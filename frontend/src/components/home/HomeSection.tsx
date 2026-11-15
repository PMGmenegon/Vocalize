import type { ReactNode } from 'react'

interface HomeSectionProps {
  id?: string
  eyebrow: string
  title: string
  description?: string
  children: ReactNode
}

/** Seção da landing: linha fina no topo, etiqueta, título serifado e descrição. Mesmo ritmo das páginas do app. */
export default function HomeSection({ id, eyebrow, title, description, children }: HomeSectionProps) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-titulo` : undefined} className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="type-eyebrow text-brand">{eyebrow}</p>
        <h2 id={id ? `${id}-titulo` : undefined} className="type-display mt-2 text-3xl sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-3 max-w-2xl text-lg text-muted">{description}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}
