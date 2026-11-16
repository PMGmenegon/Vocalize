import type { TranscriptionResult, WordResult } from '../types'

/**
 * Comparação do ditado (o que a pessoa digitou × a frase original). Funções puras, sem React.
 *
 * ATENÇÃO: esta versão no frontend é TEMPORÁRIA. Na Fase 9 a mesma lógica passa a existir no
 * backend, que será a fonte oficial do resultado.
 *
 * Como funciona:
 * 1. Cada palavra vira uma ou mais "unidades" normalizadas (minúsculas, sem pontuação,
 *    contrações expandidas: "I'm" → "i am", "don't" → "do not", "can't" → "can not").
 * 2. As unidades das duas frases são alinhadas com a distância de Levenshtein em nível de
 *    palavra (programação dinâmica) e um backtracking classifica cada par.
 * 3. O resultado volta a ser descrito por palavra da frase ORIGINAL: certa, errada
 *    (substituição), faltando ou sobrando.
 */

/** Contrações comuns → palavras equivalentes. Tudo em minúsculas e com apóstrofo simples. */
const CONTRACTIONS: Record<string, string> = {
  "i'm": 'i am',
  "you're": 'you are',
  "we're": 'we are',
  "they're": 'they are',
  "he's": 'he is',
  "she's": 'she is',
  "it's": 'it is',
  "that's": 'that is',
  "there's": 'there is',
  "here's": 'here is',
  "what's": 'what is',
  "who's": 'who is',
  "where's": 'where is',
  "how's": 'how is',
  "let's": 'let us',
  "i've": 'i have',
  "you've": 'you have',
  "we've": 'we have',
  "they've": 'they have',
  "i'll": 'i will',
  "you'll": 'you will',
  "he'll": 'he will',
  "she'll": 'she will',
  "it'll": 'it will',
  "we'll": 'we will',
  "they'll": 'they will',
  "i'd": 'i would',
  "you'd": 'you would',
  "he'd": 'he would',
  "she'd": 'she would',
  "we'd": 'we would',
  "they'd": 'they would',
  "don't": 'do not',
  "doesn't": 'does not',
  "didn't": 'did not',
  "can't": 'can not',
  cannot: 'can not',
  "won't": 'will not',
  "isn't": 'is not',
  "aren't": 'are not',
  "wasn't": 'was not',
  "weren't": 'were not',
  "hasn't": 'has not',
  "haven't": 'have not',
  "hadn't": 'had not',
  "wouldn't": 'would not',
  "couldn't": 'could not',
  "shouldn't": 'should not',
  "mustn't": 'must not',
  "needn't": 'need not',
}

/** Palavra como o usuário vê (com pontuação) e suas unidades normalizadas. */
interface Word {
  text: string
  tokens: string[]
}

/** Minúsculas, apóstrofo tipográfico → simples, sem pontuação (mantém letras, números e apóstrofo interno). */
function cleanToken(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[^a-z0-9']/g, '')
    .replace(/^'+|'+$/g, '')
}

/** Unidades de UMA palavra: hífen separa ("well-known" → well, known); contrações são expandidas. */
function tokensOf(rawWord: string): string[] {
  const tokens: string[] = []
  for (const part of rawWord.split(/[-–—]/)) {
    const clean = cleanToken(part)
    if (!clean) continue
    const expanded = CONTRACTIONS[clean]
    if (expanded) tokens.push(...expanded.split(' '))
    else tokens.push(clean)
  }
  return tokens
}

/** Quebra o texto em palavras, descartando as que são só pontuação ("—", "..."). */
export function toWords(text: string): Word[] {
  return text
    .split(/\s+/)
    .map((raw) => ({ text: raw, tokens: tokensOf(raw) }))
    .filter((w) => w.tokens.length > 0)
}

/** Forma normalizada de um texto inteiro: duas frases "iguais" têm a mesma forma. */
export function normalizeText(text: string): string {
  return toWords(text)
    .flatMap((w) => w.tokens)
    .join(' ')
}

type Op =
  | { kind: 'match' | 'sub'; i: number; j: number } // unidade esperada i ↔ digitada j
  | { kind: 'missing'; i: number } // esperada e não digitada
  | { kind: 'extra'; j: number } // digitada e não esperada

interface Unit {
  key: string
  /** Índice da palavra a que a unidade pertence. */
  word: number
}

const unitsOf = (words: Word[]): Unit[] => words.flatMap((w, word) => w.tokens.map((key) => ({ key, word })))

/**
 * Alinhamento por distância de Levenshtein em nível de palavra.
 *
 * dp[i][j] = menor número de edições (troca, remoção, inserção; custo 1 cada) para transformar as
 * primeiras i unidades esperadas nas primeiras j digitadas. O backtracking de dp[n][m] até dp[0][0]
 * recupera uma sequência ótima de operações. Em empate prefere casar, depois "faltando", "sobrando" e só por último trocar: assim uma troca
 * só é declarada quando não há alinhamento que preserve palavras certas.
 *
 * Complexidade (n = unidades esperadas, m = digitadas): tempo O(n·m) e espaço O(n·m), porque o
 * backtracking precisa da tabela inteira. Para frases de dezenas de palavras isso é desprezível.
 * (Só a distância caberia em O(min(n, m)) de espaço com duas linhas, mas perderíamos o alinhamento.)
 */
function align(exp: Unit[], typ: Unit[]): Op[] {
  const n = exp.length
  const m = typ.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = 1; i <= n; i++) dp[i]![0] = i
  for (let j = 1; j <= m; j++) dp[0]![j] = j

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const same = exp[i - 1]!.key === typ[j - 1]!.key
      dp[i]![j] = Math.min(dp[i - 1]![j - 1]! + (same ? 0 : 1), dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1)
    }
  }

  const ops: Op[] = []
  let i = n
  let j = m
  while (i > 0 || j > 0) {
    const here = dp[i]![j]!
    const same = i > 0 && j > 0 && exp[i - 1]!.key === typ[j - 1]!.key
    if (same && here === dp[i - 1]![j - 1]!) {
      ops.push({ kind: 'match', i: i - 1, j: j - 1 })
      i--
      j--
    } else if (i > 0 && here === dp[i - 1]![j]! + 1) {
      ops.push({ kind: 'missing', i: i - 1 })
      i--
    } else if (j > 0 && here === dp[i]![j - 1]! + 1) {
      ops.push({ kind: 'extra', j: j - 1 })
      j--
    } else {
      ops.push({ kind: 'sub', i: i - 1, j: j - 1 })
      i--
      j--
    }
  }
  return ops.reverse()
}

/**
 * Compara o que foi digitado com a frase original.
 * Acerto = palavras certas / palavras da frase original (arredondado, 0–100).
 *
 * Complexidade: O(n·m) em tempo e espaço, com n e m = unidades (palavras, contando contrações
 * como duas) das duas frases; a normalização e a agregação final são O(n + m).
 */
export function compareTranscription(expectedText: string, typedText: string): TranscriptionResult {
  const expWords = toWords(expectedText)
  const typWords = toWords(typedText)
  const exp = unitsOf(expWords)
  const typ = unitsOf(typWords)
  const ops = align(exp, typ)

  // Por palavra esperada: situação de cada unidade e palavras digitadas associadas.
  const expState = expWords.map(() => ({ seen: 0, matched: 0, missing: 0, typed: [] as number[] }))
  // Por palavra digitada: quantas unidades ficaram "sobrando".
  const typExtra = typWords.map(() => 0)
  // Ordem de saída: palavras esperadas na ordem do texto, com as sobrando no ponto em que apareceram.
  const order: ({ expected: number } | { extra: number })[] = []
  const placed = new Set<number>()

  for (const op of ops) {
    if (op.kind === 'extra') {
      const word = typ[op.j]!.word
      typExtra[word]!++
      order.push({ extra: word })
      continue
    }
    const word = exp[op.i]!.word
    const st = expState[word]!
    if (!placed.has(word)) {
      placed.add(word)
      order.push({ expected: word })
    }
    st.seen++
    if (op.kind === 'missing') {
      st.missing++
      continue
    }
    if (op.kind === 'match') st.matched++
    const typedWord = typ[op.j]!.word
    if (!st.typed.includes(typedWord)) st.typed.push(typedWord)
  }

  const words: WordResult[] = []
  const emittedExtra = new Set<number>()
  for (const item of order) {
    if ('extra' in item) {
      // Só vira "sobrando" a palavra digitada inteira que não casou com nada; sem repetir.
      const w = item.extra
      if (typExtra[w] === typWords[w]!.tokens.length && !emittedExtra.has(w)) {
        emittedExtra.add(w)
        words.push({ status: 'extra', typed: typWords[w]!.text })
      }
      continue
    }
    const st = expState[item.expected]!
    const expected = expWords[item.expected]!.text
    if (st.matched === st.seen) {
      words.push({ status: 'correct', expected, typed: st.typed.map((k) => typWords[k]!.text).join(' ') })
    } else if (st.missing === st.seen) {
      words.push({ status: 'missing', expected })
    } else {
      words.push({ status: 'wrong', expected, typed: st.typed.map((k) => typWords[k]!.text).join(' ') })
    }
  }

  const correctCount = words.filter((w) => w.status === 'correct').length
  const totalExpected = expWords.length
  return {
    words,
    accuracy: totalExpected === 0 ? 0 : Math.round((correctCount / totalExpected) * 100),
    correctCount,
    totalExpected,
    expectedText,
  }
}
