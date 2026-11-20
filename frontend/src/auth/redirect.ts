import type { User } from '../types'

const ONBOARDING = '/app/onboarding'

/** Rota pretendida guardada pelo RequireAuth em `location.state.from` (só caminhos dentro de /app). */
function intendedPath(state: unknown): string | null {
  const from = (state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from
  if (!from?.pathname || !from.pathname.startsWith('/app')) return null
  return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
}

/** Para onde ir depois de entrar: onboarding no primeiro acesso; senão a rota pretendida ou o dashboard. */
export function postLoginPath(user: Pick<User, 'onboarded'>, state?: unknown): string {
  if (!user.onboarded) return ONBOARDING
  return intendedPath(state) ?? '/app'
}
