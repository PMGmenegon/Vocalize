import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ACCENT_STORAGE_KEY,
  ACCENTS,
  DEFAULT_ACCENT,
  isAccent,
  type Accent,
} from './accents'
import { ThemeContext, type ThemeContextValue } from './ThemeContext'

/** Lê a escolha salva. O localStorage pode lançar (modo privado, bloqueado...), por isso o try/catch. */
function readStoredAccent(): Accent {
  try {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY)
    return isAccent(stored) ? stored : DEFAULT_ACCENT
  } catch {
    return DEFAULT_ACCENT
  }
}

/**
 * Guarda o sotaque escolhido e o reflete no DOM: `<html data-accent="...">`
 * é o que faz o CSS trocar de tema (ver src/index.css).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<Accent>(readStoredAccent)

  const setAccent = useCallback((next: Accent) => {
    setAccentState(next)
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, next)
    } catch {
      // Sem localStorage o tema continua funcionando, só não persiste.
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.accent = accent
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', ACCENTS[accent].themeColor)
  }, [accent])

  const value = useMemo<ThemeContextValue>(() => ({ accent, setAccent }), [accent, setAccent])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
