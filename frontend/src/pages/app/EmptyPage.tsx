interface EmptyPageProps {
  title: string
  description: string
}

/** Casca de página vazia, usada pelas páginas da área logada até elas serem construídas. */
export default function EmptyPage({ title, description }: EmptyPageProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-black text-brand sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted">{description}</p>
      <div className="mt-8 rounded-2xl border-2 border-dashed border-line bg-surface p-8 text-center text-muted sm:p-12">
        Em breve — esta página será construída nas próximas fases.
      </div>
    </section>
  )
}
