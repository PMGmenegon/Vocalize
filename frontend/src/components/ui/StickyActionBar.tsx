import type { ReactNode } from 'react'

interface StickyActionBarProps {
  /** Etiqueta pequena (ex.: "Sua sessão"). */
  label: string
  /** O que está escolhido ou o que falta fazer. */
  summary: ReactNode
  /** Botão(ões) de ação, à direita. */
  children: ReactNode
  /** Mensagem de erro (anunciada na hora). */
  error?: string
}

/** Barra fixa na base da tela: resume a escolha e traz a ação principal. Usa a largura da <Page>. */
export default function StickyActionBar({ label, summary, children, error }: StickyActionBarProps) {
  return (
    <div className="sticky bottom-0 z-30 -mx-4 mt-8 border-t border-ink bg-canvas px-4 py-3 sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="type-eyebrow">{label}</p>
          <div className="font-black text-ink">{summary}</div>
          <p role="alert" className="text-sm font-bold text-on-danger empty:hidden">
            {error}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      </div>
    </div>
  )
}
