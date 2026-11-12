import { useState } from 'react'
import { sessionService, type HintKind } from '../../services'
import Button from '../ui/Button'
import { Textarea } from '../ui/Input'

interface TranscribeStepProps {
  sessionId: string
  turnIndex: number
  busy: boolean
  onCheck: (text: string) => void
}

/** Etapa "Transcrever": campo de texto, dicas e o botão Conferir. */
export default function TranscribeStep({ sessionId, turnIndex, busy, onCheck }: TranscribeStepProps) {
  const [text, setText] = useState('')
  const [hint, setHint] = useState('')
  const [error, setError] = useState('')

  async function showHint(kind: HintKind) {
    try {
      setHint(await sessionService.getHint(sessionId, turnIndex, kind))
    } catch {
      setHint('Não foi possível carregar a dica agora.')
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!text.trim()) {
          setError('Digite o que você ouviu antes de conferir.')
          return
        }
        setError('')
        onCheck(text)
      }}
    >
      <Textarea
        label="O que você ouviu?"
        hint="Escreva em inglês, mesmo que não tenha entendido tudo."
        lang="en"
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={error}
        autoCapitalize="none"
        spellCheck={false}
      />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => void showHint('count')}>
          Dica: número de palavras
        </Button>
        <Button variant="secondary" onClick={() => void showHint('letters')}>
          Dica: primeiras letras
        </Button>
      </div>
      <p role="status" className="min-h-6 font-bold text-ink">
        {hint}
      </p>
      <Button type="submit" size="lg" disabled={busy} aria-busy={busy}>
        {busy ? 'Conferindo…' : 'Conferir'}
      </Button>
    </form>
  )
}
