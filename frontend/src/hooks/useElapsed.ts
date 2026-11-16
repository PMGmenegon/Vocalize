import { useEffect, useState } from 'react'

/** Segundos decorridos desde `startedAt` (atualiza a cada segundo). */
export function useElapsed(startedAt: string): number {
  const start = new Date(startedAt).getTime()
  const [seconds, setSeconds] = useState(() => Math.max(0, Math.floor((Date.now() - start) / 1000)))
  useEffect(() => {
    const id = window.setInterval(() => setSeconds(Math.max(0, Math.floor((Date.now() - start) / 1000))), 1000)
    return () => window.clearInterval(id)
  }, [start])
  return seconds
}
