import { useState } from 'react'
import type { Turn } from '../../types'

/** Roteiro da sessão: falas já reveladas, suas respostas e o acerto de cada rodada. Recolhível. */
export default function SessionScript({ turns }: { turns: Turn[] }) {
  const [open, setOpen] = useState(true)
  return (
    <aside aria-label="Roteiro da sessão" className="border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
      <h2 className="text-lg font-black text-ink">
        <button type="button" aria-expanded={open} aria-controls="session-script" onClick={() => setOpen(!open)} className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg text-left">
          Roteiro da sessão
          <span aria-hidden="true" className="text-sm text-muted">
            {open ? '▾ recolher' : '▸ abrir'}
          </span>
        </button>
      </h2>
      <div id="session-script" hidden={!open}>
        {turns.length === 0 ? (
          <p className="text-sm text-muted">As falas aparecem aqui conforme você avança.</p>
        ) : (
          <ol className="mt-1 space-y-4">
            {turns.map((t) => (
              <li key={t.index} className="text-sm">
                <p className="font-bold text-muted">
                  Rodada {t.index + 1}
                  {t.transcription && <span className="text-ink"> · {t.transcription.accuracy}% de acerto</span>}
                </p>
                {t.transcription ? (
                  <p lang="en" className="mt-0.5 text-ink">
                    {t.transcription.expectedText}
                  </p>
                ) : (
                  <p className="mt-0.5 text-muted">Fala ainda oculta.</p>
                )}
                {t.reply && (
                  <p lang="en" className="mt-1 text-muted">
                    <span lang="pt-BR">Você: </span>
                    {t.reply}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  )
}
