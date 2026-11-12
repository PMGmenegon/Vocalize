import { db } from '../mocks/db'
import { DEMO_USER } from '../mocks/users'
import type { Accent, DailyGoal, Level, User } from '../types'
import { simulate } from './runtime'

export interface Credentials {
  email: string
  password: string
}
export interface Registration extends Credentials {
  name: string
}
export interface Preferences {
  level: Level
  accent: Accent
  dailyGoalMinutes: DailyGoal
}

function nameFromEmail(email: string) {
  const local = email.split('@')[0] ?? 'Estudante'
  return local.charAt(0).toUpperCase() + local.slice(1)
}

export const authService = {
  /** Usuário logado ou null. */
  getCurrentUser(): Promise<User | null> {
    return simulate(() => (db.isAuthenticated() ? db.getUser() : null), 200)
  },

  /** Mock: qualquer e-mail entra, como a usuária de demonstração (nível B1, 3 semanas de histórico). */
  login({ email }: Credentials): Promise<User> {
    return simulate(() => {
      const stored = db.getUser()
      const user: User =
        stored && stored.email.toLowerCase() === email.toLowerCase()
          ? stored
          : { ...DEMO_USER, email, name: nameFromEmail(email) }
      db.setUser(user)
      db.setAuthenticated(true)
      return user
    }, 700)
  },

  /** Conta nova: sem histórico e ainda sem onboarding. */
  register({ name, email }: Registration): Promise<User> {
    return simulate(() => {
      const user: User = {
        id: `u-${Date.now()}`,
        name,
        email,
        level: 'B1',
        accent: 'en-US',
        dailyGoalMinutes: 15,
        onboarded: false,
        createdAt: new Date().toISOString(),
      }
      db.setUser(user)
      db.setAuthenticated(true)
      return user
    }, 700)
  },

  logout(): Promise<void> {
    return simulate(() => {
      db.setAuthenticated(false)
    }, 150)
  },

  /** Salva nível, sotaque e meta. Também conclui o onboarding. */
  savePreferences(prefs: Preferences): Promise<User> {
    return simulate(() => {
      const current = db.getUser()
      if (!current) throw new Error('Sessão expirada.')
      const user: User = { ...current, ...prefs, onboarded: true }
      db.setUser(user)
      return user
    }, 400)
  },
}
