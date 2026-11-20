import { Flag } from '../Flags'
import UsVsUk from '../UsVsUk'
import { THEME_LIST, THEMES, type Theme } from '../../theme/themes'
import { useTheme } from '../../theme/useTheme'
import HomeSection from './HomeSection'

interface Example {
  title: string
  text: string
  /** Palavras de exemplo, sempre com o significado em português ao lado. */
  words: { term: string; meaning: string }[]
}

const EXAMPLES: Record<Theme, Example> = {
  us: {
    title: 'Americano',
    text: 'Nova York, Califórnia, táxis amarelos. O "r" final é pronunciado e o "t" no meio da palavra soa como um "d" rápido.',
    words: [
      { term: 'elevator', meaning: 'elevador' },
      { term: 'apartment', meaning: 'apartamento' },
      { term: 'cookie', meaning: 'biscoito' },
    ],
  },
  uk: {
    title: 'Britânico',
    text: 'Londres, ônibus vermelhos, cabines telefônicas. O "r" final fica mudo e o "t" é pronunciado com clareza.',
    words: [
      { term: 'lift', meaning: 'elevador' },
      { term: 'flat', meaning: 'apartamento' },
      { term: 'biscuit', meaning: 'biscoito' },
    ],
  },
}

/** Os dois lados lado a lado, com botão para escolher o modo ali mesmo. */
export default function ThemeChoice() {
  const { theme, setTheme } = useTheme()

  return (
    <HomeSection id="sotaques" eyebrow="Sotaques" title="Americano ou britânico?" description="Escolha o sotaque que você quer treinar. O visual, os textos e a voz acompanham o modo.">
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
        {THEME_LIST.map((code) => {
          const info = THEMES[code]
          const ex = EXAMPLES[code]
          const active = code === theme
          return (
            <article key={code} className={`border-t-2 pt-5 ${active ? 'border-brand' : 'border-ink'}`}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="type-display inline-flex items-center gap-3 text-3xl">
                  <Flag theme={code} />
                  {ex.title} ({info.short})
                </h3>
                {active && (
                  <span className="type-eyebrow text-brand">
                    <span aria-hidden="true">✓ </span>Modo atual
                  </span>
                )}
              </div>
              <p className="mt-3 text-ink">{ex.text}</p>
              <p className="mt-3 text-muted">
                Por exemplo, para dizer “elevador”, “apartamento” e “biscoito” no inglês {ex.title.toLowerCase()}:{' '}
                {ex.words.map((w, i) => (
                  <span key={w.term}>
                    <span lang={info.locale} className="font-bold text-ink">
                      {w.term}
                    </span>
                    {i < ex.words.length - 2 ? ', ' : i === ex.words.length - 2 ? ' e ' : '.'}
                  </span>
                ))}
              </p>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setTheme(code)}
                className={[
                  'mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border-2 px-5 text-base font-bold transition-colors',
                  active ? 'border-brand bg-brand text-on-brand' : 'border-control bg-card text-link hover:bg-surface',
                ].join(' ')}
              >
                {active ? `Modo ${ex.title.toLowerCase()} ativo` : `Escolher modo ${ex.title.toLowerCase()}`}
              </button>
            </article>
          )
        })}
      </div>

      <div className="mt-14">
        <UsVsUk />
      </div>
    </HomeSection>
  )
}
