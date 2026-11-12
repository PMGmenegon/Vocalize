import { db } from '../mocks/db'
import { HISTORY, type HistoryRow } from '../mocks/history'
import { DEMO_USER } from '../mocks/users'
import type { Level, Session } from '../types'
import { LEVELS } from '../types'
import { isEmptyMode } from './runtime'

/** Uso interno dos serviços (as telas não importam isto). */
export type HistoryEntry = HistoryRow & { id: string }

/** Resumo numérico de uma sessão (usado no resumo e no histórico). */
export function summarize(session: Session) {
  const done = session.turns.filter((t) => t.transcription)
  const accuracy = done.length
    ? Math.round(done.reduce((sum, t) => sum + (t.transcription?.accuracy ?? 0), 0) / done.length)
    : 0
  const wrong = done.flatMap((t) =>
    (t.transcription?.words ?? []).flatMap((w) => (w.status === 'wrong' || w.status === 'missing' ? [w.expected ?? ''] : [])),
  )
  const seconds = Math.max(
    1,
    Math.round(((session.endedAt ? new Date(session.endedAt).getTime() : Date.now()) - new Date(session.startedAt).getTime()) / 1000),
  )
  return {
    accuracy,
    turnsCompleted: done.length,
    wrongWords: [...new Set(wrong.map((w) => w.toLowerCase()).filter(Boolean))],
    corrections: session.turns.filter((t) => t.correction?.changed).length,
    seconds,
    repetitions: done.length ? done.reduce((s, t) => s + t.repetitions, 0) / done.length : 0,
  }
}

/** Histórico completo da pessoa logada: o falso (usuária demo) + as sessões que ela concluiu neste navegador. */
export function activeHistory(): HistoryEntry[] {
  if (isEmptyMode()) return []
  const user = db.getUser()
  const base: HistoryEntry[] =
    user?.id === DEMO_USER.id ? HISTORY.map((row) => ({ ...row, id: `h-${row.daysAgo}-${row.scenarioId}` })) : []
  const real = Object.values(db.getSessions())
    .filter((s) => s.endedAt)
    .map((s): HistoryEntry => {
      const sum = summarize(s)
      return {
        id: s.id,
        daysAgo: 0,
        scenarioId: s.scenarioId,
        accent: s.accent,
        minutes: Math.max(1, Math.round(sum.seconds / 60)),
        accuracy: sum.accuracy,
        repetitions: sum.repetitions,
        turns: sum.turnsCompleted,
        corrections: sum.corrections,
        wrong: sum.wrongWords,
      }
    })
  return [...base, ...real]
}

export function nextLevel(level: Level): Level | null {
  return LEVELS[LEVELS.indexOf(level) + 1] ?? null
}
