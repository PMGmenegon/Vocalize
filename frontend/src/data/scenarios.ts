import type { PracticeLayout, Scenario, ScenarioId } from '../types'

/** Como cada tipo de prática é apresentado na tela de escolha. */
export const EXPERIENCE: Record<PracticeLayout, { label: string; hint: string }> = {
  training: { label: 'Treino', hint: 'Você ouve a fala, transcreve e responde.' },
  chat: { label: 'Chat', hint: 'Mensagens de voz: você ouve, transcreve e responde por texto.' },
}

export const SETTING_LABEL: Record<Scenario['setting'], string> = { 'in-person': 'Presencial', online: 'Online' }

/** Limite padrão de rodadas por sessão (a sessão também termina quando o usuário encerra). */
export const DEFAULT_MAX_TURNS = 8

/**
 * Tudo o que define uma situação de listening fica aqui. Para criar uma situação nova
 * basta acrescentar um item a SITUATIONS e um banco de falas em src/mocks (a tela de
 * prática escolhe o layout pelo campo `layout`; nenhum componente precisa mudar).
 */
export interface Situation extends Scenario {
  /** Função neutra (em gênero) de quem fala, em português ("Atendente"). */
  speakerRole: string
  /** Variações de cena (clima + quem vai falar); uma é sorteada por sessão. */
  scenes: string[]
}

export const SITUATIONS: Situation[] = [
  {
    id: 'restaurant', title: 'Restaurante', description: 'Peça a mesa, escolha o prato e converse com o atendimento.', icon: 'utensils', layout: 'training', setting: 'in-person', minutes: 12, skills: ['Pedidos e preferências', 'Números e preços', 'Pedidos educados'],
    speakerRole: 'Atendente',
    scenes: [
      'Restaurante movimentado, sexta à noite. Você acabou de sentar e o atendimento chega à sua mesa.',
      'Almoço de domingo num restaurante cheio. O atendimento vem anotar o seu pedido.',
      'Fim de noite, quase hora de fechar. Você pede a conta e o atendimento se aproxima.',
    ],
  },
  {
    id: 'street', title: 'Conversa na rua', description: 'Peça informação e converse com alguém que você encontra na rua.', icon: 'pin', layout: 'training', setting: 'in-person', minutes: 10, skills: ['Pedir e entender direções', 'Conversa informal', 'Fala rápida do dia a dia'],
    speakerRole: 'Pessoa na rua',
    scenes: [
      'Calçada cheia numa tarde de sábado. Uma pessoa que passa por ali para para conversar com você.',
      'Manhã fria, ponto de ônibus. Quem está ao seu lado puxa assunto.',
      'Você está perdido(a) num bairro novo. Uma pessoa na calçada percebe e se aproxima.',
    ],
  },
  {
    id: 'airport', title: 'Aeroporto', description: 'Faça check-in, passe pela segurança e encontre o portão.', icon: 'plane', layout: 'training', setting: 'in-person', minutes: 14, skills: ['Avisos e instruções', 'Horários e portões', 'Perguntas de segurança'],
    speakerRole: 'Atendente',
    scenes: [
      'Balcão de check-in lotado numa manhã de segunda. Chegou a sua vez.',
      'Madrugada no aeroporto, fila curta. O atendimento do balcão chama você.',
      'Quase na hora do embarque. Você corre até o balcão e o atendimento recebe você.',
    ],
  },
  {
    id: 'hotel', title: 'Hotel', description: 'Faça o check-in, tire dúvidas e peça ajuda à recepção.', icon: 'bed', layout: 'training', setting: 'in-person', minutes: 12, skills: ['Reservas e datas', 'Pedidos à recepção', 'Resolver imprevistos'],
    speakerRole: 'Recepção',
    scenes: [
      'Fim de tarde, você chega ao hotel com a mala na mão. A recepção recebe você.',
      'Saguão silencioso, tarde da noite. Você se aproxima da recepção para fazer o check-in.',
      'Manhã de checkout. Você vai até a recepção com uma dúvida sobre a estadia.',
    ],
  },
  {
    id: 'shopping', title: 'Compras', description: 'Pergunte preços e tamanhos, experimente e pague.', icon: 'bag', layout: 'training', setting: 'in-person', minutes: 12, skills: ['Preços e tamanhos', 'Pedidos e trocas', 'Formas de pagamento'],
    speakerRole: 'Atendente',
    scenes: [
      'Loja cheia num sábado de promoção. O atendimento se aproxima para ajudar você.',
      'Fim de tarde no shopping, loja tranquila. Você chama o atendimento para tirar uma dúvida.',
      'Você está no provador e precisa de outro tamanho. O atendimento vem até você.',
    ],
  },
  {
    id: 'job-interview', title: 'Entrevista de emprego', description: 'Apresente-se e responda perguntas sobre a sua experiência.', icon: 'briefcase', layout: 'training', setting: 'in-person', minutes: 16, skills: ['Apresentação pessoal', 'Perguntas sobre experiência', 'Respostas claras e formais'],
    speakerRole: 'Entrevistador(a)',
    scenes: [
      'Sala de reunião silenciosa, 9h da manhã. Quem vai entrevistar você acabou de entrar.',
      'Entrevista por videochamada, no meio da tarde. Quem entrevista abre a conversa.',
      'Recepção da empresa, um pouco antes do horário marcado. Quem vai entrevistar você chama o seu nome.',
    ],
  },
  {
    id: 'virtual-chat', title: 'Bate-papo virtual', description: 'Converse por mensagens de voz com um amigo ou colega.', icon: 'chat', layout: 'chat', setting: 'online', minutes: 8, skills: ['Mensagens de voz informais', 'Gírias e contrações', 'Responder por escrito'],
    speakerRole: 'Contato',
    scenes: [
      'Fim de tarde. Chega uma mensagem de voz de um contato que você conheceu num curso online.',
      'Noite de domingo. Um contato do trabalho manda uma mensagem de voz pelo celular.',
      'Intervalo do almoço. Um contato que você conheceu num grupo manda uma mensagem de voz.',
    ],
  },
]

/** Lista simples (sem os dados por sotaque), usada pela tela de escolha. */
export const SCENARIOS: Scenario[] = SITUATIONS.map(({ id, title, description, icon, layout, setting, minutes, skills }): Scenario => ({ id, title, description, icon, layout, setting, minutes, skills }))

export function situationFor(id: ScenarioId): Situation {
  const found = SITUATIONS.find((s) => s.id === id)
  if (!found) throw new Error(`Situação desconhecida: ${id}`)
  return found
}

export const speakerRoleFor = (id: ScenarioId): string => situationFor(id).speakerRole

/** Sorteia uma cena da situação (chamado uma vez por sessão). */
export function pickScene(id: ScenarioId): string {
  const { scenes } = situationFor(id)
  return scenes[Math.floor(Math.random() * scenes.length)]!
}
export const layoutFor = (id: ScenarioId): PracticeLayout => situationFor(id).layout
