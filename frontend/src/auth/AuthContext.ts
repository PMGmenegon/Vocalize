import { createContext } from 'react'
import type { Credentials, Preferences, Registration } from '../services'
import type { User } from '../types'

export interface AuthContextValue {
  /** Usuário logado (null = visitante). */
  user: User | null
  /** 'loading' enquanto confere se já existe uma sessão. */
  status: 'loading' | 'ready'
  login: (credentials: Credentials) => Promise<User>
  register: (registration: Registration) => Promise<User>
  logout: () => Promise<void>
  savePreferences: (prefs: Preferences) => Promise<User>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
