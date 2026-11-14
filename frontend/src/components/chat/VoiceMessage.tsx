import { fakeDuration, formatClock, useFakePlayback } from '../../hooks/useFakePlayback'
import type { Turn } from '../../types'
import { PlayIcon } from '../appIcons'
import TranscriptionResult from '../practice/TranscriptionResult'
import Waveform from '../practice/Waveform'

interface VoiceMessageProps {
  contactName: string
  turn: Turn
  time: string
  /** Conta uma repetição (a fala recomeça do início). */
  onRestart: () => void
}

/**
 * Mensagem de voz do contato: play/pause, forma de onda, duração, velocidade 1×/0.75×
 * e contador de repetições. O texto fica oculto até a conferência. Áudio simulado por enquanto.
 */
export default function VoiceMessage({ contactName, turn, time, onRestart }: VoiceMessageProps) {
  const playback = useFakePlayback(fakeDuration(turn.wordCount), onRestart)
  const { playing, pos, duration, slow } = playback
  return (
    <article aria-label={`Mensagem de voz de ${contactName}`} className="bubble-in max-w-[88%] rounded-2xl rounded-tl-sm border border-line bg-card p-3 text-ink shadow-sm">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={playback.toggle}
          aria-label={playing ? 'Pausar mensagem de voz' : 'Tocar mensagem de voz'}
          className="surface-brand flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand hover:bg-brand-strong"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
            </svg>
          ) : (
            <PlayIcon className="ml-0.5 h-5 w-5" />
          )}
        </button>
        <Waveform seed={turn.index + turn.wordCount} progress={pos / duration} bars={26} height={28} className="min-w-0 flex-1 overflow-hidden" />
        <span className="shrink-0 text-xs tabular-nums text-muted">{formatClock(playing || pos > 0 ? pos : duration)}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <button type="button" onClick={playback.toggleSpeed} aria-pressed={slow} aria-label="Velocidade 0,75" className="min-h-8 cursor-pointer rounded-full border-2 border-control px-2.5 font-bold text-link hover:bg-surface">
          {slow ? '0.75×' : '1×'}
        </button>
        <button type="button" onClick={playback.repeat} className="min-h-8 cursor-pointer rounded-full border-2 border-control px-2.5 font-bold text-link hover:bg-surface">
          Repetir
        </button>
        <span className="text-muted" aria-live="polite">
          Repetições: <strong className="text-ink">{turn.repetitions}</strong>
        </span>
        <span className="ml-auto text-muted">{time}</span>
      </div>
      {turn.transcription ? (
        <TranscriptionResult result={turn.transcription} />
      ) : (
        <p className="mt-2 text-xs text-muted">
          <span aria-hidden="true">🔒 </span>Texto oculto. Ouça e transcreva abaixo. (Áudio simulado.)
        </p>
      )}
    </article>
  )
}
