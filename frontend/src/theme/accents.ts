/**
 * Sotaques suportados. O `code` é o valor gravado em `data-accent` no <html>
 * (e que o CSS em index.css usa para escolher o tema).
 */
export const ACCENTS = {
  us: {
    code: 'us',
    short: 'US',
    locale: 'en-US',
    label: 'Inglês americano',
    /** Cor da marca do tema; usada no <meta name="theme-color"> (barra do navegador no celular). */
    themeColor: '#b22234',
  },
  uk: {
    code: 'uk',
    short: 'UK',
    locale: 'en-GB',
    label: 'Inglês britânico',
    themeColor: '#012169',
  },
} as const

export type Accent = keyof typeof ACCENTS

export const ACCENT_LIST: readonly Accent[] = ['us', 'uk']

export const DEFAULT_ACCENT: Accent = 'us'

/**
 * Chave do localStorage. Precisa ser igual à usada pelo script inline do
 * index.html, que aplica o tema antes do React carregar (evita "piscar").
 */
export const ACCENT_STORAGE_KEY = 'vocalize:accent'

export function isAccent(value: unknown): value is Accent {
  return value === 'us' || value === 'uk'
}
