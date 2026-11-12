import type { ReactNode } from 'react'
import ExpandCard from '../ExpandCard'
import { ChartIcon, CheckNoteIcon, DictationIcon, GlobeIcon, PinIcon, StairsIcon } from '../icons'

interface Feature {
  title: string
  description: string
  details: string
  icon: ReactNode
}

const FEATURES: readonly Feature[] = [
  {
    title: 'Diálogos em cenários reais',
    description: 'Restaurante, entrevista, aeroporto, hotel, compras e small talk.',
    details:
      'Você escolhe um cenário e a IA conversa com você como se fosse a situação real, adaptando as falas ao seu nível.',
    icon: <PinIcon />,
  },
  {
    title: 'Ditado palavra por palavra',
    description: 'Escreva o que ouviu e veja cada palavra certa ou errada.',
    details:
      'A IA fala uma frase, você digita e o app marca onde o ouvido falhou, palavra por palavra.',
    icon: <DictationIcon />,
  },
  {
    title: 'Sotaque americano ou britânico',
    description: 'Voz, vocabulário e grafia acompanham o modo escolhido.',
    details:
      'No modo americano você ouve elevator e color; no britânico, lift e colour. A voz também muda.',
    icon: <GlobeIcon />,
  },
  {
    title: 'Responda e seja corrigido',
    description: 'Digite ou fale, e entenda os erros com explicação em português.',
    details:
      'O reconhecimento de voz depende do navegador (o Chrome costuma funcionar melhor). Digitando, funciona em qualquer um.',
    icon: <CheckNoteIcon />,
  },
  {
    title: 'Níveis de A2 a C1',
    description: 'Velocidade e vocabulário se adaptam, com sugestão de subir de nível.',
    details:
      'Quando seus acertos se mantêm altos, o Vocalize sugere avançar. A decisão é sempre sua.',
    icon: <StairsIcon />,
  },
  {
    title: 'Progresso e revisão',
    description: 'Estatísticas, sequência de dias e flashcards dos seus erros.',
    details:
      'Veja seu acerto ao longo do tempo e os erros mais comuns. As palavras erradas voltam como flashcards, com repetição espaçada.',
    icon: <ChartIcon />,
  },
]

/** Grade de funcionalidades. */
export default function Features() {
  return (
    <section id="funcionalidades" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-black text-ink sm:text-4xl">Funcionalidades</h2>
      <p className="mt-3 max-w-2xl text-muted">O essencial do Vocalize. Clique em um cartão para saber mais.</p>

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
