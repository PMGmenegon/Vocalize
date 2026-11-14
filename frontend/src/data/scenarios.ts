import type { Accent, PracticeLayout, Scenario, ScenarioId } from '../types'

/** Aparência de um avatar ilustrado (desenhado em src/components/chat/Avatar.tsx). */
export interface AvatarSpec {
  skin: string
  hair: string
  hairStyle: 'short' | 'long' | 'bun' | 'cap' | 'bald' | 'wavy'
  outfit: string
  accessory?: 'apron' | 'tie' | 'vest' | 'glasses' | 'bowtie' | 'scarf' | 'badge'
}

export interface Character {
  name: string
  /** Papel na situação, em português ("Garçom"). */
  role: string
  /** Nome do lugar, em português ("Diner americano"). */
  place: string
  avatar: AvatarSpec
}

/** Limite padrão de rodadas por sessão (a sessão também termina quando o usuário encerra). */
export const DEFAULT_MAX_TURNS = 8

/**
 * Tudo o que define uma situação de listening fica aqui. Para criar uma situação nova
 * basta acrescentar um item a SITUATIONS e um banco de falas em src/mocks (a tela de
 * prática escolhe o layout pelo campo `layout`; nenhum componente precisa mudar).
 */
export interface Situation extends Scenario {
  byAccent: Record<Accent, { character: Character; intro: string }>
}

export const SITUATIONS: Situation[] = [
  {
    id: 'restaurant', title: 'Restaurante', description: 'Peça a mesa, escolha o prato e converse com o garçom.', icon: 'utensils', layout: 'training',
    byAccent: {
      'en-US': { intro: 'Você está num diner em Nova York. O garçom Mike vai atender você.', character: { name: 'Mike', role: 'Garçom', place: 'Diner americano', avatar: { skin: '#e8b98f', hair: '#4a3222', hairStyle: 'short', outfit: '#b22234', accessory: 'bowtie' } } },
      'en-GB': { intro: 'Você está num pub em Londres. O barman Oliver vai atender você.', character: { name: 'Oliver', role: 'Barman', place: 'Pub britânico', avatar: { skin: '#f1c9a5', hair: '#a8552b', hairStyle: 'wavy', outfit: '#2f4a3a', accessory: 'apron' } } },
    },
  },
  {
    id: 'street', title: 'Conversa na rua', description: 'Peça informação e converse com alguém que você encontra na rua.', icon: 'pin', layout: 'training',
    byAccent: {
      'en-US': { intro: 'Você está numa calçada no centro de Chicago e uma moradora, a Chloe, para para conversar.', character: { name: 'Chloe', role: 'Moradora', place: 'Rua em Chicago', avatar: { skin: '#e8b98f', hair: '#7a3b1e', hairStyle: 'cap', outfit: '#e4872c', accessory: 'scarf' } } },
      'en-GB': { intro: 'Você está na high street de uma cidade inglesa e um morador, o Edward, para para conversar.', character: { name: 'Edward', role: 'Morador', place: 'Rua em Manchester', avatar: { skin: '#f1c9a5', hair: '#8c8c8c', hairStyle: 'bald', outfit: '#3d6b5a', accessory: 'glasses' } } },
    },
  },
  {
    id: 'airport', title: 'Aeroporto', description: 'Faça check-in, passe pela segurança e encontre o portão.', icon: 'plane', layout: 'training',
    byAccent: {
      'en-US': { intro: 'Você está no aeroporto de Los Angeles. A agente Carla está no balcão de check-in.', character: { name: 'Carla', role: 'Agente de check-in', place: 'Aeroporto americano', avatar: { skin: '#d9a47c', hair: '#1f1612', hairStyle: 'bun', outfit: '#1d4f8f', accessory: 'scarf' } } },
      'en-GB': { intro: 'Você está no aeroporto de Heathrow. A agente Priya está no balcão de embarque.', character: { name: 'Priya', role: 'Agente de embarque', place: 'Aeroporto britânico', avatar: { skin: '#b9835c', hair: '#15100d', hairStyle: 'long', outfit: '#012169', accessory: 'scarf' } } },
    },
  },
  {
    id: 'hotel', title: 'Hotel', description: 'Faça o check-in, tire dúvidas e peça ajuda à recepção.', icon: 'bed', layout: 'training',
    byAccent: {
      'en-US': { intro: 'Você chegou a um hotel em Miami. O concierge Daniel recebe você na recepção.', character: { name: 'Daniel', role: 'Concierge', place: 'Hotel americano', avatar: { skin: '#a96f4b', hair: '#1a120d', hairStyle: 'short', outfit: '#7a1f2b', accessory: 'vest' } } },
      'en-GB': { intro: 'Você chegou a um hotel clássico em Edimburgo. A recepcionista Margaret recebe você.', character: { name: 'Margaret', role: 'Recepcionista', place: 'Hotel clássico britânico', avatar: { skin: '#f3d2b3', hair: '#b9b4ad', hairStyle: 'bun', outfit: '#1c3557', accessory: 'badge' } } },
    },
  },
  {
    id: 'shopping', title: 'Compras', description: 'Pergunte preços e tamanhos, experimente e pague.', icon: 'bag', layout: 'training',
    byAccent: {
      'en-US': { intro: 'Você está numa loja de roupas num shopping de Dallas. A vendedora Jenna vem atender você.', character: { name: 'Jenna', role: 'Vendedora', place: 'Shopping center', avatar: { skin: '#f1c9a5', hair: '#c79a3b', hairStyle: 'long', outfit: '#e0566b', accessory: 'badge' } } },
      'en-GB': { intro: 'Você está numa loja da high street em Bristol. O atendente Harry vem ajudar você.', character: { name: 'Harry', role: 'Atendente da loja', place: 'High street', avatar: { skin: '#e8b98f', hair: '#6b3f26', hairStyle: 'short', outfit: '#7d3b3b', accessory: 'apron' } } },
    },
  },
  {
    id: 'job-interview', title: 'Entrevista de emprego', description: 'Apresente-se e responda perguntas sobre a sua experiência.', icon: 'briefcase', layout: 'training',
    byAccent: {
      'en-US': { intro: 'Você está num escritório em Nova York para uma entrevista. A recrutadora Sarah conduz a conversa.', character: { name: 'Sarah', role: 'Recrutadora', place: 'Escritório em Nova York', avatar: { skin: '#c98e64', hair: '#2b1d16', hairStyle: 'long', outfit: '#3c3b6e', accessory: 'badge' } } },
      'en-GB': { intro: 'Você está num escritório em Londres para uma entrevista. O recrutador James conduz a conversa.', character: { name: 'James', role: 'Recrutador', place: 'Escritório em Londres', avatar: { skin: '#f1c9a5', hair: '#5b4636', hairStyle: 'short', outfit: '#012169', accessory: 'tie' } } },
    },
  },
  {
    id: 'virtual-chat', title: 'Bate-papo virtual', description: 'Converse por mensagens de voz com um amigo ou colega.', icon: 'chat', layout: 'chat',
    byAccent: {
      'en-US': { intro: 'Sua colega Emily manda mensagens de voz pelo celular. Ouça, transcreva e responda por texto.', character: { name: 'Emily', role: 'Colega de trabalho', place: 'Mensagens', avatar: { skin: '#f1c9a5', hair: '#7a3b1e', hairStyle: 'wavy', outfit: '#3c3b6e' } } },
      'en-GB': { intro: 'Seu amigo Tom manda mensagens de voz pelo celular. Ouça, transcreva e responda por texto.', character: { name: 'Tom', role: 'Amigo', place: 'Mensagens', avatar: { skin: '#e8b98f', hair: '#5b4636', hairStyle: 'short', outfit: '#012169' } } },
    },
  },
]

/** Lista simples (sem os dados por sotaque), usada pela tela de escolha. */
export const SCENARIOS: Scenario[] = SITUATIONS.map(({ id, title, description, icon, layout }) => ({ id, title, description, icon, layout }))

export function situationFor(id: ScenarioId): Situation {
  const found = SITUATIONS.find((s) => s.id === id)
  if (!found) throw new Error(`Situação desconhecida: ${id}`)
  return found
}

export const characterFor = (id: ScenarioId, accent: Accent): Character => situationFor(id).byAccent[accent].character
export const introFor = (id: ScenarioId, accent: Accent): string => situationFor(id).byAccent[accent].intro
export const layoutFor = (id: ScenarioId): PracticeLayout => situationFor(id).layout
