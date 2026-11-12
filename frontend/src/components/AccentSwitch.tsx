import { ACCENT_LIST, ACCENTS } from '../theme/accents'
import { useTheme } from '../theme/useTheme'
import { Flag } from './Flags'

/**
 * Seletor US/UK. É um grupo de dois botões com `aria-pressed`: leitores de tela
 * anunciam o nome completo ("Inglês americano") e qual está ativo.
 * Um indicador desliza de um lado ao outro quando o modo muda.
 */
export default function AccentSwitch() {
  const { accent, setAccent } = useTheme()
  const activeIndex = ACCENT_LIST.indexOf(accent)

  return (
    <div
      role="group"
      aria-label="Sotaque do inglês"
      className="relative inline-grid grid-cols-2 rounded-full border-2 border-control p-0.5"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-0.125rem)] rounded-full bg-brand transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {ACCENT_LIST.map((code) => {
        const info = ACCENTS[code]
        const active = code === accent
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            aria-label={`${info.label} (${info.locale})`}
            onClick={() => setAccent(code)}
            className={[
              'relative z-10 inline-flex min-h-9 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 text-sm font-bold tracking-wide transition-colors duration-300 sm:px-3',
              active ? 'text-on-brand' : 'text-ink',
            ].join(' ')}
          >
            <Flag accent={code} />
            {info.short}
          </button>
        )
      })}
    </div>
  )
}
