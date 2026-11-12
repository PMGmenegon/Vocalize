import { useEffect, useRef, useState } from 'react'
import { PlayIcon, ReplayIcon, SlowIcon } from '../appIcons'
import Button from '../ui/Button'

interface ListenStepProps {
  repetitions: number
  /** Registra uma repetição no serviço. */
  onPlay: () => void
  onContinue: () => void
  /** Botão extra para ir direto à transcrição (some na etapa de transcrição). */
  compact?: boolean
}

/**
 * Etapa "Ouvir". Ainda não há áudio: os botões só simulam a reprodução (visual) e
 * contam repetições. A fala em si chega numa fase futura.
 */
export default function ListenStep({ repetitions, onPlay, onContinue, compact = false }: ListenStepProps) {
  const [playing, setPlaying] = useState<'normal' | 'slow' | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function play(speed: 'normal' | 'slow') {
    window.clearTimeout(timer.current)
    setPlaying(speed)
    onPlay()
    timer.current = window.setTimeout(() => setPlaying(null), speed === 'slow' ? 3500 : 2200)
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {!compact && <p className="max-w-md text-muted">Ouça a fala da IA com atenção. O texto fica escondido até você tentar transcrever.</p>}

      <button
        type="button"
        onClick={() => play('normal')}
        aria-label={repetitions === 0 ? 'Ouvir a fala' : 'Ouvir a fala de novo'}
        className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand shadow-lg transition-colors hover:bg-brand-strong sm:h-32 sm:w-32"
      >
        <PlayIcon className="ml-1 h-12 w-12" />
      </button>

      <p role="status" className="min-h-6 font-bold text-ink">
        {playing === 'normal' && (
          <>
            <span aria-hidden="true">♪ </span>Tocando…
          </>
        )}
        {playing === 'slow' && (
          <>
            <span aria-hidden="true">♪ </span>Tocando devagar…
          </>
        )}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={() => play('normal')}>
          <ReplayIcon className="h-5 w-5" /> Repetir
        </Button>
        <Button variant="secondary" onClick={() => play('slow')}>
          <SlowIcon className="h-5 w-5" /> Velocidade reduzida
        </Button>
      </div>

      <p className="text-sm text-muted" aria-live="polite">
        Repetições: <strong className="text-ink">{repetitions}</strong>
      </p>
      <p className="max-w-md text-xs text-muted">O áudio de verdade chega numa fase futura; por enquanto os botões só simulam a reprodução.</p>

      {!compact && (
        <Button size="lg" onClick={onContinue}>
          Já ouvi, quero transcrever
        </Button>
      )}
    </div>
  )
}
