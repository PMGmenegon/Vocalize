import { useState } from 'react'
import { MODE_COPY } from '../../theme/modeCopy'
import { useTheme } from '../../theme/useTheme'
import Reveal from '../Reveal'

/** Níveis A2–C1: escolha um para ver o que muda, com um exemplo na grafia do modo atual. */
export default function Levels() {
  const { accent } = useTheme()
  const sp = MODE_COPY[accent].spelling
  const [selected, setSelected] = useState(0)

  const levels = [
    {
      code: 'A2',
      name: 'Básico',
      text: 'Frases curtas, fala mais lenta e vocabulário do dia a dia.',
      example: `I ${sp.practice} English every day.`,
    },
    {
      code: 'B1',
      name: 'Intermediário',
      text: 'Conversas simples sobre rotina, viagens e planos, em ritmo moderado.',
      example: `The bank is in the ${sp.center} of town.`,
    },
    {
      code: 'B2',
      name: 'Intermediário superior',
      text: 'Fala mais natural, opiniões e assuntos variados, com mais expressões.',
      example: `I prefer the ${sp.color} of the second one.`,
    },
    {
      code: 'C1',
      name: 'Avançado',
      text: 'Ritmo de falante nativo, nuances, expressões idiomáticas e frases longas.',
      example: 'She would have been more persuasive had she not hedged.',
    },
  ]
  const level = levels[selected] ?? levels[0]!

  return (
    <section id="niveis" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-black text-ink sm:text-4xl">Níveis</h2>
      <p className="mt-3 max-w-2xl text-muted">
        A velocidade da fala e o vocabulário mudam conforme o nível. Escolha um para ver.
      </p>

      <Reveal className="mt-10 grid gap-6 md:grid-cols-[auto_1fr] md:items-stretch">
        <div role="group" aria-label="Escolha um nível" className="flex gap-2 md:flex-col">
          {levels.map((l, i) => {
            const active = i === selected
            return (
              <button
                key={l.code}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(i)}
                className={[
                  'min-h-14 flex-1 cursor-pointer rounded-xl border-2 px-5 text-2xl font-black transition-all duration-200 active:scale-95 md:flex-none md:px-8',
                  active
                    ? 'surface-brand border-brand bg-brand text-on-brand md:translate-x-2'
                    : 'border-line bg-surface text-brand hover:border-brand',
                ].join(' ')}
              >
                {l.code}
              </button>
            )
          })}
        </div>

        <div key={level.code} aria-live="polite" className="fade-swap rounded-2xl bg-surface p-6 sm:p-8">
          {/* Degraus: quanto mais alto o nível, mais degraus acesos. */}
          <div className="flex items-end gap-1.5" aria-hidden="true">
            {levels.map((l, i) => (
              <span
                key={l.code}
                className={`w-8 rounded-sm transition-colors ${i <= selected ? 'bg-brand' : 'bg-line'}`}
                style={{ height: `${14 + i * 10}px` }}
              />
            ))}
          </div>
          <p className="mt-4 text-sm font-bold tracking-widest text-accent uppercase">Nível {level.code}</p>
          <h3 className="mt-1 text-2xl font-black text-ink">{level.name}</h3>
          <p className="mt-2 max-w-xl text-muted">{level.text}</p>
          <p
            lang={accent === 'us' ? 'en-US' : 'en-GB'}
            className="mt-5 rounded-xl bg-card p-4 text-lg font-bold text-ink"
          >
            {level.example}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
