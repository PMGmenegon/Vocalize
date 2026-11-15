import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { cancelSpeech, failureMessage, speak, speechSupported } from '../../lib/speech'
import { diffWords, type DiffResult } from '../../lib/diff'
import Button from '../ui/Button'
import HomeSection from './HomeSection'
import { ACCENTS, type Accent } from '../../theme/accents'
import { useTheme } from '../../theme/useTheme'

const SENTENCES: Record<Accent, readonly string[]> = {
  us: [
    'Could we get the check, please?',
    "I'll take the elevator to my apartment.",
    'What time does the subway leave?',
  ],
  uk: [
    'Could we have the bill, please?',
    "I'll take the lift up to my flat.",
    'What time does the underground leave?',
  ],
}

/** Mini rodada jogável: ouça, digite e veja a correção palavra por palavra. */
export default function TryRound() {
  const { accent } = useTheme()
  // key: ao trocar de modo a rodada recomeça do zero.
  return <Round key={accent} accent={accent} />
}

function Round({ accent }: { accent: Accent }) {
  const locale = ACCENTS[accent].locale
  const sentences = SENTENCES[accent]
  const inputId = useId()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState<DiffResult | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceNote, setVoiceNote] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const sentence = sentences[index % sentences.length] ?? sentences[0]!

  // Para a fala ao sair da página ou trocar de frase/modo.
  useEffect(() => {
    return () => {
      cancelSpeech()
    }
  }, [sentence])

  function play(rate: number) {
    setVoiceNote('')
    void speak(sentence, locale, {
      rate,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    }).then((result) => setVoiceNote(failureMessage(result)))
    inputRef.current?.focus()
  }

  function check(e: FormEvent) {
    e.preventDefault()
    if (!typed.trim()) return
    setResult(diffWords(sentence, typed))
  }

  function next() {
    setIndex((i) => (i + 1) % sentences.length)
    setTyped('')
    setResult(null)
    setRevealed(false)
  }

  const perfect = result !== null && result.correct === result.total && result.typed.every((w) => w.ok)

  return (
    <HomeSection id="experimente" eyebrow="Experimente" title="Uma rodada, agora" description="Ouça a frase no sotaque do seu modo, escreva o que entendeu e veja a correção na hora.">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => play(0.95)} disabled={!speechSupported}>
            {speaking ? 'Ouvindo…' : 'Ouvir frase'}
          </Button>
          <Button size="lg" variant="secondary" onClick={() => play(0.6)} disabled={!speechSupported}>
            Ouvir devagar
          </Button>
          <span className="type-eyebrow">
            {ACCENTS[accent].label} ({ACCENTS[accent].locale})
          </span>
        </div>
        {voiceNote && (
          <p role="status" className="mt-3 text-sm font-bold text-ink">
            {voiceNote}
          </p>
        )}
        {!speechSupported && (
          <p className="mt-3 text-sm text-muted">
            Seu navegador não tem voz sintetizada. Use o Chrome para ouvir, ou clique em "Mostrar o texto".
          </p>
        )}

        <form onSubmit={check} className="mt-6">
          <label htmlFor={inputId} className="type-eyebrow block">
            O que você ouviu?
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              ref={inputRef}
              id={inputId}
              lang="en"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Digite em inglês…"
              className="min-h-14 flex-1 rounded-xl border-2 border-control bg-card px-4 text-lg text-ink placeholder:text-muted"
            />
            <Button type="submit" size="lg">
              Conferir
            </Button>
          </div>
        </form>

        <div aria-live="polite" className="mt-6 min-h-4">
          {result && (
            <div className="fade-swap border-l-2 border-brand pl-5">
              <p className="font-black text-ink">
                {perfect
                  ? 'Perfeito! Você acertou todas as palavras.'
                  : `Você acertou ${result.correct} de ${result.total} palavras.`}
              </p>

              <p className="type-eyebrow mt-4">Frase correta</p>
              <p lang="en" className="mt-1 flex flex-wrap gap-1.5 text-lg">
                {result.expected.map((w, i) => (
                  <Word key={i} {...w} wrongLabel="faltou ou errou" rightLabel="certo" />
                ))}
              </p>

              {!perfect && (
                <>
                  <p className="type-eyebrow mt-4">O que você escreveu</p>
                  <p lang="en" className="mt-1 flex flex-wrap gap-1.5 text-lg">
                    {result.typed.map((w, i) => (
                      <Word key={i} {...w} wrongLabel="não bate" rightLabel="certo" strike />
                    ))}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="ghost" onClick={next}>
            Outra frase
          </Button>
          <button
            type="button"
            aria-pressed={revealed}
            onClick={() => setRevealed((v) => !v)}
            className="min-h-10 cursor-pointer rounded-lg px-3 text-sm font-bold text-link underline underline-offset-4"
          >
            {revealed ? 'Esconder o texto' : 'Mostrar o texto'}
          </button>
          {revealed && (
            <span lang="en" className="fade-swap text-ink">
              {sentence}
            </span>
          )}
        </div>
      </div>
    </HomeSection>
  )
}

function Word({
  word,
  ok,
  wrongLabel,
  rightLabel,
  strike = false,
}: {
  word: string
  ok: boolean
  wrongLabel: string
  rightLabel: string
  strike?: boolean
}) {
  return (
    <span
      className={[
        'rounded px-1.5 font-bold',
        ok ? 'bg-ok text-on-ok' : `bg-danger text-on-danger ${strike ? 'line-through' : 'underline decoration-wavy'}`,
      ].join(' ')}
    >
      {word}
      <span className="sr-only"> ({ok ? rightLabel : wrongLabel})</span>
    </span>
  )
}
