import type { ReactNode } from 'react'

/** Lista com divisórias finas, sem caixas. */
export function List({ children, ordered = false, className = '', label }: { children: ReactNode; ordered?: boolean; className?: string; label?: string }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag aria-label={label} className={`divide-y divide-line ${className}`}>
      {children}
    </Tag>
  )
}

interface ListItemProps {
  /** Texto principal. */
  title: ReactNode
  /** Linha de apoio, mais discreta. */
  description?: ReactNode
  /** À esquerda (ícone, número). */
  leading?: ReactNode
  /** À direita (resultado, valor). */
  trailing?: ReactNode
  className?: string
}

/** Linha padrão de lista: título, apoio e um valor à direita. */
export function ListItem({ title, description, leading, trailing, className = '' }: ListItemProps) {
  return (
    <li className={`flex items-start justify-between gap-x-4 gap-y-1 py-3.5 ${className}`}>
      <div className="flex min-w-0 flex-1 gap-3">
        {leading && <span className="shrink-0 pt-0.5 text-brand">{leading}</span>}
        <div className="min-w-0">
          <p className="font-bold text-ink">{title}</p>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
      </div>
      {trailing && <div className="shrink-0 text-right text-sm">{trailing}</div>}
    </li>
  )
}
