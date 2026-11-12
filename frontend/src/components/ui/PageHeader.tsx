import type { ReactNode } from 'react'

/** Contêiner padrão das páginas da área logada. */
export function Page({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <section className={`mx-auto px-4 py-8 sm:px-6 sm:py-12 ${narrow ? 'max-w-3xl' : 'max-w-6xl'}`}>{children}</section>
  )
}

/** Título (h1) da página com subtítulo e ação opcional. */
export default function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div>
        <h1 className="text-3xl font-black text-brand sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
