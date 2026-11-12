import { Link } from 'react-router-dom'
import { MODE_COPY } from '../../theme/modeCopy'
import { useTheme } from '../../theme/useTheme'

/** Topo da landing: nome, frase principal, frase do modo e botão "Começar". */
export default function Hero() {
  const { accent } = useTheme()
  const copy = MODE_COPY[accent]

  return (
    <section className="surface-brand relative isolate overflow-hidden bg-brand text-on-brand">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
        <div>
          <h1>
            <span className="block text-sm font-black tracking-[0.3em] text-on-brand-soft">VOCALIZE</span>
            <span className="mt-3 block text-4xl leading-tight font-black sm:text-5xl">
              Aprenda inglês ouvindo, não lendo.
            </span>
          </h1>

          <div className="mt-6 border-l-4 border-on-brand pl-4">
            <p lang="en" className="text-2xl font-black sm:text-3xl">
              {copy.tagline}
            </p>
            <p className="mt-1 text-sm text-on-brand-soft">{copy.taglineTranslation}</p>
          </div>

          <p className="mt-6 max-w-xl text-lg text-on-brand-soft">
            A IA fala em áudio, com o texto escondido. Você escreve o que entendeu, vê seus erros palavra por
            palavra e responde para manter a conversa.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/app"
              className="inline-flex items-center justify-center rounded-xl bg-on-brand px-7 py-3.5 text-base font-bold text-brand shadow-lg transition-colors hover:bg-on-brand-soft"
            >
              Começar
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-xl border-2 border-on-brand px-7 py-3 text-base font-bold text-on-brand transition-colors hover:bg-on-brand/10"
            >
              Como funciona
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
