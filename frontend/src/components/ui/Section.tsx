import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  /** Número ou texto curto à direita do título (ex.: quantidade de itens). */
  meta?: ReactNode
  /** Link ou botão discreto à direita. */
  action?: ReactNode
  /** Obrigatório: liga o título à seção para leitores de tela. */
  id: string
  className?: string
  children: ReactNode
}

/** Seção com título em etiqueta e uma linha escura embaixo. É o separador principal das páginas. */
export default function Section({ title, meta, action, id, className = '', children }: SectionProps) {
  return (
    <section aria-labelledby={id} className={className}>
      <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-2">
        <h2 id={id} className="type-eyebrow">
          {title}
        </h2>
        {meta !== undefined && <span className="type-eyebrow">{meta}</span>}
        {action}
      </div>
      {children}
    </section>
  )
}
