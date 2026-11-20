import { useEffect, useState } from 'react'
import { DIFFERENCES, KIND_LABEL } from '../content/differences'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { THEME_LIST, THEMES, type Theme } from '../theme/themes'
import { useTheme } from '../theme/useTheme'
import { Flag } from './Flags'

const ROTATE_MS = 7000

/**
 * Curiosidades "americano versus britânico" que alternam sozinhas (com botão de pausa, como pede
 * o WCAG para conteúdo que se move) e também podem ser navegadas à mão.
 * O lado do modo atual fica em destaque. Sempre acompanhadas do significado em português.
 */
export default function UsVsUk() {
  const { theme } = useTheme()
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
    <div role="group" aria-label="Curiosidades: americano versus britânico">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-2">
        <p className="type-eyebrow">
          Curiosidade · {KIND_LABEL[item.kind].toLowerCase()} · {index + 1} de {DIFFERENCES.length}
        </p>
        <div className="flex items-center gap-2 self-center">
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="min-h-10 cursor-pointer rounded-lg px-3 text-sm font-bold text-link hover:bg-surface"
            >
              {paused ? 'Retomar' : 'Pausar'}
            </button>
          )}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Curiosidade anterior"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-brand hover:bg-surface"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próxima curiosidade"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-brand hover:bg-surface"
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      {/* Anuncia a troca só quando a pessoa navega (rotação automática fica em silêncio). */}
      <div aria-live={playing ? 'off' : 'polite'} className="mt-6">
        <div key={index} className="fade-swap grid gap-x-12 gap-y-6 sm:grid-cols-2">
          {THEME_LIST.map((code) => (
            <Side key={code} code={code} current={code === theme} word={item[code]} sound={code === 'us' ? item.usSound : item.ukSound} isPron={isPron} />
          ))}
        </div>
        <p className="mt-6 text-muted">
          Em português: <strong className="text-ink">{item.meaning}</strong>
          {item.note && <> — {item.note}</>}
        </p>
      </div>
    </div>
  )
}

interface SideProps {
  code: Theme
  current: boolean
  word: string
  sound?: string
  isPron: boolean
}

function Side({ code, current, word, sound, isPron }: SideProps) {
  const info = THEMES[code]
  return (
    <div className={`border-l-2 pl-5 ${current ? 'border-brand' : 'border-line'}`}>
      <p className="type-eyebrow inline-flex items-center gap-2">
        <Flag theme={code} />
        {info.short}
        {current && <span className="text-brand">· seu modo</span>}
      </p>
      <p lang={code === 'us' ? 'en-US' : 'en-GB'} className="type-display mt-2 text-4xl break-words">
        {word}
      </p>
      {isPron && sound && <p className="mt-1 text-sm text-muted">{sound}</p>}
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
