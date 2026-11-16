import type { SpeechPlayback } from '../../hooks/useSpeechPlayer'
import { formatClock } from '../../lib/format'
import { PlayIcon, ReplayIcon } from '../appIcons'
import Waveform from './Waveform'

const pill = 'inline-flex min-h-11 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center gap-1.5 rounded-xl border-2 border-control bg-card px-3 text-sm font-bold text-link hover:bg-surface'

/**
 * Player do treino: forma de onda, play/pause grande, voltar ~3 s, repetir a frase, velocidade e
 * contador de repetições. A voz é sintetizada pelo navegador; a posição e a duração são estimadas
 * pelas palavras faladas (a API não informa o tempo real).
 */
export default function AudioPlayer({ playback, seed, repetitions }: { playback: SpeechPlayback; seed: number; repetitions: number }) {
  const { playing, pos, duration, slow, progress, ready } = playback
  return (
    <section aria-label="Player de áudio" className="border-y border-line py-5">
      <Waveform seed={seed} progress={progress} bars={64} height={56} className="w-full overflow-hidden" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={playback.toggle}
            disabled={!ready}
            aria-label={playing ? 'Pausar' : 'Tocar'}
            className="surface-brand flex disabled:cursor-not-allowed disabled:opacity-50 h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand hover:bg-brand-strong"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
              </svg>
            ) : (
              <PlayIcon className="ml-1 h-7 w-7" />
            )}
          </button>
          <button type="button" onClick={playback.back3} disabled={!ready} className={pill} aria-label="Voltar cerca de 3 segundos">
            ↺ 3 s
          </button>
          <button type="button" onClick={playback.repeat} disabled={!ready} className={pill}>
            <ReplayIcon className="h-4 w-4" /> Repetir
          </button>
          <button type="button" onClick={playback.toggleSpeed} disabled={!ready} aria-pressed={slow} aria-label="Velocidade 0,75" className={`${pill} ${slow ? 'border-brand bg-surface' : ''}`}>
            {slow ? '0.75×' : '1×'}
          </button>
        </div>
        <p className="text-sm text-muted">
          <span className="tabular-nums">
            {formatClock(pos)} / {formatClock(duration)}
          </span>
          {' · '}Repetições: <strong className="text-ink">{repetitions}</strong>
        </p>
      </div>
      <p role="status" className="sr-only">
        {playback.announcement}
      </p>
      <p role="status" className="mt-2 text-xs text-muted empty:hidden">
        {playback.notice}
      </p>
    </section>
  )
}
