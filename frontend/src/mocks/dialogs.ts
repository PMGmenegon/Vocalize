import type { Accent, ScenarioId } from '../types'

export interface DialogTurn {
  /** Fala do personagem (inglês americano). */
  ai: string
  /** Resposta corrigida "de referência". */
  corrected: string
  explanation: string
  vocabulary: { term: string; meaning: string }[]
  /** Versão britânica, quando a fala ou o vocabulário muda de verdade. */
  uk?: { ai?: string; corrected?: string; explanation?: string; vocabulary?: { term: string; meaning: string }[] }
}

type V = { term: string; meaning: string }
const v = (term: string, meaning: string): V => ({ term, meaning })

/** Diálogos falsos (6 rodadas por cenário). O backend com IA substituirá isto. */
export const DIALOGS: Record<ScenarioId, DialogTurn[]> = {
  restaurant: [
    { ai: 'Welcome in! Do you have a reservation?', corrected: 'Yes, I have a reservation for two under Silva.', explanation: 'Usamos "have a reservation" e "under" para o nome da reserva.', vocabulary: [v('reservation', 'reserva'), v('under (name)', 'no nome de')],
      uk: { ai: 'Evening! Have you booked a table?', corrected: 'Yes, I booked a table for two under Silva.', explanation: 'No Reino Unido é comum dizer "book a table" (reservar uma mesa).', vocabulary: [v('book a table', 'reservar mesa'), v('under (name)', 'no nome de')] } },
    { ai: 'Can I get you something to drink while you look at the menu?', corrected: "I'd like a glass of water, please.", explanation: '"I\'d like" é mais educado que "I want" ao pedir algo.', vocabulary: [v("I'd like", 'eu gostaria'), v('a glass of', 'um copo de')],
      uk: { ai: 'What can I get you to drink?', corrected: "I'll have a pint of lager, please.", explanation: 'Em pubs, "pint" é a medida padrão (cerca de 568 ml) e "I\'ll have" é como se pede.', vocabulary: [v('pint', 'caneca de cerveja'), v('lager', 'cerveja clara')] } },
    { ai: 'Are you ready to order?', corrected: "Yes, I'll have the grilled chicken, please.", explanation: 'Para pedir um prato usamos "I\'ll have" (eu vou querer).', vocabulary: [v("I'll have", 'eu vou querer'), v('grilled', 'grelhado')],
      uk: { corrected: "Yes, I'll have the fish and chips, please.", vocabulary: [v('fish and chips', 'peixe com batatas fritas'), v("I'll have", 'eu vou querer')] } },
    { ai: 'Would you like any sides with that?', corrected: "Could I have a side salad instead of fries?", explanation: '"Could I have... instead of...?" é a forma educada de trocar um acompanhamento.', vocabulary: [v('side', 'acompanhamento'), v('instead of', 'em vez de')],
      uk: { ai: 'Would you like any extras with that?', corrected: 'Could I have a side salad instead of chips?', explanation: 'No Reino Unido, "chips" são as batatas fritas grossas; nos EUA, "fries".', vocabulary: [v('chips', 'batatas fritas (UK)'), v('instead of', 'em vez de')] } },
    { ai: 'How is everything tasting so far?', corrected: "It's delicious, thank you. Could we get some more water?", explanation: '"Could we get...?" pede algo ao garçom com educação; "some more" indica uma quantidade extra.', vocabulary: [v('delicious', 'delicioso'), v('some more', 'um pouco mais')] },
    { ai: 'Can I interest you in dessert, or just the check?', corrected: "Just the check, please. Everything was great.", explanation: 'Nos EUA, "check" é a conta; no Reino Unido se diz "bill".', vocabulary: [v('check', 'conta (EUA)'), v('dessert', 'sobremesa')],
      uk: { ai: 'Would you like a dessert, or shall I bring the bill?', corrected: 'Just the bill, please. Everything was lovely.', explanation: 'No Reino Unido, "bill" é a conta e "lovely" é um elogio muito comum.', vocabulary: [v('bill', 'conta (UK)'), v('lovely', 'ótimo, agradável')] } },
  ],
  'job-interview': [
    { ai: 'Thank you for coming in today. Could you tell me a little about yourself?', corrected: "Sure. I'm a software developer with five years of experience.", explanation: '"Experience" é incontável neste sentido: "five years of experience".', vocabulary: [v('experience', 'experiência'), v('developer', 'desenvolvedor(a)')] },
    { ai: 'What would you say is your greatest strength?', corrected: 'I think my greatest strength is solving problems under pressure.', explanation: 'Depois de "strength is" use um verbo com -ing: "solving".', vocabulary: [v('strength', 'ponto forte'), v('under pressure', 'sob pressão')] },
    { ai: 'Why do you want to work for our company?', corrected: 'I admire your products, and I would love to join your team.', explanation: '"Would love to" soa natural e entusiasmado em entrevistas.', vocabulary: [v('admire', 'admirar'), v('join', 'juntar-se a')] },
    { ai: 'Can you describe a challenge you faced at work and how you handled it?', corrected: 'Last year our deadline moved up, so I organized the team and we finished on time.', explanation: 'Use o passado simples para contar uma história concluída: "moved", "organized", "finished".', vocabulary: [v('deadline', 'prazo final'), v('on time', 'a tempo')] },
    { ai: 'How do you usually work in a team?', corrected: 'I like to listen first, share my ideas, and help others when they need support.', explanation: '"Like to" + verbo descreve hábitos e preferências.', vocabulary: [v('support', 'apoio'), v('share', 'compartilhar')] },
    { ai: 'Do you have any questions for us?', corrected: 'Yes, what does a typical day look like in this role?', explanation: 'Fazer uma pergunta no final mostra interesse. "Look like" pede uma descrição.', vocabulary: [v('role', 'cargo, função'), v('typical', 'típico')] },
  ],
  airport: [
    { ai: 'Good morning. May I see your passport, please?', corrected: 'Of course. Here you are.', explanation: '"Here you are" é a forma natural de entregar algo.', vocabulary: [v('passport', 'passaporte'), v('Here you are', 'aqui está')] },
    { ai: 'Would you like a window seat or an aisle seat?', corrected: "I'd prefer a window seat, please.", explanation: '"Prefer" não leva "to" antes do substantivo: "prefer a window seat".', vocabulary: [v('aisle seat', 'assento no corredor'), v('prefer', 'preferir')] },
    { ai: 'Are you checking any bags today?', corrected: "Yes, I'd like to check one suitcase and carry on this backpack.", explanation: '"Check a bag" é despachar; "carry on" é levar na cabine.', vocabulary: [v('check a bag', 'despachar mala'), v('carry-on', 'bagagem de mão')] },
    { ai: 'Your flight leaves from gate twelve. Boarding starts at ten thirty.', corrected: 'Thank you. Where can I find gate twelve?', explanation: 'Para pedir localização use "Where can I find...?".', vocabulary: [v('gate', 'portão'), v('boarding', 'embarque')] },
    { ai: 'Please place your laptop and liquids in the tray.', corrected: 'Should I take off my shoes and my belt too?', explanation: '"Take off" significa tirar roupas ou acessórios.', vocabulary: [v('tray', 'bandeja'), v('take off', 'tirar')] },
    { ai: "I'm sorry, your flight has been delayed by forty minutes.", corrected: 'Oh, I see. Is there a place nearby where I can get something to eat?', explanation: '"Where I can get..." liga a pergunta ao lugar. "Nearby" quer dizer "por perto".', vocabulary: [v('delayed', 'atrasado'), v('nearby', 'por perto')],
      uk: { ai: "I'm sorry, your flight has been delayed by forty minutes. Please keep an eye on the departures board.", vocabulary: [v('delayed', 'atrasado'), v('departures board', 'painel de partidas')] } },
  ],
  hotel: [
    { ai: 'Welcome to the Riverside Hotel. How can I help you?', corrected: "Hi, I'd like to check in. I have a reservation.", explanation: '"Check in" (verbo) é separado; "check-in" (substantivo) leva hífen.', vocabulary: [v('check in', 'fazer check-in'), v('front desk', 'recepção')],
      uk: { ai: 'Good afternoon, and welcome to the Riverside Hotel. How may I help you?', vocabulary: [v('check in', 'fazer check-in'), v('reception', 'recepção')] } },
    { ai: 'How many nights will you be staying with us?', corrected: "I'll be staying for three nights.", explanation: 'Use "for" antes de um período de tempo.', vocabulary: [v('stay', 'hospedar-se'), v('night', 'noite')] },
    { ai: 'Your room is on the fifth floor. Is there anything else you need?', corrected: 'Could I have a late checkout, please?', explanation: '"Could I have...?" é um pedido educado e muito usado em hotéis.', vocabulary: [v('late checkout', 'saída tardia'), v('floor', 'andar')],
      uk: { ai: 'Your room is on the fourth floor, which is the fifth if you count the ground floor. Anything else you need?', explanation: 'No Reino Unido, o térreo é o "ground floor" e o primeiro andar vem logo acima.', vocabulary: [v('ground floor', 'térreo (UK)'), v('late checkout', 'saída tardia')] } },
    { ai: 'The elevator is just around the corner on your left.', corrected: 'Thank you. What time is breakfast served?', explanation: '"What time is... served?" pergunta o horário de uma refeição.', vocabulary: [v('around the corner', 'virando a esquina'), v('served', 'servido')],
      uk: { ai: 'The lift is just around the corner on your left.', vocabulary: [v('lift', 'elevador (UK)'), v('around the corner', 'virando a esquina')] } },
    { ai: 'Breakfast is from seven to ten in the dining room.', corrected: 'Perfect. Could you also call a taxi for me tomorrow morning?', explanation: '"Could you also...?" acrescenta mais um pedido de forma educada.', vocabulary: [v('dining room', 'sala de refeições'), v('call a taxi', 'chamar um táxi')],
      uk: { corrected: 'Perfect. Could you also book a taxi for me tomorrow morning?', vocabulary: [v('book a taxi', 'reservar um táxi'), v('dining room', 'sala de refeições')] } },
    { ai: 'Of course. What time would you like the taxi?', corrected: 'At eight, please. I have a flight at eleven.', explanation: 'Use "at" para horas e "have a flight" para voos marcados.', vocabulary: [v('flight', 'voo'), v('at eight', 'às oito')] },
  ],
  shopping: [
    { ai: 'Hi there! Are you looking for anything in particular?', corrected: "I'm just looking, thanks.", explanation: '"I\'m just looking" é a resposta clássica para recusar ajuda por enquanto.', vocabulary: [v('in particular', 'em especial'), v('just looking', 'só olhando')] },
    { ai: 'That jacket comes in small, medium and large.', corrected: 'Do you have this in a medium?', explanation: 'Para perguntar tamanho: "Do you have this in a medium?".', vocabulary: [v('comes in', 'vem em (tamanhos)'), v('medium', 'médio')] },
    { ai: 'Would you like to try it on? The fitting rooms are over there.', corrected: 'Yes, please. Where are the fitting rooms?', explanation: '"Try on" é experimentar uma roupa.', vocabulary: [v('try on', 'experimentar'), v('fitting room', 'provador')],
      uk: { ai: 'Would you like to try it on? The changing rooms are just over there.', corrected: 'Yes, please. Where are the changing rooms?', vocabulary: [v('try on', 'experimentar'), v('changing room', 'provador (UK)')] } },
    { ai: 'How does it fit?', corrected: "It's a little tight. Do you have a bigger size?", explanation: '"A little tight" = um pouco apertado. "Bigger" é o comparativo de "big".', vocabulary: [v('tight', 'apertado'), v('bigger', 'maior')] },
    { ai: 'Let me check the back. Here you go, a large.', corrected: "That's perfect. How much is it?", explanation: '"How much is it?" pergunta o preço de um item.', vocabulary: [v('Here you go', 'aqui está'), v('How much', 'quanto custa')] },
    { ai: 'It is thirty dollars. Would you like to pay by card or cash?', corrected: "I'll pay by card, please.", explanation: 'Use "by" com a forma de pagamento: "by card", "by cash".', vocabulary: [v('pay by card', 'pagar com cartão'), v('cash', 'dinheiro')],
      uk: { ai: 'That comes to thirty pounds. Would you like to pay by card or cash?', vocabulary: [v('pay by card', 'pagar com cartão'), v('pounds', 'libras')] } },
  ],
  'small-talk': [
    { ai: "Hey! How's your week going so far?", corrected: "Pretty good, thanks. It's been a busy week, though.", explanation: '"It\'s been" (present perfect) fala de algo que continua até agora.', vocabulary: [v('so far', 'até agora'), v('though', 'porém')] },
    { ai: 'Do you have any plans for the weekend?', corrected: "I'm planning to visit some friends on Saturday.", explanation: 'Depois de "planning" use "to" + verbo.', vocabulary: [v('plans', 'planos'), v('weekend', 'fim de semana')] },
    { ai: 'That sounds fun! What do you usually do to relax?', corrected: 'I usually listen to music or go for a walk.', explanation: '"Go for a walk" é a expressão natural para "dar uma caminhada".', vocabulary: [v('relax', 'relaxar'), v('go for a walk', 'dar uma caminhada')] },
    { ai: 'Nice! Have you tried the lemonade here? It is really good today.', corrected: "Not yet, but I'd love to try it. What's in it?", explanation: '"Not yet" responde a perguntas com "have you...?". "What\'s in it?" pergunta os ingredientes.', vocabulary: [v('lemonade', 'limonada'), v('ingredients', 'ingredientes')],
      uk: { ai: 'Nice! Have you tried the tea and scones here? They are really good today.', corrected: "Not yet, but I'd love to try them. What kind of jam do you have?", explanation: '"Scones" com geleia e chá são clássicos no Reino Unido.', vocabulary: [v('scones', 'pãezinhos ingleses'), v('jam', 'geleia')] } },
    { ai: 'Do you come to this park often?', corrected: 'Yes, I come here almost every Sunday. It is very peaceful.', explanation: '"Almost every" = quase todo. "Peaceful" descreve um lugar tranquilo.', vocabulary: [v('almost every', 'quase todo'), v('peaceful', 'tranquilo')] },
    { ai: 'Well, it was great talking to you. Enjoy the rest of your day!', corrected: 'You too! It was nice meeting you.', explanation: '"Nice meeting you" se usa ao se despedir de alguém que acabou de conhecer.', vocabulary: [v('You too', 'igualmente'), v('rest of the day', 'resto do dia')] },
  ],
}

/** Resolve a rodada para o sotaque da sessão (aplica a versão britânica quando existe). */
export function resolveTurn(turn: DialogTurn, accent: Accent) {
  const uk = accent === 'en-GB' ? turn.uk : undefined
  return {
    ai: uk?.ai ?? turn.ai,
    corrected: uk?.corrected ?? turn.corrected,
    explanation: uk?.explanation ?? turn.explanation,
    vocabulary: uk?.vocabulary ?? turn.vocabulary,
  }
}
