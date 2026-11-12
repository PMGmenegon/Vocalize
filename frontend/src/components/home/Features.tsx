import type { ReactNode } from 'react'
import {
  CardsIcon,
  ChartIcon,
  CheckNoteIcon,
  DictationIcon,
  GlobeIcon,
  KeyboardIcon,
  PinIcon,
  StairsIcon,
  TrendUpIcon,
} from '../icons'

interface Feature {
  title: string
  description: string
  icon: ReactNode
}

const FEATURES: readonly Feature[] = [
  {
    title: 'Diálogos com IA em cenários reais',
    description: 'Restaurante, entrevista de emprego, aeroporto, hotel, compras e small talk.',
    icon: <PinIcon />,
  },
  {
    title: 'Ditado palavra por palavra',
    description: 'Você escreve o que ouviu e vê cada palavra certa ou errada.',
    icon: <DictationIcon />,
  },
  {
    title: 'Sotaque americano ou britânico',
    description: 'Escolha o modo e treine o ouvido com a voz e o vocabulário dele.',
    icon: <GlobeIcon />,
  },
  {
    title: 'Responda digitando ou falando',
    description: 'Use o teclado ou o microfone, como for melhor para você.',
    icon: <KeyboardIcon />,
  },
  {
    title: 'Correção com explicação em português',
    description: 'Suas respostas são corrigidas e você entende o porquê.',
    icon: <CheckNoteIcon />,
  },
  {
    title: 'Níveis de A2 a C1',
    description: 'Velocidade da fala e vocabulário se adaptam ao seu nível.',
    icon: <StairsIcon />,
  },
  {
    title: 'Sugestão de subir de nível',
    description: 'Com base no seu desempenho, indicamos a hora de avançar.',
    icon: <TrendUpIcon />,
  },
  {
    title: 'Estatísticas',
    description: 'Acerto ao longo do tempo, erros mais comuns e sequência de dias.',
    icon: <ChartIcon />,
  },
  {
    title: 'Revisão com flashcards',
    description: 'As palavras que você errou voltam com repetição espaçada.',
    icon: <CardsIcon />,
  },
]

/** Grade de funcionalidades. */
export default function Features() {
  return (
    <section id="funcionalidades" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-black text-ink sm:text-4xl">Funcionalidades</h2>
      <p className="mt-3 max-w-2xl text-muted">Tudo o que o Vocalize foi pensado para oferecer.</p>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <li key={f.title} className="rounded-2xl border border-line bg-surface p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-on-brand">
              {f.icon}
            </span>
            <h3 className="mt-4 text-lg font-black text-ink">{f.title}</h3>
            <p className="mt-1 text-muted">{f.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
