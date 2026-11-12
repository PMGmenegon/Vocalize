import { ACCENT_LABEL } from '../lib/format'
import type { Choice } from '../components/ui/ChoiceGroup'
import type { Accent, DailyGoal, Level } from '../types'

export const LEVEL_OPTIONS: Choice<Level>[] = [
  { value: 'A2', label: 'A2 · Básico', description: 'Entendo frases simples e situações do dia a dia.' },
  { value: 'B1', label: 'B1 · Intermediário', description: 'Me viro em viagens e acompanho conversas sobre temas conhecidos.' },
  { value: 'B2', label: 'B2 · Intermediário avançado', description: 'Converso com fluência sobre vários assuntos e entendo textos longos.' },
  { value: 'C1', label: 'C1 · Avançado', description: 'Uso o inglês com naturalidade no trabalho e nos estudos.' },
]

export const ACCENT_OPTIONS: Choice<Accent>[] = [
  { value: 'en-US', label: ACCENT_LABEL['en-US'], description: 'Sotaque dos Estados Unidos. Tema vermelho.' },
  { value: 'en-GB', label: ACCENT_LABEL['en-GB'], description: 'Sotaque do Reino Unido. Tema azul-marinho.' },
]

const GOAL_HINT: Record<DailyGoal, string> = {
  10: 'Um empurrãozinho diário.',
  15: 'O ritmo mais comum.',
  20: 'Para evoluir mais rápido.',
  30: 'Treino intenso.',
}

export const GOAL_OPTIONS: Choice<DailyGoal>[] = ([10, 15, 20, 30] as const).map((minutes) => ({
  value: minutes,
  label: `${minutes} minutos por dia`,
  description: GOAL_HINT[minutes],
}))
