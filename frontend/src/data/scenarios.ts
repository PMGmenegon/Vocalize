import type { Accent, Scenario, ScenarioId } from '../types'

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
  /** Papel na cena, em português ("Garçom"). */
  role: string
  /** Nome do lugar, em português, para a barra do chat ("Diner americano"). */
  place: string
  avatar: AvatarSpec
}

/** Cenários disponíveis (conteúdo fixo do app, não depende de backend). */
export const SCENARIOS: Scenario[] = [
  { id: 'restaurant', title: 'Restaurante', description: 'Peça a mesa, escolha o prato e converse com o garçom.' },
  { id: 'job-interview', title: 'Entrevista de emprego', description: 'Apresente-se e responda perguntas sobre sua experiência.' },
  { id: 'airport', title: 'Aeroporto', description: 'Faça check-in, passe pela segurança e encontre o portão.' },
  { id: 'hotel', title: 'Hotel', description: 'Faça a reserva, o check-in e peça ajuda à recepção.' },
  { id: 'shopping', title: 'Compras', description: 'Pergunte preços, tamanhos e troque um produto.' },
  { id: 'small-talk', title: 'Small talk', description: 'Bata papo leve com um colega ou um desconhecido.' },
]

/** Quem conversa com o usuário em cada cenário, por sotaque. */
export const CHARACTERS: Record<ScenarioId, Record<Accent, Character>> = {
  restaurant: {
    'en-US': { name: 'Mike', role: 'Garçom', place: 'Diner americano', avatar: { skin: '#e8b98f', hair: '#4a3222', hairStyle: 'short', outfit: '#b22234', accessory: 'bowtie' } },
    'en-GB': { name: 'Oliver', role: 'Barman', place: 'Pub britânico', avatar: { skin: '#f1c9a5', hair: '#a8552b', hairStyle: 'wavy', outfit: '#2f4a3a', accessory: 'apron' } },
  },
  'job-interview': {
    'en-US': { name: 'Sarah', role: 'Recrutadora', place: 'Escritório em Nova York', avatar: { skin: '#c98e64', hair: '#2b1d16', hairStyle: 'long', outfit: '#3c3b6e', accessory: 'badge' } },
    'en-GB': { name: 'James', role: 'Recrutador', place: 'Escritório em Londres', avatar: { skin: '#f1c9a5', hair: '#5b4636', hairStyle: 'short', outfit: '#012169', accessory: 'tie' } },
  },
  airport: {
    'en-US': { name: 'Carla', role: 'Agente de check-in', place: 'Aeroporto americano', avatar: { skin: '#d9a47c', hair: '#1f1612', hairStyle: 'bun', outfit: '#1d4f8f', accessory: 'scarf' } },
    'en-GB': { name: 'Priya', role: 'Agente de embarque', place: 'Aeroporto britânico', avatar: { skin: '#b9835c', hair: '#15100d', hairStyle: 'long', outfit: '#012169', accessory: 'scarf' } },
  },
  hotel: {
    'en-US': { name: 'Daniel', role: 'Concierge', place: 'Hotel americano', avatar: { skin: '#a96f4b', hair: '#1a120d', hairStyle: 'short', outfit: '#7a1f2b', accessory: 'vest' } },
    'en-GB': { name: 'Margaret', role: 'Recepcionista', place: 'Hotel clássico britânico', avatar: { skin: '#f3d2b3', hair: '#b9b4ad', hairStyle: 'bun', outfit: '#1c3557', accessory: 'badge' } },
  },
  shopping: {
    'en-US': { name: 'Jenna', role: 'Vendedora', place: 'Shopping center', avatar: { skin: '#f1c9a5', hair: '#c79a3b', hairStyle: 'long', outfit: '#e0566b', accessory: 'badge' } },
    'en-GB': { name: 'Harry', role: 'Atendente da loja', place: 'High street', avatar: { skin: '#e8b98f', hair: '#6b3f26', hairStyle: 'short', outfit: '#7d3b3b', accessory: 'apron' } },
  },
  'small-talk': {
    'en-US': { name: 'Chloe', role: 'Dona do food truck', place: 'Parque com food truck', avatar: { skin: '#e8b98f', hair: '#7a3b1e', hairStyle: 'cap', outfit: '#e4872c', accessory: 'apron' } },
    'en-GB': { name: 'Edward', role: 'Dono do café', place: 'Parque com café e coreto', avatar: { skin: '#f1c9a5', hair: '#8c8c8c', hairStyle: 'bald', outfit: '#3d6b5a', accessory: 'glasses' } },
  },
}

export const characterFor = (scenarioId: ScenarioId, accent: Accent): Character => CHARACTERS[scenarioId][accent]
