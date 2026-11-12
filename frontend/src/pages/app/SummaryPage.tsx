import { useParams } from 'react-router-dom'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import Skeleton from '../../components/ui/Skeleton'
import { useAsync } from '../../hooks/useAsync'
import { formatDuration } from '../../lib/format'
import { sessionService } from '../../services'

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-1 text-3xl font-black text-ink">{value}</p>
    </Card>
  )
}

export default function SummaryPage() {
  const { sessaoId = '' } = useParams()
  const state = useAsync(() => sessionService.getSummary(sessaoId), sessaoId)

  return (
    <Page narrow>
      <Async
        state={state}
        skeleton={
          <div role="status" aria-live="polite" className="space-y-4">
            <span className="sr-only">Carregando o resumo…</span>
            <Skeleton className="h-10 w-2/3" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        }
        isEmpty={(s) => s.turnsCompleted === 0}
        empty={{
          title: 'Sessão encerrada sem rodadas concluídas',
          description: 'Nenhuma rodada foi completada, então não há o que resumir. Que tal tentar de novo?',
          action: <Button to="/app/praticar">Praticar de novo</Button>,
        }}
        errorMessage="Não foi possível carregar o resumo desta sessão."
      >
        {(s) => (
          <>
            <PageHeader title="Sessão concluída" description={`${s.scenarioTitle} · ${s.turnsCompleted} ${s.turnsCompleted === 1 ? 'rodada' : 'rodadas'}`} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric label="Acerto médio" value={`${s.averageAccuracy}%`} />
              <Metric label="Tempo" value={formatDuration(s.durationSeconds)} />
              <Metric label="Palavras erradas" value={String(s.wrongWords.length)} />
              <Metric label="Correções recebidas" value={String(s.correctionsCount)} />
            </div>

            <Card className="mt-4" as="section">
              <h2 className="text-lg font-black text-ink">Palavras para treinar</h2>
              {s.wrongWords.length === 0 ? (
                <p className="mt-2 text-muted">✓ Você acertou todas as palavras. Excelente!</p>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.wrongWords.map((w) => (
                    <li key={w} lang="en" className="rounded-full bg-danger px-3 py-1 text-sm font-bold text-on-danger">
                      <span aria-hidden="true">✗ </span>
                      {w}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/app/praticar" size="lg">
                Praticar de novo
              </Button>
              <Button to="/app" variant="secondary" size="lg">
                Ir para o início
              </Button>
            </div>
          </>
        )}
      </Async>
    </Page>
  )
}
