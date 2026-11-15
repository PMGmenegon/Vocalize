import { useUser } from '../../auth/useAuth'
import { FlameIcon } from '../../components/appIcons'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
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
      <div className="grid gap-4 sm:grid-cols-2">
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
          return (
            <div className="space-y-10">
              <dl className="grid gap-6 border-y border-line py-6 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-line">
                <div className="sm:pr-8">
                  <dt className="flex items-center gap-2 text-sm font-bold text-muted">
                    <FlameIcon className="h-5 w-5 text-brand" /> Sequência
                  </dt>
                  <dd className="mt-1 text-4xl font-black text-ink">
                    {d.streakDays} <span className="text-lg font-bold">{d.streakDays === 1 ? 'dia' : 'dias'}</span>
                  </dd>
                  <dd className="text-sm text-muted">{d.streakDays > 0 ? 'Estudando em dias seguidos.' : 'Comece hoje a sua sequência.'}</dd>
                </div>
                <div className="sm:pl-8">
                  <dt className="text-sm font-bold text-muted">Nível atual</dt>
                  <dd className="mt-1 text-4xl font-black text-ink">{user.level}</dd>
                  <dd className="text-sm text-muted">Sotaque: {ACCENT_LABEL[user.accent]}</dd>
                </div>
              </dl>

              <section aria-label="Próximo passo" className="flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h2 className="text-sm font-bold text-muted">Recomendação de nível</h2>
                  <p className="mt-1 text-lg font-black text-ink">{d.recommendation.message}</p>
                  {d.recommendation.sessionsRemaining > 0 && (
                    <ProgressBar
                      className="mt-3"
                      label="Caminho até o próximo nível"
                      value={5 - d.recommendation.sessionsRemaining}
                      max={5}
                      valueText={`${5 - d.recommendation.sessionsRemaining} de 5 sessões acima de ${d.recommendation.threshold}%`}
                    />
                  )}
                </div>
                <Button to="/app/praticar" size="lg" className="w-full px-10 sm:w-auto">
                  Praticar agora
                </Button>
              </section>

              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <section aria-labelledby="recent-title">
                  <h2 id="recent-title" className="border-b border-line pb-2 text-xl font-black text-ink">
                    Últimas sessões
                  </h2>
                  {d.recentSessions.length === 0 ? (
                    <p className="mt-3 text-muted">Você ainda não fez nenhuma sessão. Que tal começar agora?</p>
                  ) : (
                    <ul className="divide-y divide-line">
                      {d.recentSessions.map((s) => (
                        <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                          <div>
                            <p className="font-bold text-ink">{s.scenarioTitle}</p>
                            <p className="text-sm text-muted">
                              {formatDate(s.date)} · {s.minutes} min · {ACCENT_LABEL[s.accent]}
                            </p>
                          </div>
                          <span className={`text-sm font-bold ${s.accuracy >= 85 ? 'text-on-ok' : 'text-ink'}`}>
                            {s.accuracy >= 85 && <span aria-hidden="true">✓ </span>}
                            {s.accuracy}% de acerto
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section aria-labelledby="review-title">
                  <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
                    <h2 id="review-title" className="text-xl font-black text-ink">
                      Palavras para revisar hoje
                    </h2>
                    <Button to="/app/revisao" variant="ghost">
                      Revisar
                    </Button>
                  </div>
                  {d.reviewWords.length === 0 ? (
                    <p className="mt-3 text-muted">Nada para revisar por hoje. Volte amanhã!</p>
                  ) : (
                    <ul className="divide-y divide-line">
                      {d.reviewWords.map((w) => (
                        <li key={w.id} className="flex justify-between gap-3 py-3">
                          <span lang="en" className="font-bold text-ink">
                            {w.word}
                          </span>
                          <span className="text-muted">{w.meaning}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          )
        }}
      </Async>
    </Page>
  )
}
