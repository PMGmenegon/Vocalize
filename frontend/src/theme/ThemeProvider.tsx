import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  THEME_STORAGE_KEY,
  THEMES,
  DEFAULT_THEME,
  isTheme,
  type Theme,
} from './themes'
import { ThemeContext, type ThemeContextValue } from './ThemeContext'

/** Lê a escolha salva. O localStorage pode lançar (modo privado, bloqueado...), por isso o try/catch. */
function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

/**
 * Guarda o tema visual escolhido e o reflete no DOM: `<html data-theme="...">`
 * é o que faz o CSS trocar de tema (ver src/index.css).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  const fadeTimer = useRef<number | undefined>(undefined)

  const setTheme = useCallback((next: Theme) => {
    // Liga a transição suave de cores só durante a troca (e só se o usuário não pediu menos movimento).
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const root = document.documentElement
      root.classList.add('theme-fading')
      window.clearTimeout(fadeTimer.current)
      fadeTimer.current = window.setTimeout(() => root.classList.remove('theme-fading'), 450)
    }
    setThemeState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Sem localStorage o tema continua funcionando, só não persiste.
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEMES[theme].themeColor)
  }, [theme])

  useEffect(() => () => window.clearTimeout(fadeTimer.current), [])

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
