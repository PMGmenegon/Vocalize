/**
 * Regras do teste de nivelamento. Funções puras, sem React nem acesso a navegador,
 * para poderem ser movidas para o backend sem mudanças.
 */
import type { PlacementQuestion } from '../data/placementQuestions'
import { LEVELS, type Level } from '../types'

/** Resposta de cada pergunta (mesma ordem das perguntas): índice da alternativa ou null se em branco. */
export type PlacementAnswers = readonly (number | null)[]

export interface QuestionResult {
  question: PlacementQuestion
  /** Alternativa escolhida (null = sem resposta). */
  chosenIndex: number | null
  correct: boolean
}

export interface LevelScore {
  level: Level
  correct: number
  total: number
}

export function isCorrect(question: PlacementQuestion, chosenIndex: number | null | undefined): boolean {
  return chosenIndex != null && chosenIndex === question.correctIndex
}

export function gradeAnswers(questions: readonly PlacementQuestion[], answers: PlacementAnswers): QuestionResult[] {
  return questions.map((question, i) => {
    const chosenIndex = answers[i] ?? null
    return { question, chosenIndex, correct: isCorrect(question, chosenIndex) }
  })
}

/** Acertos por nível, na ordem A2 → C1 (níveis sem perguntas ficam de fora). */
export function scoreByLevel(results: readonly QuestionResult[]): LevelScore[] {
  return LEVELS.map((level) => {
    const own = results.filter((r) => r.question.level === level)
    return { level, correct: own.filter((r) => r.correct).length, total: own.length }
  }).filter((s) => s.total > 0)
}

/**
 * Nível final: sobe em sequência a partir do A2 enquanto o usuário acertou TODAS as perguntas do nível.
 * Resultado = o último nível completado; errar já no A2 resulta em A2 (mínimo).
 */
export function computeLevel(results: readonly QuestionResult[]): Level {
  let reached: Level = LEVELS[0]!
  for (const score of scoreByLevel(results)) {
    if (score.correct < score.total) break
    reached = score.level
  }
  return reached
}

/** Atalho: corrige e calcula o nível. */
export function placeUser(questions: readonly PlacementQuestion[], answers: PlacementAnswers): Level {
  return computeLevel(gradeAnswers(questions, answers))
}
