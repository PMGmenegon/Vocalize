import { createContext } from 'react'
import type { Accent } from './accents'

export interface ThemeContextValue {
  /** Sotaque/tema atual. */
  accent: Accent
  /** Troca o sotaque, aplica o tema e salva a escolha no localStorage. */
  setAccent: (accent: Accent) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
