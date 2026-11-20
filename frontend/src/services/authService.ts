import type { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js'
import { getSupabase } from '../lib/supabase'
import { AuthFailure, translateAuthError } from './authErrors'

export interface Credentials {
  email: string
  password: string
}
export interface Registration extends Credentials {
  name: string
}
/** Quem está autenticado (dados do provedor de login, não do perfil de estudo). */
export interface AuthUser {
  id: string
  name: string
  email: string
  createdAt: string
}
export interface AuthSession {
  user: AuthUser
}
export interface SignUpResult {
  email: string
  /** Sessão imediata (confirmação de e-mail desligada) ou null (precisa confirmar o e-mail). */
  session: AuthSession | null
}
export type AuthEvent = 'INITIAL_SESSION' | 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY'

/** Contrato de autenticação. Telas e componentes só conhecem esta interface, nunca o Supabase. */
export interface AuthService {
  signUp(registration: Registration): Promise<SignUpResult>
  signIn(credentials: Credentials): Promise<AuthSession>
  /** Redireciona o navegador para o Google. Rejeita com AuthFailure('provider_unavailable') se o provedor estiver desligado. */
  signInWithGoogle(): Promise<void>
  signOut(): Promise<void>
  getSession(): Promise<AuthSession | null>
  /** Devolve a função que cancela a assinatura. */
  onAuthStateChange(callback: (event: AuthEvent, session: AuthSession | null) => void): () => void
  requestPasswordReset(email: string): Promise<void>
  updatePassword(password: string): Promise<void>
  resendConfirmation(email: string): Promise<void>
}

function toAuthUser(user: SupabaseUser): AuthUser {
  const name = user.user_metadata?.name
  return {
    id: user.id,
    name: typeof name === 'string' && name.trim() ? name : (user.email?.split('@')[0] ?? 'Estudante'),
    email: user.email ?? '',
    createdAt: user.created_at,
  }
}

function toAuthSession(session: SupabaseSession | null): AuthSession | null {
  return session ? { user: toAuthUser(session.user) } : null
}

/** Roda uma chamada do SDK, que devolve { error } ou lança, e converte qualquer falha em AuthFailure (português). */
async function call<T extends { error: unknown }>(run: () => Promise<T>): Promise<T> {
  let result: T
  try {
    result = await run()
  } catch (error) {
    throw translateAuthError(error)
  }
  if (result.error) throw translateAuthError(result.error)
  return result
}

export const supabaseAuthService: AuthService = {
  async signUp({ name, email, password }) {
    const { data } = await call(() =>
      getSupabase().auth.signUp({
        email,
        password,
        options: { data: { name }, emailRedirectTo: `${window.location.origin}/app` },
      }),
    )
    // Com confirmação ligada, e-mail já cadastrado não gera erro: o Supabase devolve um usuário sem identidades.
    if (data.user && data.user.identities?.length === 0) throw new AuthFailure('email_taken')
    return { email, session: toAuthSession(data.session) }
  },

  async signIn({ email, password }) {
    const { data } = await call(() => getSupabase().auth.signInWithPassword({ email, password }))
    const session = toAuthSession(data.session)
    if (!session) throw new AuthFailure('unknown')
    return session
  },

  async signInWithGoogle() {
    await call(() =>
      getSupabase().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/app` } }),
    )
  },

  async signOut() {
    await call(() => getSupabase().auth.signOut())
  },

  async getSession() {
    const { data } = await call(() => getSupabase().auth.getSession())
    return toAuthSession(data.session)
  },

  onAuthStateChange(callback) {
    const { data } = getSupabase().auth.onAuthStateChange((event, session) => {
      callback(event as AuthEvent, toAuthSession(session))
    })
    return () => data.subscription.unsubscribe()
  },

  async requestPasswordReset(email) {
    await call(() => getSupabase().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/redefinir-senha` }))
  },

  async updatePassword(password) {
    await call(() => getSupabase().auth.updateUser({ password }))
  },

  async resendConfirmation(email) {
    await call(() =>
      getSupabase().auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${window.location.origin}/app` } }),
    )
  },
}

export const authService: AuthService = supabaseAuthService
