import type { Accent, ScenarioId } from '../types'

/**
 * Histórico falso de 3 semanas, a fonte única de onde saem dashboard, estatísticas
 * e últimas sessões (por isso os números batem entre as telas).
 * `daysAgo` 0 = hoje. Dias sem linha = dia sem estudar.
 */
export interface HistoryRow {
  daysAgo: number
  scenarioId: ScenarioId
  accent: Accent
  minutes: number
  accuracy: number
  repetitions: number
  turns: number
  corrections: number
  wrong: string[]
}

const US: Accent = 'en-US'
const GB: Accent = 'en-GB'

// Do mais antigo para o mais recente. Hoje: 9 min (meta 15). Sequência atual: 9 dias.
export const HISTORY: HistoryRow[] = [
  { daysAgo: 20, scenarioId: 'small-talk', accent: US, minutes: 10, accuracy: 64, repetitions: 3.2, turns: 5, corrections: 4, wrong: ['through', 'thought', 'the'] },
  { daysAgo: 18, scenarioId: 'restaurant', accent: US, minutes: 12, accuracy: 67, repetitions: 3.0, turns: 5, corrections: 4, wrong: ['would', 'a', 'menu'] },
  { daysAgo: 17, scenarioId: 'airport', accent: US, minutes: 11, accuracy: 66, repetitions: 3.1, turns: 5, corrections: 3, wrong: ['schedule', 'through'] },
  { daysAgo: 15, scenarioId: 'hotel', accent: GB, minutes: 14, accuracy: 70, repetitions: 2.8, turns: 6, corrections: 4, wrong: ['reservation', 'a', 'thought'] },
  { daysAgo: 14, scenarioId: 'shopping', accent: US, minutes: 12, accuracy: 72, repetitions: 2.7, turns: 5, corrections: 3, wrong: ['would', 'comfortable'] },
  { daysAgo: 13, scenarioId: 'restaurant', accent: GB, minutes: 15, accuracy: 74, repetitions: 2.6, turns: 6, corrections: 3, wrong: ['the', 'through'] },
  { daysAgo: 11, scenarioId: 'job-interview', accent: US, minutes: 16, accuracy: 71, repetitions: 2.9, turns: 6, corrections: 5, wrong: ['experience', 'would', 'a'] },
  { daysAgo: 10, scenarioId: 'small-talk', accent: GB, minutes: 13, accuracy: 76, repetitions: 2.5, turns: 5, corrections: 3, wrong: ['thought', 'schedule'] },
  { daysAgo: 8, scenarioId: 'airport', accent: US, minutes: 15, accuracy: 78, repetitions: 2.4, turns: 6, corrections: 3, wrong: ['through', 'the'] },
  { daysAgo: 7, scenarioId: 'hotel', accent: US, minutes: 17, accuracy: 80, repetitions: 2.2, turns: 6, corrections: 2, wrong: ['reservation', 'a'] },
  { daysAgo: 6, scenarioId: 'job-interview', accent: GB, minutes: 18, accuracy: 77, repetitions: 2.4, turns: 6, corrections: 4, wrong: ['experience', 'would', 'schedule'] },
  { daysAgo: 5, scenarioId: 'shopping', accent: US, minutes: 14, accuracy: 82, repetitions: 2.1, turns: 5, corrections: 2, wrong: ['comfortable', 'the'] },
  { daysAgo: 4, scenarioId: 'restaurant', accent: US, minutes: 16, accuracy: 79, repetitions: 2.2, turns: 6, corrections: 3, wrong: ['would', 'through'] },
  { daysAgo: 3, scenarioId: 'small-talk', accent: GB, minutes: 15, accuracy: 88, repetitions: 1.8, turns: 6, corrections: 2, wrong: ['thought'] },
  { daysAgo: 2, scenarioId: 'airport', accent: US, minutes: 15, accuracy: 81, repetitions: 2.0, turns: 6, corrections: 2, wrong: ['schedule', 'a'] },
  { daysAgo: 1, scenarioId: 'hotel', accent: US, minutes: 16, accuracy: 86, repetitions: 1.9, turns: 6, corrections: 2, wrong: ['reservation'] },
  { daysAgo: 0, scenarioId: 'job-interview', accent: GB, minutes: 9, accuracy: 83, repetitions: 2.0, turns: 4, corrections: 2, wrong: ['experience', 'would'] },
]

/** Tipo de erro de cada palavra (para o gráfico "erros mais comuns"). */
export const WORD_ERROR_TYPE: Record<string, string> = {
  through: 'Sons parecidos',
  thought: 'Sons parecidos',
  schedule: 'Pronúncia por sotaque',
  would: 'Palavras curtas e contrações',
  a: 'Artigos',
  the: 'Artigos',
  reservation: 'Palavras longas',
  comfortable: 'Palavras longas',
  experience: 'Palavras longas',
  menu: 'Palavras curtas e contrações',
}

export const LEVEL_TIMELINE = [
  { daysAgo: 21, level: 'A2' as const, note: 'Nível inicial' },
  { daysAgo: 15, level: 'B1' as const, note: 'Promovida após 3 sessões acima de 80%' },
]
