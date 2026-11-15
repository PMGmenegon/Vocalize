import { ACCENT_LABEL } from '../lib/format'
import type { Choice } from '../components/ui/ChoiceGroup'
import type { Accent, Level } from '../types'

export const LEVEL_OPTIONS: Choice<Level>[] = [
  { value: 'A2', label: 'A2 · Básico', description: 'Entendo frases simples e situações do dia a dia.' },
  { value: 'B1', label: 'B1 · Intermediário', description: 'Me viro em viagens e acompanho conversas sobre temas conhecidos.' },
  { value: 'B2', label: 'B2 · Intermediário avançado', description: 'Converso com fluência sobre vários assuntos e entendo textos longos.' },
  { value: 'C1', label: 'C1 · Avançado', description: 'Uso o inglês com naturalidade no trabalho e nos estudos.' },
]

export const ACCENT_OPTIONS: Choice<Accent>[] = [
  { value: 'en-US', label: ACCENT_LABEL['en-US'], description: 'Sotaque dos Estados Unidos. Tema vermelho.' },
  { value: 'en-GB', label: ACCENT_LABEL['en-GB'], description: 'Sotaque do Reino Unido. Tema azul-marinho.' },
]

/** Frase do resultado do teste de nivelamento, por nível. */
export const LEVEL_VERDICT: Record<Level, string> = {
  A2: 'Você entende e usa frases simples do dia a dia. É um ótimo ponto de partida para treinar o ouvido com calma.',
  B1: 'Você se vira em situações comuns e acompanha conversas sobre temas conhecidos. Agora é hora de ganhar velocidade e vocabulário.',
  B2: 'Você entende bem textos e conversas mais longos e usa estruturas variadas. O foco agora é nuance, sotaque e fala natural.',
  C1: 'Você usa o inglês com naturalidade e domina estruturas complexas. Vamos afinar o ouvido para ritmos e sotaques mais desafiadores.',
}
