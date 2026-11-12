import { useState } from 'react'
import { AccuracyLine, ColumnBars, HorizontalBars } from '../../components/stats/charts'
import ChartCard from '../../components/stats/ChartCard'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ChoiceGroup from '../../components/ui/ChoiceGroup'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import ProgressBar from '../../components/ui/ProgressBar'
import Skeleton from '../../components/ui/Skeleton'
import { useAsync } from '../../hooks/useAsync'
import { ACCENT_LABEL } from '../../lib/format'
import { statsService } from '../../services'
import type { StatsPeriod } from '../../types'

const PERIODS = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: 'all', label: 'Tudo' },
] as const

function Kpi({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <Card>
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-1 text-3xl font-black text-ink">{value}</p>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
    </Card>
  )
}

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
      <PageHeader title="Estatísticas" description="Acompanhe sua evolução no listening, os erros mais comuns e o ritmo de estudo." />
      <div className="mb-6 max-w-md">
        <ChoiceGroup legend="Período" columns="grid-cols-3" value={period} onChange={setPeriod} options={PERIODS} />
      </div>

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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi label="Sessões no período" value={String(s.sessionsCount)} />
                <Kpi label="Repetições por fala" value={String(s.averageRepetitions).replace('.', ',')} note="Média de vezes que você ouviu cada fala." />
                <Kpi label="Respostas corrigidas" value={`${s.correctedRate}%`} note="Das respostas que receberam correção." />
                <Kpi
                  label="Sequência"
                  value={`${s.streak.current} ${s.streak.current === 1 ? 'dia' : 'dias'}`}
                  note={`Melhor sequência: ${s.streak.best} ${s.streak.best === 1 ? 'dia' : 'dias'}.`}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <ChartCard
                  title="Acerto no listening"
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

              <div className="grid gap-4 lg:grid-cols-3">
                <Card as="section">
                  <h2 className="text-xl font-black text-ink">Por sotaque</h2>
                  <ul className="mt-4 space-y-4">
                    {s.byAccent.map((a) => (
                      <li key={a.accent}>
                        <div className="flex justify-between gap-2 text-sm">
                          <span className="font-bold text-ink">{ACCENT_LABEL[a.accent]}</span>
                          <span className="text-muted">
                            {a.accuracy}% · {a.sessions} {a.sessions === 1 ? 'sessão' : 'sessões'}
                          </span>
                        </div>
                        <ProgressBar className="mt-1" label={`Acerto no ${ACCENT_LABEL[a.accent]}`} value={a.accuracy} valueText={`${a.accuracy}%`} />
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card as="section">
                  <h2 className="text-xl font-black text-ink">Palavras mais erradas</h2>
                  <ol className="mt-4 space-y-2">
                    {s.wrongWords.map((w, i) => (
                      <li key={w.word} className="flex items-center justify-between gap-2">
                        <span>
                          <span className="text-sm text-muted">{i + 1}. </span>
                          <span lang="en" className="font-bold text-ink">
                            {w.word}
                          </span>
                        </span>
                        <span className="rounded-full bg-danger px-2.5 py-0.5 text-xs font-bold text-on-danger">
                          {w.count} {w.count === 1 ? 'erro' : 'erros'}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Card>

                <Card as="section">
                  <h2 className="text-xl font-black text-ink">Linha do tempo de níveis</h2>
                  <ol className="mt-4 space-y-4 border-l-2 border-line pl-4">
                    {s.levelTimeline.map((t) => (
                      <li key={t.level}>
                        <p className="font-black text-ink">
                          {t.level} <span className="text-sm font-normal text-muted">· {t.date}</span>
                        </p>
                        <p className="text-sm text-muted">{t.note}</p>
                      </li>
                    ))}
                  </ol>
                </Card>
              </div>
            </div>
          )
        }}
      </Async>
    </Page>
  )
}
