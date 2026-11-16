import type { SpeechLocale } from './SpeechPlayer'

/**
 * ÚNICO lugar onde se escolhe qual voz cada navegador usa. Para mudar de voz, edite VOICE_PREFERENCES.
 *
 * Ordem de escolha: (1) as preferências do navegador, na ordem, entre as vozes do sotaque pedido;
 * (2) a melhor voz do sotaque pedido; (3) qualquer voz en-US/en-GB (sotaque diferente);
 * (4) qualquer voz em inglês. Se nenhuma for do sotaque pedido, o app avisa de forma discreta.
 */

export type Engine = 'chrome' | 'safari' | 'edge' | 'other'

/** O que precisamos de uma voz (compatível com SpeechSynthesisVoice; facilita testar). */
export interface VoiceLike {
  name: string
  lang: string
  localService?: boolean
}

/** Texto = nome exato; RegExp = casa com o nome. */
type Preference = string | RegExp

export const VOICE_PREFERENCES: Record<Engine, Record<SpeechLocale, Preference[]>> = {
  // Chrome (desktop e Android): vozes do Google.
  chrome: {
    'en-US': ['Google US English'],
    'en-GB': ['Google UK English Female', 'Google UK English Male'],
  },
  // Safari (Mac, iPhone, iPad; no iOS todos os navegadores usam este motor): vozes da Apple,
  // variantes Premium/Enhanced primeiro.
  safari: {
    'en-US': [/^Samantha \((Premium|Enhanced)\)/i, /^Samantha/i],
    'en-GB': [/^Daniel \((Premium|Enhanced)\)/i, /^Daniel/i],
  },
  // Edge: vozes neurais online ("Microsoft ... Online (Natural)").
  edge: {
    'en-US': [/^Microsoft .*Online \(Natural\)/i],
    'en-GB': [/^Microsoft .*Online \(Natural\)/i],
  },
  // Firefox, Samsung Internet e outros: sem preferência, vale a melhor voz do idioma.
  other: { 'en-US': [], 'en-GB': [] },
}

export function detectEngine(userAgent: string, maxTouchPoints = 0): Engine {
  const ua = userAgent
  // No iOS/iPadOS todo navegador usa o motor do Safari (iPadOS finge ser Mac: detectamos pelo toque).
  const ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && maxTouchPoints > 1)
  if (ios) return 'safari'
  if (/\bEdg(e|A|iOS)?\//.test(ua)) return 'edge'
  if (/SamsungBrowser|OPR\/|Opera|Firefox|FxiOS/.test(ua)) return 'other'
  if (/Chrome|Chromium/.test(ua)) return 'chrome'
  if (/Safari/.test(ua)) return 'safari'
  return 'other'
}

/** "en_GB" → "en-gb" (alguns sistemas usam sublinhado). */
const normalizeLang = (lang: string) => lang.replace('_', '-').toLowerCase()

/** Vozes de efeito do macOS ("Bad News", "Zarvox"...): nunca queremos. */
const NOVELTY = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Wobble|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Zarvox|Deranged|Hysterical|Fred|Junior|Ralph|Kathy|Princess|Agnes)\b/i

/** Nomes que indicam o sotaque britânico quando o campo `lang` não ajuda. */
const BRITISH_NAME = /\b(uk|british|united kingdom|great britain)\b|hazel|george|susan|sonia|ryan|libby|maisie|daniel|serena|kate|oliver/i

/** Maior = melhor: vozes de qualidade ("natural", "premium"...) primeiro, depois as do próprio aparelho. */
const rank = (v: VoiceLike) => (/natural|neural|premium|enhanced/i.test(v.name) ? 2 : 0) + (v.localService ? 1 : 0)

const byRank = (a: VoiceLike, b: VoiceLike) => rank(b) - rank(a)

const matches = (v: VoiceLike, pref: Preference) => (typeof pref === 'string' ? v.name === pref : pref.test(v.name))

export interface VoiceChoice<V extends VoiceLike> {
  /** null = deixar o navegador escolher pelo idioma. */
  voice: V | null
  /** É uma voz do sotaque pedido. */
  matched: boolean
}

/**
 * Lista ordenada de vozes a tentar (a primeira é a preferida). Termina sempre com "sem voz
 * específica", para o navegador escolher sozinho se todas falharem.
 */
export function rankVoices<V extends VoiceLike>(voices: V[], locale: SpeechLocale, engine: Engine): VoiceChoice<V>[] {
  const wanted = normalizeLang(locale)
  const usable = voices.filter((v) => !NOVELTY.test(v.name))
  const english = usable.filter((v) => normalizeLang(v.lang).startsWith('en'))

  let sameAccent = english.filter((v) => normalizeLang(v.lang) === wanted)
  if (sameAccent.length === 0 && wanted === 'en-gb') sameAccent = english.filter((v) => BRITISH_NAME.test(v.name) && normalizeLang(v.lang) !== 'en-us')

  const preferred = VOICE_PREFERENCES[engine][locale].flatMap((pref) => sameAccent.filter((v) => matches(v, pref)).sort(byRank))
  const otherAccent = english.filter((v) => /^en-(us|gb)$/.test(normalizeLang(v.lang)) && !sameAccent.includes(v)).sort(byRank)
  const anyEnglish = english.filter((v) => !sameAccent.includes(v) && !otherAccent.includes(v)).sort(byRank)

  const ordered = [...new Set([...preferred, ...[...sameAccent].sort(byRank), ...otherAccent, ...anyEnglish])]
  const choices: VoiceChoice<V>[] = ordered.map((voice) => ({ voice, matched: sameAccent.includes(voice) }))
  // Sem lista de vozes (ainda carregando): o navegador escolhe pelo idioma e provavelmente acerta.
  choices.push({ voice: null, matched: voices.length === 0 })
  return choices
}
