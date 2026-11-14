import { useState, type ComponentType } from 'react'
import { layoutFor } from '../../data/scenarios'
import type { PracticeLayout, Session } from '../../types'
import ChatLayout from '../chat/ChatLayout'
import SessionIntro from './SessionIntro'
import TrainingLayout from './TrainingLayout'

/**
 * Cada layout recebe só a sessão e usa o mesmo hook (usePracticeSession).
 * Para acrescentar um layout novo: crie o componente e registre-o aqui.
 */
const LAYOUTS: Record<PracticeLayout, ComponentType<{ session: Session }>> = {
  training: TrainingLayout,
  chat: ChatLayout,
}

/** Mostra a introdução da situação (sessão nova) e depois o layout definido nos dados da situação. */
export default function PracticeSession({ session }: { session: Session }) {
  const [started, setStarted] = useState(session.turns.length > 0)
  if (!started) return <SessionIntro session={session} onStart={() => setStarted(true)} />
  const Layout = LAYOUTS[layoutFor(session.scenarioId)]
  return <Layout session={session} />
}
