import { useState } from 'react'
import type { HintKind } from '../../services'
import type { Correction } from '../../types'
import { MicIcon, SendIcon } from '../appIcons'
import Button from '../ui/Button'
import { Textarea } from '../ui/Input'

/** Enter envia; Shift+Enter quebra linha. */
const onEnter = (submit: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
    e.preventDefault()
    submit()
  }
}

/** Área de transcrição: campo grande, dicas e "Conferir". */
export function TranscribeForm({ busy, getHint, onCheck }: { busy: boolean; getHint: (kind: HintKind) => Promise<string>; onCheck: (text: string) => void }) {
  const [text, setText] = useState('')
  const [hint, setHint] = useState('')
  const [error, setError] = useState('')

  function submit() {
    if (busy) return
    if (!text.trim()) return setError('Digite o que você ouviu antes de conferir.')
    setError('')
    onCheck(text.trim())
  }
  async function ask(kind: HintKind) {
    try {
      setHint(await getHint(kind))
    } catch {
      setHint('Não foi possível carregar a dica agora.')
    }
  }

  return (
    <form
      className="mt-6 space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <Textarea
        label="Transcreva o que você ouviu"
        hint="Escreva em inglês, mesmo que não tenha entendido tudo."
        lang="en"
        autoFocus
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onEnter(submit)}
        error={error}
        spellCheck={false}
        autoCapitalize="none"
        large
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={busy} aria-busy={busy}>
          {busy ? 'Conferindo…' : 'Conferir'}
        </Button>
        <Button variant="ghost" onClick={() => void ask('count')}>
          Dica: nº de palavras
        </Button>
        <Button variant="ghost" onClick={() => void ask('letters')}>
          Dica: primeiras letras
        </Button>
      </div>
      <p role="status" className="min-h-6 font-bold text-ink">
        {hint}
      </p>
    </form>
  )
}

/** Etapa "Responder": texto ou microfone (visual). */
export function ReplyForm({ busy, onSend }: { busy: boolean; onSend: (text: string) => void }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [micNote, setMicNote] = useState('')

  function submit() {
    if (busy) return
    if (!text.trim()) return setError('Escreva sua resposta antes de enviar.')
    setError('')
    onSend(text.trim())
  }

  return (
    <form
      className="mt-8 space-y-3 border-t border-line pt-6"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <h2 className="type-display text-2xl">Agora responda</h2>
      <Textarea
        label="Sua resposta em inglês"
        lang="en"
        autoFocus
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onEnter(submit)}
        error={error}
        spellCheck={false}
        large
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={busy} aria-busy={busy}>
          <SendIcon className="h-5 w-5" /> {busy ? 'Enviando…' : 'Enviar'}
        </Button>
        <Button variant="secondary" onClick={() => setMicNote('A resposta por voz chega numa fase futura. Por enquanto, escreva.')}>
          <MicIcon className="h-5 w-5" /> Responder por voz
        </Button>
      </div>
      <p role="status" className="min-h-5 text-sm text-muted">
        {micNote}
      </p>
    </form>
  )
}

/** Correção: original × corrigida, explicação em português e vocabulário-chave. */
export function CorrectionView({ correction }: { correction: Correction }) {
  return (
    <section aria-label="Correção" className="mt-8 space-y-5 border-t border-line pt-6">
      <h2 className="type-display text-2xl">Correção</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border-l-2 border-line pl-4">
          <p className="type-eyebrow">Sua resposta</p>
          <p lang="en" className={`mt-1 text-lg ${correction.changed ? 'text-ink line-through decoration-on-danger decoration-2' : 'font-bold text-ink'}`}>
            {correction.original}
          </p>
        </div>
        <div className="border-l-2 border-on-ok pl-4">
          <p className="type-eyebrow text-on-ok">
            <span aria-hidden="true">✓ </span>Versão corrigida
          </p>
          <p lang="en" className="mt-1 text-lg font-bold text-ink">
            {correction.corrected}
          </p>
        </div>
      </div>
      <div>
        <h3 className="type-eyebrow">Por quê?</h3>
        <p className="mt-1 text-ink">{correction.explanation}</p>
      </div>
      <div>
        <h3 className="type-eyebrow">Vocabulário-chave</h3>
        <ul className="mt-2 divide-y divide-line border-b border-line">
          {correction.vocabulary.map((v) => (
            <li key={v.term} className="flex justify-between gap-3 py-2">
              <span lang="en" className="font-bold text-ink">
                {v.term}
              </span>
              <span className="text-muted">{v.meaning}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
