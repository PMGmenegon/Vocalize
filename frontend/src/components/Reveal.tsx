import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Atraso (ms) para escalonar vários itens. */
  delay?: number
  as?: 'div' | 'li' | 'section'
}

/**
 * Faz o conteúdo surgir suavemente ao entrar na tela. Sem IntersectionObserver
 * ou com "reduzir movimento", aparece já visível.
 */
export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')
  const visible = seen || reduced

  useEffect(() => {
    const el = ref.current
    if (visible || !el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
