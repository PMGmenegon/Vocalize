import { useEffect } from 'react'
import { characterFor, situationFor } from '../../data/scenarios'
import { useElapsed } from '../../hooks/useElapsed'
import { useSpeechPlayer } from '../../hooks/useSpeechPlayer'
import { useSpokenText } from '../../hooks/useSpokenText'
import { usePracticeSession, type PracticeController } from '../../hooks/usePracticeSession'
import { ACCENT_LABEL, formatClock } from '../../lib/format'
import type { Session, Turn } from '../../types'
import Avatar from '../chat/Avatar'
import { Page } from '../ui/PageHeader'
import Button from '../ui/Button'
import ErrorState from '../ui/ErrorState'
import ProgressBar from '../ui/ProgressBar'
import { SkeletonBlock } from '../ui/Skeleton'
import AudioPlayer from './AudioPlayer'
import EndSession from './EndSession'
import SessionScript from './SessionScript'
import { ReplyFeedbackView, ReplyForm, TranscribeForm } from './TrainingForms'
import TranscriptionResult from './TranscriptionResult'

function TopBar({ ctrl }: { ctrl: PracticeController }) {
  const { session } = ctrl
  const character = characterFor(session.scenarioId, session.accent)
  const elapsed = useElapsed(session.startedAt)
  const situation = situationFor(session.scenarioId)
  return (
    <header className="mb-8 sm:mb-10">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar spec={character.avatar} className="h-14 w-14" />
          <div className="min-w-0">
            <p className="type-eyebrow text-brand">Treino · {ACCENT_LABEL[session.accent]}</p>
            <h1 className="type-display mt-1 text-3xl sm:text-4xl">{situation.title}</h1>
            <p className="text-muted">
              Com {character.name}, {character.role.toLowerCase()} · nível {session.level}
            </p>
          </div>
        </div>
        <div className="flex items-end gap-6">
          <dl>
            <dt className="type-eyebrow">Tempo</dt>
            <dd className="mt-0.5 text-xl font-black tabular-nums text-ink">{formatClock(elapsed)}</dd>
          </dl>
          <EndSession busy={ctrl.busy} onEnd={() => void ctrl.finish()} />
        </div>
      </div>
      <div className="mt-5 border-t border-ink pt-3">
        <p className="type-eyebrow">
          Rodada {Math.max(1, ctrl.turns.length)} de {session.maxTurns}
        </p>
        <ProgressBar className="mt-2" label="Progresso da sessão" value={ctrl.done} max={session.maxTurns} valueText={`${ctrl.done} de ${session.maxTurns} rodadas concluídas`} />
      </div>
    </header>
  )
}

/** Uma rodada. Recriada a cada fala nova (key), então o player e os campos recomeçam do zero. */
function TrainingTurn({ ctrl, turn }: { ctrl: PracticeController; turn: Turn }) {
  const { phase, isLast } = ctrl
  const text = useSpokenText(ctrl.session.id, turn.index)
  const playback = useSpeechPlayer({ text, locale: ctrl.session.accent, onRestart: ctrl.addRepetition })
  const { toggle, repeat, toggleSpeed } = playback
  const onNext = () => (isLast ? void ctrl.finish() : ctrl.next())

  // Atalhos: Ctrl+Espaço toca/pausa, Ctrl+R repete, Ctrl+S alterna velocidade; Enter avança depois da avaliação.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && !e.altKey && !e.metaKey) {
        const handlers: Record<string, () => void> = { Space: toggle, KeyR: repeat, KeyS: toggleSpeed }
        const run = handlers[e.code]
        if (run) {
          e.preventDefault()
          run()
        }
        return
      }
      const target = e.target as HTMLElement
      const typing = ['TEXTAREA', 'INPUT', 'BUTTON', 'A', 'SUMMARY'].includes(target.tagName)
      if (e.key === 'Enter' && !typing && phase === 'reviewed' && !ctrl.busy) {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div>
      <AudioPlayer playback={playback} seed={turn.index + turn.wordCount} repetitions={turn.repetitions} />
      {phase === 'listen' && <TranscribeForm busy={ctrl.busy} getHint={ctrl.getHint} onCheck={(t) => void ctrl.check(t)} />}

      {turn.transcription && (
        <section aria-label="Resultado do ditado" className="mt-8">
          <TranscriptionResult result={turn.transcription} large />
        </section>
      )}
      {phase === 'reply' && <ReplyForm locale={ctrl.session.accent} busy={ctrl.busy} onSend={(t) => void ctrl.reply(t)} />}

      {turn.feedback && turn.reply && (
        <>
          <ReplyFeedbackView reply={turn.reply} feedback={turn.feedback} />
          <div className="mt-6">
            <Button size="lg" onClick={onNext} disabled={ctrl.busy} aria-busy={ctrl.busy}>
              {isLast ? 'Concluir sessão' : 'Próxima fala'}
            </Button>
          </div>
        </>
      )}
      <p role="alert" className="mt-4 text-sm font-bold text-on-danger empty:hidden">
        {ctrl.error}
      </p>
    </div>
  )
}

/** Layout de treino: tela focada, sem chat, focada na escuta. */
export default function TrainingLayout({ session }: { session: Session }) {
  const ctrl = usePracticeSession(session)
  const { phase, current } = ctrl

  return (
    <Page>
      <TopBar ctrl={ctrl} />
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <main aria-label="Prática de escuta" className="min-w-0">
          {phase === 'preparing' ? (
            <div className="space-y-3" aria-live="polite">
              <p className="type-eyebrow">Preparando a próxima fala…</p>
              <SkeletonBlock lines={3} label="Preparando a próxima fala…" />
            </div>
          ) : phase === 'prepare-error' ? (
            <ErrorState message="Não foi possível preparar a próxima fala." onRetry={ctrl.retry} />
          ) : current ? (
            <TrainingTurn key={current.index} ctrl={ctrl} turn={current} />
          ) : null}
          <p className="mt-8 text-xs text-muted">
            Atalhos: <kbd className="rounded border border-line px-1">Ctrl</kbd>+<kbd className="rounded border border-line px-1">Espaço</kbd> tocar/pausar ·{' '}
            <kbd className="rounded border border-line px-1">Ctrl</kbd>+<kbd className="rounded border border-line px-1">R</kbd> repetir ·{' '}
            <kbd className="rounded border border-line px-1">Ctrl</kbd>+<kbd className="rounded border border-line px-1">S</kbd> velocidade ·{' '}
            <kbd className="rounded border border-line px-1">Enter</kbd> conferir/enviar
          </p>
        </main>
        <SessionScript turns={ctrl.turns} />
      </div>
    </Page>
  )
}
