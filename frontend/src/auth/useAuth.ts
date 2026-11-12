import { useContext } from 'react'
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
