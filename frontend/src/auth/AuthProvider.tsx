import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../services'
import type { User } from '../types'
import { AuthContext, type AuthContextValue } from './AuthContext'

/** Guarda o usuário logado. Fala só com authService (mock hoje, API depois). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')

  useEffect(() => {
    let cancelled = false
    authService
      .getCurrentUser()
      .then((current) => !cancelled && setUser(current))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setStatus('ready'))
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login: async (credentials) => {
        const next = await authService.login(credentials)
        setUser(next)
        return next
      },
      register: async (registration) => {
        const next = await authService.register(registration)
        setUser(next)
        return next
      },
      logout: async () => {
        await authService.logout()
        setUser(null)
      },
      savePreferences: async (prefs) => {
        const next = await authService.savePreferences(prefs)
        setUser(next)
        return next
      },
    }),
    [user, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
