import { useId } from 'react'
import type { Accent } from '../theme/accents'

interface FlagProps {
  className?: string
}

const frame = 'rounded-[3px] ring-1 ring-black/25'

const DOTS = [0, 1, 2].flatMap((row) =>
  [0, 1, 2, 3].map((col) => ({ x: 0.9 + col * 1.75 + (row % 2) * 0.85, y: 0.8 + row * 1.5 })),
)

/** Mini bandeira dos EUA (desenho próprio, simplificado). */
export function FlagUS({ className = 'h-3.5 w-[1.625rem]' }: FlagProps) {
  return (
    <svg viewBox="0 0 19 10" className={`${frame} ${className}`} aria-hidden="true" focusable="false">
      <rect width="19" height="10" fill="#b22234" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} y={0.77 + i * 1.54} width="19" height="0.77" fill="#fff" />
      ))}
      <rect width="7.6" height="5.4" fill="#3c3b6e" />
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="0.32" fill="#fff" />
      ))}
    </svg>
  )
}

/** Mini bandeira do Reino Unido (Union Jack). */
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
