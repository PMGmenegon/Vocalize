import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { SkeletonBlock } from '../components/ui/Skeleton'
import { postLoginPath } from './redirect'
import { useAuth } from './useAuth'

/** Telas só para visitantes (login, cadastro, esqueci a senha): com sessão ativa vão direto para o app. */
export default function GuestOnly() {
  const { user, status } = useAuth()
  const location = useLocation()

  // Sem "piscar" o formulário de login para quem já está logado.
  if (status === 'loading') return <SkeletonBlock lines={3} label="Verificando sua sessão…" />
  if (user) return <Navigate to={postLoginPath(user, location.state)} replace />
  return <Outlet />
}
