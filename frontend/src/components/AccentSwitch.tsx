import { ACCENT_LIST, ACCENTS } from '../theme/accents'
import { useTheme } from '../theme/useTheme'

/**
 * Seletor US/UK. É um grupo de dois botões com `aria-pressed`: leitores de tela
 * anunciam o nome completo ("Inglês americano") e qual está ativo.
 */
export default function AccentSwitch() {
  const { accent, setAccent } = useTheme()

  return (
    <div
      role="group"
      aria-label="Sotaque do inglês"
      className="inline-flex rounded-full border-2 border-control p-0.5"
    >
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
              'min-h-9 min-w-11 cursor-pointer rounded-full px-3 text-sm font-bold tracking-wide transition-colors',
              active ? 'bg-brand text-on-brand' : 'text-ink hover:bg-surface',
            ].join(' ')}
          >
            {info.short}
          </button>
        )
      })}
    </div>
  )
}
