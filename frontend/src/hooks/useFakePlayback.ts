import { useCallback, useEffect, useRef, useState } from 'react'

/** Duração simulada de uma fala a partir do número de palavras (o áudio real chega numa fase futura). */
export const fakeDuration = (wordCount: number) => Math.max(2, Math.round((wordCount * 0.42 + 0.8) * 10) / 10)

export const formatClock = (seconds: number) => {
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Reprodução SIMULADA (sem som): avança uma posição no tempo para animar a forma de onda.
 * `onRestart` é chamado sempre que a fala começa do início (conta uma repetição).
 * Quando houver áudio de verdade, só esta peça troca; os layouts continuam iguais.
 */
export function useFakePlayback(duration: number, onRestart: () => void) {
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [slow, setSlow] = useState(false)
  const posRef = useRef(0)
  const speed = slow ? 0.75 : 1

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      const next = Math.min(duration, posRef.current + 0.1 * speed)
      posRef.current = next
      setPos(next)
      if (next >= duration) setPlaying(false)
    }, 100)
    return () => window.clearInterval(id)
  }, [playing, speed, duration])

  const seek = useCallback((to: number) => {
    posRef.current = to
    setPos(to)
  }, [])

  const toggle = useCallback(() => {
    if (playing) {
      setPlaying(false)
      return
    }
    if (posRef.current === 0 || posRef.current >= duration - 0.05) {
      seek(0)
      onRestart()
    }
    setPlaying(true)
  }, [playing, duration, onRestart, seek])

  const repeat = useCallback(() => {
    seek(0)
    onRestart()
    setPlaying(true)
  }, [onRestart, seek])

  const back3 = useCallback(() => seek(Math.max(0, posRef.current - 3)), [seek])
  const toggleSpeed = useCallback(() => setSlow((s) => !s), [])

  return { playing, pos, duration, speed, slow, toggle, repeat, back3, toggleSpeed }
}

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
