import type { Interlocutor, PracticeLayout, Scenario, ScenarioId } from '../types'

/** Como cada tipo de prática é apresentado na tela de escolha. */
export const EXPERIENCE: Record<PracticeLayout, { label: string; hint: string }> = {
  training: { label: 'Treino', hint: 'Você ouve a fala, transcreve e responde.' },
  chat: { label: 'Chat', hint: 'Mensagens de voz: você ouve, transcreve e responde por texto.' },
}

export const SETTING_LABEL: Record<Scenario['setting'], string> = { 'in-person': 'Presencial', online: 'Online' }

/** Limite padrão de rodadas por sessão (a sessão também termina quando o usuário encerra). */
export const DEFAULT_MAX_TURNS = 8

/**
 * Tudo o que define uma situação de listening fica aqui. Cada situação tem vários interlocutores;
 * ao iniciar uma sessão o sistema sorteia um deles e uma cena (mock; a IA fará isso na Fase 10).
 * Para criar uma situação nova basta acrescentar um item a SITUATIONS e um diálogo por interlocutor
 * em src/mocks/bank.ts (a tela de prática escolhe o layout pelo campo `layout`).
 * Textos de cena e funções são neutros em gênero, pois a voz pode ser masculina ou feminina.
 */
export interface Situation extends Scenario {
  interlocutors: Interlocutor[]
}

export const SITUATIONS: Situation[] = [
  {
    id: 'restaurant', title: 'Restaurante', description: 'Peça a mesa, escolha o prato e converse com o atendimento.', icon: 'utensils', layout: 'training', setting: 'in-person', minutes: 12, skills: ['Pedidos e preferências', 'Números e preços', 'Pedidos educados'],
    interlocutors: [
      {
        id: 'restaurant-waiter', role: 'Atendente', userRole: 'Cliente',
        context: 'O atendimento anota o pedido da mesa: bebidas, prato principal, acompanhamentos e sobremesa.',
        scenes: [
          'Restaurante movimentado, sexta à noite. Você acabou de sentar e o atendimento chega à sua mesa.',
          'Almoço de domingo num restaurante cheio. O atendimento vem anotar o seu pedido.',
        ],
      },
      {
        id: 'restaurant-cashier', role: 'Caixa', userRole: 'Cliente',
        context: 'No caixa, a conta é conferida, dividida entre as pessoas da mesa e paga, com ou sem gorjeta.',
        scenes: [
          'Fim de noite, quase hora de fechar. Você vai ao caixa pagar a conta.',
          'Mesa grande, conta longa. Você chega ao caixa para pagar a sua parte.',
        ],
      },
      {
        id: 'restaurant-host', role: 'Recepção do restaurante', userRole: 'Cliente',
        context: 'Na entrada, a recepção confirma a reserva, informa o tempo de espera e indica a mesa.',
        scenes: [
          'Porta de um restaurante lotado num sábado à noite. A recepção atende você na entrada.',
          'Você chega sem reserva na hora do almoço e a recepção vem falar com você.',
        ],
      },
      {
        id: 'restaurant-delivery', role: 'Atendimento de delivery por telefone', userRole: 'Cliente',
        context: 'Por telefone, você faz um pedido para entrega: itens, endereço, forma de pagamento e prazo.',
        scenes: [
          'Noite de chuva, ninguém quer sair de casa. Você liga para pedir comida e o atendimento atende.',
          'Domingo à tarde, você liga para um restaurante e o atendimento do delivery pega o telefone.',
        ],
      },
    ],
  },
  {
    id: 'street', title: 'Conversa na rua', description: 'Peça informação e converse com alguém que você encontra na rua.', icon: 'pin', layout: 'training', setting: 'in-person', minutes: 10, skills: ['Pedir e entender direções', 'Conversa informal', 'Fala rápida do dia a dia'],
    interlocutors: [
      {
        id: 'street-local', role: 'Habitante local', userRole: 'Turista',
        context: 'Você é turista e pede informações ou puxa conversa com alguém que mora na cidade: direções, lugares para comer, dicas.',
        scenes: [
          'Calçada cheia numa tarde de sábado. Uma pessoa que mora na cidade para para conversar com você.',
          'Você está perdido(a) num bairro novo. Uma pessoa que mora ali percebe e se aproxima.',
        ],
      },
      {
        id: 'street-tourist', role: 'Turista', userRole: 'Habitante local',
        context: 'Uma pessoa visitando a cidade aborda você pedindo ajuda; você faz o papel de quem conhece o lugar e explica caminhos e dicas.',
        scenes: [
          'Manhã fria, ponto de ônibus. Uma pessoa de fora da cidade, com um mapa na mão, se aproxima de você.',
          'Praça movimentada. Quem está visitando a cidade pede ajuda a você.',
        ],
      },
    ],
  },
  {
    id: 'airport', title: 'Aeroporto', description: 'Faça check-in, passe pela segurança e encontre o portão.', icon: 'plane', layout: 'training', setting: 'in-person', minutes: 14, skills: ['Avisos e instruções', 'Horários e portões', 'Perguntas de segurança'],
    interlocutors: [
      {
        id: 'airport-checkin', role: 'Check-in', userRole: 'Pessoa em viagem',
        context: 'No balcão de check-in, o atendimento confere documentos, despacha a bagagem e define o assento.',
        scenes: [
          'Balcão de check-in lotado numa manhã de segunda. Chegou a sua vez.',
          'Madrugada no aeroporto, fila curta. O atendimento do balcão chama você.',
        ],
      },
      {
        id: 'airport-security', role: 'Controle de segurança', userRole: 'Pessoa em viagem',
        context: 'Na inspeção, a equipe pede para separar itens da bagagem de mão e orienta sobre líquidos e eletrônicos.',
        scenes: [
          'Fila de segurança andando devagar. Chegou a sua vez de passar a bagagem de mão pela inspeção.',
          'Quase na hora do embarque. A equipe de segurança chama você ao ponto de inspeção.',
        ],
      },
      {
        id: 'airport-immigration', role: 'Imigração', userRole: 'Pessoa em viagem',
        context: 'Na imigração, quem atende pergunta o motivo da viagem, o tempo de estadia e onde você vai ficar.',
        scenes: [
          'Chegada num país novo, depois de um voo longo. A imigração chama você ao guichê.',
          'Fila grande na imigração. Quem atende no guichê faz sinal para você avançar.',
        ],
      },
      {
        id: 'airport-gate', role: 'Portão de embarque', userRole: 'Pessoa em viagem',
        context: 'No portão, a equipe avisa sobre atraso do voo, troca de assento e instruções de embarque.',
        scenes: [
          'Sala de embarque cheia e o painel mostra atraso. Você vai ao portão pedir informação.',
          'Embarque quase começando. Você se aproxima do balcão do portão com uma dúvida sobre o assento.',
        ],
      },
      {
        id: 'airport-baggage', role: 'Balcão de bagagens', userRole: 'Pessoa em viagem',
        context: 'Sua mala não apareceu na esteira; o balcão de bagagens registra a ocorrência e explica como ela será entregue.',
        scenes: [
          'Esteira parada e sem sinal da sua mala. Você procura o balcão de bagagens.',
          'Todo mundo já foi embora e a sua mala não chegou. O balcão de bagagens atende você.',
        ],
      },
    ],
  },
  {
    id: 'hotel', title: 'Hotel', description: 'Faça o check-in, tire dúvidas e peça ajuda à recepção.', icon: 'bed', layout: 'training', setting: 'in-person', minutes: 12, skills: ['Reservas e datas', 'Pedidos à recepção', 'Resolver imprevistos'],
    interlocutors: [
      {
        id: 'hotel-reception', role: 'Recepção', userRole: 'Hóspede',
        context: 'Na recepção, você faz o check-in ou o check-out: reserva, documentos, quarto, café da manhã e pagamento.',
        scenes: [
          'Fim de tarde, você chega ao hotel com a mala na mão. A recepção recebe você.',
          'Manhã de checkout. Você vai até a recepção para encerrar a estadia.',
        ],
      },
      {
        id: 'hotel-housekeeping', role: 'Equipe de arrumação', userRole: 'Hóspede',
        context: 'A equipe de arrumação cuida da limpeza do quarto e dos itens extras, como toalhas, travesseiros e amenidades.',
        scenes: [
          'Meio da manhã. Você abre a porta do quarto e a equipe de arrumação está no corredor.',
          'Você volta ao quarto e encontra a equipe de arrumação terminando o serviço.',
        ],
      },
      {
        id: 'hotel-roomservice', role: 'Serviço de quarto por telefone', userRole: 'Hóspede',
        context: 'Por telefone, você pede uma refeição no quarto: itens, restrições alimentares, horário e valor.',
        scenes: [
          'Tarde da noite, você está cansado(a) demais para sair. Você liga para o serviço de quarto e alguém atende.',
          'Manhã cedo, você liga do quarto para pedir o café da manhã.',
        ],
      },
      {
        id: 'hotel-concierge', role: 'Atendimento ao hóspede', userRole: 'Hóspede',
        context: 'O atendimento ao hóspede dá dicas da cidade: passeios, restaurantes, transporte e horários.',
        scenes: [
          'Saguão do hotel, manhã de sol. Você se aproxima do balcão de atendimento ao hóspede.',
          'Primeiro dia na cidade. Você pede ideias de passeio ao atendimento do hotel.',
        ],
      },
    ],
  },
  {
    id: 'shopping', title: 'Compras', description: 'Pergunte preços e tamanhos, experimente e pague.', icon: 'bag', layout: 'training', setting: 'in-person', minutes: 12, skills: ['Preços e tamanhos', 'Pedidos e trocas', 'Formas de pagamento'],
    interlocutors: [
      {
        id: 'shopping-clerk', role: 'Atendente de loja', userRole: 'Cliente',
        context: 'Na loja, o atendimento ajuda você a escolher uma peça: tamanho, cor, opções e provador.',
        scenes: [
          'Loja cheia num sábado de promoção. O atendimento se aproxima para ajudar você.',
          'Você está no provador e precisa de outro tamanho. O atendimento vem até você.',
        ],
      },
      {
        id: 'shopping-cashier', role: 'Caixa', userRole: 'Cliente',
        context: 'No caixa, você confere o valor, escolhe a forma de pagamento e decide sobre sacola e nota fiscal.',
        scenes: [
          'Fim de tarde, fila curta no caixa. Chegou a sua vez de pagar.',
          'Você leva várias peças ao caixa e o atendimento começa a passar os itens.',
        ],
      },
      {
        id: 'shopping-returns', role: 'Trocas e devoluções', userRole: 'Cliente',
        context: 'No balcão de trocas, você explica o problema com uma compra e pede troca ou reembolso.',
        scenes: [
          'Você volta à loja com uma compra que não serviu. O balcão de trocas atende você.',
          'Uma peça veio com defeito. Você vai ao balcão de devoluções com a nota na mão.',
        ],
      },
    ],
  },
  {
    id: 'job-interview', title: 'Entrevista de emprego', description: 'Apresente-se e responda perguntas sobre a sua experiência.', icon: 'briefcase', layout: 'training', setting: 'in-person', minutes: 16, skills: ['Apresentação pessoal', 'Perguntas sobre experiência', 'Respostas claras e formais'],
    interlocutors: [
      {
        id: 'interview-hr', role: 'Recrutamento/RH', userRole: 'Pessoa candidata',
        context: 'Entrevista inicial com o recrutamento: sua trajetória, sua motivação para a vaga e suas expectativas.',
        scenes: [
          'Sala de reunião silenciosa, 9h da manhã. Quem vai entrevistar você acabou de entrar.',
          'Recepção da empresa, um pouco antes do horário marcado. Quem conduz a entrevista chama o seu nome.',
        ],
      },
      {
        id: 'interview-lead', role: 'Liderança da área', userRole: 'Pessoa candidata',
        context: 'A liderança da área faz perguntas técnicas e propõe situações do dia a dia para entender como você trabalha.',
        scenes: [
          'Segunda etapa do processo. A liderança da área recebe você numa sala com uma lousa.',
          'Entrevista por videochamada, no meio da tarde. A liderança da área abre a conversa.',
        ],
      },
      {
        id: 'interview-phone', role: 'Entrevista por telefone', userRole: 'Pessoa candidata',
        context: 'Uma triagem rápida por telefone: disponibilidade, experiência resumida e pretensão para a vaga.',
        scenes: [
          'Você está em casa, esperando uma ligação marcada. O telefone toca e quem entrevista se apresenta.',
          'Final de manhã. Chega a ligação da triagem e você atende num lugar tranquilo.',
        ],
      },
    ],
  },
  {
    id: 'virtual-chat', title: 'Bate-papo virtual', description: 'Converse por mensagens de voz com um amigo ou colega.', icon: 'chat', layout: 'chat', setting: 'online', minutes: 8, skills: ['Mensagens de voz informais', 'Gírias e contrações', 'Responder por escrito'],
    interlocutors: [
      {
        id: 'chat-coworker', role: 'Colega de trabalho', userRole: 'Colega de trabalho',
        context: 'Alguém do trabalho manda mensagens de voz sobre assuntos da rotina e combina tarefas e prazos com você.',
        scenes: [
          'Noite de domingo. Um contato do trabalho manda uma mensagem de voz pelo celular.',
          'Intervalo do almoço. Uma pessoa da sua equipe manda uma mensagem de voz sobre o projeto.',
        ],
      },
      {
        id: 'chat-friend', role: 'Amigo(a)', userRole: 'Amigo(a)',
        context: 'Uma amizade manda mensagens de voz para contar as novidades e combinar planos para o fim de semana.',
        scenes: [
          'Quinta à noite. Chega uma mensagem de voz de alguém querido, cheia de novidades.',
          'Sexta no fim do expediente. Uma amizade manda áudio perguntando o que você vai fazer no fim de semana.',
        ],
      },
      {
        id: 'chat-course', role: 'Contato de curso online', userRole: 'Colega de curso',
        context: 'Alguém que você conheceu num curso online troca experiências sobre os estudos e as aulas.',
        scenes: [
          'Fim de tarde. Chega uma mensagem de voz de um contato que você conheceu num curso online.',
          'Véspera de prova do curso. Um contato do grupo de estudos manda uma mensagem de voz.',
        ],
      },
      {
        id: 'chat-hostfamily', role: 'Família anfitriã de intercâmbio', userRole: 'Intercambista',
        context: 'A família que vai receber você no intercâmbio manda áudios sobre os preparativos da chegada.',
        scenes: [
          'Faltam duas semanas para a viagem. A família anfitriã manda uma mensagem de voz para se apresentar.',
          'Você está arrumando as malas quando chega um áudio da família anfitriã.',
        ],
      },
    ],
  },
]

/** Lista simples (sem os interlocutores), usada pela tela de escolha. */
export const SCENARIOS: Scenario[] = SITUATIONS.map(({ id, title, description, icon, layout, setting, minutes, skills }): Scenario => ({ id, title, description, icon, layout, setting, minutes, skills }))

export function situationFor(id: ScenarioId): Situation {
  const found = SITUATIONS.find((s) => s.id === id)
  if (!found) throw new Error(`Situação desconhecida: ${id}`)
  return found
}

/** Funções (roles) com quem a conversa pode acontecer em uma situação. */
export const interlocutorRolesFor = (id: ScenarioId): string[] => situationFor(id).interlocutors.map((i) => i.role)

/** Interlocutor da sessão (fixo do início ao fim). */
export function interlocutorFor(id: ScenarioId, interlocutorId: string): Interlocutor {
  const found = situationFor(id).interlocutors.find((i) => i.id === interlocutorId)
  if (!found) throw new Error(`Interlocutor desconhecido: ${interlocutorId}`)
  return found
}

export const layoutFor = (id: ScenarioId): PracticeLayout => situationFor(id).layout
