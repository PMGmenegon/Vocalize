import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { characterFor, SCENARIOS } from '../../data/scenarios'
import { sessionService } from '../../services'
import type { Session, Turn } from '../../types'
import Scene from '../scenes/Scene'
import AudioBubble from './AudioBubble'
import ChatInput, { type InputMode } from './ChatInput'
import ChatPanel from './ChatPanel'
import ChatTopBar from './ChatTopBar'
import CorrectionCard from './CorrectionCard'
import TypingIndicator from './TypingIndicator'
import UserBubble from './UserBubble'

/** typing = personagem "digitando"; listen = bolha de áudio, aguardando transcrição; reply = aguardando resposta; wait = lendo a correção; finished = última rodada feita. */
type Phase = 'typing' | 'listen' | 'reply' | 'wait' | 'finished'

const TYPING_MS = 1300
const READING_MS = 2400

/**
 * A sessão como conversa: cena ilustrada ao fundo (desktop) ou no topo (celular) e o chat por cima.
 * Cada rodada: bolha de áudio → transcrição → resultado na bolha → resposta → correção → próxima fala.
 */
export default function ChatSession({ session }: { session: Session }) {
  const navigate = useNavigate()
  const character = characterFor(session.scenarioId, session.accent)
  const scenarioTitle = SCENARIOS.find((s) => s.id === session.scenarioId)?.title ?? ''

  const firstPending = session.turns.findIndex((t) => !t.correction)
  const [turns, setTurns] = useState<Turn[]>(session.turns)
  const [index, setIndex] = useState(Math.max(0, firstPending))
  const [phase, setPhase] = useState<Phase>(firstPending === -1 ? 'finished' : 'typing')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [compact, setCompact] = useState(false)

  const total = session.totalTurns
  const done = turns.filter((t) => t.correction).length

  // Personagem "digitando" → bolha de áudio.
  useEffect(() => {
    if (phase !== 'typing') return
    const id = window.setTimeout(() => setPhase('listen'), TYPING_MS)
    return () => window.clearTimeout(id)
  }, [phase, index])

  // Depois da correção, dá um tempo para ler e o personagem fala de novo.
  useEffect(() => {
    if (phase !== 'wait') return
    const id = window.setTimeout(() => {
      setIndex((i) => i + 1)
      setPhase('typing')
    }, READING_MS)
    return () => window.clearTimeout(id)
  }, [phase])

  const patch = (i: number, change: Partial<Turn>) => setTurns((prev) => prev.map((t) => (t.index === i ? { ...t, ...change } : t)))

  async function check(text: string) {
    setBusy(true)
    setError('')
    try {
      const transcription = await sessionService.checkTranscription(session.id, index, text)
      patch(index, { transcription })
      setPhase('reply')
    } catch {
      setError('Algo deu errado ao conferir. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  async function reply(text: string) {
    setBusy(true)
    setError('')
    try {
      const correction = await sessionService.submitReply(session.id, index, text)
      patch(index, { reply: text, correction })
      setPhase(index + 1 >= total ? 'finished' : 'wait')
    } catch {
      setError('Algo deu errado ao enviar. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  async function finish() {
    setBusy(true)
    setError('')
    try {
      await sessionService.finish(session.id)
      navigate(`/app/praticar/${session.id}/resumo`, { replace: true })
    } catch {
      setError('Não foi possível encerrar a sessão. Tente de novo.')
      setBusy(false)
    }
  }

  function play(turnIndex: number) {
    patch(turnIndex, { repetitions: (turns.find((t) => t.index === turnIndex)?.repetitions ?? 0) + 1 })
    void sessionService.addRepetition(session.id, turnIndex).catch(() => undefined)
  }

  const mode: InputMode = phase === 'listen' ? 'transcribe' : phase === 'reply' ? 'reply' : phase === 'finished' ? 'finished' : 'locked'
  const visible = turns.filter((t) => t.index <= index)
  const lastWithCorrection = [...turns].reverse().find((t) => t.correction)?.index

  return (
    <div className="relative flex h-[calc(100dvh-7.25rem)] flex-col overflow-hidden lg:flex-row">
      {/* Cena: cabeçalho ilustrado no celular (encolhe ao rolar) e fundo de tela cheia no desktop */}
      <div
        aria-hidden="true"
        className={`relative shrink-0 overflow-hidden transition-[height] duration-300 lg:absolute lg:inset-0 lg:z-0 lg:!h-auto ${compact ? 'h-16' : 'h-40 sm:h-52'}`}
      >
        <Scene scenarioId={session.scenarioId} accent={session.accent} />
      </div>

      {/* Chat: painel semitransparente à direita no desktop; ocupa o resto da tela no celular */}
      <section
        aria-label={`Conversa com ${character.name}`}
        className="relative z-10 min-h-0 flex-1 bg-canvas lg:m-4 lg:ml-auto lg:w-[32rem] lg:flex-none lg:rounded-3xl lg:border lg:border-line lg:bg-canvas/95 lg:shadow-2xl lg:backdrop-blur"
      >
        <ChatPanel
          scrollKey={`${index}-${phase}-${visible.length}-${turns.filter((t) => t.reply).length}`}
          onScrolled={setCompact}
          header={<ChatTopBar character={character} scenarioTitle={scenarioTitle} done={done} total={total} current={index + 1} busy={busy} onEnd={() => void finish()} />}
          footer={
            <>
              <ChatInput
                key={`${index}-${mode}`}
                mode={mode}
                busy={busy}
                characterName={character.name}
                getHint={(kind) => sessionService.getHint(session.id, index, kind)}
                onSubmit={(text) => void (mode === 'transcribe' ? check(text) : reply(text))}
                onFinish={() => void finish()}
              />
              <p role="alert" className="px-3 pb-2 text-xs font-bold text-on-danger empty:hidden">
                {error}
              </p>
            </>
          }
        >
          {visible.map((turn) => {
            const current = turn.index === index
            const showBubble = !(current && phase === 'typing')
            return (
              <div key={turn.index} className="space-y-3">
                {showBubble ? (
                  <AudioBubble character={character} repetitions={turn.repetitions} result={turn.transcription} onPlay={() => play(turn.index)} />
                ) : (
                  <TypingIndicator character={character} />
                )}
                {turn.reply && <UserBubble text={turn.reply} />}
                {turn.correction && <CorrectionCard correction={turn.correction} defaultOpen={turn.index === lastWithCorrection} />}
              </div>
            )
          })}
        </ChatPanel>
      </section>
    </div>
  )
}
