import { useEffect, useState } from 'react'
import { sessionService } from '../services'

/** Texto da fala de uma rodada (para a voz sintetizada), ou `null` enquanto carrega. Não fala nada: só busca. */
export function useSpokenText(sessionId: string, turnIndex: number): string | null {
  const [loaded, setLoaded] = useState<{ key: string; text: string } | null>(null)
  const key = `${sessionId}:${turnIndex}`
  useEffect(() => {
    let alive = true
    sessionService.getSpokenText(sessionId, turnIndex).then(
      (text) => alive && setLoaded({ key, text }),
      () => undefined,
    )
    return () => {
      alive = false
    }
  }, [sessionId, turnIndex, key])
  return loaded?.key === key ? loaded.text : null
}
