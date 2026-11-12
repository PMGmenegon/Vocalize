import type { ScenarioId } from '../types'

export interface DialogTurn {
  /** Fala da IA (em inglês). */
  ai: string
  /** Resposta corrigida "de referência" para a pergunta. */
  corrected: string
  explanation: string
  vocabulary: { term: string; meaning: string }[]
}

/** Diálogos falsos (3 rodadas por cenário). O backend com IA substituirá isto. */
export const DIALOGS: Record<ScenarioId, DialogTurn[]> = {
  restaurant: [
    { ai: 'Good evening! Do you have a reservation?', corrected: 'Yes, I have a reservation for two under Silva.', explanation: 'Em inglês, usamos "have a reservation" e a preposição "under" para o nome da reserva.', vocabulary: [{ term: 'reservation', meaning: 'reserva' }, { term: 'under (name)', meaning: 'no nome de' }] },
    { ai: 'Can I get you something to drink while you look at the menu?', corrected: "I'd like a glass of water, please.", explanation: '"I\'d like" é mais educado que "I want" ao pedir algo.', vocabulary: [{ term: "I'd like", meaning: 'eu gostaria' }, { term: 'a glass of', meaning: 'um copo de' }] },
    { ai: 'Are you ready to order?', corrected: "Yes, I'll have the grilled chicken, please.", explanation: 'Para pedir um prato usamos "I\'ll have" (eu vou querer).', vocabulary: [{ term: "I'll have", meaning: 'eu vou querer' }, { term: 'grilled', meaning: 'grelhado' }] },
  ],
  'job-interview': [
    { ai: 'Thank you for coming in today. Could you tell me a little about yourself?', corrected: "Sure. I'm a software developer with five years of experience.", explanation: '"Experience" é incontável neste sentido: diga "five years of experience", sem "an".', vocabulary: [{ term: 'experience', meaning: 'experiência' }, { term: 'developer', meaning: 'desenvolvedor(a)' }] },
    { ai: 'What would you say is your greatest strength?', corrected: 'I think my greatest strength is solving problems under pressure.', explanation: 'Depois de "strength is" use um verbo com -ing: "solving".', vocabulary: [{ term: 'strength', meaning: 'ponto forte' }, { term: 'under pressure', meaning: 'sob pressão' }] },
    { ai: 'Why do you want to work for our company?', corrected: 'I admire your products, and I would love to join your team.', explanation: '"Would love to" soa natural e entusiasmado em entrevistas.', vocabulary: [{ term: 'admire', meaning: 'admirar' }, { term: 'join', meaning: 'juntar-se a' }] },
  ],
  airport: [
    { ai: 'Good morning. May I see your passport, please?', corrected: 'Of course. Here you are.', explanation: '"Here you are" é a forma natural de entregar algo a alguém.', vocabulary: [{ term: 'passport', meaning: 'passaporte' }, { term: 'Here you are', meaning: 'aqui está' }] },
    { ai: 'Would you like a window seat or an aisle seat?', corrected: "I'd prefer a window seat, please.", explanation: '"Prefer" não leva "to" antes do substantivo: "prefer a window seat".', vocabulary: [{ term: 'aisle seat', meaning: 'assento no corredor' }, { term: 'prefer', meaning: 'preferir' }] },
    { ai: 'Your flight leaves from gate twelve. Boarding starts at ten thirty.', corrected: 'Thank you. Where can I find gate twelve?', explanation: 'Para pedir localização use "Where can I find...?".', vocabulary: [{ term: 'gate', meaning: 'portão' }, { term: 'boarding', meaning: 'embarque' }] },
  ],
  hotel: [
    { ai: 'Welcome to the Riverside Hotel. How can I help you?', corrected: "Hi, I'd like to check in. I have a reservation.", explanation: '"Check in" (verbo) vai separado; "check-in" (substantivo) leva hífen.', vocabulary: [{ term: 'check in', meaning: 'fazer check-in' }, { term: 'front desk', meaning: 'recepção' }] },
    { ai: 'How many nights will you be staying with us?', corrected: "I'll be staying for three nights.", explanation: 'Use "for" antes de um período de tempo: "for three nights".', vocabulary: [{ term: 'stay', meaning: 'hospedar-se' }, { term: 'night', meaning: 'noite' }] },
    { ai: 'Your room is on the fifth floor. Is there anything else you need?', corrected: 'Could I have a late checkout, please?', explanation: '"Could I have...?" é um pedido educado e muito usado em hotéis.', vocabulary: [{ term: 'late checkout', meaning: 'saída tardia' }, { term: 'floor', meaning: 'andar' }] },
  ],
  shopping: [
    { ai: 'Hi there! Are you looking for anything in particular?', corrected: "I'm just looking, thanks.", explanation: '"I\'m just looking" é a resposta clássica para recusar ajuda por enquanto.', vocabulary: [{ term: 'in particular', meaning: 'em especial' }, { term: 'just looking', meaning: 'só olhando' }] },
    { ai: 'That jacket comes in small, medium and large.', corrected: 'Do you have this in a medium?', explanation: 'Para perguntar tamanho: "Do you have this in a medium?".', vocabulary: [{ term: 'comes in', meaning: 'vem em (tamanhos)' }, { term: 'medium', meaning: 'médio' }] },
    { ai: 'It is thirty dollars. Would you like to pay by card or cash?', corrected: "I'll pay by card, please.", explanation: 'Use "by" com a forma de pagamento: "by card", "by cash".', vocabulary: [{ term: 'pay by card', meaning: 'pagar com cartão' }, { term: 'cash', meaning: 'dinheiro' }] },
  ],
  'small-talk': [
    { ai: "Hey! How's your week going so far?", corrected: "Pretty good, thanks. It's been a busy week, though.", explanation: '"It\'s been" (present perfect) fala de algo que começou e continua até agora.', vocabulary: [{ term: 'so far', meaning: 'até agora' }, { term: 'though', meaning: 'porém' }] },
    { ai: 'Do you have any plans for the weekend?', corrected: "I'm planning to visit some friends on Saturday.", explanation: 'Depois de "planning" use "to" + verbo: "planning to visit".', vocabulary: [{ term: 'plans', meaning: 'planos' }, { term: 'weekend', meaning: 'fim de semana' }] },
    { ai: 'That sounds fun! What do you usually do to relax?', corrected: 'I usually listen to music or go for a walk.', explanation: '"Go for a walk" é a expressão natural para "dar uma caminhada".', vocabulary: [{ term: 'relax', meaning: 'relaxar' }, { term: 'go for a walk', meaning: 'dar uma caminhada' }] },
  ],
}
