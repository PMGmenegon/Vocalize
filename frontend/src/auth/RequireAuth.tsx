import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { SkeletonBlock } from '../components/ui/Skeleton'
import { useAuth } from './useAuth'

export const ONBOARDING_PATH = '/app/onboarding'

/**
 * Protege a área logada: visitante vai para /login; quem ainda não fez o
 * onboarding é levado a ele antes de qualquer outra tela.
 */
export default function RequireAuth() {
  const { user, status } = useAuth()
  const { pathname } = useLocation()

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-md p-8">
        <SkeletonBlock lines={3} label="Verificando sua sessão…" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!user.onboarded && pathname !== ONBOARDING_PATH) return <Navigate to={ONBOARDING_PATH} replace />
  return <Outlet />
}
