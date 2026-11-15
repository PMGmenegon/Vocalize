import type { ReactNode } from 'react'
import ExpandCard from '../ExpandCard'
import HomeSection from './HomeSection'
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
    description: 'Restaurante, entrevista, aeroporto, hotel, compras e bate-papo por mensagens de voz.',
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
    <HomeSection id="funcionalidades" eyebrow="Funcionalidades" title="O essencial do Vocalize" description="Toque em “Saiba mais” para ver os detalhes de cada uma.">
      <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <ExpandCard key={f.title} icon={f.icon} title={f.title} summary={f.description} details={f.details} delay={(i % 3) * 90} />
        ))}
      </ul>
    </HomeSection>
  )
}
