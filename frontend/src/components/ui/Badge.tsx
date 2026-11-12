import type { ReactNode } from 'react'

type Tone = 'neutral' | 'brand' | 'ok' | 'danger'

const tones: Record<Tone, string> = {
  neutral: 'border border-line bg-surface text-ink',
  brand: 'bg-brand text-on-brand',
  ok: 'bg-ok text-on-ok',
  danger: 'bg-danger text-on-danger',
}

export default function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  )
}
