import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { cancelSpeech, speak, speechSupported } from '../../lib/speech'
import { diffWords, type DiffResult } from '../../lib/diff'
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
    }).then((result) => {
      if (result && !result.matched) {
        setVoiceNote(`Este aparelho não tem uma voz ${accent === 'uk' ? 'britânica' : 'americana'} instalada; usando a voz padrão do inglês.`)
      }
    })
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
    <section id="experimente" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-black text-ink sm:text-4xl">Experimente agora</h2>
      <p className="mt-3 max-w-2xl text-muted">
        Ouça a frase no sotaque do seu modo, escreva o que entendeu e veja a correção na hora.
      </p>

      <div className="mt-8 rounded-2xl bg-surface p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => play(0.95)}
            disabled={!speechSupported}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-brand px-5 font-bold text-on-brand transition-all hover:bg-brand-strong active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {speaking ? 'Ouvindo…' : 'Ouvir frase'}
          </button>
          <button
            type="button"
            onClick={() => play(0.6)}
            disabled={!speechSupported}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border-2 border-control bg-canvas px-5 font-bold text-brand transition-all hover:bg-canvas/60 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ouvir devagar
          </button>
          <span className="text-sm text-muted">
            Sotaque: {ACCENTS[accent].label} ({ACCENTS[accent].locale})
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
          <label htmlFor={inputId} className="block text-sm font-bold text-ink">
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
              className="min-h-11 flex-1 rounded-xl border-2 border-control bg-canvas px-4 text-ink placeholder:text-muted"
            />
            <button
              type="submit"
              className="min-h-11 cursor-pointer rounded-xl bg-accent px-6 font-bold text-on-accent transition-all hover:opacity-90 active:scale-95"
            >
              Conferir
            </button>
          </div>
        </form>

        <div aria-live="polite" className="mt-6 min-h-4">
          {result && (
            <div className="fade-swap rounded-xl bg-canvas p-4 sm:p-5">
              <p className="font-black text-ink">
                {perfect
                  ? 'Perfeito! Você acertou todas as palavras.'
                  : `Você acertou ${result.correct} de ${result.total} palavras.`}
              </p>

              <p className="mt-4 text-sm font-bold text-muted">Frase correta</p>
              <p lang="en" className="mt-1 flex flex-wrap gap-1.5 text-lg">
                {result.expected.map((w, i) => (
                  <Word key={i} {...w} wrongLabel="faltou ou errou" rightLabel="certo" />
                ))}
              </p>

              {!perfect && (
                <>
                  <p className="mt-4 text-sm font-bold text-muted">O que você escreveu</p>
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
          <button
            type="button"
            onClick={next}
            className="min-h-10 cursor-pointer rounded-lg border-2 border-control px-4 text-sm font-bold text-brand hover:bg-canvas active:scale-95"
          >
            Outra frase
          </button>
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
    </section>
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
