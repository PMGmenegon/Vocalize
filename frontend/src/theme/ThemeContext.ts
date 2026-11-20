import { createContext } from 'react'
import type { Theme } from './themes'

export interface ThemeContextValue {
  /** Tema visual atual (preferência do navegador; independente do sotaque de estudo). */
  theme: Theme
  /** Troca o tema e salva no localStorage. Só o seletor US/UK deve chamar isto. */
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
