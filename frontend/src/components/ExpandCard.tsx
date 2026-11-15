import { useId, useState, type ReactNode } from 'react'
import Reveal from './Reveal'

interface ExpandCardProps {
  icon: ReactNode
  title: string
  /** Frase curta, sempre visível. */
  summary: string
  /** Explicação que aparece ao clicar. */
  details: string
  /** Texto pequeno acima do título (ex.: "Passo 1"). */
  eyebrow?: string
  delay?: number
}

/**
 * Item com explicação que abre ao clicar, sem caixa: linha escura no topo, ícone, título e resumo.
 * O botão "Saiba mais" é um disclosure (aria-expanded); o texto escondido fica fora do foco enquanto fechado.
 */
export default function ExpandCard({ icon, title, summary, details, eyebrow, delay = 0 }: ExpandCardProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <Reveal as="li" delay={delay} className="group border-t border-ink pt-5">
      <div className="flex items-center gap-3 text-brand">
        <span className="transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5">{icon}</span>
        {eyebrow && <span className="type-eyebrow text-brand">{eyebrow}</span>}
      </div>

      <h3 className="type-display mt-4 text-2xl">{title}</h3>
      <p className="mt-2 text-ink">{summary}</p>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg text-sm font-bold text-link hover:underline"
      >
        {open ? 'Mostrar menos' : 'Saiba mais'}
        <span aria-hidden="true" className={`inline-block transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>

      <div id={panelId} className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden" inert={!open}>
          <p className="border-l-2 border-brand pl-4 text-sm text-muted">{details}</p>
        </div>
      </div>
    </Reveal>
  )
}
