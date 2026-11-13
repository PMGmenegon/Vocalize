import { useState } from 'react'
import type { Character } from '../../data/scenarios'
import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'
import Avatar from './Avatar'

interface ChatTopBarProps {
  character: Character
  scenarioTitle: string
  done: number
  total: number
  current: number
  busy: boolean
  onEnd: () => void
}

/** Barra superior: quem fala, onde, progresso da sessão e "Encerrar" (com confirmação). */
export default function ChatTopBar({ character, scenarioTitle, done, total, current, busy, onEnd }: ChatTopBarProps) {
  const [confirming, setConfirming] = useState(false)
  return (
    <header className="border-b border-line p-3">
      <div className="flex items-center gap-3">
        <Avatar spec={character.avatar} className="h-11 w-11" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-black text-ink">
            {character.name} <span className="text-sm font-bold text-muted">· {character.role}</span>
          </h1>
          <p className="truncate text-xs text-muted">
            {scenarioTitle} · {character.place}
          </p>
        </div>
        {!confirming && (
          <Button variant="ghost" onClick={() => setConfirming(true)}>
            Encerrar
          </Button>
        )}
      </div>
      {confirming && (
        <div role="alertdialog" aria-label="Confirmar encerramento" className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-ink">Encerrar a sessão agora?</span>
          <Button variant="danger" onClick={onEnd} disabled={busy}>
            Sim, encerrar
          </Button>
          <Button variant="ghost" onClick={() => setConfirming(false)}>
            Continuar
          </Button>
        </div>
      )}
      <div className="mt-2 flex items-center gap-3">
        <p className="shrink-0 text-xs font-bold text-muted">
          Rodada {Math.min(current, total)} de {total}
        </p>
        <ProgressBar className="flex-1" label="Progresso da sessão" value={done} max={total} valueText={`${done} de ${total} rodadas concluídas`} />
      </div>
    </header>
  )
}
