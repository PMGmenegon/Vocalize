import type { Accent } from '../types'

/** Sotaque da fala: o mesmo valor usado nas sessões ('en-US' | 'en-GB'). */
export type SpeechLocale = Accent

export interface SpeakRequest {
  text: string
  locale: SpeechLocale
  /** Velocidade: 1 = normal, 0.75 = devagar. */
  rate: number
  /** Índice da palavra em que a fala começa (para retomar/voltar). Padrão: 0. */
  fromWord?: number
}

/** Qual voz foi usada. `matched` = é uma voz do sotaque pedido (false = alternativa mais próxima). */
export interface VoiceInfo {
  name: string | null
  matched: boolean
}

/** finished = terminou sozinha · cancelled = interrompida (cancel() ou outra fala) · error = não foi possível tocar. */
export type EndReason = 'finished' | 'cancelled' | 'error'

export interface SpeakHandlers {
  /** O som começou (primeira vez). */
  onStart?: (voice: VoiceInfo) => void
  /** Palavra atual (índice na frase inteira). Igual ao total de palavras quando a última termina. */
  onWord?: (index: number) => void
  onEnd?: (reason: EndReason) => void
}

export interface SpeechHandle {
  /** Interrompe esta fala (sem efeito se ela já terminou ou foi substituída). */
  cancel: () => void
}

/**
 * Motor de voz do app. Hoje: Web Speech do navegador (WebSpeechPlayer). Para trocar por outro motor
 * (áudio gerado no servidor, por exemplo), basta outra implementação desta interface.
 *
 * Regras: só uma fala por vez (falar de novo interrompe a anterior) e `speak` deve ser chamado
 * direto de um gesto do usuário (toque/clique/tecla): o iOS exige isso para liberar o som.
 */
export interface SpeechPlayer {
  readonly supported: boolean
  speak: (request: SpeakRequest, handlers: SpeakHandlers) => SpeechHandle
  /** Interrompe qualquer fala em andamento. */
  cancel: () => void
}
