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
  /** list: linhas com divisórias e barra de seleção (padrão) · pill: botões compactos em linha. */
  variant?: 'list' | 'pill'
  /** Classes de grade da variante list (ex.: "sm:grid-cols-2"). */
  columns?: string
  /** Esconde a legenda visualmente (continua para leitores de tela). */
  hideLegend?: boolean
}

const focus = 'has-[:focus-visible]:outline-3 has-[:focus-visible]:-outline-offset-3 has-[:focus-visible]:outline-(--focus)'

/**
 * Seleção de uma opção entre várias, com botões de rádio nativos (as setas do teclado
 * funcionam). A opção marcada ganha destaque E um ✓, então não depende só de cor.
 */
export default function ChoiceGroup<T extends string | number>({
  legend,
  value,
  options,
  onChange,
  variant = 'list',
  columns = '',
  hideLegend = false,
}: ChoiceGroupProps<T>) {
  const name = useId()
  const pill = variant === 'pill'

  return (
    <fieldset>
      <legend className={hideLegend ? 'sr-only' : 'type-eyebrow mb-2'}>{legend}</legend>
      <div className={pill ? 'flex flex-wrap gap-2' : `grid border-t border-line ${columns}`}>
        {options.map((opt) => {
          const checked = opt.value === value
          const box = pill
            ? `min-h-11 items-center rounded-full border-2 px-4 py-1.5 ${checked ? 'border-brand bg-brand text-on-brand' : 'border-control bg-card text-ink hover:bg-surface'} ${focus.replace('-outline-offset-3', 'outline-offset-2')}`
            : `group items-center border-b border-line py-4 pr-3 pl-5 ${checked ? 'bg-surface' : 'hover:bg-surface/70'} ${focus}`
          return (
            <label key={opt.value} className={`relative flex cursor-pointer gap-3 transition-colors ${box}`}>
              <input type="radio" name={name} value={opt.value} checked={checked} onChange={() => onChange(opt.value)} className="sr-only" />
              {!pill && <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 transition-colors ${checked ? 'bg-brand' : 'bg-transparent group-hover:bg-line'}`} />}
              {opt.icon && <span className="shrink-0 text-brand">{opt.icon}</span>}
              <span className="min-w-0 flex-1">
                <span className={`block font-black ${pill ? 'text-sm' : 'text-lg'}`}>{opt.label}</span>
                {opt.description && <span className="mt-0.5 block text-muted">{opt.description}</span>}
              </span>
              {checked && (
                <span aria-hidden="true" className={pill ? 'font-black' : 'shrink-0 text-lg font-black text-brand'}>
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
