import { useEffect } from 'react'
import { speechPlayer } from '../../audio'
import { EXPERIENCE, interlocutorFor } from '../../data/scenarios'
import { ACCENT_LABEL } from '../../lib/format'
import { usePracticeSession } from '../../hooks/usePracticeSession'
import { COHERENCE_LABEL, ISSUE_LABEL, LEVEL_FIT_LABEL } from '../../lib/replyFeedback'
import type { Session, Turn } from '../../types'
import EndSession from '../practice/EndSession'
import Button from '../ui/Button'
import { Stat, StatList } from '../ui/Stat'
import ChatInput, { type InputMode } from './ChatInput'
import ChatPanel from './ChatPanel'
import VoiceMessage from './VoiceMessage'

const NEXT_VOICE_DELAY_MS = 2400

const clock = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '')

/** Ícone neutro de contato (sem iniciais nem ilustração). */
function ContactIcon() {
  return (
    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
      </svg>
    </span>
  )
}

/** Mensagem do usuário: bolha à direita com horário e ✓✓, e a avaliação como nota expansível logo abaixo. */
function UserMessage({ turn }: { turn: Turn }) {
  const c = turn.feedback
  return (
    <div className="bubble-in space-y-1.5">
      <div className="flex justify-end">
        <p lang="en" className="surface-brand max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2 text-on-brand">
          <span className="sr-only">Você: </span>
          {turn.reply}
          <span className="mt-0.5 flex justify-end gap-1 text-[11px] opacity-90" aria-hidden="true">
            {clock(turn.repliedAt)} ✓✓
          </span>
        </p>
      </div>
      {c && (
        <details className="ml-auto max-w-[85%] rounded-lg border border-line bg-card px-3 py-1.5 text-xs text-ink">
          <summary className="min-h-8 cursor-pointer select-none py-1 font-bold text-link">
            <span aria-hidden="true">{c.coherence === 'coherent' ? '✓ ' : '• '}</span>
            {COHERENCE_LABEL[c.coherence]}
          </summary>
          <p className="mt-1">{LEVEL_FIT_LABEL[c.levelFit]}</p>
          {c.comment && <p className="mt-1">{c.comment}</p>}
          {c.correctedReply && (
            <p lang="en" className="mt-1 font-bold text-on-ok">
              <span className="font-sans text-muted">Sua frase corrigida: </span>
              <span aria-hidden="true">✓ </span>
              {c.correctedReply}
            </p>
          )}
          {c.issues.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              <li className="font-bold">Pontos de melhoria</li>
              {c.issues.map((issue, n) => (
                <li key={n}>
                  <span className="font-bold">{ISSUE_LABEL[issue.category]}:</span> <span className="text-muted">{issue.explanation}</span>
                </li>
              ))}
            </ul>
          )}
          {c.suggestedReplies.length > 0 && (
            <div className="mt-1.5">
              <p className="font-bold">Respostas sugeridas</p>
              <p className="text-muted">Outras formas naturais de responder</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {c.suggestedReplies.map((r) => (
                  <li key={r} lang="en" className="rounded-full border border-line bg-surface px-2 py-0.5 font-bold">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </details>
      )}
    </div>
  )
}

/**
 * Layout de chat: conversa por mensagens de voz num "celular" (moldura no desktop, tela inteira
 * no celular). Visual genérico de app de mensagens, com as cores do tema; não imita nenhum app real.
 */
export default function ChatLayout({ session }: { session: Session }) {
  const ctrl = usePracticeSession(session)
  const { phase, turns, isLast } = ctrl
  const role = interlocutorFor(session.scenarioId, session.interlocutorId).role

  // Depois da avaliação o contato "grava" outra mensagem de voz (depois de um tempo para ler a nota).
  const { next } = ctrl
  useEffect(() => {
    if (phase !== 'reviewed' || isLast) return
    const id = window.setTimeout(next, NEXT_VOICE_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [phase, isLast, next])

  // Chegou uma mensagem nova (rodada nova): corta qualquer áudio que ainda esteja tocando.
  const turnCount = turns.length
  useEffect(() => {
    speechPlayer.cancel()
  }, [turnCount])

  const mode: InputMode = phase === 'listen' ? 'transcribe' : phase === 'reply' ? 'reply' : phase === 'reviewed' && isLast ? 'finished' : 'locked'
  const status = phase === 'preparing' ? 'gravando áudio...' : phase === 'prepare-error' ? 'sem conexão' : 'online'

  return (
    <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center lg:gap-x-16 lg:px-6 lg:py-8">
      <div className="hidden lg:block">
        <p className="type-eyebrow text-brand">{EXPERIENCE.chat.label} · {ACCENT_LABEL[session.accent]}</p>
        <p className="type-display mt-2 text-5xl">Bate-papo virtual</p>
        <p className="mt-3 max-w-md text-lg text-muted">{session.scene}</p>
        <StatList>
          <Stat label="Nível" value={session.level} />
          <Stat label="Rodadas" value={`até ${session.maxTurns}`} />
        </StatList>
        <p className="mt-8 max-w-md border-t border-line pt-4 text-sm text-muted">
          Ouça a mensagem de voz, transcreva o que entendeu e responda por texto. A avaliação aparece como nota logo abaixo da sua resposta.
        </p>
      </div>
      <div className="relative flex h-[calc(100dvh-4.5rem)] w-full flex-col overflow-hidden bg-canvas lg:h-[min(46rem,calc(100dvh-9rem))] lg:rounded-3xl lg:border lg:border-ink">
        <ChatPanel
          scrollKey={`${turns.length}-${phase}-${turns.filter((t) => t.reply).length}`}
          header={
            <header className="flex items-center gap-3 border-b border-ink bg-canvas px-3 py-2.5">
              <ContactIcon />
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-black text-ink">
                  {role}
                </h1>
                <p role="status" aria-live="polite" className="text-xs text-muted">
                  {status}
                </p>
              </div>
              <EndSession busy={ctrl.busy} onEnd={() => void ctrl.finish()} />
            </header>
          }
          footer={
            <>
              <ChatInput
                key={`${turns.length}-${mode}`}
                mode={mode}
                busy={ctrl.busy}
                contactName={role}
                locale={session.accent}
                getHint={ctrl.getHint}
                onSubmit={(text) => void (mode === 'transcribe' ? ctrl.check(text) : ctrl.reply(text))}
                onFinish={() => void ctrl.finish()}
              />
              <p role="alert" className="px-3 pb-2 text-xs font-bold text-on-danger empty:hidden">
                {ctrl.error}
              </p>
            </>
          }
        >
          <div className="chat-pattern min-h-full space-y-3 px-3 py-4">
            <p className="mx-auto w-fit rounded-full bg-card px-3 py-1 text-xs font-bold text-muted shadow-sm">Hoje</p>
            <p className="mx-auto max-w-[90%] rounded-xl bg-card px-3 py-2 text-center text-xs text-muted shadow-sm">{session.scene}</p>
            {turns.map((turn) => (
              <div key={turn.index} className="space-y-3">
                <VoiceMessage sessionId={session.id} locale={session.accent} contactName={role} turn={turn} time={clock(turn.createdAt)} onRestart={ctrl.addRepetition} />
                {turn.reply && <UserMessage turn={turn} />}
              </div>
            ))}
            {phase === 'prepare-error' && (
              <div role="alert" className="rounded-xl border-2 border-on-danger bg-danger p-3 text-sm text-on-danger">
                <p className="font-bold">
                  <span aria-hidden="true">✗ </span>Não foi possível receber a mensagem de voz.
                </p>
                <div className="mt-2">
                  <Button variant="secondary" onClick={ctrl.retry}>
                    Tentar de novo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ChatPanel>
      </div>
    </div>
  )
}
