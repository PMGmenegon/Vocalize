import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sessionService } from '../../services'
import type { Correction, Session, TranscriptionResult } from '../../types'
import Card from '../ui/Card'
import CorrectionStep from './CorrectionStep'
import DictationResult from './DictationResult'
import ListenStep from './ListenStep'
import ReplyStep from './ReplyStep'
import SessionProgress from './SessionProgress'
import TranscribeStep from './TranscribeStep'

type Phase = 'listen' | 'transcribe' | 'result' | 'reply' | 'correction'

const TITLES: Record<Phase, string> = {
  listen: '1. Ouvir',
  transcribe: '2. Transcrever',
  result: 'Resultado do ditado',
  reply: '3. Responder',
  correction: 'Correção',
}

/** Máquina de estados de uma sessão: cada rodada passa por ouvir → transcrever → resultado → responder → correção. */
export default function SessionRunner({ session }: { session: Session }) {
  const navigate = useNavigate()
  const firstPending = session.turns.findIndex((t) => !t.correction)
  const [turnIndex, setTurnIndex] = useState(Math.max(0, firstPending))
  const [phase, setPhase] = useState<Phase>('listen')
  const [repetitions, setRepetitions] = useState(session.turns[Math.max(0, firstPending)]?.repetitions ?? 0)
  const [result, setResult] = useState<TranscriptionResult | null>(null)
  const [correction, setCorrection] = useState<Correction | null>(null)
  const [completed, setCompleted] = useState(Math.max(0, firstPending === -1 ? session.totalTurns : firstPending))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  // Cada etapa nova leva o foco ao seu título (teclado e leitor de tela acompanham).
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    heading.current?.focus()
  }, [phase, turnIndex])

  async function run<T>(action: () => Promise<T>, onOk: (value: T) => void) {
    setBusy(true)
    setError('')
    try {
      onOk(await action())
    } catch {
      setError('Algo deu errado. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  async function finish() {
    setBusy(true)
    try {
      await sessionService.finish(session.id)
      navigate(`/app/praticar/${session.id}/resumo`, { replace: true })
    } catch {
      setError('Não foi possível encerrar a sessão. Tente de novo.')
      setBusy(false)
    }
  }

  function next() {
    if (turnIndex + 1 >= session.totalTurns) {
      void finish()
      return
    }
    setTurnIndex(turnIndex + 1)
    setRepetitions(0)
    setResult(null)
    setCorrection(null)
    setPhase('listen')
  }

  function play() {
    setRepetitions((n) => n + 1)
    void sessionService.addRepetition(session.id, turnIndex).catch(() => undefined)
  }

  return (
    <>
      <SessionProgress done={completed} total={session.totalTurns} current={turnIndex + 1} busy={busy} onEnd={() => void finish()} />
      <Card>
        <h2 ref={heading} tabIndex={-1} className="mb-5 text-2xl font-black text-brand focus:outline-none">
          {TITLES[phase]}
        </h2>

        {phase === 'listen' && <ListenStep repetitions={repetitions} onPlay={play} onContinue={() => setPhase('transcribe')} />}

        {phase === 'transcribe' && (
          <div className="space-y-6">
            <ListenStep compact repetitions={repetitions} onPlay={play} onContinue={() => undefined} />
            <TranscribeStep
              sessionId={session.id}
              turnIndex={turnIndex}
              busy={busy}
              onCheck={(text) =>
                void run(
                  () => sessionService.checkTranscription(session.id, turnIndex, text),
                  (r) => {
                    setResult(r)
                    setPhase('result')
                  },
                )
              }
            />
          </div>
        )}

        {phase === 'result' && result && <DictationResult result={result} onContinue={() => setPhase('reply')} />}

        {phase === 'reply' && result && (
          <ReplyStep
            aiText={result.expectedText}
            busy={busy}
            onSend={(text) =>
              void run(
                () => sessionService.submitReply(session.id, turnIndex, text),
                (c) => {
                  setCorrection(c)
                  setCompleted((n) => Math.max(n, turnIndex + 1))
                  setPhase('correction')
                },
              )
            }
          />
        )}

        {phase === 'correction' && correction && (
          <CorrectionStep correction={correction} isLast={turnIndex + 1 >= session.totalTurns} onNext={next} />
        )}

        <p role="alert" className="mt-4 text-sm font-bold text-on-danger">
          {error}
        </p>
      </Card>
    </>
  )
}
