import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { SkeletonBlock } from '../components/ui/Skeleton'
import { useAuth } from './useAuth'

export const ONBOARDING_PATH = '/app/onboarding'

/**
 * Protege a área logada: visitante vai para /login (guardando a rota pretendida); quem ainda não fez o
 * onboarding é levado a ele antes de qualquer outra tela.
 * É só experiência do usuário: a segurança real é a validação do JWT no backend (Fase 8).
 */
export default function RequireAuth() {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <SkeletonBlock lines={3} label="Verificando sua sessão…" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (!user.onboarded && location.pathname !== ONBOARDING_PATH) return <Navigate to={ONBOARDING_PATH} replace />
  return <Outlet />
}
