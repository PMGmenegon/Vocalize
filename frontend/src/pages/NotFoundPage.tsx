import Button from '../components/ui/Button'

/** Rota desconhecida. */
export default function NotFoundPage() {
  return (
    <section aria-labelledby="erro-titulo" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="type-eyebrow text-brand">Erro 404</p>
      <h1 id="erro-titulo" className="type-display mt-2 text-4xl sm:text-5xl">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-xl text-lg text-muted">O endereço que você tentou abrir não existe ou foi movido.</p>
      <div className="mt-8 border-t border-line pt-6">
        <Button to="/" size="lg" className="px-8">
          Voltar ao início
        </Button>
      </div>
    </section>
  )
}
