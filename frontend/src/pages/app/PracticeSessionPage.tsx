import { useParams } from 'react-router-dom'
import SessionRunner from '../../components/practice/SessionRunner'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import { Page } from '../../components/ui/PageHeader'
import Skeleton from '../../components/ui/Skeleton'
import { useAsync } from '../../hooks/useAsync'
import { sessionService } from '../../services'

export default function PracticeSessionPage() {
  const { sessaoId = '' } = useParams()
  const state = useAsync(() => sessionService.get(sessaoId), sessaoId)

  return (
    <Page narrow>
      <Async
        state={state}
        skeleton={
          <div role="status" aria-live="polite" className="space-y-4">
            <span className="sr-only">Carregando a sessão…</span>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-80" />
          </div>
        }
        errorMessage="Não encontramos esta sessão. Ela pode ter sido apagada ou aberta em outro navegador."
      >
        {(session) =>
          session.endedAt ? (
            <div className="space-y-4">
              <p className="text-lg font-bold text-ink">Esta sessão já foi encerrada.</p>
              <Button to={`/app/praticar/${session.id}/resumo`}>Ver resumo</Button>
            </div>
          ) : (
            <SessionRunner session={session} />
          )
        }
      </Async>
    </Page>
  )
}
