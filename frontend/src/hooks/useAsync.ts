import { useEffect, useRef, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading'; data?: undefined; reload: () => void }
  | { status: 'error'; data?: undefined; reload: () => void }
  | { status: 'success'; data: T; reload: () => void }

/**
 * Carrega dados de um serviço. `key` identifica a consulta: quando muda (ex.: o
 * filtro de período), busca de novo e volta ao estado "loading". `reload` tenta outra vez.
 */
export function useAsync<T>(load: () => Promise<T>, key = ''): AsyncState<T> {
  const loadRef = useRef(load)
  useEffect(() => {
    loadRef.current = load
  })
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{ id: string; data?: T; failed?: boolean } | null>(null)
  const id = `${key}#${attempt}`

  useEffect(() => {
    let cancelled = false
    loadRef.current().then(
      (data) => !cancelled && setResult({ id, data }),
      () => !cancelled && setResult({ id, failed: true }),
    )
    return () => {
      cancelled = true
    }
  }, [id])

  const reload = () => setAttempt((n) => n + 1)
  if (!result || result.id !== id) return { status: 'loading', reload }
  if (result.failed) return { status: 'error', reload }
  return { status: 'success', data: result.data as T, reload }
}
