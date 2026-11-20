import { useId, useRef, useState, type FormEvent } from 'react'
import { compareTranscription } from '../../domain/transcription'
import { useSpeechPlayer } from '../../hooks/useSpeechPlayer'
import Button from '../ui/Button'
import HomeSection from './HomeSection'
import { THEMES, type Theme } from '../../theme/themes'
import { useTheme } from '../../theme/useTheme'
import type { TranscriptionResult } from '../../types'

const SENTENCES: Record<Theme, readonly string[]> = {
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
  const { theme } = useTheme()
  // key: ao trocar de modo a rodada recomeça do zero.
  return <Round key={theme} theme={theme} />
}

function Round({ theme }: { theme: Theme }) {
  const locale = THEMES[theme].locale
  const sentences = SENTENCES[theme]
  const inputId = useId()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState<TranscriptionResult | null>(null)
  const [revealed, setRevealed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const sentence = sentences[index % sentences.length] ?? sentences[0]!

  // Voz do navegador (src/audio): cala ao trocar de frase/modo ou sair da página (o hook cuida disso).
  const player = useSpeechPlayer({ text: sentence, locale, baseRate: 0.95 })
  const speaking = player.playing
  const speechSupported = player.supported

  function play(rate: number) {
    player.play(rate)
    inputRef.current?.focus()
  }

  function check(e: FormEvent) {
    e.preventDefault()
    if (!typed.trim()) return
    setResult(compareTranscription(sentence, typed))
  }

  function next() {
    setIndex((i) => (i + 1) % sentences.length)
    setTyped('')
    setResult(null)
    setRevealed(false)
  }

  const perfect = result !== null && result.words.every((w) => w.status === 'correct')

  // Marcação palavra por palavra a partir da comparação (frase correta × o que foi escrito).
  const expectedMarks = (result?.words ?? []).filter((w) => w.expected !== undefined).map((w) => ({ word: w.expected ?? '', ok: w.status === 'correct' }))
  const typedMarks = (result?.words ?? []).filter((w) => w.typed).map((w) => ({ word: w.typed ?? '', ok: w.status === 'correct' }))

  return (
    <HomeSection id="experimente" eyebrow="Experimente" title="Uma rodada, agora" description="Ouça a frase no sotaque do seu modo, escreva o que entendeu e veja a correção na hora.">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => play(0.95)} disabled={!player.ready}>
            {speaking ? 'Ouvindo…' : 'Ouvir frase'}
          </Button>
          <Button size="lg" variant="secondary" onClick={() => play(0.6)} disabled={!player.ready}>
            Ouvir devagar
          </Button>
          <span className="type-eyebrow">
            {THEMES[theme].label} ({THEMES[theme].locale})
          </span>
        </div>
        <p role="status" className="mt-3 text-sm font-bold text-ink empty:hidden">
          {player.notice}
        </p>
        {!speechSupported && <p className="mt-3 text-sm text-muted">Você ainda pode clicar em "Mostrar o texto".</p>}

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
                  : `Você acertou ${result.correctCount} de ${result.totalExpected} palavras.`}
              </p>

              <p className="type-eyebrow mt-4">Frase correta</p>
              <p lang="en" className="mt-1 flex flex-wrap gap-1.5 text-lg">
                {expectedMarks.map((w, i) => (
                  <Word key={i} {...w} wrongLabel="faltou ou errou" rightLabel="certo" />
                ))}
              </p>

              {!perfect && (
                <>
                  <p className="type-eyebrow mt-4">O que você escreveu</p>
                  <p lang="en" className="mt-1 flex flex-wrap gap-1.5 text-lg">
                    {typedMarks.map((w, i) => (
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
