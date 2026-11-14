import { useEffect, useState } from 'react'

/** Hora atual (HH:MM) no fuso informado, atualizada a cada minuto. */
export function useWorldClock(timeZone: string): string {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date())
  const [time, setTime] = useState(format)

  useEffect(() => {
    // Confere a cada 15 s para trocar logo que o minuto vira; só re-renderiza quando o texto muda.
    const id = window.setInterval(() => {
      const next = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date())
      setTime((prev) => (prev === next ? prev : next))
    }, 15_000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return time
}

export const NYC_TZ = 'America/New_York'
export const LDN_TZ = 'Europe/London'
