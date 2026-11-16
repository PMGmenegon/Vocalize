import { WebSpeechPlayer } from './WebSpeechPlayer'

export type { EndReason, SpeakHandlers, SpeakRequest, SpeechHandle, SpeechLocale, SpeechPlayer, VoiceInfo } from './SpeechPlayer'
export { estimateDuration, splitWords, wordsInSeconds } from './timing'

/** Motor de voz único do app. Para trocar de motor, mude só esta linha. */
export const speechPlayer = new WebSpeechPlayer()
