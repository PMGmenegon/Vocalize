import type { Accent } from './accents'

/** Textos e grafias que mudam conforme o modo (US ou UK). */
export interface ModeCopy {
  /** Saudação curta no cabeçalho da área logada. */
  greeting: string
  /** Frase de destaque do hero (em inglês). */
  tagline: string
  /** Tradução da frase de destaque. */
  taglineTranslation: string
  /** Nome do modo para aparecer no texto ("americano" / "britânico"). */
  adjective: string
  /** Grafias de palavras em inglês exibidas na interface. */
  spelling: {
    color: string
    center: string
    /** Verbo: "practice" (US) / "practise" (UK). */
    practice: string
  }
}

export const MODE_COPY: Record<Accent, ModeCopy> = {
  us: {
    greeting: 'Hey there!',
    tagline: 'Sound like a New Yorker.',
    taglineTranslation: 'Fale como um nova-iorquino.',
    adjective: 'americano',
    spelling: { color: 'color', center: 'center', practice: 'practice' },
  },
  uk: {
    greeting: 'Hiya!',
    tagline: 'Sound like a Londoner.',
    taglineTranslation: 'Fale como um londrino.',
    adjective: 'britânico',
    spelling: { color: 'colour', center: 'centre', practice: 'practise' },
  },
}
