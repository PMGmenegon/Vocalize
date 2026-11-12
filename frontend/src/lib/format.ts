import type { Accent } from '../types'
import { ACCENTS, type Accent as ThemeAccent } from '../theme/accents'

export const ACCENT_LABEL: Record<Accent, string> = {
  'en-US': 'Americano (US)',
  'en-GB': 'Britânico (UK)',
}

/** Sotaque do conteúdo (locale) → tema visual. */
export const themeOf = (accent: Accent): ThemeAccent => (accent === 'en-GB' ? 'uk' : 'us')
export const localeOf = (theme: ThemeAccent): Accent => ACCENTS[theme].locale

export function formatDate(iso: string): string {
  const date = new Date(iso)
  const days = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(iso).setHours(0, 0, 0, 0)) / 86_400_000)
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s ? `${m} min ${s} s` : `${m} min`
}
