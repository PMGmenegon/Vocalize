import { EXPERIENCE, situationFor, speakerRoleFor } from '../../data/scenarios'
import { ACCENT_LABEL } from '../../lib/format'
import type { Session } from '../../types'
import { ScenarioIcon } from '../appIcons'
import Button from '../ui/Button'
import PageHeader, { Page } from '../ui/PageHeader'
import { Stat, StatList } from '../ui/Stat'
import StickyActionBar from '../ui/StickyActionBar'

/** Introdução curta da situação, antes de a sessão começar. */
export default function SessionIntro({ session, onStart }: { session: Session; onStart: () => void }) {
  const situation = situationFor(session.scenarioId)
  return (
    <Page narrow>
      <PageHeader
        eyebrow={`${EXPERIENCE[situation.layout].label} · antes de começar`}
        title={situation.title}
        stats={
          <StatList>
            <Stat label="Nível" value={session.level} />
            <Stat label="Sotaque" value={ACCENT_LABEL[session.accent]} />
            <Stat label="Rodadas" value={`até ${session.maxTurns}`} />
          </StatList>
        }
      />
      <div className="flex items-start gap-4 border-y border-line py-5">
        <p className="type-display min-w-0 flex-1 text-2xl sm:text-3xl">{session.scene}</p>
        <span className="text-brand">
          <ScenarioIcon icon={situation.icon} className="h-8 w-8" />
        </span>
      </div>
      <p className="mt-3 text-sm text-muted">Quem fala: {speakerRoleFor(session.scenarioId)}</p>
      <p className="mt-6 max-w-xl text-lg text-ink">
        {situation.layout === 'chat'
          ? 'As falas chegam como mensagens de voz. Transcreva o que ouviu e responda por texto.'
          : 'Ouça cada fala, transcreva o que entendeu, veja seus erros palavra por palavra e responda para continuar a conversa.'}
      </p>
      <StickyActionBar label="Sua sessão" summary={`${situation.title} · ${session.level}`}>
        <Button to="/app/praticar" variant="ghost" size="lg">
          Voltar
        </Button>
        <Button size="lg" onClick={onStart} className="px-8">
          Começar
        </Button>
      </StickyActionBar>
    </Page>
  )
}
