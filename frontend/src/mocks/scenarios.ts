import type { Scenario } from '../types'

export const SCENARIOS: Scenario[] = [
  { id: 'restaurant', title: 'Restaurante', description: 'Peça a mesa, escolha o prato e converse com o garçom.' },
  { id: 'job-interview', title: 'Entrevista de emprego', description: 'Apresente-se e responda perguntas sobre sua experiência.' },
  { id: 'airport', title: 'Aeroporto', description: 'Faça check-in, passe pela segurança e encontre o portão.' },
  { id: 'hotel', title: 'Hotel', description: 'Faça a reserva, o check-in e peça ajuda à recepção.' },
  { id: 'shopping', title: 'Compras', description: 'Pergunte preços, tamanhos e troque um produto.' },
  { id: 'small-talk', title: 'Small talk', description: 'Bata papo leve com um colega ou um desconhecido.' },
]
