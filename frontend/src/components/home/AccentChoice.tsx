import { Flag } from '../Flags'
import UsVsUk from '../UsVsUk'
import { ACCENT_LIST, ACCENTS, type Accent } from '../../theme/accents'
import { useTheme } from '../../theme/useTheme'

const EXAMPLES: Record<Accent, { title: string; text: string; words: string }> = {
  us: {
    title: 'Americano',
    text: 'Nova York, Califórnia, táxis amarelos. O "r" final é pronunciado e o "t" no meio da palavra soa como um "d" rápido.',
    words: 'elevator · apartment · cookie · fall · subway · vacation',
  },
  uk: {
    title: 'Britânico',
    text: 'Londres, ônibus vermelhos, cabines telefônicas. O "r" final fica mudo e o "t" é pronunciado com clareza.',
    words: 'lift · flat · biscuit · autumn · underground · holiday',
  },
}

/** Os dois lados lado a lado, com botão para escolher o modo ali mesmo. */
export default function AccentChoice() {
  const { accent, setAccent } = useTheme()

  return (
    <section id="sotaques" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-black text-ink sm:text-4xl">Americano ou britânico?</h2>
      <p className="mt-3 max-w-2xl text-muted">
        Escolha o sotaque que você quer treinar. O visual, os textos e a voz acompanham o modo.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {ACCENT_LIST.map((code) => {
          const info = ACCENTS[code]
          const ex = EXAMPLES[code]
          const active = code === accent
          return (
            <article
              key={code}
              className={`rounded-2xl border-2 bg-surface p-5 transition-all duration-200 hover:shadow-lg motion-safe:hover:-translate-y-1 sm:p-6 ${active ? 'border-brand' : 'border-line hover:border-brand'}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="inline-flex items-center gap-2 text-xl font-black text-ink">
                  <Flag accent={code} />
                  {ex.title} ({info.short})
                </h3>
                {active && (
                  <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-on-brand">Modo atual</span>
                )}
              </div>
              <p className="mt-2 text-muted">{ex.text}</p>
              <p lang={info.locale} className="mt-3 font-bold text-ink">
                {ex.words}
              </p>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setAccent(code)}
                className={[
                  'mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border-2 px-5 text-base font-bold transition-all active:scale-95',
                  active
                    ? 'border-brand bg-brand text-on-brand'
                    : 'border-control bg-canvas text-brand hover:bg-canvas/60',
                ].join(' ')}
              >
                {active ? `Modo ${ex.title.toLowerCase()} ativo` : `Escolher modo ${ex.title.toLowerCase()}`}
              </button>
            </article>
          )
        })}
      </div>

      <div className="mt-8">
        <UsVsUk />
      </div>
    </section>
  )
}
