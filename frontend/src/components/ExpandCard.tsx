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
 * Cartão que abre uma explicação ao clicar. O título é um botão (aria-expanded) e
 * o cartão inteiro é clicável; o texto escondido fica fora do foco enquanto fechado.
 */
export default function ExpandCard({ icon, title, summary, details, eyebrow, delay = 0 }: ExpandCardProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <Reveal
      as="li"
      delay={delay}
      className={[
        'group relative rounded-2xl border-2 bg-surface p-6 transition-all duration-200 hover:border-brand hover:shadow-lg motion-safe:hover:-translate-y-1',
        open ? 'border-brand shadow-md' : 'border-line',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-on-brand transition-transform duration-200 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6">
          {icon}
        </span>
        {eyebrow && <span className="text-sm font-bold tracking-widest text-accent uppercase">{eyebrow}</span>}
      </div>

      <h3 className="mt-4 text-lg font-black text-ink">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-start justify-between gap-3 text-left after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-solid focus-visible:after:outline-(--focus)"
        >
          {title}
          <svg
            viewBox="0 0 24 24"
            className={`mt-1 h-5 w-5 shrink-0 text-brand transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </h3>
      <p className="mt-1 text-muted">{summary}</p>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="mt-4 rounded-xl bg-canvas p-3 text-sm text-ink">{details}</p>
        </div>
      </div>

      <span aria-hidden="true" className="mt-3 inline-block text-sm font-bold text-link">
        {open ? 'Mostrar menos' : 'Saiba mais'}
      </span>
    </Reveal>
  )
}
