import { useState } from 'react'
import { MicIcon, SendIcon } from '../appIcons'
import Button from '../ui/Button'
import { Textarea } from '../ui/Input'

interface ReplyStepProps {
  aiText: string
  busy: boolean
  onSend: (text: string) => void
}

/** Etapa "Responder": a fala da IA já está revelada; o usuário responde por texto (voz é só visual). */
export default function ReplyStep({ aiText, busy, onSend }: ReplyStepProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [micNote, setMicNote] = useState('')

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!text.trim()) {
          setError('Escreva sua resposta antes de enviar.')
          return
        }
        setError('')
        onSend(text.trim())
      }}
    >
      <blockquote className="rounded-xl border-l-4 border-brand bg-surface p-4">
        <p className="text-sm font-bold text-muted">A IA disse:</p>
        <p lang="en" className="mt-1 text-lg font-bold text-ink">
          {aiText}
        </p>
      </blockquote>
      <Textarea
        label="Sua resposta em inglês"
        lang="en"
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={error}
        spellCheck={false}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => setMicNote('A resposta por voz chega numa fase futura. Por enquanto, escreva.')}>
          <MicIcon className="h-5 w-5" /> Responder por voz
        </Button>
        <Button type="submit" disabled={busy} aria-busy={busy}>
          <SendIcon className="h-5 w-5" /> {busy ? 'Enviando…' : 'Enviar'}
        </Button>
      </div>
      <p role="status" className="min-h-5 text-sm text-muted">
        {micNote}
      </p>
    </form>
  )
}
