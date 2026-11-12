import { useState } from 'react'
import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'

interface SessionProgressProps {
  /** Rodadas já concluídas. */
  done: number
  total: number
  /** Rodada atual (1-based) para o texto. */
  current: number
  busy: boolean
  onEnd: () => void
}

/** Barra de progresso da sessão e o botão "Encerrar sessão" (com confirmação). */
export default function SessionProgress({ done, total, current, busy, onEnd }: SessionProgressProps) {
  const [confirming, setConfirming] = useState(false)
  return (
    <div className="mb-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-muted">
          Rodada {Math.min(current, total)} de {total}
        </p>
        {confirming ? (
          <div role="alertdialog" aria-label="Confirmar encerramento" className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-ink">Encerrar agora?</span>
            <Button variant="danger" onClick={onEnd} disabled={busy}>
              Sim, encerrar
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Continuar
            </Button>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setConfirming(true)}>
            Encerrar sessão
          </Button>
        )}
      </div>
      <ProgressBar label="Progresso da sessão" value={done} max={total} valueText={`${done} de ${total} rodadas concluídas`} />
    </div>
  )
}
