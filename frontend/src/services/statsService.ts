import { db } from '../mocks/db'
import { LEVEL_TIMELINE, WORD_ERROR_TYPE } from '../mocks/history'
import type { Accent, DashboardData, LevelRecommendation, ScenarioId, SessionListItem, Stats, StatsPeriod } from '../types'
import { activeHistory, nextLevel, type HistoryEntry } from './history'
import { dueToday } from './reviewService'
import { scenarioTitle } from './scenarioService'
import { daysAgoIso, simulate } from './runtime'

const DAYS: Record<StatsPeriod, number> = { '7d': 7, '30d': 30, all: Infinity }

const dm = (daysAgo: number) =>
  new Date(daysAgoIso(daysAgo)).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

const avg = (nums: number[]) => (nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0)

function count<T>(items: T[]) {
  const map = new Map<T, number>()
  for (const item of items) map.set(item, (map.get(item) ?? 0) + 1)
  return [...map.entries()]
}

/** Dias consecutivos estudando, contando de hoje (ou de ontem, se ainda não estudou hoje). */
function streaks(rows: HistoryEntry[]) {
  const days = new Set(rows.map((r) => r.daysAgo))
  let current = 0
  for (let d = days.has(0) ? 0 : 1; days.has(d); d++) current++
  let best = 0
  let run = 0
  for (let d = Math.max(0, ...days); d >= 0; d--) {
    run = days.has(d) ? run + 1 : 0
    best = Math.max(best, run)
  }
  return { current, best }
}

function minutesSeries(rows: HistoryEntry[], period: StatsPeriod): Pick<Stats, 'minutesSeries' | 'minutesUnit'> {
  if (period === '7d') {
    const series = Array.from({ length: 7 }, (_, i) => {
      const daysAgo = 6 - i
      const label = new Date(daysAgoIso(daysAgo)).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
      return { label, minutes: rows.filter((r) => r.daysAgo === daysAgo).reduce((s, r) => s + r.minutes, 0) }
    })
    return { minutesSeries: series, minutesUnit: 'dia' }
  }
  const weeks = Math.floor(Math.max(0, ...rows.map((r) => r.daysAgo)) / 7) + 1
  const series = Array.from({ length: weeks }, (_, i) => {
    const k = weeks - 1 - i
    const label = k === 0 ? 'Esta semana' : k === 1 ? 'Semana passada' : `Há ${k} semanas`
    return { label, minutes: rows.filter((r) => Math.floor(r.daysAgo / 7) === k).reduce((s, r) => s + r.minutes, 0) }
  })
  return { minutesSeries: series, minutesUnit: 'semana' }
}

export const statsService = {
  getStats(period: StatsPeriod): Promise<Stats> {
    return simulate(() => {
      const all = activeHistory()
      const rows = all.filter((r) => r.daysAgo < DAYS[period])
      const wrongWords = rows.flatMap((r) => r.wrong)
      const turns = rows.reduce((s, r) => s + r.turns, 0)
      const groupBy = <K extends string>(key: (r: HistoryEntry) => K) =>
        [...new Set(rows.map(key))].map((k) => {
          const group = rows.filter((r) => key(r) === k)
          return { key: k, accuracy: avg(group.map((r) => r.accuracy)), sessions: group.length }
        })

      return {
        period,
        sessionsCount: rows.length,
        listeningAccuracy: rows.map((r) => ({ label: dm(r.daysAgo), accuracy: r.accuracy })),
        averageRepetitions: rows.length ? Math.round((rows.reduce((s, r) => s + r.repetitions, 0) / rows.length) * 10) / 10 : 0,
        correctedRate: turns ? Math.round((rows.reduce((s, r) => s + r.corrections, 0) / turns) * 100) : 0,
        errorTypes: count(wrongWords.map((w) => WORD_ERROR_TYPE[w] ?? 'Outros'))
          .map(([type, n]) => ({ type, count: n }))
          .sort((a, b) => b.count - a.count),
        wrongWords: count(wrongWords)
          .map(([word, n]) => ({ word, count: n }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8),
        streak: streaks(all),
        ...minutesSeries(rows, period),
        byScenario: groupBy((r) => r.scenarioId).map((g) => ({
          scenarioId: g.key as ScenarioId,
          scenarioTitle: scenarioTitle(g.key),
          accuracy: g.accuracy,
          sessions: g.sessions,
        })),
        byAccent: groupBy((r) => r.accent).map((g) => ({ accent: g.key as Accent, accuracy: g.accuracy, sessions: g.sessions })),
        levelTimeline: all.length
          ? LEVEL_TIMELINE.map((t) => ({ date: dm(t.daysAgo), level: t.level, note: t.note }))
          : [],
      }
    }, 500)
  },

  getDashboard(): Promise<DashboardData> {
    return simulate(() => {
      const user = db.getUser()
      if (!user) throw new Error('Sessão expirada.')
      const rows = activeHistory()
      const threshold = 85
      const required = 5
      const target = nextLevel(user.level)
      const above = rows.slice(-required).filter((r) => r.accuracy >= threshold).length
      const remaining = Math.max(0, required - above)
      const recommendation: LevelRecommendation = {
        currentLevel: user.level,
        targetLevel: target ?? user.level,
        threshold,
        sessionsRemaining: target ? remaining : 0,
        message: !target
          ? 'Você já está no nível mais alto. Continue praticando para manter o ritmo!'
          : remaining === 0
            ? `Você já pode subir para o ${target}! Confirme na próxima sessão.`
            : `Você está perto do ${target} — faltam ${remaining} ${remaining === 1 ? 'sessão' : 'sessões'} acima de ${threshold}%`,
      }
      const recentSessions: SessionListItem[] = rows
        .slice(-4)
        .reverse()
        .map((r) => ({
          id: r.id,
          scenarioId: r.scenarioId,
          scenarioTitle: scenarioTitle(r.scenarioId),
          accent: r.accent,
          date: daysAgoIso(r.daysAgo),
          accuracy: r.accuracy,
          minutes: r.minutes,
        }))
      return {
        streakDays: streaks(rows).current,
        todayMinutes: rows.filter((r) => r.daysAgo === 0).reduce((s, r) => s + r.minutes, 0),
        dailyGoalMinutes: user.dailyGoalMinutes,
        recommendation,
        recentSessions,
        reviewWords: dueToday().slice(0, 6),
      }
    }, 500)
  },
}
