interface ProgressBarProps {
  value: number
  max?: number
  /** Nome acessível ("Progresso do onboarding"). */
  label: string
  /** Texto legível do valor ("Etapa 2 de 3"). */
  valueText?: string
  className?: string
}

export default function ProgressBar({ value, max = 100, label, valueText, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, max === 0 ? 0 : (value / max) * 100))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(value, max)}
      aria-valuetext={valueText}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-line ${className}`}
    >
      <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  )
}
