import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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

  const fadeTimer = useRef<number | undefined>(undefined)

  const setAccent = useCallback((next: Accent) => {
    // Liga a transição suave de cores só durante a troca (e só se o usuário não pediu menos movimento).
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const root = document.documentElement
      root.classList.add('theme-fading')
      window.clearTimeout(fadeTimer.current)
      fadeTimer.current = window.setTimeout(() => root.classList.remove('theme-fading'), 450)
    }
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

  useEffect(() => () => window.clearTimeout(fadeTimer.current), [])

  const value = useMemo<ThemeContextValue>(() => ({ accent, setAccent }), [accent, setAccent])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
