import type { ReactNode } from 'react'
import ExpandCard from '../ExpandCard'
import type { Accent } from '../../theme/accents'
import { useTheme } from '../../theme/useTheme'
import { ChatIcon, HeadphonesIcon, PencilIcon } from '../icons'

interface Step {
  title: string
  description: string
  details: string
  icon: ReactNode
}

const STEPS: readonly Step[] = [
  {
    title: 'Ouvir',
    details:
      'O texto fica escondido de propósito: assim você treina o ouvido, e não a leitura. Dá para ouvir de novo e também em velocidade menor.',
    description: 'A IA fala em inglês e o texto fica escondido. Você treina o ouvido de verdade.',
    icon: <HeadphonesIcon />,
  },
  {
    title: 'Transcrever',
    details:
      'Você digita a frase. A comparação é palavra por palavra: o que acertou aparece em verde, e o que errou ou faltou aparece em vermelho.',
    description: 'Digite o que ouviu. Comparamos palavra por palavra e mostramos onde errou.',
    icon: <PencilIcon />,
  },
  {
    title: 'Responder',
    details:
      'Depois da correção, você responde à IA por texto ou voz e a conversa segue, sempre com a correção e uma explicação em português.',
    description: 'Responda por texto ou voz. A IA corrige e a conversa continua.',
    icon: <ChatIcon />,
  },
]

interface Round {
  said: string
  before: string
  wrong: string
  after: string
  right: string
  reply: string
  explanation: string
}

/** Exemplo de rodada; a palavra muda conforme o modo (check/bill). */
const ROUNDS: Record<Accent, Round> = {
  us: {
    said: 'Could we get the check, please?',
    before: 'Could we get the',
    wrong: 'chick',
    after: ', please?',
    right: 'check',
    reply: 'Sure! Here is the check. Take your time.',
    explanation: '"check" é a conta, no inglês americano. "chick" (pintinho) soa quase igual.',
  },
  uk: {
    said: 'Could we have the bill, please?',
    before: 'Could we have the',
    wrong: 'bell',
    after: ', please?',
    right: 'bill',
    reply: 'Of course. Here is the bill. Take your time.',
    explanation: '"bill" é a conta, no inglês britânico. "bell" (sino) soa parecido.',
  },
}

/** Os 3 passos e um exemplo visual de uma rodada. */
export default function HowItWorks() {
  const { accent } = useTheme()
  const round = ROUNDS[accent]

  return (
    <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-black text-ink sm:text-4xl">Como funciona</h2>
      <p className="mt-3 max-w-2xl text-muted">Cada rodada tem três passos. Poucos minutos por dia já ajudam.</p>

      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <ExpandCard
            key={step.title}
            icon={step.icon}
            title={step.title}
            summary={step.description}
            details={step.details}
            eyebrow={`Passo ${i + 1}`}
            delay={i * 120}
          />
        ))}
      </ol>

      <div className="mt-10">
        <h3 className="text-lg font-black text-ink">Exemplo de uma rodada</h3>
        <ol className="mt-5 grid gap-4 lg:grid-cols-3">
          <li className="rounded-xl bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-accent">
              <HeadphonesIcon className="h-5 w-5" /> 1. A IA fala
            </p>
            <p className="mt-3 text-ink">
              Você ouve a frase em áudio, sem ver o texto.
            </p>
          </li>

          <li className="rounded-xl bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-accent">
              <PencilIcon className="h-5 w-5" /> 2. Você transcreve
            </p>
            <p lang="en" className="mt-3 text-ink">
              {round.before}{' '}
              <span className="rounded bg-danger px-1.5 font-bold text-on-danger underline decoration-wavy">
                {round.wrong}
              </span>
              <span className="sr-only"> (errado)</span>
              {round.after}
            </p>
            <p className="mt-2 text-sm text-muted">A palavra errada fica destacada.</p>
          </li>

          <li className="rounded-xl bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-accent">
              <ChatIcon className="h-5 w-5" /> 3. Correção e resposta
            </p>
            <p lang="en" className="mt-3 text-ink">
              {round.before}{' '}
              <span className="rounded bg-ok px-1.5 font-bold text-on-ok">{round.right}</span>
              <span className="sr-only"> (correto)</span>
              {round.after}
            </p>
            <p className="mt-2 text-sm text-muted">{round.explanation}</p>
            <p lang="en" className="mt-3 rounded-lg bg-canvas p-2 text-sm text-ink">
              {round.reply}
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}
