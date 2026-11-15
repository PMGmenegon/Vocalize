import { useState } from 'react'
import { AccuracyLine, ColumnBars, HorizontalBars } from '../../components/stats/charts'
import ChartCard from '../../components/stats/ChartCard'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import ChoiceGroup from '../../components/ui/ChoiceGroup'
import { List } from '../../components/ui/List'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import ProgressBar from '../../components/ui/ProgressBar'
import Section from '../../components/ui/Section'
import Skeleton from '../../components/ui/Skeleton'
import { Stat, StatList } from '../../components/ui/Stat'
import { useAsync } from '../../hooks/useAsync'
import { ACCENT_LABEL } from '../../lib/format'
import { statsService } from '../../services'
import type { StatsPeriod } from '../../types'

const PERIODS = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: 'all', label: 'Tudo' },
] as const

function StatsSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">Carregando estatísticas…</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    </div>
  )
}

export default function StatsPage() {
  const [period, setPeriod] = useState<StatsPeriod>('30d')
  const state = useAsync(() => statsService.getStats(period), period)

  return (
    <Page>
      <PageHeader
        eyebrow="Estatísticas"
        title="Sua evolução"
        description="Acompanhe sua evolução na escuta, os erros mais comuns e o ritmo de estudo."
        action={<ChoiceGroup legend="Período" variant="pill" value={period} onChange={setPeriod} options={PERIODS} />}
      />

      <Async
        state={state}
        skeleton={<StatsSkeleton />}
        isEmpty={(s) => s.sessionsCount === 0}
        empty={{
          title: 'Ainda não há dados neste período',
          description: 'Faça uma sessão de prática e suas estatísticas aparecem aqui.',
          action: <Button to="/app/praticar">Praticar agora</Button>,
        }}
        errorMessage="Não foi possível carregar as estatísticas."
      >
        {(s) => {
          const best = s.byScenario.reduce((a, b) => (b.accuracy > a.accuracy ? b : a), s.byScenario[0]!)
          return (
            <div className="space-y-6">
              <StatList divided>
                <Stat divided large label="Sessões no período" value={String(s.sessionsCount)} />
                <Stat divided large label="Repetições por fala" value={String(s.averageRepetitions).replace('.', ',')} note="Média de vezes que você ouviu cada fala." />
                <Stat divided large label="Respostas corrigidas" value={`${s.correctedRate}%`} note="Das respostas que receberam correção." />
                <Stat
                  divided
                  large
                  label="Sequência"
                  value={`${s.streak.current} ${s.streak.current === 1 ? 'dia' : 'dias'}`}
                  note={`Melhor sequência: ${s.streak.best} ${s.streak.best === 1 ? 'dia' : 'dias'}.`}
                />
              </StatList>

              <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
                <ChartCard
                  title="Acerto na escuta"
                  description="Porcentagem de palavras certas no ditado, sessão a sessão."
                  summary={`De ${s.listeningAccuracy[0]?.accuracy}% para ${s.listeningAccuracy.at(-1)?.accuracy}% em ${s.listeningAccuracy.length} sessões.`}
                  table={{ headers: ['Data', 'Acerto'], rows: s.listeningAccuracy.map((p) => [p.label, `${p.accuracy}%`]) }}
                >
                  <AccuracyLine data={s.listeningAccuracy} />
                </ChartCard>

                <ChartCard
                  title="Erros mais comuns"
                  description="Tipos de erro que mais aparecem nos seus ditados."
                  summary={s.errorTypes.map((e) => `${e.type}: ${e.count}`).join('; ') || 'Sem erros no período.'}
                  table={{ headers: ['Tipo de erro', 'Ocorrências'], rows: s.errorTypes.map((e) => [e.type, e.count]) }}
                >
                  <HorizontalBars data={s.errorTypes.map((e) => ({ name: e.type, value: e.count }))} />
                </ChartCard>

                <ChartCard
                  title={`Minutos por ${s.minutesUnit}`}
                  description="Quanto tempo você dedicou à prática."
                  summary={s.minutesSeries.map((m) => `${m.label}: ${m.minutes} min`).join('; ')}
                  table={{ headers: [s.minutesUnit === 'dia' ? 'Dia' : 'Semana', 'Minutos'], rows: s.minutesSeries.map((m) => [m.label, m.minutes]) }}
                >
                  <ColumnBars data={s.minutesSeries.map((m) => ({ name: m.label, value: m.minutes }))} unit=" min" />
                </ChartCard>

                <ChartCard
                  title="Acerto por cenário"
                  description={`Seu melhor cenário é ${best.scenarioTitle} (${best.accuracy}%).`}
                  summary={s.byScenario.map((c) => `${c.scenarioTitle}: ${c.accuracy}%`).join('; ')}
                  table={{ headers: ['Cenário', 'Acerto', 'Sessões'], rows: s.byScenario.map((c) => [c.scenarioTitle, `${c.accuracy}%`, c.sessions]) }}
                >
                  <HorizontalBars data={s.byScenario.map((c) => ({ name: c.scenarioTitle, value: c.accuracy }))} unit="%" />
                </ChartCard>
              </div>

              <div className="grid gap-x-12 gap-y-10 lg:grid-cols-3">
                <Section id="sotaque-titulo" title="Por sotaque">
                  <ul className="mt-4 space-y-5">
                    {s.byAccent.map((a) => (
                      <li key={a.accent}>
                        <div className="flex justify-between gap-2">
                          <span className="font-bold text-ink">{ACCENT_LABEL[a.accent]}</span>
                          <span className="text-sm text-muted">
                            {a.accuracy}% · {a.sessions} {a.sessions === 1 ? 'sessão' : 'sessões'}
                          </span>
                        </div>
                        <ProgressBar className="mt-2" label={`Acerto no ${ACCENT_LABEL[a.accent]}`} value={a.accuracy} valueText={`${a.accuracy}%`} />
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section id="erradas-titulo" title="Palavras mais erradas">
                  <List ordered>
                    {s.wrongWords.map((w, i) => (
                      <li key={w.word} className="flex items-center justify-between gap-2 py-3">
                        <span>
                          <span className="text-sm text-muted">{i + 1}. </span>
                          <span lang="en" className="font-bold text-ink">
                            {w.word}
                          </span>
                        </span>
                        <span className="text-sm font-bold text-on-danger">
                          {w.count} {w.count === 1 ? 'erro' : 'erros'}
                        </span>
                      </li>
                    ))}
                  </List>
                </Section>

                <Section id="niveis-titulo" title="Linha do tempo de níveis">
                  <ol className="mt-4 space-y-5 border-l border-line pl-5">
                    {s.levelTimeline.map((t) => (
                      <li key={t.level}>
                        <p className="font-black text-ink">
                          {t.level} <span className="text-sm font-normal text-muted">· {t.date}</span>
                        </p>
                        <p className="text-sm text-muted">{t.note}</p>
                      </li>
                    ))}
                  </ol>
                </Section>
              </div>
            </div>
          )
        }}
      </Async>
    </Page>
  )
}
