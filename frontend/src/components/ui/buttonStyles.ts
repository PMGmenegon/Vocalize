export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand hover:bg-brand-strong',
  secondary: 'border-2 border-control bg-card text-link hover:bg-surface',
  ghost: 'text-link hover:bg-surface',
  danger: 'border-2 border-on-danger bg-danger text-on-danger hover:brightness-95',
}

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-4 py-2 text-sm',
  lg: 'min-h-14 px-7 py-3 text-lg',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim()
}
