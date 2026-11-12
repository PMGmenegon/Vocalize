import { useEffect, useState } from 'react'
import { DIFFERENCES, KIND_LABEL } from '../content/differences'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ACCENT_LIST, ACCENTS, type Accent } from '../theme/accents'
import { useTheme } from '../theme/useTheme'
import { Flag } from './Flags'

const ROTATE_MS = 7000

/**
 * Curiosidades "US vs UK" que alternam sozinhas (com botão de pausa, como pede
 * o WCAG para conteúdo que se move) e também podem ser navegadas à mão.
 * O lado do modo atual fica em destaque.
 */
export default function UsVsUk() {
  const { accent } = useTheme()
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const playing = !paused && !reduced

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % DIFFERENCES.length), ROTATE_MS)
    return () => window.clearTimeout(id)
  }, [playing, index])

  const item = DIFFERENCES[index] ?? DIFFERENCES[0]!
  const go = (delta: number) => setIndex((i) => (i + delta + DIFFERENCES.length) % DIFFERENCES.length)
  const isPron = item.kind === 'pron'

  return (
    <div className="rounded-2xl border border-line bg-card p-4 sm:p-6" role="group" aria-label="Curiosidades: americano versus britânico">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold tracking-widest text-accent uppercase">
          {KIND_LABEL[item.kind]} · {index + 1} de {DIFFERENCES.length}
        </p>
        <div className="flex items-center gap-2">
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="min-h-10 cursor-pointer rounded-lg border-2 border-control px-3 text-sm font-bold text-ink hover:bg-surface"
            >
              {paused ? 'Retomar' : 'Pausar'}
            </button>
          )}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Curiosidade anterior"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-control text-brand hover:bg-surface"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próxima curiosidade"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-control text-brand hover:bg-surface"
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      {/* Anuncia a troca só quando a pessoa navega (rotação automática fica em silêncio). */}
      <div aria-live={playing ? 'off' : 'polite'} className="mt-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {ACCENT_LIST.map((code) => (
            <Side
              key={code}
              code={code}
              current={code === accent}
              word={item[code]}
              sound={code === 'us' ? item.usSound : item.ukSound}
              isPron={isPron}
            />
          ))}
        </div>
        <p className="mt-4 text-muted">
          Em português: <strong className="text-ink">{item.meaning}</strong>
          {item.note && <> — {item.note}</>}
        </p>
      </div>
    </div>
  )
}

interface SideProps {
  code: Accent
  current: boolean
  word: string
  sound?: string
  isPron: boolean
}

function Side({ code, current, word, sound, isPron }: SideProps) {
  const info = ACCENTS[code]
  return (
    <div
      className={[
        'rounded-xl border-2 p-4',
        current ? 'surface-brand border-brand bg-brand text-on-brand' : 'border-line bg-surface text-ink',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-bold">
          <Flag accent={code} />
          {info.short}
        </span>
        {current && (
          <span className="rounded-full bg-on-brand px-2 py-0.5 text-xs font-bold text-brand">Seu modo</span>
        )}
      </div>
      <p lang={code === 'us' ? 'en-US' : 'en-GB'} className="mt-3 text-3xl font-black break-words">
        {word}
      </p>
      {isPron && sound && (
        <p className={`mt-1 text-sm ${current ? 'text-on-brand-soft' : 'text-muted'}`}>{sound}</p>
      )}
    </div>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}
