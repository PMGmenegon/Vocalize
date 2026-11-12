import type { ReactNode } from 'react'
import Card from '../ui/Card'

interface ChartCardProps {
  title: string
  description: string
  /** Resumo em texto do que o gráfico mostra (lido por leitores de tela no lugar do desenho). */
  summary: string
  /** Dados do gráfico em forma de tabela, para quem não enxerga o desenho. */
  table: { headers: string[]; rows: (string | number)[][] }
  children: ReactNode
}

/** Moldura de gráfico: título, descrição, alternativa em texto e tabela de dados. */
export default function ChartCard({ title, description, summary, table, children }: ChartCardProps) {
  return (
    <Card as="section">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div role="img" aria-label={`${title}. ${summary}`} className="mt-4 h-64 w-full text-ink">
        {children}
      </div>
      <details className="mt-3">
        <summary className="inline-flex min-h-11 cursor-pointer items-center rounded-lg px-1 text-sm font-bold text-link underline underline-offset-4">
          Ver dados em tabela
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-line">
                {table.headers.map((h) => (
                  <th key={h} scope="col" className="py-2 pr-4 font-bold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i} className="border-b border-line">
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 pr-4 text-muted">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Card>
  )
}
