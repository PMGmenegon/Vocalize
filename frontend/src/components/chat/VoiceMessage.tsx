import { useSpeechPlayer } from '../../hooks/useSpeechPlayer'
import { useSpokenText } from '../../hooks/useSpokenText'
import { formatClock } from '../../lib/format'
import type { Accent, Turn } from '../../types'
import { PlayIcon } from '../appIcons'
import TranscriptionResult from '../practice/TranscriptionResult'
import Waveform from '../practice/Waveform'

interface VoiceMessageProps {
  sessionId: string
  locale: Accent
  contactName: string
  turn: Turn
  time: string
  /** Conta uma repetição (a fala recomeça do início). */
  onRestart: () => void
}

/**
 * Mensagem de voz do contato: play/pause, forma de onda, duração, velocidade 1×/0.75×
 * e contador de repetições. O texto fica oculto até a conferência. A voz é sintetizada pelo navegador.
 */
export default function VoiceMessage({ sessionId, locale, contactName, turn, time, onRestart }: VoiceMessageProps) {
  const text = useSpokenText(sessionId, turn.index)
  const playback = useSpeechPlayer({ text, locale, onRestart })
  const { playing, pos, duration, slow, progress, ready } = playback
  return (
    <article aria-label={`Mensagem de voz de ${contactName}`} className="bubble-in max-w-[88%] rounded-2xl rounded-tl-sm border border-line bg-card p-3 text-ink shadow-sm">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={playback.toggle}
          disabled={!ready}
          aria-label={playing ? 'Pausar mensagem de voz' : 'Tocar mensagem de voz'}
          className="surface-brand flex disabled:cursor-not-allowed disabled:opacity-50 h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand hover:bg-brand-strong"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
            </svg>
          ) : (
            <PlayIcon className="ml-0.5 h-5 w-5" />
          )}
        </button>
        <Waveform seed={turn.index + turn.wordCount} progress={progress} bars={26} height={28} className="min-w-0 flex-1 overflow-hidden" />
        <span className="shrink-0 text-xs tabular-nums text-muted">{formatClock(playing || pos > 0 ? pos : duration)}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <button type="button" onClick={playback.toggleSpeed} disabled={!ready} aria-pressed={slow} aria-label="Velocidade 0,75" className="min-h-8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-full border-2 border-control px-2.5 font-bold text-link hover:bg-surface">
          {slow ? '0.75×' : '1×'}
        </button>
        <button type="button" onClick={playback.repeat} disabled={!ready} className="min-h-8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-full border-2 border-control px-2.5 font-bold text-link hover:bg-surface">
          Repetir
        </button>
        <span className="text-muted">
          Repetições: <strong className="text-ink">{turn.repetitions}</strong>
        </span>
        <span className="ml-auto text-muted">{time}</span>
      </div>
      {turn.transcription ? (
        <TranscriptionResult result={turn.transcription} />
      ) : (
        <p className="mt-2 text-xs text-muted">
          <span aria-hidden="true">🔒 </span>Texto oculto. Ouça e transcreva abaixo.
        </p>
      )}
      <p role="status" className="sr-only">
        {playback.announcement}
      </p>
      <p role="status" className="mt-1 text-xs text-muted empty:hidden">
        {playback.notice}
      </p>
    </article>
  )
}
