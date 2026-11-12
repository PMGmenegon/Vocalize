import { useId } from 'react'
import type { Accent } from '../theme/accents'

interface FlagProps {
  className?: string
}

const frame = 'flag rounded-[3px] ring-1 ring-black/25'

/** Estrela de 5 pontas centrada em (cx, cy). */
function star(cx: number, cy: number, r: number) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.382
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${(cx + radius * Math.cos(a)).toFixed(2)},${(cy + radius * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}

// Bandeira dos EUA (proporção 1,9:1): 50 estrelas em 9 fileiras alternadas de 6 e 5.
const CANTON_W = 76
const CANTON_H = 53.85
const STARS = Array.from({ length: 9 }, (_, row) =>
  Array.from({ length: row % 2 === 0 ? 6 : 5 }, (_, col) => ({
    x: (CANTON_W / 12) * (row % 2 === 0 ? 2 * col + 1 : 2 * col + 2),
    y: (CANTON_H / 10) * (row + 1),
  })),
).flat()
const STRIPE = 100 / 13

/** Bandeira dos EUA: 13 listras e 50 estrelas. */
export function FlagUS({ className = 'h-3.5 w-[1.625rem]' }: FlagProps) {
  return (
    <svg viewBox="0 0 190 100" className={`${frame} ${className}`} aria-hidden="true" focusable="false">
      <rect width="190" height="100" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={i * 2 * STRIPE} width="190" height={STRIPE} fill="#b22234" />
      ))}
      <rect width={CANTON_W} height={CANTON_H} fill="#3c3b6e" />
      <g fill="#fff">
        {STARS.map((s, i) => (
          <polygon key={i} points={star(s.x, s.y, 3.2)} />
        ))}
      </g>
    </svg>
  )
}

/** Bandeira do Reino Unido (Union Jack). */
export function FlagUK({ className = 'h-3.5 w-[1.625rem]' }: FlagProps) {
  const id = useId()
  const whole = `${id}-s`
  const quarters = `${id}-t`
  return (
    <svg viewBox="0 0 60 30" className={`${frame} ${className}`} aria-hidden="true" focusable="false">
      <clipPath id={whole}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={quarters}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${whole})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${quarters})`} stroke="#c8102e" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  )
}

export function Flag({ accent, className }: FlagProps & { accent: Accent }) {
  return accent === 'us' ? <FlagUS className={className} /> : <FlagUK className={className} />
}
