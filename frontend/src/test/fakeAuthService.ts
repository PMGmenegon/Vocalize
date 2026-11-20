import type { AuthEvent, AuthService, AuthSession } from '../services'
import { AuthFailure } from '../services'

export const FAKE_SESSION: AuthSession = {
  user: { id: 'u-1', name: 'Ana', email: 'ana@exemplo.com', createdAt: '2026-01-01T00:00:00.000Z' },
}

/** AuthService falso para os testes: nenhuma chamada de rede, nenhuma chave real. */
export function createFakeAuthService(initial: AuthSession | null = null) {
  let session = initial
  const listeners = new Set<(event: AuthEvent, session: AuthSession | null) => void>()
  const emit = (event: AuthEvent) => listeners.forEach((l) => l(event, session))

  const service: AuthService = {
    signUp: async ({ email }) => ({ email, session: null }),
    signIn: async ({ email, password }) => {
      if (password !== 'senha1234') throw new AuthFailure('invalid_credentials')
      session = { user: { ...FAKE_SESSION.user, email } }
      emit('SIGNED_IN')
      return session
    },
    signOut: async () => {
      session = null
      emit('SIGNED_OUT')
    },
    getSession: async () => session,
    onAuthStateChange: (callback) => {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    requestPasswordReset: async () => {},
    updatePassword: async () => {},
    resendConfirmation: async () => {},
  }
  return { service, listeners, setSession: (next: AuthSession | null) => (session = next), emit }
}
