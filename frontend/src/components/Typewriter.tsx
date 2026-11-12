import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface TypewriterProps {
  text: string
  className?: string
  /** Milissegundos por letra. */
  speed?: number
}

/**
 * Digita o texto letra por letra. Use `key={text}` no pai para recomeçar quando o texto mudar.
 * Leitores de tela recebem o texto inteiro de uma vez; "reduzir movimento" mostra tudo direto.
 */
export default function Typewriter({ text, className = '', speed = 45 }: TypewriterProps) {
  const reduced = usePrefersReducedMotion()
  const [count, setCount] = useState(0)
  const shown = reduced ? text.length : count
  const done = shown >= text.length

  useEffect(() => {
    if (reduced || done) return
    const id = window.setInterval(() => setCount((c) => c + 1), speed)
    return () => window.clearInterval(id)
  }, [reduced, done, speed])

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {!reduced && <span className={`caret ${done ? 'caret-idle' : ''}`} />}
      </span>
    </span>
  )
}
