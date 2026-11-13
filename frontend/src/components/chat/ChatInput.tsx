import { useState } from 'react'
import type { HintKind } from '../../services'
import { MicIcon, SendIcon } from '../appIcons'
import Button from '../ui/Button'

export type InputMode = 'transcribe' | 'reply' | 'locked' | 'finished'

interface ChatInputProps {
  mode: InputMode
  busy: boolean
  characterName: string
  getHint: (kind: HintKind) => Promise<string>
  onSubmit: (text: string) => void
  onFinish: () => void
}

const MODE_INFO = {
  transcribe: { pill: 'Transcrever', label: 'Escreva o que você ouviu', placeholder: 'Ex.: Good evening! Do you have…' },
  reply: { pill: 'Responder', label: 'Responda em inglês', placeholder: 'Escreva sua resposta…' },
} as const

/** Campo de mensagem na base do chat (o pai usa `key` para recriá-lo a cada rodada/modo, limpando o texto e levando o foco até ele). O modo (Transcrever / Responder) aparece num selo e no rótulo. */
export default function ChatInput({ mode, busy, characterName, getHint, onSubmit, onFinish }: ChatInputProps) {
  const [text, setText] = useState('')
  const [hint, setHint] = useState('')
  const [error, setError] = useState('')
  const [micNote, setMicNote] = useState('')

  if (mode === 'finished') {
    return (
      <div className="flex flex-col items-center gap-2 p-3 text-center">
        <p className="text-sm font-bold text-ink">✓ Conversa concluída. Ótimo trabalho!</p>
        <Button size="lg" onClick={onFinish} disabled={busy} aria-busy={busy}>
          {busy ? 'Concluindo…' : 'Concluir sessão'}
        </Button>
      </div>
    )
  }

  const info = mode === 'locked' ? null : MODE_INFO[mode]
  const locked = mode === 'locked'

  function submit() {
    if (locked || busy) return
    if (!text.trim()) {
      setError(mode === 'transcribe' ? 'Digite o que você ouviu antes de conferir.' : 'Escreva sua resposta antes de enviar.')
      return
    }
    setError('')
    onSubmit(text.trim())
  }

  async function askHint(kind: HintKind) {
    try {
      setHint(await getHint(kind))
    } catch {
      setHint('Não foi possível carregar a dica agora.')
    }
  }

  return (
    <form
      className="space-y-2 p-3"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="surface-brand rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-on-brand">{info ? `Modo: ${info.pill}` : 'Aguardando'}</span>
        {mode === 'transcribe' && (
          <>
            <button type="button" onClick={() => void askHint('count')} className="min-h-9 cursor-pointer rounded-lg px-2 text-xs font-bold text-link underline underline-offset-4 hover:bg-surface">
              Dica: nº de palavras
            </button>
            <button type="button" onClick={() => void askHint('letters')} className="min-h-9 cursor-pointer rounded-lg px-2 text-xs font-bold text-link underline underline-offset-4 hover:bg-surface">
              Dica: primeiras letras
            </button>
          </>
        )}
      </div>
      <p role="status" className="min-h-4 text-xs font-bold text-ink">
        {hint}
      </p>

      <label htmlFor="chat-input" className="sr-only">
        {info ? info.label : `${characterName} está digitando`}
      </label>
      <div className="flex items-end gap-2">
        <textarea
          id="chat-input"
          autoFocus
          rows={2}
          lang="en"
          value={text}
          disabled={locked}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={info ? info.placeholder : `${characterName} está digitando…`}
          aria-describedby={error ? 'chat-input-error' : undefined}
          aria-invalid={error ? true : undefined}
          spellCheck={false}
          autoCapitalize="none"
          className={`block max-h-32 min-h-12 w-full resize-none rounded-xl border-2 bg-card px-3 py-2 text-base text-ink placeholder:text-muted disabled:opacity-60 ${error ? 'border-on-danger' : 'border-control'}`}
        />
        {mode === 'reply' && (
          <button
            type="button"
            aria-label="Responder por voz (em breve)"
            onClick={() => setMicNote('A resposta por voz chega numa fase futura. Por enquanto, escreva.')}
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-control bg-card text-brand hover:bg-surface"
          >
            <MicIcon className="h-5 w-5" />
          </button>
        )}
        <Button type="submit" disabled={locked || busy} aria-busy={busy} className="h-12 shrink-0" aria-label={mode === 'transcribe' ? 'Conferir' : 'Enviar'}>
          <SendIcon className="h-5 w-5" />
          <span className="hidden sm:inline">{busy ? '…' : mode === 'transcribe' ? 'Conferir' : 'Enviar'}</span>
        </Button>
      </div>
      <p id="chat-input-error" role="alert" className="min-h-4 text-xs font-bold text-on-danger">
        {error}
      </p>
      <p role="status" className="text-xs text-muted">
        {micNote}
      </p>
    </form>
  )
}
