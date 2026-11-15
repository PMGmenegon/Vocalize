import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ACCENTS, type Accent } from '../../theme/accents'
import { useTheme } from '../../theme/useTheme'
import { Flag } from '../Flags'
import SoundStage from './SoundStage'

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/** Topo da landing: nome, frase principal, palco sonoro interativo e botão "Começar". */
export default function Hero() {
  const { accent, setAccent } = useTheme()
  const other: Accent = accent === 'us' ? 'uk' : 'us'

  return (
    <section aria-labelledby="hero-titulo">
      <div className="mx-auto grid max-w-6xl items-center gap-x-16 gap-y-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-24">
        <div>
          <p className="type-eyebrow rise text-brand">Vocalize · treino de escuta</p>
          <h1 id="hero-titulo" className="type-display rise mt-3 text-5xl sm:text-6xl lg:text-7xl" style={delay(80)}>
            Aprenda inglês <span className="hl">ouvindo</span>, não lendo.
          </h1>

          <p className="rise mt-6 max-w-xl text-lg text-muted" style={delay(180)}>
            A voz fala, com o texto escondido. Você escreve o que entendeu, vê seus erros palavra por palavra e responde para manter a conversa.
          </p>

          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={delay(280)}>
            <Link
              to="/cadastro"
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand px-8 py-3 text-lg font-bold text-on-brand transition-colors hover:bg-brand-strong"
            >
              Começar
              <Arrow />
            </Link>
            <button
              type="button"
              onClick={() => setAccent(other)}
              className="inline-flex min-h-14 cursor-pointer items-center gap-2 rounded-xl border-2 border-control bg-card px-6 text-lg font-bold text-link transition-colors hover:bg-surface"
            >
              <Flag accent={other} />
              Mudar para {ACCENTS[other].short}
            </button>
          </div>
        </div>

        <div className="rise" style={delay(220)}>
          <SoundStage key={accent} />
        </div>
      </div>
    </section>
  )
}

/** Seta que avança um pouco quando o botão pai (class "group") recebe o mouse. */
export function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
