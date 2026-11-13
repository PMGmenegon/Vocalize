import { useParams } from 'react-router-dom'
import ChatSession from '../../components/chat/ChatSession'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import { Page } from '../../components/ui/PageHeader'
import Skeleton from '../../components/ui/Skeleton'
import { useAsync } from '../../hooks/useAsync'
import { sessionService } from '../../services'

export default function PracticeSessionPage() {
  const { sessaoId = '' } = useParams()
  const state = useAsync(() => sessionService.get(sessaoId), sessaoId)

  // A conversa ocupa a tela toda (cena + chat); carregamento, erro e "já encerrada" usam a página comum.
  if (state.status === 'success' && !state.data.endedAt) return <ChatSession session={state.data} />

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
        {(session) => (
          <div className="space-y-4">
            <p className="text-lg font-bold text-ink">Esta sessão já foi encerrada.</p>
            <Button to={`/app/praticar/${session.id}/resumo`}>Ver resumo</Button>
          </div>
        )}
      </Async>
    </Page>
  )
}
