import type { Theme } from './themes'

/** Textos e grafias que mudam conforme o modo (US ou UK). */
export interface ModeCopy {
  /** Frase de exemplo que o palco sonoro da landing fala (conteúdo de exercício, em inglês). */
  demoPhrase: string
  /** Tradução da frase de exemplo. */
  demoTranslation: string
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

export const MODE_COPY: Record<Theme, ModeCopy> = {
  us: {
    demoPhrase: 'Could we get the check, please?',
    demoTranslation: 'Podemos pedir a conta, por favor?',
    adjective: 'americano',
    spelling: { color: 'color', center: 'center', practice: 'practice' },
  },
  uk: {
    demoPhrase: 'Could we have the bill, please?',
    demoTranslation: 'Podemos pedir a conta, por favor?',
    adjective: 'britânico',
    spelling: { color: 'colour', center: 'centre', practice: 'practise' },
  },
}
