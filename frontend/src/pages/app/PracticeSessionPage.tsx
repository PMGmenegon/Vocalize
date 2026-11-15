import { useParams } from 'react-router-dom'
import PracticeSession from '../../components/practice/PracticeSession'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { Page } from '../../components/ui/PageHeader'
import Skeleton from '../../components/ui/Skeleton'
import { useAsync } from '../../hooks/useAsync'
import { sessionService } from '../../services'

export default function PracticeSessionPage() {
  const { sessaoId = '' } = useParams()
  const state = useAsync(() => sessionService.get(sessaoId), sessaoId)

  // A prática tem layout próprio (treino ou chat); carregamento, erro e "já encerrada" usam a página comum.
  if (state.status === 'success' && !state.data.endedAt) return <PracticeSession session={state.data} />

  return (
    <Page narrow>
      <Async
        state={state}
        skeleton={
          <div role="status" aria-live="polite" className="space-y-6">
            <span className="sr-only">Carregando a sessão…</span>
            <Skeleton className="h-24 w-2/3" />
            <Skeleton className="h-80" />
          </div>
        }
        errorMessage="Não encontramos esta sessão. Ela pode ter sido apagada ou aberta em outro navegador."
      >
        {(session) => (
          <EmptyState
            title="Esta sessão já foi encerrada"
            description="O resumo mostra como foi o seu desempenho."
            action={<Button to={`/app/praticar/${session.id}/resumo`}>Ver resumo</Button>}
          />
        )}
      </Async>
    </Page>
  )
}
