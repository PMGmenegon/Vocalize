import type { ReactNode } from 'react'
import ExpandCard from '../ExpandCard'
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
  details: string
  icon: ReactNode
}

const FEATURES: readonly Feature[] = [
  {
    title: 'Diálogos com IA em cenários reais',
    details:
      'Você escolhe um cenário, como pedir comida ou fazer check-in, e a IA conversa com você como se fosse a situação real, adaptando as falas ao seu nível.',
    description: 'Restaurante, entrevista de emprego, aeroporto, hotel, compras e small talk.',
    icon: <PinIcon />,
  },
  {
    title: 'Ditado palavra por palavra',
    details:
      'A IA fala uma frase, você digita o que ouviu e o app marca cada palavra certa ou errada, para você ver exatamente onde o ouvido falhou.',
    description: 'Você escreve o que ouviu e vê cada palavra certa ou errada.',
    icon: <DictationIcon />,
  },
  {
    title: 'Sotaque americano ou britânico',
    details:
      'Com o modo americano ou britânico, a voz, o vocabulário (elevator ou lift) e a grafia (color ou colour) acompanham a sua escolha.',
    description: 'Escolha o modo e treine o ouvido com a voz e o vocabulário dele.',
    icon: <GlobeIcon />,
  },
  {
    title: 'Responda digitando ou falando',
    details:
      'Responda pelo teclado ou pelo microfone. O reconhecimento de voz depende do navegador; o Chrome costuma funcionar melhor.',
    description: 'Use o teclado ou o microfone, como for melhor para você.',
    icon: <KeyboardIcon />,
  },
  {
    title: 'Correção com explicação em português',
    details:
      'Depois de responder, você vê o que ajustar e uma explicação em português, para entender o motivo do erro e não só a versão certa.',
    description: 'Suas respostas são corrigidas e você entende o porquê.',
    icon: <CheckNoteIcon />,
  },
  {
    title: 'Níveis de A2 a C1',
    details:
      'Do A2 ao C1, a velocidade da fala, o tamanho das frases e as palavras usadas mudam conforme o nível que você escolher.',
    description: 'Velocidade da fala e vocabulário se adaptam ao seu nível.',
    icon: <StairsIcon />,
  },
  {
    title: 'Sugestão de subir de nível',
    details:
      'Quando seus acertos se mantêm altos, o Vocalize sugere subir de nível. A decisão de avançar é sempre sua.',
    description: 'Com base no seu desempenho, indicamos a hora de avançar.',
    icon: <TrendUpIcon />,
  },
  {
    title: 'Estatísticas',
    details:
      'Gráficos mostram seu acerto ao longo do tempo, os erros que mais se repetem e quantos dias seguidos você praticou.',
    description: 'Acerto ao longo do tempo, erros mais comuns e sequência de dias.',
    icon: <ChartIcon />,
  },
  {
    title: 'Revisão com flashcards',
    details:
      'As palavras que você errou viram flashcards e voltam em intervalos cada vez maiores (repetição espaçada), até ficarem fixas.',
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
        {FEATURES.map((f, i) => (
          <ExpandCard
            key={f.title}
            icon={f.icon}
            title={f.title}
            summary={f.description}
            details={f.details}
            delay={(i % 3) * 90}
          />
        ))}
      </ul>
    </section>
  )
}
