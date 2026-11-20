import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService, profileService, type AuthService, type AuthSession } from '../services'
import type { User } from '../types'
import { AuthContext, type AuthContextValue } from './AuthContext'

interface AuthState {
  session: AuthSession | null
  user: User | null
}
const SIGNED_OUT: AuthState = { session: null, user: null }

/**
 * Guarda a sessão e o usuário logado. Fala só com authService (Supabase) e profileService (mock até a Fase 8).
 * A sessão persiste e o token é renovado sozinho pelo Supabase; aqui só reagimos às mudanças.
 */
export function AuthProvider({ children, service = authService }: { children: ReactNode; service?: AuthService }) {
  const [state, setState] = useState<AuthState>(SIGNED_OUT)
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')

  /** Aplica uma sessão. Se for o mesmo usuário (ex.: renovação do token), mantém o objeto e não re-renderiza o app. */
  const apply = useCallback((session: AuthSession | null) => {
    setState((prev) => {
      if (!session) return prev.session === null ? prev : SIGNED_OUT
      const p = prev.session?.user
      const unchanged = p?.id === session.user.id && p.name === session.user.name && p.email === session.user.email
      return unchanged ? prev : { session, user: profileService.load(session.user) }
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    let unsubscribe: (() => void) | undefined
    try {
      unsubscribe = service.onAuthStateChange((_event, session) => !cancelled && apply(session))
    } catch (error) {
      console.error(error)
    }
    service
      .getSession()
      .then((session) => !cancelled && apply(session))
      .catch((error) => {
        console.error(error)
        if (!cancelled) apply(null)
      })
      .finally(() => !cancelled && setStatus('ready'))
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [service, apply])

  const { user, session } = state

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      status,
      signUp: async (registration) => {
        const result = await service.signUp(registration)
        apply(result.session)
        return { ...result, user: result.session ? profileService.load(result.session.user) : null }
      },
      signIn: async (credentials) => {
        const next = await service.signIn(credentials)
        apply(next)
        return profileService.load(next.user)
      },
      signInWithGoogle: () => service.signInWithGoogle(),
      signOut: async () => {
        try {
          await service.signOut()
        } finally {
          profileService.clearCurrent()
          apply(null)
        }
      },
      requestPasswordReset: (email) => service.requestPasswordReset(email),
      updatePassword: (password) => service.updatePassword(password),
      resendConfirmation: (email) => service.resendConfirmation(email),
      savePreferences: async (prefs) => {
        if (!user) throw new Error('Sessão expirada.')
        const next = await profileService.savePreferences(user, prefs)
        setState((prev) => ({ ...prev, user: next }))
        return next
      },
    }),
    [user, session, status, service, apply],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
