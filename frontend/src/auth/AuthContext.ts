import { createContext } from 'react'
import type { AuthSession, Credentials, Preferences, Registration, SignUpResult } from '../services'
import type { User } from '../types'

export interface AuthContextValue {
  /** Usuário logado, já com o perfil de estudo (null = visitante). */
  user: User | null
  session: AuthSession | null
  /** 'loading' enquanto confere se já existe uma sessão. */
  status: 'loading' | 'ready'
  signUp: (registration: Registration) => Promise<SignUpResult & { user: User | null }>
  signIn: (credentials: Credentials) => Promise<User>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  resendConfirmation: (email: string) => Promise<void>
  savePreferences: (prefs: Preferences) => Promise<User>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
