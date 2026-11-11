import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChatIcon, HeadphonesIcon, PencilIcon } from '../components/icons'

interface Step {
  title: string
  description: string
  icon: ReactNode
}

const STEPS: readonly Step[] = [
  {
    title: 'Ouvir',
    description:
      'A IA fala em inglês e o texto fica escondido. Você treina o ouvido de verdade, sem apoio da leitura.',
    icon: <HeadphonesIcon />,
  },
  {
    title: 'Transcrever',
    description:
      'Digite exatamente o que ouviu. Comparamos palavra por palavra e mostramos onde você errou.',
    icon: <PencilIcon />,
  },
  {
    title: 'Responder',
    description:
      'Responda por texto ou voz. A IA corrige o que for preciso e a conversa continua de onde parou.',
    icon: <ChatIcon />,
  },
]

/** Página inicial pública: o que é o Vocalize, como funciona e botão "Começar". */
export default function HomePage() {
  const { hash } = useLocation()

  // Links como "/#como-funciona" navegam sem recarregar; rolamos até a âncora manualmente.
  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <>
      <section className="surface-brand relative isolate overflow-hidden bg-brand text-on-brand">
        <div className="hero-deco absolute inset-0 -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <p className="text-sm font-bold uppercase tracking-widest text-on-brand-soft">
            Listening + diálogo com IA
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-black sm:text-5xl lg:text-6xl">
            Aprenda inglês ouvindo, não lendo.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-on-brand-soft">
            O Vocalize toca a fala da IA em áudio, com o texto escondido. Você escreve o que entendeu,
            vê seus erros palavra por palavra e responde para manter a conversa viva.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
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
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-3xl font-black text-ink sm:text-4xl">Como funciona</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Cada rodada tem três passos. Em poucos minutos por dia, seu ouvido e sua escrita evoluem juntos.
        </p>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-on-brand">
                  {step.icon}
                </span>
                <span className="text-sm font-bold tracking-widest text-accent uppercase">Passo {i + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-black text-ink">{step.title}</h3>
              <p className="mt-2 text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-line bg-surface p-8 sm:p-10">
          <h2 className="text-2xl font-black text-ink sm:text-3xl">Americano ou britânico?</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Use o seletor <strong className="text-ink">US / UK</strong> no cabeçalho para escolher o
            sotaque de estudo. O visual do app acompanha: vermelho e estrelas no modo americano,
            azul-marinho e a cruz da Union Jack no britânico.
          </p>
          <Link
            to="/app"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-7 py-3.5 text-base font-bold text-on-brand transition-colors hover:bg-brand-strong"
          >
            Começar
          </Link>
        </div>
      </section>
    </>
  )
}
