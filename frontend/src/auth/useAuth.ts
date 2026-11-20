import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from './AuthContext'

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa ser usado dentro de <AuthProvider>')
  return ctx
}

/** Para telas que só existem com usuário logado (dentro de RequireAuth). */
export function useUser() {
  const { user } = useAuth()
  if (!user) throw new Error('useUser usado sem usuário logado')
  return user
}

/** Sai e volta para a página inicial. Navega ANTES de limpar a sessão, para a rota protegida não mandar para /login. */
export function useSignOut() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  return useCallback(async () => {
    navigate('/', { replace: true })
    await signOut()
  }, [navigate, signOut])
}
