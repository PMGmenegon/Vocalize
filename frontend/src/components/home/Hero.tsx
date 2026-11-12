import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ACCENTS, type Accent } from '../../theme/accents'
import { MODE_COPY } from '../../theme/modeCopy'
import { useTheme } from '../../theme/useTheme'
import { Flag } from '../Flags'
import Typewriter from '../Typewriter'
import SoundStage from './SoundStage'

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/** Topo da landing: nome, frase principal, palco sonoro interativo e botão "Começar". */
export default function Hero() {
  const { accent, setAccent } = useTheme()
  const copy = MODE_COPY[accent]
  const other: Accent = accent === 'us' ? 'uk' : 'us'

  return (
    <section className="hero-glow relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
        <div>
          <h1 className="rise">
            <span className="block text-sm font-black tracking-[0.3em] text-brand">VOCALIZE</span>
            <span className="mt-3 block text-4xl leading-tight font-black text-ink sm:text-5xl lg:text-6xl">
              Aprenda inglês <span className="hl">ouvindo</span>, não lendo.
            </span>
          </h1>

          <p
            lang="en"
            className="rise mt-6 min-h-9 text-2xl font-black text-brand sm:min-h-10 sm:text-3xl"
            style={delay(120)}
          >
            <Typewriter key={accent} text={copy.tagline} />
          </p>
          <p className="rise text-sm text-muted" style={delay(200)}>
            {copy.taglineTranslation}
          </p>

          <p className="rise mt-6 max-w-xl text-lg text-muted" style={delay(260)}>
            A IA fala em áudio, com o texto escondido. Você escreve o que entendeu, vê seus erros palavra por
            palavra e responde para manter a conversa.
          </p>

          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={delay(360)}>
            <Link
              to="/app"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-base font-bold text-on-brand shadow-lg transition-all hover:bg-brand-strong active:scale-95"
            >
              Começar
              <Arrow />
            </Link>
            <button
              type="button"
              onClick={() => setAccent(other)}
              className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border-2 border-control px-5 text-base font-bold text-brand transition-all hover:bg-surface active:scale-95"
            >
              <Flag accent={other} />
              Mudar para {ACCENTS[other].short}
            </button>
          </div>
        </div>

        <div className="rise" style={delay(240)}>
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
