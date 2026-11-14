import type { ReactNode } from 'react'
import type { ScenarioIconKey } from '../types'
import { Icon } from './icons'

type P = { className?: string }

export const FlameIcon = ({ className }: P) => (
  <Icon className={className}>
    <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .2 1.2.9 2 1.8 2C11 8.5 11 5.5 12 3z" />
  </Icon>
)

export const PlayIcon = ({ className }: P) => (
  <Icon className={className}>
    <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
  </Icon>
)

export const ReplayIcon = ({ className }: P) => (
  <Icon className={className}>
    <path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5" />
  </Icon>
)

/** Tartaruga simplificada: velocidade reduzida. */
export const SlowIcon = ({ className }: P) => (
  <Icon className={className}>
    <path d="M4 16a8 7 0 0 1 16 0z" />
    <path d="M20 16h2M4 16l-2 1.5M8 20v-4M16 20v-4" />
  </Icon>
)

export const MicIcon = ({ className }: P) => (
  <Icon className={className}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </Icon>
)

export const SendIcon = ({ className }: P) => (
  <Icon className={className}>
    <path d="M3 11.5L21 3l-8.5 18-2.2-7.3z" />
  </Icon>
)

const utensils = (
  <>
    <path d="M6 3v7a2 2 0 0 0 2 2v9M10 3v7a2 2 0 0 1-2 2M6 3v7M18 21V3c-2.5 1.5-3 5-3 8h3" />
  </>
)
const briefcase = (
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" />
  </>
)
const plane = <path d="M3 13l18-8-5 15-4-6zM12 14l-1 5" />
const bed = (
  <>
    <path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-8v6" />
    <circle cx="6.5" cy="11.5" r="1.5" />
  </>
)
const bag = (
  <>
    <path d="M5 8h14l-1 12H6z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </>
)

const ICONS: Record<ScenarioIconKey, ReactNode> = {
  utensils,
  briefcase,
  plane,
  bed,
  bag,
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      <path d="M19 9h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-3-3h-4" />
    </>
  ),
}

/** Ícone de uma situação (chave definida em src/data/scenarios.ts). */
export function ScenarioIcon({ icon, className }: { icon: ScenarioIconKey; className?: string }) {
  return <Icon className={className}>{ICONS[icon]}</Icon>
}
