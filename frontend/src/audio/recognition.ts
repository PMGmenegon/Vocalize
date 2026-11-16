/**
 * Tipos mínimos da Web Speech API de reconhecimento (SpeechRecognition). O TypeScript ainda não
 * traz esses tipos e o Chrome/Edge/Safari expõem o construtor com o prefixo `webkit`.
 */

interface RecognitionAlternative {
  transcript: string
}

interface RecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: RecognitionAlternative | undefined
}

export interface RecognitionResultEvent {
  readonly resultIndex: number
  readonly results: ArrayLike<RecognitionResult>
}

export interface RecognitionErrorEvent {
  readonly error: string
}

export interface RecognitionInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onstart: (() => void) | null
  onresult: ((e: RecognitionResultEvent) => void) | null
  onerror: ((e: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type RecognitionConstructor = new () => RecognitionInstance

/** O construtor do navegador, ou `undefined` se não houver suporte (ex.: Firefox). */
export function getRecognitionConstructor(): RecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}
