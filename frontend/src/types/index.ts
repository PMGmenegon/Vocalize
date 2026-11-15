/** Tipos do domínio do Vocalize. Os serviços (src/services) devolvem exatamente estes formatos, com mock ou API real. */

export type Level = 'A2' | 'B1' | 'B2' | 'C1'
export const LEVELS: readonly Level[] = ['A2', 'B1', 'B2', 'C1']

/** Sotaque do conteúdo (locale). Não confundir com o tema visual `Accent` de src/theme ('us' | 'uk'). */
export type Accent = 'en-US' | 'en-GB'

export type ScenarioId = 'restaurant' | 'street' | 'airport' | 'hotel' | 'shopping' | 'job-interview' | 'virtual-chat'

/** Como a prática é apresentada: tela de treino focada ou conversa por mensagens. */
export type PracticeLayout = 'training' | 'chat'

/** Chave do ícone da situação (ver ScenarioIcon em components/appIcons.tsx). */
export type ScenarioIconKey = 'utensils' | 'pin' | 'plane' | 'bed' | 'bag' | 'briefcase' | 'chat'

/** Resultado salvo do teste de nivelamento. */
export interface PlacementRecord {
  level: Level
  /** Data do teste (ISO). */
  takenAt: string
}

export interface User {
  id: string
  name: string
  email: string
  level: Level
  accent: Accent
  /** Resultado do teste de nivelamento (nível recomendado pelo teste + data). Ausente se o nível foi escolhido na mão. */
  placement?: PlacementRecord
  /** false até concluir o onboarding. */
  onboarded: boolean
  createdAt: string
}

/** Uma situação de listening. O campo `layout` escolhe a tela de prática. */
export interface Scenario {
  id: ScenarioId
  title: string
  /** Contexto em uma frase. */
  description: string
  icon: ScenarioIconKey
  layout: PracticeLayout
}

/** Situação de cada palavra na comparação do ditado. */
export type WordStatus = 'correct' | 'wrong' | 'missing' | 'extra'

export interface WordResult {
  status: WordStatus
  /** Palavra da frase original (ausente em 'extra'). */
  expected?: string
  /** O que o usuário digitou (ausente em 'missing'). */
  typed?: string
}

export interface TranscriptionResult {
  words: WordResult[]
  /** 0–100. */
  accuracy: number
  correctCount: number
  totalExpected: number
  /** Frase original, revelada só depois da conferência. */
  expectedText: string
}

export interface Correction {
  original: string
  corrected: string
  /** Explicação em português. */
  explanation: string
  vocabulary: { term: string; meaning: string }[]
  /** false quando a resposta já estava ótima. */
  changed: boolean
}

export interface Turn {
  index: number
  /** Quando a fala chegou (ISO). */
  createdAt?: string
  /** Quando o usuário respondeu (ISO). */
  repliedAt?: string
  /** Quantidade de palavras da fala da IA (dica). */
  wordCount: number
  repetitions: number
  transcription?: TranscriptionResult
  reply?: string
  correction?: Correction
}

export interface Session {
  id: string
  scenarioId: ScenarioId
  level: Level
  accent: Accent
  startedAt: string
  endedAt?: string
  /** Limite de rodadas. A sessão também termina quando o usuário encerra. */
  maxTurns: number
  /** As falas chegam uma a uma (assíncronas), então a lista cresce durante a sessão. */
  turns: Turn[]
}

export interface SessionSummary {
  sessionId: string
  scenarioId: ScenarioId
  scenarioTitle: string
  averageAccuracy: number
  durationSeconds: number
  turnsCompleted: number
  wrongWords: string[]
  correctionsCount: number
}

/** Item da lista "últimas sessões". */
export interface SessionListItem {
  id: string
  scenarioId: ScenarioId
  scenarioTitle: string
  accent: Accent
  date: string
  accuracy: number
  minutes: number
}

export type StatsPeriod = '7d' | '30d' | 'all'

export interface Stats {
  period: StatsPeriod
  sessionsCount: number
  listeningAccuracy: { label: string; accuracy: number }[]
  averageRepetitions: number
  /** % de respostas faladas/escritas que receberam correção. */
  correctedRate: number
  errorTypes: { type: string; count: number }[]
  wrongWords: { word: string; count: number }[]
  streak: { current: number; best: number }
  minutesSeries: { label: string; minutes: number }[]
  minutesUnit: 'dia' | 'semana'
  byScenario: { scenarioId: ScenarioId; scenarioTitle: string; accuracy: number; sessions: number }[]
  byAccent: { accent: Accent; accuracy: number; sessions: number }[]
  levelTimeline: { date: string; level: Level; note: string }[]
}

export interface LevelRecommendation {
  currentLevel: Level
  targetLevel: Level
  /** Nota mínima (%) de cada sessão que conta. */
  threshold: number
  sessionsRemaining: number
  message: string
}

export interface DashboardData {
  streakDays: number
  recommendation: LevelRecommendation
  recentSessions: SessionListItem[]
  reviewWords: Flashcard[]
}

export interface Flashcard {
  id: string
  /** Palavra em inglês (resposta do cartão). */
  word: string
  meaning: string
  example: string
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'
