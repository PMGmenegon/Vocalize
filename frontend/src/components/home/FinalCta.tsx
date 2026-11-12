import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { Arrow } from './Hero'

/** Chamada final antes do rodapé. */
export default function FinalCta() {
  return (
    <section className="surface-brand bg-brand text-on-brand">
      <Reveal className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-16">
        <h2 className="text-3xl font-black sm:text-4xl">Pronto para ouvir de verdade?</h2>
        <p className="mx-auto mt-3 max-w-xl text-on-brand-soft">Escolha seu sotaque e comece sua primeira rodada.</p>
        <Link
          to="/cadastro"
          className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-on-brand px-8 py-3.5 text-base font-bold text-brand shadow-lg transition-all hover:bg-on-brand-soft active:scale-95"
        >
          Começar
          <Arrow />
        </Link>
      </Reveal>
    </section>
  )
}
