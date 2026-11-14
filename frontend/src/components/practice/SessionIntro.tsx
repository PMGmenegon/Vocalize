import { characterFor, introFor, situationFor } from '../../data/scenarios'
import { ACCENT_LABEL } from '../../lib/format'
import type { Session } from '../../types'
import { ScenarioIcon } from '../appIcons'
import Avatar from '../chat/Avatar'
import Button from '../ui/Button'
import { Page } from '../ui/PageHeader'

/** Introdução curta da situação, antes de a sessão começar. */
export default function SessionIntro({ session, onStart }: { session: Session; onStart: () => void }) {
  const situation = situationFor(session.scenarioId)
  const character = characterFor(session.scenarioId, session.accent)
  return (
    <Page narrow>
      <div className="flex items-center gap-3 text-brand">
        <ScenarioIcon icon={situation.icon} className="h-8 w-8" />
        <p className="text-sm font-bold uppercase tracking-wide">{situation.title}</p>
      </div>
      <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{introFor(session.scenarioId, session.accent)}</h1>
      <div className="mt-6 flex items-center gap-4 border-y border-line py-4">
        <Avatar spec={character.avatar} className="h-14 w-14" />
        <div>
          <p className="font-black text-ink">
            {character.name} <span className="font-bold text-muted">· {character.role}</span>
          </p>
          <p className="text-sm text-muted">
            Nível {session.level} · {ACCENT_LABEL[session.accent]} · até {session.maxTurns} rodadas
          </p>
        </div>
      </div>
      <p className="mt-4 text-muted">
        {situation.layout === 'chat'
          ? 'As falas chegam como mensagens de voz. Transcreva o que ouviu e responda por texto.'
          : 'Ouça cada fala, transcreva o que entendeu, veja seus erros palavra por palavra e responda para continuar a conversa.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={onStart}>
          Começar
        </Button>
        <Button to="/app/praticar" variant="ghost" size="lg">
          Voltar
        </Button>
      </div>
    </Page>
  )
}
