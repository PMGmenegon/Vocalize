import type { User } from '../types'

/** Usuária do mock: nível B1, três semanas de histórico (ver history.ts). */
export const DEMO_USER: User = {
  id: 'u-demo',
  name: 'Ana Souza',
  email: 'ana@exemplo.com',
  level: 'B1',
  accent: 'en-US',
  dailyGoalMinutes: 15,
  onboarded: true,
  createdAt: new Date(Date.now() - 21 * 86_400_000).toISOString(),
}
