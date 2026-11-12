import { SCENARIOS } from '../mocks/scenarios'
import type { Scenario } from '../types'
import { isEmptyMode, simulate } from './runtime'

export const scenarioService = {
  list(): Promise<Scenario[]> {
    return simulate(() => (isEmptyMode() ? [] : SCENARIOS))
  },
}

export function scenarioTitle(id: string): string {
  return SCENARIOS.find((s) => s.id === id)?.title ?? id
}
