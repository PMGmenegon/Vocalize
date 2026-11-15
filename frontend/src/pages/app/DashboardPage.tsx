import { Link } from 'react-router-dom'
import { useUser } from '../../auth/useAuth'
import { FlameIcon } from '../../components/appIcons'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import { List, ListItem } from '../../components/ui/List'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import ProgressBar from '../../components/ui/ProgressBar'
import Section from '../../components/ui/Section'
import Skeleton from '../../components/ui/Skeleton'
import { Stat, StatList } from '../../components/ui/Stat'
import { useAsync } from '../../hooks/useAsync'
import { ACCENT_LABEL, formatDate } from '../../lib/format'
import { statsService } from '../../services'

function DashboardSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-10">
      <span className="sr-only">Carregando seu painel…</span>
      <Skeleton className="h-28" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const user = useUser()
  const state = useAsync(() => statsService.getDashboard())
  const firstName = user.name.split(' ')[0]

  return (
    <Page>
      <Async
        state={state}
        skeleton={
          <>
            <PageHeader eyebrow="Início" title={`Olá, ${firstName}.`} description="Pronto para treinar o ouvido hoje?" />
            <DashboardSkeleton />
          </>
        }
        errorMessage="Não foi possível carregar o seu painel."
      >
        {(d) => (
          <>
            <PageHeader
              eyebrow="Início"
              title={`Olá, ${firstName}.`}
              description="Pronto para treinar o ouvido hoje?"
              stats={
                <StatList>
                  <Stat
                    label="Sequência"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <FlameIcon className="h-5 w-5 text-brand" />
                        {d.streakDays} {d.streakDays === 1 ? 'dia' : 'dias'}
                      </span>
                    }
                  />
                  <Stat label="Nível" value={user.level} />
                  <Stat label="Sotaque" value={ACCENT_LABEL[user.accent]} />
                </StatList>
              }
            />

            <div className="space-y-12">
              <section aria-labelledby="proximo-passo" className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-y border-line py-6">
                <div className="min-w-0 flex-1 sm:basis-96">
                  <p id="proximo-passo" className="type-eyebrow text-brand">
                    Recomendação de nível
                  </p>
                  <p className="type-display mt-1 text-2xl sm:text-3xl">{d.recommendation.message}</p>
                  {d.recommendation.sessionsRemaining > 0 && (
                    <ProgressBar
                      className="mt-4 max-w-md"
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

              <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
                <Section id="recent-title" title="Últimas sessões" meta={d.recentSessions.length || undefined}>
                  {d.recentSessions.length === 0 ? (
                    <p className="mt-4 text-muted">Você ainda não fez nenhuma sessão. Que tal começar agora?</p>
                  ) : (
                    <List>
                      {d.recentSessions.map((s) => (
                        <ListItem
                          key={s.id}
                          title={s.scenarioTitle}
                          description={`${formatDate(s.date)} · ${s.minutes} min · ${ACCENT_LABEL[s.accent]}`}
                          trailing={
                            <span className={`font-black ${s.accuracy >= 85 ? 'text-on-ok' : 'text-ink'}`}>
                              {s.accuracy >= 85 && <span aria-hidden="true">✓ </span>}
                              {s.accuracy}%<span className="sr-only"> de acerto</span>
                            </span>
                          }
                        />
                      ))}
                    </List>
                  )}
                </Section>

                <Section id="review-title" title="Palavras para revisar hoje" action={<Link to="/app/revisao" className="rounded text-sm font-bold text-link hover:underline">Revisar →</Link>}>
                  {d.reviewWords.length === 0 ? (
                    <p className="mt-4 text-muted">Nada para revisar por hoje. Volte amanhã!</p>
                  ) : (
                    <List>
                      {d.reviewWords.map((w) => (
                        <ListItem
                          key={w.id}
                          title={<span lang="en">{w.word}</span>}
                          trailing={<span className="text-muted">{w.meaning}</span>}
                        />
                      ))}
                    </List>
                  )}
                </Section>
              </div>
            </div>
          </>
        )}
      </Async>
    </Page>
  )
}
