import { Link } from 'react-router-dom'

/** Chamada final antes do rodapé. */
export default function FinalCta() {
  return (
    <section className="surface-brand bg-brand text-on-brand">
      <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-16">
        <h2 className="text-3xl font-black sm:text-4xl">Pronto para ouvir de verdade?</h2>
        <p className="mx-auto mt-3 max-w-xl text-on-brand-soft">Escolha seu sotaque e comece sua primeira rodada.</p>
        <Link
          to="/app"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-on-brand px-8 py-3.5 text-base font-bold text-brand shadow-lg transition-colors hover:bg-on-brand-soft"
        >
          Começar
        </Link>
      </div>
    </section>
  )
}
