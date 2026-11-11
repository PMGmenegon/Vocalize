import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeContext'

/** Acesso ao tema atual. Só funciona dentro de <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme precisa ser usado dentro de <ThemeProvider>')
  }
  return ctx
}
