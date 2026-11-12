import type { TranscriptionResult, WordResult } from '../types'

const normalize = (w: string) =>
  w
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9']/g, '')

const split = (text: string) =>
  text
    .split(/\s+/)
    .map((word) => ({ word, key: normalize(word) }))
    .filter((w) => w.key !== '')

/** Comparação simples para decidir se duas frases são "iguais" (ignora caixa e pontuação). */
export const sameText = (a: string, b: string) =>
  split(a).map((w) => w.key).join(' ') === split(b).map((w) => w.key).join(' ')

/**
 * Compara o ditado palavra por palavra (maior subsequência comum). Trechos entre
 * palavras iguais viram "errada" (par esperado/digitado), "faltando" ou "sobrando".
 * No backend real, essa comparação será feita no servidor.
 */
export function compareDictation(expectedText: string, typedText: string): TranscriptionResult {
  const exp = split(expectedText)
  const typ = split(typedText)
  const dp: number[][] = Array.from({ length: exp.length + 1 }, () => new Array<number>(typ.length + 1).fill(0))
  for (let i = exp.length - 1; i >= 0; i--) {
    for (let j = typ.length - 1; j >= 0; j--) {
      dp[i]![j] = exp[i]!.key === typ[j]!.key ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!)
    }
  }

  const words: WordResult[] = []
  let gapExp: string[] = []
  let gapTyp: string[] = []
  const flush = () => {
    const pairs = Math.min(gapExp.length, gapTyp.length)
    for (let k = 0; k < pairs; k++) words.push({ status: 'wrong', expected: gapExp[k], typed: gapTyp[k] })
    for (const e of gapExp.slice(pairs)) words.push({ status: 'missing', expected: e })
    for (const t of gapTyp.slice(pairs)) words.push({ status: 'extra', typed: t })
    gapExp = []
    gapTyp = []
  }

  let i = 0
  let j = 0
  while (i < exp.length || j < typ.length) {
    if (i < exp.length && j < typ.length && exp[i]!.key === typ[j]!.key) {
      flush()
      words.push({ status: 'correct', expected: exp[i]!.word, typed: typ[j]!.word })
      i++
      j++
    } else if (j >= typ.length || (i < exp.length && dp[i + 1]![j]! >= dp[i]![j + 1]!)) {
      gapExp.push(exp[i]!.word)
      i++
    } else {
      gapTyp.push(typ[j]!.word)
      j++
    }
  }
  flush()

  const correctCount = words.filter((w) => w.status === 'correct').length
  return {
    words,
    accuracy: exp.length === 0 ? 0 : Math.round((correctCount / exp.length) * 100),
    correctCount,
    totalExpected: exp.length,
    expectedText,
  }
}
