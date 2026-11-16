import { useState } from 'react'
import type { HintKind } from '../../services'
import { COHERENCE_LABEL, ISSUE_LABEL, LEVEL_FIT_LABEL } from '../../lib/replyFeedback'
import type { Accent, ReplyFeedback } from '../../types'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { SendIcon } from '../appIcons'
import Button from '../ui/Button'
import { Textarea } from '../ui/Input'
import { MicButton, MicStatus } from './MicControls'

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

/** Etapa "Responder": digitando ou pelo microfone (o texto falado vai para o campo, para revisar antes de enviar). */
export function ReplyForm({ locale, busy, onSend }: { locale: Accent; busy: boolean; onSend: (text: string) => void }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const mic = useSpeechRecognition({
    lang: locale,
    onText: (spoken) => {
      setError('')
      setText((prev) => (prev.trim() ? `${prev.trim()} ${spoken}` : spoken))
    },
  })

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
        <MicButton input={mic} variant="labeled" />
      </div>
      <MicStatus input={mic} />
    </form>
  )
}

/** Avaliação da resposta: o que o usuário escreveu, o que fez sentido, a frase corrigida (se houve), pontos de melhoria e sugestões. */
export function ReplyFeedbackView({ reply, feedback }: { reply: string; feedback: ReplyFeedback }) {
  return (
    <section aria-label="Avaliação da resposta" className="mt-8 space-y-5 border-t border-line pt-6">
      <h2 className="type-display text-2xl">Sua resposta</h2>
      <div className="border-l-2 border-line pl-4">
        <p lang="en" className="text-lg font-bold text-ink">
          {reply}
        </p>
        <ul className="mt-2 space-y-0.5 text-ink">
          <li>
            <span aria-hidden="true" className={feedback.coherence === 'coherent' ? 'text-on-ok' : 'text-muted'}>
              {feedback.coherence === 'coherent' ? '✓ ' : '• '}
            </span>
            {COHERENCE_LABEL[feedback.coherence]}
          </li>
          <li>
            <span aria-hidden="true" className={feedback.levelFit === 'at' ? 'text-on-ok' : 'text-muted'}>
              {feedback.levelFit === 'at' ? '✓ ' : '• '}
            </span>
            {LEVEL_FIT_LABEL[feedback.levelFit]}
          </li>
        </ul>
      </div>
      {feedback.comment && <p className="text-ink">{feedback.comment}</p>}
      {feedback.correctedReply && (
        <div className="border-l-2 border-on-ok pl-4">
          <h3 className="type-eyebrow text-on-ok">Sua frase corrigida</h3>
          <p lang="en" className="mt-1 text-lg font-bold text-ink">
            {feedback.correctedReply}
          </p>
        </div>
      )}
      {feedback.issues.length > 0 && (
        <div>
          <h3 className="type-eyebrow">Pontos de melhoria</h3>
          <ul className="mt-2 divide-y divide-line border-b border-line">
            {feedback.issues.map((issue, n) => (
              <li key={n} className="flex flex-wrap justify-between gap-x-3 py-2">
                <span className="font-bold text-ink">{ISSUE_LABEL[issue.category]}</span>
                <span className="text-muted">{issue.explanation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {feedback.suggestedReplies.length > 0 && (
        <div>
          <h3 className="type-eyebrow">Respostas sugeridas</h3>
          <p className="mt-1 text-sm text-muted">Outras formas naturais de responder</p>
          <ul className="mt-2 space-y-1">
            {feedback.suggestedReplies.map((r) => (
              <li key={r} lang="en" className="text-lg font-bold text-ink">
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
