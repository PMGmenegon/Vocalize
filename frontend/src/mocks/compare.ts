import { normalizeText } from '../domain/transcription'

/** Duas frases são "iguais" se só diferem em caixa, pontuação e contrações (usado pela correção simulada da resposta). */
export const sameText = (a: string, b: string) => normalizeText(a) === normalizeText(b)
