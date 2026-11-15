import { LETTERS_BY_INDEX } from './letters'
import { LEVEL_VERDICT } from '../../content/options'
import type { LevelScore, QuestionResult } from '../../domain/placement'
import type { Level } from '../../types'
import { List } from '../ui/List'
import Section from '../ui/Section'
import { Stat, StatList } from '../ui/Stat'

interface Props {
  level: Level
  scores: readonly LevelScore[]
  results: readonly QuestionResult[]
}

/** Resultado do teste: nível em destaque, frase, acertos por nível e revisão das perguntas. */
export default function PlacementResult({ level, scores, results }: Props) {
  return (
    <div>
      <header className="mb-10">
        <p className="type-eyebrow text-brand">Resultado do teste</p>
        <p className="type-display mt-2 text-7xl sm:text-8xl" aria-hidden="true">
          {level}
        </p>
        <p className="mt-3 max-w-xl text-lg text-ink">{LEVEL_VERDICT[level]}</p>
        <StatList>
          {scores.map((s) => (
            <Stat key={s.level} label={`Acertos em ${s.level}`} value={`${s.correct} de ${s.total}`} />
          ))}
        </StatList>
      </header>

      <Section id="revisao-titulo" title="Revisão das perguntas" meta={results.length}>
        <List ordered>
          {results.map((r, i) => {
            const { question: q } = r
            return (
              <li key={q.id} className="py-5">
                <p className="type-eyebrow">
                  Pergunta {i + 1} · {q.level} · {q.skill}{' '}
                  <span className={r.correct ? 'text-on-ok' : 'text-on-danger'}>{r.correct ? '✓ Acertou' : '✗ Errou'}</span>
                </p>
                {q.passage && (
                  <p lang="en" className="mt-2 text-sm text-muted">
                    {q.passage}
                  </p>
                )}
                <p lang="en" className="mt-2 text-lg font-bold text-ink">
                  {q.prompt}
                </p>
                {!r.correct && (
                  <p className="mt-1 text-sm text-ink">
                    Sua resposta:{' '}
                    <span lang="en" className="font-bold">
                      {r.chosenIndex == null ? '—' : `${LETTERS_BY_INDEX[r.chosenIndex]}) ${q.options[r.chosenIndex]}`}
                    </span>
                  </p>
                )}
                <p className="mt-1 text-sm text-ink">
                  Resposta certa:{' '}
                  <span lang="en" className="font-bold">
                    {LETTERS_BY_INDEX[q.correctIndex]}) {q.options[q.correctIndex]}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted">{q.explanation}</p>
              </li>
            )
          })}
        </List>
      </Section>
    </div>
  )
}
