import { useEffect } from 'react'
import { characterFor } from '../../data/scenarios'
import { usePracticeSession } from '../../hooks/usePracticeSession'
import type { Session, Turn } from '../../types'
import EndSession from '../practice/EndSession'
import Button from '../ui/Button'
import ChatInput, { type InputMode } from './ChatInput'
import ChatPanel from './ChatPanel'
import VoiceMessage from './VoiceMessage'

const NEXT_VOICE_DELAY_MS = 2400

const clock = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '')

/** Avatar de contato com iniciais (sem ilustração, como num app de mensagens). */
function Initials({ name }: { name: string }) {
  return (
    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas text-base font-black text-brand">
      {name.slice(0, 2).toUpperCase()}
    </span>
  )
}

/** Mensagem do usuário: bolha à direita com horário e ✓✓, e a correção como nota expansível logo abaixo. */
function UserMessage({ turn }: { turn: Turn }) {
  const c = turn.correction
  return (
    <div className="bubble-in space-y-1.5">
      <div className="flex justify-end">
        <p lang="en" className="surface-brand max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2 text-on-brand shadow-sm">
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
            {c.changed ? (
              <>
                <span aria-hidden="true">✗ </span>Nota de correção
              </>
            ) : (
              <>
                <span aria-hidden="true">✓ </span>Sem erros
              </>
            )}
          </summary>
          <p lang="en" className="mt-1 font-bold text-on-ok">
            <span className="sr-only">Corrigida: </span>
            <span aria-hidden="true">✓ </span>
            {c.corrected}
          </p>
          <p className="mt-1">{c.explanation}</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {c.vocabulary.map((v) => (
              <li key={v.term} className="rounded-full border border-line bg-surface px-2 py-0.5">
                <span lang="en" className="font-bold">
                  {v.term}
                </span>
                <span className="text-muted"> — {v.meaning}</span>
              </li>
            ))}
          </ul>
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
  const contact = characterFor(session.scenarioId, session.accent)

  // Depois da correção o contato "grava" outra mensagem de voz (depois de um tempo para ler a nota).
  const { next } = ctrl
  useEffect(() => {
    if (phase !== 'reviewed' || isLast) return
    const id = window.setTimeout(next, NEXT_VOICE_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [phase, isLast, next])

  const mode: InputMode = phase === 'listen' ? 'transcribe' : phase === 'reply' ? 'reply' : phase === 'reviewed' && isLast ? 'finished' : 'locked'
  const status = phase === 'preparing' ? 'gravando áudio...' : phase === 'prepare-error' ? 'sem conexão' : 'online'

  return (
    <div className="flex justify-center lg:px-4 lg:py-5">
      <div className="relative flex h-[calc(100dvh-7.25rem)] w-full flex-col overflow-hidden bg-canvas lg:h-[min(46rem,calc(100dvh-9rem))] lg:max-w-sm lg:rounded-[2.5rem] lg:border-[10px] lg:border-ink lg:shadow-2xl">
        <ChatPanel
          scrollKey={`${turns.length}-${phase}-${turns.filter((t) => t.reply).length}`}
          header={
            <header className="surface-brand flex items-center gap-3 bg-brand px-3 py-2.5 text-on-brand">
              <Initials name={contact.name} />
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-black">
                  {contact.name} <span className="text-xs font-bold opacity-90">· {contact.role}</span>
                </h1>
                <p role="status" aria-live="polite" className="text-xs">
                  {status}
                </p>
              </div>
              <EndSession busy={ctrl.busy} onEnd={() => void ctrl.finish()} tone="on-brand" />
            </header>
          }
          footer={
            <>
              <ChatInput
                key={`${turns.length}-${mode}`}
                mode={mode}
                busy={ctrl.busy}
                characterName={contact.name}
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
            {turns.map((turn) => (
              <div key={turn.index} className="space-y-3">
                <VoiceMessage contactName={contact.name} turn={turn} time={clock(turn.createdAt)} onRestart={ctrl.addRepetition} />
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
