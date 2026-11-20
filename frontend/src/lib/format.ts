import type { Accent } from '../types'

export const ACCENT_LABEL: Record<Accent, string> = {
  'en-US': 'Americano (US)',
  'en-GB': 'Britânico (UK)',
}

/** Forma curta, para resumos e barras. */
export const ACCENT_SHORT: Record<Accent, string> = {
  'en-US': 'US English',
  'en-GB': 'UK English',
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  const days = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(iso).setHours(0, 0, 0, 0)) / 86_400_000)
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

/** Data completa DD/MM/AAAA. */
export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s ? `${m} min ${s} s` : `${m} min`
}

/** Relógio m:ss. */
export function formatClock(seconds: number): string {
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
