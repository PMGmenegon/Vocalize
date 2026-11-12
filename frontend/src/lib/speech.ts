/**
 * Voz sintetizada do navegador (Web Speech API), com escolha de voz por sotaque.
 *
 * Por que isto existe: `getVoices()` costuma vir VAZIO na primeira chamada (as vozes
 * carregam de forma assíncrona) e alguns sistemas usam "en_GB" em vez de "en-GB".
 * Sem tratar isso, a voz britânica caía na voz americana padrão.
 */

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

/** Vozes que já funcionaram (por sotaque) e as que ficaram mudas: evitamos repetir tentativas lentas. */
const working = new Map<string, string>()
const broken = new Set<string>()

/** Cada cancelamento invalida falas que ainda estavam esperando para começar. */
let token = 0

const normalize = (lang: string) => lang.replace('_', '-').toLowerCase()

/** Espera as vozes carregarem (até 1,5 s). */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis
  const now = synth.getVoices()
  if (now.length > 0) return Promise.resolve(now)
  return new Promise((resolve) => {
    const finish = () => {
      synth.removeEventListener('voiceschanged', finish)
      window.clearTimeout(timer)
      resolve(synth.getVoices())
    }
    const timer = window.setTimeout(finish, 1500)
    synth.addEventListener('voiceschanged', finish)
  })
}

/** Nomes que indicam sotaque britânico quando o campo `lang` não ajuda. */
const BRITISH_NAME = /\b(uk|british|united kingdom|great britain)\b|hazel|george|susan|sonia|ryan|libby|maisie|daniel|serena|kate|oliver/i

/** Quanto maior, melhor: vozes do próprio aparelho primeiro (funcionam offline), depois as "naturais". */
const rank = (v: SpeechSynthesisVoice) =>
  (v.localService ? 2 : 0) + (/natural|premium|enhanced/i.test(v.name) ? 1 : 0)

/** Vozes candidatas ao sotaque, da preferida para a menos preferida. */
export function candidateVoices(voices: SpeechSynthesisVoice[], locale: string): SpeechSynthesisVoice[] {
  const wanted = normalize(locale)
  let pool = voices.filter((v) => normalize(v.lang) === wanted)
  if (pool.length === 0 && wanted === 'en-gb') {
    pool = voices.filter((v) => normalize(v.lang).startsWith('en') && BRITISH_NAME.test(v.name))
  }
  const score = (v: SpeechSynthesisVoice) => rank(v) + (working.get(wanted) === v.voiceURI ? 10 : 0)
  return pool.filter((v) => !broken.has(v.voiceURI)).sort((a, b) => score(b) - score(a))
}

export function cancelSpeech() {
  token++
  if (speechSupported) window.speechSynthesis.cancel()
}

interface SpeakOptions {
  rate?: number
  onStart?: () => void
  onEnd?: () => void
  /** Índice do caractere onde a palavra atual começa (nem todo navegador envia). */
  onBoundary?: (charIndex: number) => void
}

export interface SpeakResult {
  /** Existe voz do sotaque pedido neste aparelho. */
  matched: boolean
  /** Nome e idioma da voz que realmente tocou (null = voz padrão do navegador). */
  voice: string | null
  /** Nenhuma voz conseguiu tocar. */
  failed: boolean
  /** Quantas vozes do sotaque o aparelho oferece. */
  available: number
}

const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms))

/** Tenta uma fala. Resolve quando ela COMEÇA ('started') ou falha/estoura o tempo ('failed'). */
function attempt(
  text: string,
  locale: string,
  voice: SpeechSynthesisVoice | null,
  mine: number,
  { rate = 0.95, onStart, onEnd, onBoundary }: SpeakOptions,
): Promise<'started' | 'failed' | 'aborted'> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = voice?.lang ?? locale
    if (voice) utterance.voice = voice
    utterance.rate = rate
    let started = false
    // Vozes online às vezes ficam mudas sem avisar; sem "start" em 2 s tentamos outra.
    const timer = window.setTimeout(() => {
      if (!started) {
        window.speechSynthesis.cancel()
        resolve('failed')
      }
    }, 2000)
    utterance.onstart = () => {
      started = true
      window.clearTimeout(timer)
      onStart?.()
      resolve('started')
    }
    utterance.onboundary = (e) => onBoundary?.(e.charIndex)
    utterance.onend = () => {
      window.clearTimeout(timer)
      if (started) onEnd?.()
      else resolve('failed')
    }
    utterance.onerror = () => {
      window.clearTimeout(timer)
      if (started) onEnd?.()
      else resolve(mine !== token ? 'aborted' : 'failed')
    }
    window.speechSynthesis.speak(utterance)
  })
}

/**
 * Fala o texto no sotaque pedido, tentando as vozes do sotaque uma a uma (as do
 * aparelho primeiro) e, por último, a voz padrão. Devolve `null` se a fala foi
 * cancelada ou não há suporte.
 */
export async function speak(text: string, locale: string, options: SpeakOptions = {}): Promise<SpeakResult | null> {
  if (!speechSupported) return null
  const synth = window.speechSynthesis
  const wasBusy = synth.speaking || synth.pending
  cancelSpeech()
  const mine = token

  const voices = await loadVoices()
  if (mine !== token) return null
  const candidates = candidateVoices(voices, locale)

  // O Chrome às vezes ignora um speak() logo depois de cancel(); uma pausa curta resolve.
  if (wasBusy) await sleep(80)
  if (mine !== token) return null

  const tries: (SpeechSynthesisVoice | null)[] = [...candidates, null]
  for (const voice of tries) {
    const outcome = await attempt(text, locale, voice, mine, options)
    if (outcome === 'aborted' || mine !== token) return null
    if (outcome === 'started') {
      if (voice) working.set(normalize(locale), voice.voiceURI)
      return {
        matched: voice !== null,
        voice: voice ? `${voice.name} (${voice.lang})` : null,
        failed: false,
        available: candidates.length,
      }
    }
    if (voice) broken.add(voice.voiceURI)
    await sleep(80)
    if (mine !== token) return null
  }
  options.onEnd?.()
  return { matched: false, voice: null, failed: true, available: candidates.length }
}

/** Mensagem só para quando NADA tocou (sem falar de qual voz é ou de onde vem). */
export function failureMessage(result: SpeakResult | null): string {
  return result?.failed ? 'Não foi possível tocar o áudio. Confira se o som do aparelho está ligado.' : ''
}
