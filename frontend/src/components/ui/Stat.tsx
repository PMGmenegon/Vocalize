import type { ReactNode } from 'react'

/** Lista de números lado a lado, sem caixas. `divided` separa os itens por linhas finas (faixas de resumo). */
export function StatList({ children, divided = false, className = '' }: { children: ReactNode; divided?: boolean; className?: string }) {
  return divided ? (
    <dl className={`grid gap-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:gap-0 lg:divide-x lg:divide-line ${className}`}>{children}</dl>
  ) : (
    <dl className={`mt-5 flex flex-wrap gap-x-10 gap-y-3 ${className}`}>{children}</dl>
  )
}

interface StatProps {
  label: string
  value: ReactNode
  note?: string
  /** Número grande (faixas de resumo) em vez do tamanho de cabeçalho. */
  large?: boolean
  /** Dentro de <StatList divided>: dá o respiro lateral entre as divisórias. */
  divided?: boolean
}

/** Um número com etiqueta. */
export function Stat({ label, value, note, large = false, divided = false }: StatProps) {
  return (
    <div className={divided ? 'lg:px-8 lg:first:pl-0 lg:last:pr-0' : undefined}>
      <dt className="type-eyebrow">{label}</dt>
      <dd className={`mt-0.5 font-black text-ink ${large ? 'text-4xl' : 'text-xl'}`}>{value}</dd>
      {note && <dd className="mt-1 text-sm text-muted">{note}</dd>}
    </div>
  )
}
