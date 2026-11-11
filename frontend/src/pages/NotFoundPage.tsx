import { Link } from 'react-router-dom'

/** Rota desconhecida. */
export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-bold tracking-widest text-accent uppercase">Erro 404</p>
      <h1 className="mt-3 text-4xl font-black text-ink">Página não encontrada</h1>
      <p className="mt-3 text-muted">O endereço que você tentou abrir não existe.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-brand px-7 py-3.5 font-bold text-on-brand transition-colors hover:bg-brand-strong"
      >
        Voltar ao início
      </Link>
    </section>
  )
}
