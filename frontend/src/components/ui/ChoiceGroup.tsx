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
  /** Classes de grade (ex.: "sm:grid-cols-2"). */
  columns?: string
  /** Esconde a legenda visualmente (continua para leitores de tela). */
  hideLegend?: boolean
}

/**
 * Seleção de uma opção entre várias, com botões de rádio nativos (as setas do teclado
 * funcionam) estilizados como cartões. A opção marcada ganha borda grossa E um ✓,
 * então não depende só de cor.
 */
export default function ChoiceGroup<T extends string | number>({
  legend,
  value,
  options,
  onChange,
  columns = 'sm:grid-cols-2',
  hideLegend = false,
}: ChoiceGroupProps<T>) {
  const name = useId()
  return (
    <fieldset>
      <legend className={hideLegend ? 'sr-only' : 'mb-2 text-sm font-bold text-ink'}>{legend}</legend>
      <div className={`grid gap-3 ${columns}`}>
        {options.map((opt) => {
          const checked = opt.value === value
          return (
            <label
              key={opt.value}
              className={`relative flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--focus) ${
                checked ? 'border-brand bg-surface' : 'border-line bg-card hover:bg-surface'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {opt.icon && <span className="shrink-0 text-brand">{opt.icon}</span>}
              <span className="min-w-0 flex-1">
                <span className="block font-black text-ink">{opt.label}</span>
                {opt.description && <span className="mt-0.5 block text-sm text-muted">{opt.description}</span>}
              </span>
              {checked && (
                <span aria-hidden="true" className="absolute right-3 top-3 text-lg font-black text-brand">
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
