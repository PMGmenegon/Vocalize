import { useEffect, useRef, useState } from 'react'
import type { Character } from '../../data/scenarios'
import type { TranscriptionResult as Result } from '../../types'
import { PlayIcon, ReplayIcon } from '../appIcons'
import Avatar from './Avatar'
import TranscriptionResult from './TranscriptionResult'

/** Alturas fixas das barras da "forma de onda" (decorativa). */
const BARS = [6, 12, 8, 16, 10, 20, 14, 8, 18, 12, 6, 16, 22, 10, 14, 8, 18, 12, 6, 10, 16, 8, 12, 6]

interface AudioBubbleProps {
  character: Character
  repetitions: number
  /** Presente depois que o usuário conferiu a transcrição: revela o texto. */
  result?: Result
  /** Registra uma repetição (play, repetir ou 0.75×). */
  onPlay: () => void
}

/**
 * Fala do personagem como mensagem de áudio. O texto fica oculto até a conferência.
 * Ainda não há áudio: os botões só simulam a reprodução (visual) e contam repetições.
 */
export default function AudioBubble({ character, repetitions, result, onPlay }: AudioBubbleProps) {
  const [playing, setPlaying] = useState<'normal' | 'slow' | null>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  function play(speed: 'normal' | 'slow') {
    window.clearTimeout(timer.current)
    setPlaying(speed)
    onPlay()
    timer.current = window.setTimeout(() => setPlaying(null), speed === 'slow' ? 3600 : 2600)
  }

  return (
    <div className="bubble-in flex items-end gap-2">
      <Avatar spec={character.avatar} className="h-9 w-9 sm:h-10 sm:w-10" />
      <article aria-label={`Mensagem de áudio de ${character.name}`} className="max-w-[88%] rounded-2xl rounded-bl-sm border border-line bg-surface p-3 text-ink">
        <p className="text-xs font-bold text-muted">
          {character.name} · {character.role}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => play('normal')}
            aria-label={repetitions === 0 ? `Ouvir ${character.name}` : `Ouvir ${character.name} de novo`}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand hover:bg-brand-strong"
          >
            <PlayIcon className="ml-0.5 h-5 w-5" />
          </button>
          <div aria-hidden="true" className="flex h-8 items-center gap-[3px]">
            {BARS.map((h, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-full bg-brand ${playing ? 'wave-playing' : ''} ${playing ? '' : 'opacity-60'}`}
                style={{ height: h, animationDelay: `${(i % 6) * 0.12}s` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => play('normal')}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border-2 border-control bg-card px-2.5 text-xs font-bold text-link hover:bg-surface"
          >
            <ReplayIcon className="h-4 w-4" /> Repetir
          </button>
          <button
            type="button"
            onClick={() => play('slow')}
            aria-label="Ouvir em velocidade 0,75"
            className="inline-flex min-h-9 cursor-pointer items-center rounded-lg border-2 border-control bg-card px-2.5 text-xs font-bold text-link hover:bg-surface"
          >
            0.75×
          </button>
          <span className="text-xs text-muted" aria-live="polite">
            Repetições: <strong className="text-ink">{repetitions}</strong>
          </span>
        </div>
        <p role="status" className="sr-only">
          {playing === 'slow' ? 'Tocando devagar' : playing ? 'Tocando' : ''}
        </p>

        {result ? (
          <TranscriptionResult result={result} />
        ) : (
          <p className="mt-2 text-xs text-muted">
            <span aria-hidden="true">🔒 </span>Texto oculto. Ouça e transcreva abaixo. (Áudio simulado por enquanto.)
          </p>
        )}
      </article>
    </div>
  )
}
