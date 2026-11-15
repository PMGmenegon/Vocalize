import { describe, expect, it } from 'vitest'
import { PLACEMENT_QUESTIONS as Q } from '../data/placementQuestions'
import type { Level } from '../types'
import { placeUser } from './placement'

/** Respostas todas certas, exceto nas perguntas (ids) indicadas. */
function answers(wrongIds: string[] = []) {
  return Q.map((q) => (wrongIds.includes(q.id) ? (q.correctIndex + 1) % 4 : q.correctIndex))
}
const level = (wrong: string[]): Level => placeUser(Q, answers(wrong))

describe('dados do teste', () => {
  it('tem 6 perguntas com ids únicos', () => {
    expect(Q).toHaveLength(6)
    expect(new Set(Q.map((q) => q.id)).size).toBe(6)
  })
  it('distribui A2=1, B1=2, B2=2, C1=1', () => {
    const count = (l: Level) => Q.filter((q) => q.level === l).length
    expect([count('A2'), count('B1'), count('B2'), count('C1')]).toEqual([1, 2, 2, 1])
  })
  it('cada pergunta tem 4 alternativas e exatamente uma correta', () => {
    for (const q of Q) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(Number.isInteger(q.correctIndex)).toBe(true)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(4)
      expect(q.explanation.length).toBeGreaterThan(0)
    }
  })
})

describe('cálculo do nível', () => {
  it('acertou tudo → C1', () => expect(level([])).toBe('C1'))
  it('errou a de A2 → A2', () => expect(level(['p1'])).toBe('A2'))
  it('errou uma de B1 → A2', () => {
    expect(level(['p2'])).toBe('A2')
    expect(level(['p3'])).toBe('A2')
  })
  it('errou uma de B2 → B1', () => {
    expect(level(['p4'])).toBe('B1')
    expect(level(['p5'])).toBe('B1')
  })
  it('errou só a de C1 → B2', () => expect(level(['p6'])).toBe('B2'))
  it('acertou B2 e C1 mas errou uma de B1 → A2', () => expect(level(['p3'])).toBe('A2'))
  it('tudo errado ou em branco → A2 (mínimo)', () => {
    expect(level(Q.map((q) => q.id))).toBe('A2')
    expect(placeUser(Q, [null, null, null, null, null, null])).toBe('A2')
  })
})
