import { db } from '../mocks/db'
import type { Accent, Level, PlacementRecord, User } from '../types'
import type { AuthUser } from './authService'
import { simulate } from './runtime'

export interface Preferences {
  level: Level
  accent: Accent
  /** Resultado do teste de nivelamento, quando o nível veio dele. Sem ele, o nível foi escolhido na mão. */
  placement?: PlacementRecord
}

/**
 * Perfil de estudo (nível, sotaque, onboarding concluído) do usuário logado.
 * MOCK: guardado no navegador, por id do usuário. Vai para o backend na Fase 8.
 */
export const profileService = {
  /** Perfil do usuário (cria um novo, sem onboarding, no primeiro acesso). Síncrono: lê do navegador. */
  load(auth: AuthUser): User {
    const stored = db.getProfiles()[auth.id]
    const user: User = {
      level: 'B1',
      accent: 'en-US',
      onboarded: false,
      ...stored,
      id: auth.id,
      name: auth.name,
      email: auth.email,
      createdAt: auth.createdAt,
    }
    db.setUser(user) // os demais mocks (histórico, revisão) leem o "usuário atual" daqui.
    return user
  },

  /** Esquece o "usuário atual" dos mocks ao sair. O perfil continua guardado para o próximo login. */
  clearCurrent() {
    db.setUser(null)
  },

  /** Salva nível, sotaque e (opcional) o resultado do teste de nivelamento. Também conclui o onboarding. */
  savePreferences(current: User, prefs: Preferences): Promise<User> {
    return simulate(() => {
      const user: User = { ...current, level: prefs.level, accent: prefs.accent, placement: prefs.placement, onboarded: true }
      db.setProfiles({ ...db.getProfiles(), [user.id]: user })
      db.setUser(user)
      return user
    }, 400)
  },
}
