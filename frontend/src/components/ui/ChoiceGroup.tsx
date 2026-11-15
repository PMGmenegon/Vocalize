import { useId, type ReactNode } from 'react'

export interface Choice<T extends string | number> {
  value: T
  label: string
  description?: string
  icon?: ReactNode
}

interface ChoiceGroupProps<T extends string | number> {
  legend: string
  value: T
  options: readonly Choice<T>[]
  onChange: (value: T) => void
  /** card: cartões com borda · list: linhas com divisórias (sem caixas) · pill: botões compactos em linha. */
  variant?: 'card' | 'list' | 'pill'
  /** Classes de grade (variantes card e list). */
  columns?: string
  /** Esconde a legenda visualmente (continua para leitores de tela). */
  hideLegend?: boolean
}

const focus = 'has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--focus)'

/**
 * Seleção de uma opção entre várias, com botões de rádio nativos (as setas do teclado
 * funcionam). A opção marcada ganha destaque E um ✓, então não depende só de cor.
 */
export default function ChoiceGroup<T extends string | number>({
  legend,
  value,
  options,
  onChange,
  variant = 'card',
  columns = 'sm:grid-cols-2',
  hideLegend = false,
}: ChoiceGroupProps<T>) {
  const name = useId()
  const wrapper = variant === 'pill' ? 'flex flex-wrap gap-2' : variant === 'list' ? `grid border-t border-line ${columns}` : `grid gap-3 ${columns}`

  return (
    <fieldset>
      <legend className={hideLegend ? 'sr-only' : 'mb-2 text-sm font-bold text-ink'}>{legend}</legend>
      <div className={wrapper}>
        {options.map((opt) => {
          const checked = opt.value === value
          const box =
            variant === 'pill'
              ? `min-h-11 items-center rounded-full border-2 px-4 py-1.5 ${checked ? 'border-brand bg-brand text-on-brand' : 'border-control bg-card text-ink hover:bg-surface'}`
              : variant === 'list'
                ? `items-center border-b border-line px-3 py-4 ${checked ? 'bg-surface' : 'hover:bg-surface'}`
                : `rounded-xl border-2 p-4 pr-10 ${checked ? 'border-brand bg-surface' : 'border-line bg-card hover:bg-surface'}`
          return (
            <label key={opt.value} className={`relative flex cursor-pointer gap-3 transition-colors ${box} ${focus}`}>
              <input type="radio" name={name} value={opt.value} checked={checked} onChange={() => onChange(opt.value)} className="sr-only" />
              {opt.icon && <span className="shrink-0 text-brand">{opt.icon}</span>}
              <span className="min-w-0 flex-1">
                <span className={`block font-black ${variant === 'pill' ? 'text-sm' : ''}`}>{opt.label}</span>
                {opt.description && <span className="mt-0.5 block text-sm text-muted">{opt.description}</span>}
              </span>
              {checked && (
                <span aria-hidden="true" className={variant === 'card' ? 'absolute right-3 top-3 text-lg font-black text-brand' : variant === 'pill' ? 'font-black' : 'shrink-0 text-lg font-black text-brand'}>
                  ✓
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
