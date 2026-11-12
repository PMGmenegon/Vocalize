import { MODE_COPY } from '../../theme/modeCopy'
import { useTheme } from '../../theme/useTheme'

/** Níveis A2–C1, com um exemplo em inglês que usa a grafia do modo atual. */
export default function Levels() {
  const { accent } = useTheme()
  const sp = MODE_COPY[accent].spelling

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

  return (
    <section id="niveis" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-black text-ink sm:text-4xl">Níveis</h2>
      <p className="mt-3 max-w-2xl text-muted">
        A velocidade da fala e o vocabulário mudam conforme o nível escolhido.
      </p>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {levels.map((l) => (
          <li key={l.code} className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-4xl font-black text-brand">{l.code}</p>
            <h3 className="mt-1 text-base font-bold text-ink">{l.name}</h3>
            <p className="mt-2 text-muted">{l.text}</p>
            <p lang={accent === 'us' ? 'en-US' : 'en-GB'} className="mt-3 rounded-lg bg-canvas p-2 text-sm text-ink">
              {l.example}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
