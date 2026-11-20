import type { ReactNode } from 'react'
import ExpandCard from '../ExpandCard'
import type { Theme } from '../../theme/themes'
import { useTheme } from '../../theme/useTheme'
import { ChatIcon, HeadphonesIcon, PencilIcon } from '../icons'
import HomeSection from './HomeSection'

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
    description: 'A voz fala em inglês e o texto fica escondido. Você treina o ouvido de verdade.',
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
      'Depois da correção, você responde por texto e a conversa segue, sempre com a correção e uma explicação em português.',
    description: 'Responda por texto. A correção vem com explicação e a conversa continua.',
    icon: <ChatIcon />,
  },
]

interface Round {
  before: string
  wrong: string
  after: string
  right: string
  reply: string
  explanation: string
}

/** Exemplo de rodada; a palavra muda conforme o modo (check/bill). */
const ROUNDS: Record<Theme, Round> = {
  us: {
    before: 'Could we get the',
    wrong: 'chick',
    after: ', please?',
    right: 'check',
    reply: 'Sure! Here is the check. Take your time.',
    explanation: '"check" é a conta, no inglês americano. "chick" (pintinho) soa quase igual.',
  },
  uk: {
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
  const { theme } = useTheme()
  const round = ROUNDS[theme]

  return (
    <HomeSection id="como-funciona" eyebrow="Como funciona" title="Três passos por rodada" description="Poucos minutos por dia já ajudam.">
      <ol className="grid gap-x-12 gap-y-10 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <ExpandCard key={step.title} icon={step.icon} title={step.title} summary={step.description} details={step.details} eyebrow={`Passo ${i + 1}`} delay={i * 100} />
        ))}
      </ol>

      <div className="mt-16">
        <h3 className="type-eyebrow border-b border-ink pb-2">Exemplo de uma rodada</h3>
        <ol className="grid gap-x-12 gap-y-8 pt-6 lg:grid-cols-3">
          <li>
            <p className="flex items-center gap-2 font-black text-brand">
              <HeadphonesIcon className="h-5 w-5" /> 1. A voz fala
            </p>
            <p className="mt-3 text-ink">Você ouve a frase em áudio, sem ver o texto.</p>
          </li>

          <li>
            <p className="flex items-center gap-2 font-black text-brand">
              <PencilIcon className="h-5 w-5" /> 2. Você transcreve
            </p>
            <p lang="en" className="mt-3 text-lg text-ink">
              {round.before}{' '}
              <span className="rounded bg-danger px-1.5 font-bold text-on-danger underline decoration-wavy">{round.wrong}</span>
              <span className="sr-only"> (errado)</span>
              {round.after}
            </p>
            <p className="mt-2 text-sm text-muted">A palavra errada fica destacada.</p>
          </li>

          <li>
            <p className="flex items-center gap-2 font-black text-brand">
              <ChatIcon className="h-5 w-5" /> 3. Correção e resposta
            </p>
            <p lang="en" className="mt-3 text-lg text-ink">
              {round.before}{' '}
              <span className="rounded bg-ok px-1.5 font-bold text-on-ok">{round.right}</span>
              <span className="sr-only"> (correto)</span>
              {round.after}
            </p>
            <p className="mt-2 text-sm text-muted">{round.explanation}</p>
            <p lang="en" className="mt-3 border-l-2 border-line pl-3 text-sm text-ink">
              {round.reply}
            </p>
          </li>
        </ol>
      </div>
    </HomeSection>
  )
}
