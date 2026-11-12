import { useUser } from '../../auth/useAuth'
import { FlameIcon } from '../../components/appIcons'
import Async from '../../components/ui/Async'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Page } from '../../components/ui/PageHeader'
import ProgressBar from '../../components/ui/ProgressBar'
import Skeleton from '../../components/ui/Skeleton'
import { useAsync } from '../../hooks/useAsync'
import { ACCENT_LABEL, formatDate } from '../../lib/format'
import { statsService } from '../../services'
import { MODE_COPY } from '../../theme/modeCopy'
import { useTheme } from '../../theme/useTheme'

function DashboardSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Carregando seu painel…</span>
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-28" />
      <Skeleton className="h-14 w-full sm:w-72" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const user = useUser()
  const { accent } = useTheme()
  const state = useAsync(() => statsService.getDashboard())
  const hello = MODE_COPY[accent].greeting.replace(/!$/, '')
  const firstName = user.name.split(' ')[0]

  return (
    <Page>
      <h1 className="text-3xl font-black text-brand sm:text-4xl">
        <span lang="en">{hello}</span>, {firstName}!
      </h1>
      <p className="mt-1 mb-8 text-muted">Pronto para treinar o ouvido hoje?</p>

      <Async state={state} skeleton={<DashboardSkeleton />} errorMessage="Não foi possível carregar o seu painel.">
        {(d) => {
          const goalDone = d.todayMinutes >= d.dailyGoalMinutes
          return (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <h2 className="flex items-center gap-2 text-sm font-bold text-muted">
                    <FlameIcon className="h-5 w-5 text-brand" /> Sequência
                  </h2>
                  <p className="mt-2 text-4xl font-black text-ink">
                    {d.streakDays} <span className="text-lg font-bold">{d.streakDays === 1 ? 'dia' : 'dias'}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {d.streakDays > 0 ? 'Estudando em dias seguidos.' : 'Comece hoje a sua sequência.'}
                  </p>
                </Card>
                <Card>
                  <h2 className="text-sm font-bold text-muted">Meta de hoje</h2>
                  <p className="mt-2 text-4xl font-black text-ink">
                    {d.todayMinutes} <span className="text-lg font-bold">/ {d.dailyGoalMinutes} min</span>
                  </p>
                  <ProgressBar
                    className="mt-3"
                    label="Meta de hoje"
                    value={d.todayMinutes}
                    max={d.dailyGoalMinutes}
                    valueText={`${d.todayMinutes} de ${d.dailyGoalMinutes} minutos`}
                  />
                  <p className="mt-2 text-sm text-muted">
                    {goalDone ? '✓ Meta cumprida. Parabéns!' : `Faltam ${d.dailyGoalMinutes - d.todayMinutes} min.`}
                  </p>
                </Card>
                <Card>
                  <h2 className="text-sm font-bold text-muted">Nível atual</h2>
                  <p className="mt-2 text-4xl font-black text-ink">{user.level}</p>
                  <p className="mt-1 text-sm text-muted">Sotaque: {ACCENT_LABEL[user.accent]}</p>
                </Card>
              </div>

              <Card tone="soft">
                <h2 className="text-sm font-bold text-muted">Recomendação de nível</h2>
                <p className="mt-1 text-lg font-black text-ink">{d.recommendation.message}</p>
                {d.recommendation.sessionsRemaining > 0 && (
                  <ProgressBar
                    className="mt-3 max-w-md"
                    label="Caminho até o próximo nível"
                    value={5 - d.recommendation.sessionsRemaining}
                    max={5}
                    valueText={`${5 - d.recommendation.sessionsRemaining} de 5 sessões acima de ${d.recommendation.threshold}%`}
                  />
                )}
              </Card>

              <Button to="/app/praticar" size="lg" className="w-full sm:w-auto">
                Praticar agora
              </Button>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card as="section">
                  <h2 className="text-xl font-black text-ink">Últimas sessões</h2>
                  {d.recentSessions.length === 0 ? (
                    <p className="mt-3 text-muted">Você ainda não fez nenhuma sessão. Que tal começar agora?</p>
                  ) : (
                    <ul className="mt-3 divide-y divide-line">
                      {d.recentSessions.map((s) => (
                        <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                          <div>
                            <p className="font-bold text-ink">{s.scenarioTitle}</p>
                            <p className="text-sm text-muted">
                              {formatDate(s.date)} · {s.minutes} min · {ACCENT_LABEL[s.accent]}
                            </p>
                          </div>
                          <Badge tone={s.accuracy >= 85 ? 'ok' : 'neutral'}>{s.accuracy}% de acerto</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>

                <Card as="section">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-black text-ink">Palavras para revisar hoje</h2>
                    <Button to="/app/revisao" variant="ghost">
                      Revisar
                    </Button>
                  </div>
                  {d.reviewWords.length === 0 ? (
                    <p className="mt-3 text-muted">Nada para revisar por hoje. Volte amanhã!</p>
                  ) : (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {d.reviewWords.map((w) => (
                        <li key={w.id}>
                          <span lang="en" className="inline-block rounded-full border border-line bg-surface px-3 py-1 text-sm font-bold text-ink">
                            {w.word}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </div>
            </div>
          )
        }}
      </Async>
    </Page>
  )
}
