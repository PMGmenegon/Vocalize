export type DifferenceKind = 'vocab' | 'pron' | 'spelling'

export interface Difference {
  kind: DifferenceKind
  /** Significado, em português. */
  meaning: string
  us: string
  uk: string
  /** Pronúncia aproximada (IPA) — só nos itens de pronúncia. */
  usSound?: string
  ukSound?: string
  /** Observação curta em português. */
  note?: string
}

export const KIND_LABEL: Record<DifferenceKind, string> = {
  vocab: 'Vocabulário',
  pron: 'Pronúncia',
  spelling: 'Grafia',
}

/** Diferenças reais entre inglês americano e britânico. */
export const DIFFERENCES: readonly Difference[] = [
  { kind: 'vocab', meaning: 'elevador', us: 'elevator', uk: 'lift' },
  { kind: 'vocab', meaning: 'apartamento', us: 'apartment', uk: 'flat' },
  { kind: 'vocab', meaning: 'biscoito', us: 'cookie', uk: 'biscuit' },
  { kind: 'vocab', meaning: 'outono', us: 'fall', uk: 'autumn' },
  { kind: 'vocab', meaning: 'metrô', us: 'subway', uk: 'underground', note: 'Em Londres também se diz "the Tube".' },
  { kind: 'vocab', meaning: 'férias', us: 'vacation', uk: 'holiday' },
  { kind: 'vocab', meaning: 'gasolina', us: 'gas', uk: 'petrol' },
  { kind: 'vocab', meaning: 'calçada', us: 'sidewalk', uk: 'pavement' },
  { kind: 'vocab', meaning: 'porta-malas', us: 'trunk', uk: 'boot' },
  {
    kind: 'pron',
    meaning: 'horário, programação',
    us: 'schedule',
    uk: 'schedule',
    usSound: '/ˈskɛdʒuːl/ (começa com "sk")',
    ukSound: '/ˈʃɛdjuːl/ (começa com "ch")',
  },
  {
    kind: 'pron',
    meaning: 'tomate',
    us: 'tomato',
    uk: 'tomato',
    usSound: '/təˈmeɪtoʊ/ ("tomêiro")',
    ukSound: '/təˈmɑːtəʊ/ ("tomárto")',
  },
  {
    kind: 'pron',
    meaning: 'não posso',
    us: "can't",
    uk: "can't",
    usSound: '/kænt/ (vogal curta)',
    ukSound: '/kɑːnt/ (vogal longa)',
  },
  {
    kind: 'pron',
    meaning: 'água',
    us: 'water',
    uk: 'water',
    usSound: '/ˈwɔːɾɚ/ (o "t" vira um "d" rápido)',
    ukSound: '/ˈwɔːtə/ (o "t" é nítido)',
  },
  {
    kind: 'pron',
    meaning: 'carro',
    us: 'car',
    uk: 'car',
    usSound: '/kɑːr/ (o "r" final é pronunciado)',
    ukSound: '/kɑː/ (o "r" final fica mudo)',
  },
  { kind: 'spelling', meaning: 'cor', us: 'color', uk: 'colour' },
  { kind: 'spelling', meaning: 'centro', us: 'center', uk: 'centre' },
  {
    kind: 'spelling',
    meaning: 'praticar (verbo)',
    us: 'practice',
    uk: 'practise',
    note: 'No Reino Unido, "practice" é só o substantivo.',
  },
]
