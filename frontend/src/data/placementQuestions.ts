import type { Level } from '../types'

export type PlacementSkill = 'gramática' | 'compreensão de texto' | 'vocabulário'

export interface PlacementQuestion {
  id: string
  level: Level
  skill: PlacementSkill
  /** Texto de apoio (só nas perguntas de compreensão). */
  passage?: string
  prompt: string
  /** Sempre 4 alternativas, na ordem a) b) c) d). */
  options: readonly [string, string, string, string]
  /** Índice (0–3) da alternativa correta. */
  correctIndex: number
  /** Explicação em português, mostrada na revisão do resultado. */
  explanation: string
}

/** Perguntas FIXAS, iguais para todos os usuários e sempre nesta ordem. */
export const PLACEMENT_QUESTIONS: readonly PlacementQuestion[] = [
  {
    id: 'p1',
    level: 'A2',
    skill: 'gramática',
    prompt: 'She ___ to school every day.',
    options: ['go', 'goes', 'going', 'gone'],
    correctIndex: 1,
    explanation: 'Com he/she/it no presente simples, o verbo recebe -s: "goes".',
  },
  {
    id: 'p2',
    level: 'B1',
    skill: 'gramática',
    prompt: 'If it rains tomorrow, we ___ the picnic.',
    options: ['cancel', 'will cancel', 'would cancel', 'cancelled'],
    correctIndex: 1,
    explanation: 'Primeira condicional (if + presente, will + verbo) para uma situação real no futuro.',
  },
  {
    id: 'p3',
    level: 'B1',
    skill: 'compreensão de texto',
    passage:
      "Tom missed the bus this morning, so he took a taxi. He arrived at the office ten minutes late, but the meeting hadn't started yet.",
    prompt: "Why didn't Tom miss the beginning of the meeting?",
    options: ['He took the bus.', 'The meeting started after he arrived.', 'He arrived early.', 'The meeting was cancelled.'],
    correctIndex: 1,
    explanation: '"the meeting hadn\'t started yet" indica que a reunião ainda não tinha começado quando ele chegou.',
  },
  {
    id: 'p4',
    level: 'B2',
    skill: 'gramática',
    prompt: "I'd rather you ___ smoke in here.",
    options: ["don't", "didn't", "won't", 'not'],
    correctIndex: 1,
    explanation: '"I\'d rather + sujeito" usa o passado para falar do presente ou futuro: "I\'d rather you didn\'t".',
  },
  {
    id: 'p5',
    level: 'B2',
    skill: 'vocabulário',
    prompt: 'The company had to ___ its plans because of budget cuts.',
    options: ['carry out', 'put off', 'look after', 'bring up'],
    correctIndex: 1,
    explanation: '"put off" significa adiar; os cortes de orçamento obrigaram a empresa a adiar os planos.',
  },
  {
    id: 'p6',
    level: 'C1',
    skill: 'gramática',
    prompt: '___ had I arrived than the phone started ringing.',
    options: ['No sooner', 'Hardly', 'Scarcely', 'Barely'],
    correctIndex: 0,
    explanation: '"No sooner ... than" com inversão. "Hardly", "scarcely" e "barely" seriam usados com "when", não com "than".',
  },
]
