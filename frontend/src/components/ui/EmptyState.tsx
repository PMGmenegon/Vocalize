import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

/** Estado vazio: sem caixa, só linhas finas e espaço. */
export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="border-y border-line py-12">
      <p className="type-display text-3xl">{title}</p>
      {description && <p className="mt-3 max-w-xl text-lg text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
