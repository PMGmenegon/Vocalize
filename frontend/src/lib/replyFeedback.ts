import type { ReplyCoherence, ReplyIssueCategory, ReplyLevelFit } from '../types'

/** Textos gentis para a avaliação da resposta (sem notas punitivas). */
export const COHERENCE_LABEL: Record<ReplyCoherence, string> = {
  coherent: 'Faz sentido na conversa',
  partially_coherent: 'Faz sentido em parte',
  off_topic: 'Não respondeu ao que foi perguntado',
}

export const LEVEL_FIT_LABEL: Record<ReplyLevelFit, string> = {
  below: 'Abaixo do seu nível: dá para arriscar mais',
  at: 'Adequada ao seu nível',
  above: 'Acima do seu nível: ótimo desafio',
}

export const ISSUE_LABEL: Record<ReplyIssueCategory, string> = {
  verb_tense: 'Tempo verbal',
  preposition: 'Preposição',
  article: 'Artigo',
  word_order: 'Ordem das palavras',
  vocabulary: 'Vocabulário',
  spelling: 'Ortografia',
  other: 'Outro ponto',
}
