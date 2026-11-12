import { getMockMode } from '../mocks/db'

/**
 * Simulação de rede dos serviços falsos. Na API real este arquivo some:
 * cada serviço passará a chamar `fetch`.
 *
 * Modos de teste (via URL, lembrados na aba): ?mock=erro (toda chamada falha),
 * ?mock=vazio (listas voltam vazias), ?mock=normal (desliga).
 */
export const isEmptyMode = () => getMockMode() === 'vazio'

export function simulate<T>(produce: () => T, delayMs = 350): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    window.setTimeout(() => {
      if (getMockMode() === 'erro') {
        reject(new Error('Falha simulada (?mock=erro).'))
        return
      }
      try {
        resolve(produce())
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Erro inesperado.'))
      }
    }, delayMs)
  })
}

/** Data (ISO) de "n dias atrás", ao meio-dia. */
export function daysAgoIso(daysAgo: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}
