import type { ReactNode } from 'react'

/** Contêiner padrão das páginas da área logada. `narrow` serve às telas de fluxo (uma coluna). */
export function Page({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <section className={`mx-auto px-4 py-8 sm:px-6 sm:py-12 ${narrow ? 'max-w-3xl' : 'max-w-6xl'}`}>{children}</section>
  )
}

interface PageHeaderProps {
  /** Etiqueta curta acima do título (nome da área). */
  eyebrow: string
  title: string
  description?: string
  /** Números do cabeçalho (use <Stat> dentro de <StatList>). */
  stats?: ReactNode
  /** Ação à direita (botão, seletor). */
  action?: ReactNode
  className?: string
}

/** Cabeçalho padrão de página: etiqueta, título editorial, descrição e números. */
export default function PageHeader({ eyebrow, title, description, stats, action, className = '' }: PageHeaderProps) {
  return (
    <header className={`mb-8 sm:mb-10 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <p className="type-eyebrow text-brand">{eyebrow}</p>
          <h1 className="type-display mt-2 text-4xl sm:text-5xl">{title}</h1>
        </div>
        {action}
      </div>
      {description && <p className="mt-3 max-w-2xl text-lg text-muted">{description}</p>}
      {stats}
    </header>
  )
}
