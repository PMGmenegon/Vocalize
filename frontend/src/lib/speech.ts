/**
 * Voz sintetizada do navegador (Web Speech API), com escolha de voz por sotaque.
 *
 * Por que isto existe: `getVoices()` costuma vir VAZIO na primeira chamada (as vozes
 * carregam de forma assíncrona) e alguns sistemas usam "en_GB" em vez de "en-GB".
 * Sem tratar isso, a voz britânica caía na voz americana padrão.
 */

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

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

/** Vozes "naturais" soam melhor; preferimos quando existem. */
const quality = (v: SpeechSynthesisVoice) => (/natural|online|google|premium|enhanced/i.test(v.name) ? 1 : 0)

/** Nomes que indicam sotaque britânico quando o campo `lang` não ajuda. */
const BRITISH_NAME = /\b(uk|british|united kingdom|great britain)\b|hazel|george|susan|daniel|serena|kate|oliver/i

export function pickVoice(
  voices: SpeechSynthesisVoice[],
  locale: string,
): { voice: SpeechSynthesisVoice | null; matched: boolean } {
  const wanted = normalize(locale)
  let pool = voices.filter((v) => normalize(v.lang) === wanted)
  if (pool.length === 0 && wanted === 'en-gb') {
    pool = voices.filter((v) => normalize(v.lang).startsWith('en') && BRITISH_NAME.test(v.name))
  }
  if (pool.length === 0) return { voice: null, matched: false }
  const best = [...pool].sort((a, b) => quality(b) - quality(a))[0] ?? null
  return { voice: best, matched: best !== null }
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

/**
 * Fala o texto no sotaque pedido. Devolve `matched: false` quando o aparelho não
 * tem uma voz daquele sotaque (aí usamos a voz padrão e o chamador pode avisar).
 * Devolve `null` se a fala foi cancelada antes de começar ou não há suporte.
 */
export async function speak(
  text: string,
  locale: string,
  { rate = 0.95, onStart, onEnd, onBoundary }: SpeakOptions = {},
): Promise<{ matched: boolean } | null> {
  if (!speechSupported) return null
  const synth = window.speechSynthesis
  const wasBusy = synth.speaking || synth.pending
  cancelSpeech()
  const mine = token

  const voices = await loadVoices()
  if (mine !== token) return null
  const { voice, matched } = pickVoice(voices, locale)

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = voice?.lang ?? locale
  if (voice) utterance.voice = voice
  utterance.rate = rate
  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()
  utterance.onboundary = (e) => onBoundary?.(e.charIndex)

  // O Chrome às vezes ignora um speak() logo depois de cancel(); uma pausa curta resolve.
  if (wasBusy) await new Promise((r) => window.setTimeout(r, 80))
  if (mine !== token) return null

  synth.speak(utterance)
  return { matched }
}
