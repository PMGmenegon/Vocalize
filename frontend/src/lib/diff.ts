export interface WordMark {
  word: string
  ok: boolean
}

export interface DiffResult {
  /** Frase correta, palavra por palavra (ok = você acertou essa palavra). */
  expected: WordMark[]
  /** O que você digitou, palavra por palavra (ok = a palavra está na frase). */
  typed: WordMark[]
  correct: number
  total: number
}

/** Minúsculas, sem pontuação; apóstrofos tipográficos viram simples. */
function normalize(word: string): string {
  return word
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9']/g, '')
}

function split(text: string) {
  return text
    .split(/\s+/)
    .map((word) => ({ word, key: normalize(word) }))
    .filter((w) => w.key !== '')
}

/** Compara palavra por palavra usando a maior subsequência comum (ordem importa). */
export function diffWords(expectedText: string, typedText: string): DiffResult {
  const exp = split(expectedText)
  const typ = split(typedText)

  // dp[i][j] = tamanho da subsequência comum entre exp[i..] e typ[j..]
  const dp: number[][] = Array.from({ length: exp.length + 1 }, () => new Array<number>(typ.length + 1).fill(0))
  for (let i = exp.length - 1; i >= 0; i--) {
    for (let j = typ.length - 1; j >= 0; j--) {
      dp[i]![j] =
        exp[i]!.key === typ[j]!.key ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!)
    }
  }

  const expOk = new Array<boolean>(exp.length).fill(false)
  const typOk = new Array<boolean>(typ.length).fill(false)
  let i = 0
  let j = 0
  while (i < exp.length && j < typ.length) {
    if (exp[i]!.key === typ[j]!.key) {
      expOk[i] = true
      typOk[j] = true
      i++
      j++
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      i++
    } else {
      j++
    }
  }

  return {
    expected: exp.map((w, k) => ({ word: w.word, ok: expOk[k]! })),
    typed: typ.map((w, k) => ({ word: w.word, ok: typOk[k]! })),
    correct: expOk.filter(Boolean).length,
    total: exp.length,
  }
}
