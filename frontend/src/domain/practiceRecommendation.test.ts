import { describe, expect, it } from 'vitest'
import type { ScenarioHistory, ScenarioId } from '../types'
import { recommendScenario } from './practiceRecommendation'

const ORDER: ScenarioId[] = ['restaurant', 'street', 'airport']
const h = (scenarioId: ScenarioId, averageAccuracy: number, sessions = 3): ScenarioHistory => ({ scenarioId, sessions, averageAccuracy, lastAccuracy: averageAccuracy, lastDate: '2026-01-01T12:00:00.000Z' })

describe('recommendScenario', () => {
  it('sem histórico, sugere a primeira situação', () => {
    expect(recommendScenario(ORDER, []).scenarioId).toBe('restaurant')
  })
  it('prioriza a de pior acerto quando está abaixo do limite', () => {
    const r = recommendScenario(ORDER, [h('restaurant', 90), h('street', 70), h('airport', 80)])
    expect(r.scenarioId).toBe('street')
    expect(r.reason).toContain('70%')
  })
  it('com acertos bons, sugere uma situação ainda não praticada', () => {
    expect(recommendScenario(ORDER, [h('restaurant', 90), h('street', 85)]).scenarioId).toBe('airport')
  })
  it('com tudo praticado e bem, sugere a de menor acerto', () => {
    expect(recommendScenario(ORDER, [h('restaurant', 90), h('street', 80), h('airport', 85)]).scenarioId).toBe('street')
  })
})
