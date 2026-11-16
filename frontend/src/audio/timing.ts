/** Utilidades de tempo e de texto da fala. Puras (sem navegador), por isso testáveis. */

/** Palavras do texto, como a fala as conta. */
export const splitWords = (text: string): string[] => text.split(/\s+/).filter(Boolean)

/** Segundos por palavra a velocidade 1 (cerca de 150 palavras por minuto). */
const SECONDS_PER_WORD = 0.4

/** Duração de UMA palavra na velocidade `rate`. */
export const wordSeconds = (rate: number) => SECONDS_PER_WORD / rate

/**
 * Duração estimada de uma fala. A Web Speech API não informa a duração; estimamos pelo número de
 * palavras e pela velocidade (mais uma pequena folga para a respiração entre frases).
 */
export const estimateDuration = (wordCount: number, rate: number) => (wordCount === 0 ? 0 : Math.max(1, (wordCount * SECONDS_PER_WORD + 0.4) / rate))

/** Quantas palavras cabem em `seconds` segundos (no mínimo 1). */
export const wordsInSeconds = (seconds: number, rate: number) => Math.max(1, Math.round(seconds / wordSeconds(rate)))

/** Onde (índice do caractere) cada palavra começa em `words.join(' ')`. */
export function wordStarts(words: string[]): number[] {
  const starts: number[] = []
  let at = 0
  for (const w of words) {
    starts.push(at)
    at += w.length + 1
  }
  return starts
}

/** Índice da palavra que contém o caractere `charIndex` (evento `boundary` do navegador). */
export function wordAtChar(starts: number[], charIndex: number): number {
  let idx = 0
  for (let i = 0; i < starts.length; i++) if (starts[i]! <= charIndex) idx = i
  return idx
}

export interface Chunk {
  /** Índice, na frase inteira, da primeira palavra do trecho. */
  offset: number
  words: string[]
}

const SENTENCE_END = /[.!?…]["')\]”’]*$/
const SOFT_BREAK = /[,;:]$/

/**
 * Divide em trechos curtos (frases). O Chrome corta falas longas depois de uns 15 s; falar frase a
 * frase evita isso. Frases acima de `maxChars` são quebradas numa vírgula (ou no limite).
 */
export function chunkWords(words: string[], maxChars = 160): Chunk[] {
  const chunks: Chunk[] = []
  let current: string[] = []
  let length = 0
  let offset = 0
  const flush = () => {
    if (current.length === 0) return
    chunks.push({ offset, words: current })
    offset += current.length
    current = []
    length = 0
  }
  for (const word of words) {
    current.push(word)
    length += word.length + 1
    if (SENTENCE_END.test(word) || (length >= maxChars * 0.6 && SOFT_BREAK.test(word)) || length >= maxChars) flush()
  }
  flush()
  return chunks
}
