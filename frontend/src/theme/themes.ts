/**
 * TEMA VISUAL (paleta de cores): 'us' | 'uk'.
 *
 * Não confundir com o SOTAQUE DE ESTUDO (`Accent`: 'en-US' | 'en-GB', em
 * src/types), que é a preferência de estudo do perfil e define só a voz.
 * O tema é preferência visual, salva no navegador, e só muda quando o usuário
 * escolhe no seletor US/UK. O `code` é o valor gravado em `data-theme` no <html>
 * (o CSS em index.css usa esse atributo).
 */
export const THEMES = {
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

export type Theme = keyof typeof THEMES

export const THEME_LIST: readonly Theme[] = ['us', 'uk']

export const DEFAULT_THEME: Theme = 'us'

/**
 * Chave do localStorage. Precisa ser igual à usada pelo script inline do
 * index.html, que aplica o tema antes do React carregar (evita "piscar").
 * (O valor mantém o nome antigo para não perder a escolha já salva.)
 */
export const THEME_STORAGE_KEY = 'vocalize:accent'

export function isTheme(value: unknown): value is Theme {
  return value === 'us' || value === 'uk'
}
