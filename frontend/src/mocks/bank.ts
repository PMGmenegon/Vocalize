import type { Accent, Level, ScenarioId } from '../types'

type Vocab = { term: string; meaning: string }

/**
 * Uma fala possível do personagem + a resposta de referência. Com IA real, estas falas
 * serão geradas na hora; aqui o mock sorteia do banco da situação, filtrando pelo nível.
 */
export interface BankItem {
  /** Nível a partir do qual a fala é adequada. */
  lv: Level
  /** Fala do personagem (inglês americano). */
  ai: string
  /** Resposta de referência (a "versão corrigida"). */
  corrected: string
  explanation: string
  vocabulary: Vocab[]
  /** Versão britânica, quando a fala ou o vocabulário muda de verdade. */
  uk?: { ai?: string; corrected?: string; explanation?: string; vocabulary?: Vocab[] }
}

const v = (term: string, meaning: string): Vocab => ({ term, meaning })
const i = (lv: Level, ai: string, corrected: string, explanation: string, vocabulary: Vocab[], uk?: BankItem['uk']): BankItem => ({ lv, ai, corrected, explanation, vocabulary, uk })

/** Bancos por situação: falas de 3 a ~30 palavras, de A2 a C1. */
export const BANK: Record<ScenarioId, BankItem[]> = {
  restaurant: [
    i('A2', 'Welcome in! Do you have a reservation?', 'Yes, I have a reservation for two under Silva.', 'Usamos "have a reservation" e "under" para o nome da reserva.', [v('reservation', 'reserva'), v('under (name)', 'no nome de')],
      { ai: 'Evening! Have you booked a table?', corrected: 'Yes, I booked a table for two under Silva.', explanation: 'No Reino Unido é comum dizer "book a table".', vocabulary: [v('book a table', 'reservar mesa'), v('under (name)', 'no nome de')] }),
    i('A2', 'Can I get you something to drink while you look at the menu?', "I'd like a glass of water, please.", '"I\'d like" é mais educado que "I want" ao pedir algo.', [v("I'd like", 'eu gostaria'), v('a glass of', 'um copo de')],
      { ai: 'What can I get you to drink?', corrected: "I'll have a pint of lager, please.", explanation: 'Em pubs, "pint" é a medida padrão de cerveja.', vocabulary: [v('pint', 'caneca de cerveja'), v('lager', 'cerveja clara')] }),
    i('A2', 'Are you ready to order?', "Yes, I'll have the grilled chicken, please.", 'Para pedir um prato usamos "I\'ll have".', [v("I'll have", 'eu vou querer'), v('grilled', 'grelhado')],
      { corrected: "Yes, I'll have the fish and chips, please.", vocabulary: [v('fish and chips', 'peixe com batatas fritas'), v("I'll have", 'eu vou querer')] }),
    i('B1', 'Would you like any sides with that?', 'Could I have a side salad instead of fries?', '"Could I have... instead of...?" troca um acompanhamento com educação.', [v('side', 'acompanhamento'), v('instead of', 'em vez de')],
      { ai: 'Would you like any extras with that?', corrected: 'Could I have a side salad instead of chips?', explanation: 'No Reino Unido, "chips" são as batatas fritas grossas.', vocabulary: [v('chips', 'batatas fritas (UK)'), v('instead of', 'em vez de')] }),
    i('B1', 'How is everything tasting so far?', "It's delicious, thank you. Could we get some more water?", '"Could we get...?" pede algo ao garçom; "some more" indica quantidade extra.', [v('delicious', 'delicioso'), v('some more', 'um pouco mais')]),
    i('B2', 'Can I interest you in dessert, or just the check?', 'Just the check, please. Everything was great.', 'Nos EUA, "check" é a conta; no Reino Unido, "bill".', [v('check', 'conta (EUA)'), v('dessert', 'sobremesa')],
      { ai: 'Would you like a dessert, or shall I bring the bill?', corrected: 'Just the bill, please. Everything was lovely.', explanation: '"Bill" é a conta no Reino Unido; "lovely" é um elogio comum.', vocabulary: [v('bill', 'conta (UK)'), v('lovely', 'ótimo')] }),
    i('B2', "I'm so sorry, but the salmon is sold out tonight, so I'd recommend the steak, which is our special and comes with roasted vegetables.", "That's fine. I'll try the steak, and could you make it medium, please?", 'Ao aceitar uma sugestão, combine a escolha com um pedido: "make it medium" define o ponto da carne.', [v('sold out', 'esgotado'), v('medium', 'ao ponto')]),
    i('C1', "I apologize for the wait, and since we have kept you for so long, the manager has asked me to bring you a complimentary dessert, if that's all right with you.", "That's very kind of you, thank you. We really appreciate it.", '"That\'s very kind of you" é a forma elegante de agradecer um gesto inesperado.', [v('complimentary', 'cortesia'), v('apologize', 'pedir desculpas')]),
  ],
  street: [
    i('A2', 'Hi! Are you lost? Do you need some help?', 'Yes, please. Where is the bus station?', '"Where is...?" é a pergunta básica para pedir localização.', [v('lost', 'perdido'), v('bus station', 'rodoviária')],
      { ai: 'Hello! Are you lost? Do you need a hand?', corrected: 'Yes, please. Where is the bus station?', explanation: '"Do you need a hand?" é uma forma britânica comum de oferecer ajuda.', vocabulary: [v('a hand', 'uma ajuda'), v('bus station', 'rodoviária')] }),
    i('A2', 'Go straight, then turn left at the bank.', 'Thank you! Is it far from here?', '"Is it far?" pergunta se é longe.', [v('turn left', 'vire à esquerda'), v('far', 'longe')]),
    i('A2', "It's about five minutes on foot.", 'Great, thanks for your help.', '"Thanks for your help" agradece a ajuda de forma natural.', [v('on foot', 'a pé'), v('about', 'cerca de')]),
    i('B1', "Are you from around here? I haven't seen you before.", "No, I'm visiting from Brazil. I arrived two days ago.", 'Use "I arrived" no passado simples com "ago".', [v('visiting', 'visitando'), v('ago', 'atrás')]),
    i('B1', "If you like coffee, there's a great place just around the corner.", 'That sounds nice. Could you tell me how to get there?', '"Could you tell me how to get there?" é um pedido educado de direção.', [v('around the corner', 'virando a esquina'), v('how to get there', 'como chegar lá')],
      { ai: "If you like coffee, there's a lovely café just round the corner.", vocabulary: [v('round the corner', 'virando a esquina'), v('how to get there', 'como chegar lá')] }),
    i('B2', "You can't miss it. It's right across from the pharmacy, next to the bookshop with the green door.", 'Perfect, I think I know where that is. Thanks a lot!', '"Across from" e "next to" descrevem localização relativa.', [v('across from', 'em frente a'), v('next to', 'ao lado de')],
      { ai: "You can't miss it. It's opposite the chemist's, next to the bookshop with the green door.", vocabulary: [v('opposite', 'em frente a'), v("chemist's", 'farmácia (UK)')] }),
    i('B2', "Honestly, I'd avoid the main square at this time of day, because it gets really crowded with tourists, so I'd take the side street instead.", "That's a good idea. I'd rather avoid the crowds, so I'll take the side street.", '"I\'d rather" + verbo expressa preferência.', [v('crowded', 'lotado'), v("I'd rather", 'eu preferiria')]),
    i('C1', "By the way, if you have a few hours to spare this afternoon, the old market by the river is well worth a visit, especially since the street musicians usually start playing around four.", "That sounds wonderful. I'll definitely check it out, as I've been wanting to see some of the local culture.", '"Check it out" é informal para "dar uma olhada"; "I\'ve been wanting" mostra um desejo que dura até agora.', [v('worth a visit', 'vale a visita'), v('check out', 'conhecer, dar uma olhada')]),
  ],
  airport: [
    i('A2', 'Good morning. May I see your passport, please?', 'Of course. Here you are.', '"Here you are" é a forma natural de entregar algo.', [v('passport', 'passaporte'), v('Here you are', 'aqui está')]),
    i('A2', 'Would you like a window seat or an aisle seat?', "I'd prefer a window seat, please.", '"Prefer" não leva "to" antes do substantivo.', [v('aisle seat', 'assento no corredor'), v('prefer', 'preferir')]),
    i('A2', 'Any bags to check?', 'Yes, one suitcase.', 'Respostas curtas são comuns no balcão: "Yes, one suitcase."', [v('check a bag', 'despachar mala'), v('suitcase', 'mala')]),
    i('B1', 'Your flight leaves from gate twelve. Boarding starts at ten thirty.', 'Thank you. Where can I find gate twelve?', 'Para pedir localização use "Where can I find...?".', [v('gate', 'portão'), v('boarding', 'embarque')]),
    i('B1', 'Please place your laptop and liquids in the tray.', 'Should I take off my shoes and my belt too?', '"Take off" significa tirar roupas ou acessórios.', [v('tray', 'bandeja'), v('take off', 'tirar')]),
    i('B1', "I'm sorry, your flight has been delayed by forty minutes.", 'Oh, I see. Is there a place nearby where I can get something to eat?', '"Nearby" quer dizer "por perto".', [v('delayed', 'atrasado'), v('nearby', 'por perto')],
      { ai: "I'm sorry, your flight has been delayed by forty minutes. Please keep an eye on the departures board.", vocabulary: [v('delayed', 'atrasado'), v('departures board', 'painel de partidas')] }),
    i('B2', "Unfortunately, the connecting flight is full, but I can put you on the next one, which leaves in three hours, and I'll give you a meal voucher for the wait.", "That works for me, thank you. Will my luggage be transferred automatically?", '"Will... be transferred?" usa a voz passiva no futuro.', [v('connecting flight', 'voo de conexão'), v('voucher', 'vale')]),
    i('C1', "Due to severe weather conditions, all departures have been suspended until further notice, so we advise passengers to stay in the terminal and check the screens for updates, as the situation changes quickly.", "I understand. Could you tell me whether the airline will cover the hotel if we have to stay overnight?", '"Whether" introduz uma pergunta indireta com sim ou não.', [v('until further notice', 'até novo aviso'), v('overnight', 'durante a noite')]),
  ],
  hotel: [
    i('A2', 'Welcome to the Riverside Hotel. How can I help you?', "Hi, I'd like to check in. I have a reservation.", '"Check in" (verbo) é separado; "check-in" (substantivo) leva hífen.', [v('check in', 'fazer check-in'), v('front desk', 'recepção')],
      { ai: 'Good afternoon, and welcome to the Riverside Hotel. How may I help you?', vocabulary: [v('check in', 'fazer check-in'), v('reception', 'recepção')] }),
    i('A2', 'How many nights will you be staying with us?', "I'll be staying for three nights.", 'Use "for" antes de um período de tempo.', [v('stay', 'hospedar-se'), v('night', 'noite')]),
    i('A2', 'Breakfast is from seven to ten.', 'Perfect. Where is the dining room?', '"Where is...?" pede a localização de um lugar.', [v('dining room', 'sala de refeições'), v('from... to...', 'de... até...')]),
    i('B1', 'Your room is on the fifth floor. Is there anything else you need?', 'Could I have a late checkout, please?', '"Could I have...?" é um pedido educado e muito usado em hotéis.', [v('late checkout', 'saída tardia'), v('floor', 'andar')],
      { ai: 'Your room is on the fourth floor, which is the fifth if you count the ground floor. Anything else you need?', explanation: 'No Reino Unido, o térreo é o "ground floor".', vocabulary: [v('ground floor', 'térreo (UK)'), v('late checkout', 'saída tardia')] }),
    i('B1', 'The elevator is just around the corner on your left.', 'Thank you. What time is breakfast served?', '"What time is... served?" pergunta o horário de uma refeição.', [v('around the corner', 'virando a esquina'), v('served', 'servido')],
      { ai: 'The lift is just around the corner on your left.', vocabulary: [v('lift', 'elevador (UK)'), v('around the corner', 'virando a esquina')] }),
    i('B1', 'Of course. What time would you like the taxi?', 'At eight, please. I have a flight at eleven.', 'Use "at" para horas e "have a flight" para voos marcados.', [v('flight', 'voo'), v('at eight', 'às oito')]),
    i('B2', "I'm afraid the room you booked has a problem with the air conditioning, so we'd like to upgrade you to a suite at no extra charge, if that suits you.", "That's very generous, thank you. Does the suite have a view of the sea?", '"At no extra charge" = sem custo adicional; "suits you" = serve para você.', [v('upgrade', 'melhorar a categoria'), v('at no extra charge', 'sem custo extra')]),
    i('C1', "We regret to inform you that the pool will be closed for maintenance during your stay, but we would be happy to arrange complimentary access to the spa, which has recently been renovated and is quite popular with our guests.", "That's disappointing, but I appreciate the offer. Could you book me a treatment for tomorrow afternoon?", '"I appreciate the offer" agradece sem perder a educação ao expressar desapontamento.', [v('regret to inform', 'lamentar informar'), v('treatment', 'tratamento')]),
  ],
  shopping: [
    i('A2', 'Hi there! Are you looking for anything in particular?', "I'm just looking, thanks.", '"I\'m just looking" recusa ajuda por enquanto.', [v('in particular', 'em especial'), v('just looking', 'só olhando')]),
    i('A2', 'That jacket comes in small, medium and large.', 'Do you have this in a medium?', 'Para perguntar tamanho: "Do you have this in a medium?".', [v('comes in', 'vem em (tamanhos)'), v('medium', 'médio')]),
    i('A2', 'Can I help you?', 'Yes, how much is this shirt?', '"How much is...?" pergunta o preço de um item.', [v('shirt', 'camisa'), v('how much', 'quanto custa')]),
    i('B1', 'Would you like to try it on? The fitting rooms are over there.', 'Yes, please. Where are the fitting rooms?', '"Try on" é experimentar uma roupa.', [v('try on', 'experimentar'), v('fitting room', 'provador')],
      { ai: 'Would you like to try it on? The changing rooms are just over there.', corrected: 'Yes, please. Where are the changing rooms?', vocabulary: [v('try on', 'experimentar'), v('changing room', 'provador (UK)')] }),
    i('B1', 'How does it fit?', "It's a little tight. Do you have a bigger size?", '"A little tight" = um pouco apertado.', [v('tight', 'apertado'), v('bigger', 'maior')]),
    i('B1', 'It is thirty dollars. Would you like to pay by card or cash?', "I'll pay by card, please.", 'Use "by" com a forma de pagamento.', [v('pay by card', 'pagar com cartão'), v('cash', 'dinheiro')],
      { ai: 'That comes to thirty pounds. Would you like to pay by card or cash?', vocabulary: [v('pay by card', 'pagar com cartão'), v('pounds', 'libras')] }),
    i('B2', "If it doesn't fit, you can bring it back within thirty days with the receipt, and we'll either exchange it or give you a full refund.", 'Great, that is good to know. Could you put the receipt in the bag, please?', '"Within thirty days" = dentro de trinta dias.', [v('refund', 'reembolso'), v('exchange', 'trocar')]),
    i('C1', "Actually, this model has just been discounted, so if you buy two pieces today, you get an additional twenty percent off the cheaper one, which makes it a really good deal.", "That's tempting. Let me think about it, but could you hold these for me for a few minutes?", '"Hold" aqui significa reservar por um tempo.', [v('discounted', 'com desconto'), v('a good deal', 'um bom negócio')]),
  ],
  'job-interview': [
    i('B1', 'Thank you for coming in today. Could you tell me a little about yourself?', "Sure. I'm a software developer with five years of experience.", '"Experience" é incontável: "five years of experience".', [v('experience', 'experiência'), v('developer', 'desenvolvedor(a)')]),
    i('B1', 'What would you say is your greatest strength?', 'I think my greatest strength is solving problems under pressure.', 'Depois de "strength is" use um verbo com -ing.', [v('strength', 'ponto forte'), v('under pressure', 'sob pressão')]),
    i('B1', 'Why do you want to work for our company?', 'I admire your products, and I would love to join your team.', '"Would love to" soa natural e entusiasmado.', [v('admire', 'admirar'), v('join', 'juntar-se a')]),
    i('B2', 'Can you describe a challenge you faced at work and how you handled it?', 'Last year our deadline moved up, so I organized the team and we finished on time.', 'Use o passado simples para contar uma história concluída.', [v('deadline', 'prazo final'), v('on time', 'a tempo')]),
    i('B2', 'How do you usually work in a team?', 'I like to listen first, share my ideas, and help others when they need support.', '"Like to" + verbo descreve hábitos.', [v('support', 'apoio'), v('share', 'compartilhar')]),
    i('B2', 'Do you have any questions for us?', 'Yes, what does a typical day look like in this role?', 'Fazer uma pergunta no final mostra interesse.', [v('role', 'cargo'), v('typical', 'típico')]),
    i('C1', "We are looking for someone who can take ownership of projects from start to finish, so I'd like to hear about a time when you had to make a difficult decision without all the information.", "In my last role, I had to choose between two vendors with limited data, so I ran a small test, compared the results, and presented my recommendation to the team.", '"Take ownership" = assumir responsabilidade. Estruture a resposta: situação, ação, resultado.', [v('ownership', 'responsabilidade'), v('vendor', 'fornecedor')]),
    i('C1', 'Where do you see yourself in five years?', 'I see myself leading a team and mentoring younger colleagues.', 'Use "see myself" + -ing para planos de carreira.', [v('mentor', 'orientar'), v('lead', 'liderar')]),
  ],
  'virtual-chat': [
    i('A2', 'Hey! Are you free tonight?', "Yes, I'm free. What do you want to do?", '"Free" aqui significa livre, sem compromisso.', [v('free', 'livre'), v('tonight', 'hoje à noite')]),
    i('A2', "Let's go and see a movie.", 'Good idea. What time does it start?', '"What time does it start?" pergunta o horário.', [v("let's", 'vamos'), v('movie', 'filme')],
      { ai: "Let's go and see a film.", vocabulary: [v('film', 'filme (UK)'), v("let's", 'vamos')] }),
    i('A2', "Sorry, I'm running late.", "No problem. I'll wait for you here.", '"Running late" = atrasado(a).', [v('running late', 'atrasado'), v('wait for', 'esperar')]),
    i('B1', 'Did you see the message from our manager? The meeting was moved to Thursday.', 'Yes, I saw it. Thursday is fine for me.', '"Was moved" é voz passiva: a reunião foi remarcada.', [v('moved to', 'remarcado para'), v('manager', 'gerente')]),
    i('B1', 'I just got back from my trip. It was amazing, you should come next time!', 'That sounds great! Can you send me some photos?', '"Should" dá um conselho ou sugestão.', [v('got back', 'voltei'), v('amazing', 'incrível')]),
    i('B2', "I've been thinking about changing jobs lately, and I'd really like to hear what you think.", 'Honestly, I think it is a good idea if you feel ready for a new challenge.', '"Honestly" abre uma opinião sincera; "if you feel ready" dá a condição.', [v('lately', 'ultimamente'), v('challenge', 'desafio')]),
    i('B2', "Could you do me a favor? I forgot my laptop charger at the office, and I need it for tomorrow's presentation.", 'Sure, I can bring it to you in the morning before the presentation.', '"Do me a favor" = fazer um favor. "Bring it to you" = levar até você.', [v('charger', 'carregador'), v('favor', 'favor')]),
    i('C1', "So, I finally decided to sign up for that marathon we talked about last month, and I'm honestly a little nervous, but I figure it's the best way to stay motivated all year.", "That's fantastic news! I'm sure you'll do great, and I'd be happy to train with you.", '"Sign up for" = inscrever-se; "I figure" = eu imagino/acho.', [v('sign up', 'inscrever-se'), v('motivated', 'motivado')]),
  ],
}

/** Resolve a fala para o sotaque da sessão (aplica a versão britânica quando existe). */
export function resolveItem(item: BankItem, accent: Accent) {
  const uk = accent === 'en-GB' ? item.uk : undefined
  return {
    ai: uk?.ai ?? item.ai,
    corrected: uk?.corrected ?? item.corrected,
    explanation: uk?.explanation ?? item.explanation,
    vocabulary: uk?.vocabulary ?? item.vocabulary,
  }
}
