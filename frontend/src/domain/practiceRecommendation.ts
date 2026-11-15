import type { ScenarioHistory, ScenarioId } from '../types'

/** Abaixo desta média de acerto a situação vira prioridade de reforço. */
export const WEAK_ACCURACY = 75

/**
 * Escolhe a situação a destacar na tela de prática:
 * 1) sem nenhum histórico: a primeira da lista, como ponto de partida;
 * 2) a de pior acerto médio, se estiver abaixo de WEAK_ACCURACY;
 * 3) a primeira ainda não praticada;
 * 4) a de pior acerto médio.
 */
export function recommendScenario(order: readonly ScenarioId[], history: readonly ScenarioHistory[]): { scenarioId: ScenarioId; reason: string } {
  const first = order[0]
  if (!first) throw new Error('Nenhuma situação disponível.')
  if (history.length === 0) return { scenarioId: first, reason: 'Um bom ponto de partida: vocabulário do dia a dia e frases curtas para pegar o ritmo.' }

  const worst = [...history].sort((a, b) => a.averageAccuracy - b.averageAccuracy)[0]!
  const reinforce = {
    scenarioId: worst.scenarioId,
    reason: `Seu menor acerto médio: ${worst.averageAccuracy}% em ${worst.sessions} ${worst.sessions === 1 ? 'sessão' : 'sessões'}. Vale reforçar.`,
  }
  if (worst.averageAccuracy < WEAK_ACCURACY) return reinforce

  const fresh = order.find((id) => !history.some((h) => h.scenarioId === id))
  if (fresh) return { scenarioId: fresh, reason: 'Você ainda não praticou esta situação. É a melhor forma de ampliar o vocabulário.' }
  return reinforce
}
