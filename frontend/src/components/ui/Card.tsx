import type { ElementType, ReactNode } from 'react'

interface CardProps {
  as?: ElementType
  className?: string
  children: ReactNode
  tone?: 'default' | 'soft' | 'brand'
}

const tones = {
  default: 'border border-line bg-canvas text-ink',
  soft: 'border border-line bg-surface text-ink',
  brand: 'surface-brand bg-brand text-on-brand',
}

export default function Card({ as: Tag = 'div', className = '', tone = 'default', children }: CardProps) {
  return <Tag className={`rounded-2xl p-5 sm:p-6 ${tones[tone]} ${className}`}>{children}</Tag>
}
