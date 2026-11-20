import { useState } from 'react'
import { MODE_COPY } from '../../theme/modeCopy'
import { useTheme } from '../../theme/useTheme'
import Reveal from '../Reveal'
import HomeSection from './HomeSection'

/** Níveis A2–C1: escolha um para ver o que muda, com um exemplo na grafia do modo atual. */
export default function Levels() {
  const { theme } = useTheme()
  const sp = MODE_COPY[theme].spelling
  const [selected, setSelected] = useState(0)

  const levels = [
    {
      code: 'A2',
      name: 'Básico',
      text: 'Frases curtas, fala mais lenta e vocabulário do dia a dia.',
      example: `I ${sp.practice} English every day.`,
      translation: 'Eu pratico inglês todos os dias.',
    },
    {
      code: 'B1',
      name: 'Intermediário',
      text: 'Conversas simples sobre rotina, viagens e planos, em ritmo moderado.',
      example: `The bank is in the ${sp.center} of town.`,
      translation: 'O banco fica no centro da cidade.',
    },
    {
      code: 'B2',
      name: 'Intermediário superior',
      text: 'Fala mais natural, opiniões e assuntos variados, com mais expressões.',
      example: `I prefer the ${sp.color} of the second one.`,
      translation: 'Prefiro a cor do segundo.',
    },
    {
      code: 'C1',
      name: 'Avançado',
      text: 'Ritmo de falante nativo, nuances, expressões idiomáticas e frases longas.',
      example: 'She would have been more persuasive had she not hedged.',
      translation: 'Ela teria sido mais persuasiva se não tivesse hesitado.',
    },
  ]
  const level = levels[selected] ?? levels[0]!

  return (
    <HomeSection id="niveis" eyebrow="Níveis" title="Do A2 ao C1" description="A velocidade da fala e o vocabulário mudam conforme o nível. Escolha um para ver.">
      <Reveal>
        <div role="group" aria-label="Escolha um nível" className="grid grid-cols-4 border-b border-line sm:max-w-md">
          {levels.map((l, i) => {
            const active = i === selected
            return (
              <button
                key={l.code}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(i)}
                className={`relative min-h-12 cursor-pointer text-2xl font-black transition-colors ${active ? 'text-brand' : 'text-muted hover:text-ink'}`}
              >
                {l.code}
                <span aria-hidden="true" className={`absolute inset-x-0 -bottom-px h-0.5 transition-colors ${active ? 'bg-brand' : 'bg-transparent'}`} />
              </button>
            )
          })}
        </div>

        <div key={level.code} aria-live="polite" className="fade-swap grid gap-x-12 gap-y-6 pt-8 md:grid-cols-2">
          <div>
            <p className="type-eyebrow text-brand">Nível {level.code}</p>
            <h3 className="type-display mt-1 text-3xl">{level.name}</h3>
            <p className="mt-3 max-w-xl text-lg text-muted">{level.text}</p>
          </div>
          <div className="border-l-2 border-brand pl-5">
            <p className="type-eyebrow">Exemplo de fala neste nível</p>
            <p lang={theme === 'us' ? 'en-US' : 'en-GB'} className="type-display mt-2 text-2xl">
              {level.example}
            </p>
            <p className="mt-2 text-muted">Em português: {level.translation}</p>
          </div>
        </div>
      </Reveal>
    </HomeSection>
  )
}
