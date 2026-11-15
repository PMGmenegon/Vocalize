import { useParams } from 'react-router-dom'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import { List } from '../../components/ui/List'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import Section from '../../components/ui/Section'
import Skeleton from '../../components/ui/Skeleton'
import { Stat, StatList } from '../../components/ui/Stat'
import StickyActionBar from '../../components/ui/StickyActionBar'
import { useAsync } from '../../hooks/useAsync'
import { formatDuration } from '../../lib/format'
import { sessionService } from '../../services'

export default function SummaryPage() {
  const { sessaoId = '' } = useParams()
  const state = useAsync(() => sessionService.getSummary(sessaoId), sessaoId)

  return (
    <Page narrow>
      <Async
        state={state}
        skeleton={
          <div role="status" aria-live="polite" className="space-y-6">
            <span className="sr-only">Carregando o resumo…</span>
            <Skeleton className="h-24 w-2/3" />
            <Skeleton className="h-28" />
            <Skeleton className="h-40" />
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
            <PageHeader eyebrow="Sessão concluída" title={s.scenarioTitle} description={`${s.turnsCompleted} ${s.turnsCompleted === 1 ? 'rodada concluída' : 'rodadas concluídas'}.`} />
            <StatList divided>
              <Stat divided large label="Acerto médio" value={`${s.averageAccuracy}%`} />
              <Stat divided large label="Tempo" value={formatDuration(s.durationSeconds)} />
              <Stat divided large label="Erros" value={String(s.wrongWords.length)} />
              <Stat divided large label="Correções" value={String(s.correctionsCount)} />
            </StatList>

            <Section id="treinar-titulo" title="Palavras para treinar" meta={s.wrongWords.length || undefined} className="mt-12">
              {s.wrongWords.length === 0 ? (
                <p className="mt-4 text-lg text-on-ok">✓ Você acertou todas as palavras. Excelente!</p>
              ) : (
                <List className="grid sm:grid-cols-2 sm:gap-x-12 sm:divide-y-0">
                  {s.wrongWords.map((w) => (
                    <li key={w} lang="en" className="border-b border-line py-3 font-bold text-ink">
                      <span aria-hidden="true" className="text-on-danger">✗ </span>
                      {w}
                    </li>
                  ))}
                </List>
              )}
            </Section>

            <StickyActionBar label="Próximo passo" summary="Continue treinando">
              <Button to="/app" variant="ghost" size="lg">
                Ir para o início
              </Button>
              <Button to="/app/praticar" size="lg" className="px-8">
                Praticar de novo
              </Button>
            </StickyActionBar>
          </>
        )}
      </Async>
    </Page>
  )
}
