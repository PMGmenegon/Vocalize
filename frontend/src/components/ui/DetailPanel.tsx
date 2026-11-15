import type { ReactNode } from 'react'

/**
 * Coluna lateral de detalhes: acompanha a rolagem no desktop, com uma linha fina à esquerda.
 * Em telas estreitas a linha some e a coluna desce para o fluxo normal da página.
 */
export default function DetailPanel({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <aside aria-label={label} className={`self-start lg:sticky lg:top-24 lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto ${className}`}>
      <div className="lg:border-l lg:border-line lg:pl-8">{children}</div>
    </aside>
  )
}
