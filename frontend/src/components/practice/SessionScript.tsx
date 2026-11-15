import { useState } from 'react'
import type { Turn } from '../../types'
import DetailPanel from '../ui/DetailPanel'

/** Roteiro da sessão: falas já reveladas, suas respostas e o acerto de cada rodada. Recolhível. */
export default function SessionScript({ turns }: { turns: Turn[] }) {
  const [open, setOpen] = useState(true)
  return (
    <DetailPanel label="Roteiro da sessão" className="border-t border-line pt-4 lg:border-t-0 lg:pt-0">
      <h2>
        <button type="button" aria-expanded={open} aria-controls="session-script" onClick={() => setOpen(!open)} className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg text-left">
          <span className="type-eyebrow">Roteiro da sessão</span>
          <span aria-hidden="true" className="type-eyebrow">
            {open ? '▾ recolher' : '▸ abrir'}
          </span>
        </button>
      </h2>
      <div id="session-script" hidden={!open}>
        {turns.length === 0 ? (
          <p className="text-sm text-muted">As falas aparecem aqui conforme você avança.</p>
        ) : (
          <ol className="mt-2 divide-y divide-line">
            {turns.map((t) => (
              <li key={t.index} className="py-3 text-sm">
                <p className="type-eyebrow">
                  Rodada {t.index + 1}
                  {t.transcription && <span className="text-brand"> · {t.transcription.accuracy}% de acerto</span>}
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
    </DetailPanel>
  )
}
