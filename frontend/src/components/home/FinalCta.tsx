import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { Arrow } from './Hero'

/** Chamada final antes do rodapé: linha escura, título e botão. */
export default function FinalCta() {
  return (
    <section aria-labelledby="cta-titulo" className="border-t border-ink">
      <Reveal className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-12 gap-y-6 px-4 py-14 sm:px-6 sm:py-16">
        <div>
          <h2 id="cta-titulo" className="type-display text-3xl sm:text-4xl">
            Pronto para ouvir de verdade?
          </h2>
          <p className="mt-3 text-lg text-muted">Escolha seu sotaque e comece sua primeira rodada.</p>
        </div>
        <Link
          to="/cadastro"
          className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand px-8 py-3 text-lg font-bold text-on-brand transition-colors hover:bg-brand-strong"
        >
          Começar
          <Arrow />
        </Link>
      </Reveal>
    </section>
  )
}
