import { formatClock, type useFakePlayback } from '../../hooks/useFakePlayback'
import { PlayIcon, ReplayIcon } from '../appIcons'
import Waveform from './Waveform'

type Playback = ReturnType<typeof useFakePlayback>

const pill = 'inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-control bg-card px-3 text-sm font-bold text-link hover:bg-surface'

/**
 * Player do treino: forma de onda, play/pause grande, voltar 3 s, repetir a frase, velocidade e
 * contador de repetições. O áudio ainda é SIMULADO (só a posição avança); chega numa fase futura.
 */
export default function AudioPlayer({ playback, seed, repetitions }: { playback: Playback; seed: number; repetitions: number }) {
  const { playing, pos, duration, slow } = playback
  return (
    <section aria-label="Player de áudio" className="border-y border-line py-5">
      <Waveform seed={seed} progress={duration ? pos / duration : 0} bars={64} height={56} className="w-full overflow-hidden" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={playback.toggle}
            aria-label={playing ? 'Pausar' : 'Tocar'}
            className="surface-brand flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand hover:bg-brand-strong"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
              </svg>
            ) : (
              <PlayIcon className="ml-1 h-7 w-7" />
            )}
          </button>
          <button type="button" onClick={playback.back3} className={pill} aria-label="Voltar 3 segundos">
            ↺ 3 s
          </button>
          <button type="button" onClick={playback.repeat} className={pill}>
            <ReplayIcon className="h-4 w-4" /> Repetir
          </button>
          <button type="button" onClick={playback.toggleSpeed} aria-pressed={slow} aria-label="Velocidade 0,75" className={`${pill} ${slow ? 'border-brand bg-surface' : ''}`}>
            {slow ? '0.75×' : '1×'}
          </button>
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          <span className="tabular-nums">
            {formatClock(pos)} / {formatClock(duration)}
          </span>
          {' · '}Repetições: <strong className="text-ink">{repetitions}</strong>
        </p>
      </div>
      <p className="mt-2 text-xs text-muted">Áudio simulado por enquanto: a reprodução real chega numa fase futura.</p>
    </section>
  )
}
