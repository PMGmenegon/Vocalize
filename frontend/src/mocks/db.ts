/**
 * "Banco" do mock: guarda o que precisa sobreviver a recarregar a página
 * (usuário logado, sessões de prática, cartões já revisados) e lê o modo de
 * simulação (?mock=erro | vazio | normal) usado para testar os estados da interface.
 */

const KEYS = {
  user: 'vocalize:mock-user',
  auth: 'vocalize:mock-auth',
  sessions: 'vocalize:mock-sessions',
  reviewed: 'vocalize:mock-reviewed',
  mode: 'vocalize:mock-mode',
} as const

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sem localStorage o mock continua valendo só até recarregar.
  }
}

export const db = {
  getUser: () => read<import('../types').User>(KEYS.user),
  setUser: (user: import('../types').User | null) => write(KEYS.user, user),
  isAuthenticated: () => read<boolean>(KEYS.auth) === true,
  setAuthenticated: (value: boolean) => write(KEYS.auth, value ? true : null),
  getSessions: () => read<Record<string, import('../types').Session>>(KEYS.sessions) ?? {},
  setSessions: (sessions: Record<string, import('../types').Session>) => write(KEYS.sessions, sessions),
  getReviewed: () => read<string[]>(KEYS.reviewed) ?? [],
  setReviewed: (ids: string[]) => write(KEYS.reviewed, ids),
}

export type MockMode = 'normal' | 'erro' | 'vazio'

/** Lê ?mock= da URL (e lembra a escolha na aba até `?mock=normal`). */
export function getMockMode(): MockMode {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('mock')
    if (fromUrl === 'erro' || fromUrl === 'vazio') sessionStorage.setItem(KEYS.mode, fromUrl)
    else if (fromUrl === 'normal') sessionStorage.removeItem(KEYS.mode)
    const saved = sessionStorage.getItem(KEYS.mode)
    return saved === 'erro' || saved === 'vazio' ? saved : 'normal'
  } catch {
    return 'normal'
  }
}
