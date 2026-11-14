import { useState } from 'react'
import Button from '../ui/Button'

/** Botão "Encerrar" com confirmação em duas etapas (evita perder a sessão sem querer). */
export default function EndSession({ busy, onEnd, tone = 'default' }: { busy: boolean; onEnd: () => void; tone?: 'default' | 'on-brand' }) {
  const [confirming, setConfirming] = useState(false)
  const onBrand = tone === 'on-brand'
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`min-h-9 cursor-pointer rounded-lg px-3 text-sm font-bold ${onBrand ? 'text-on-brand underline underline-offset-4 hover:bg-white/15' : 'text-link hover:bg-surface'}`}
      >
        Encerrar
      </button>
    )
  }
  return (
    <div role="alertdialog" aria-label="Confirmar encerramento" className={`flex flex-wrap items-center gap-2 ${onBrand ? 'rounded-lg bg-canvas p-2' : ''}`}>
      <span className="text-sm font-bold text-ink">Encerrar agora?</span>
      <Button variant="danger" onClick={onEnd} disabled={busy}>
        Sim, encerrar
      </Button>
      <Button variant="ghost" onClick={() => setConfirming(false)}>
        Continuar
      </Button>
    </div>
  )
}
