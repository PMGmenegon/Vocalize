import { LETTERS_BY_INDEX } from './letters'
import { LEVEL_VERDICT } from '../../content/options'
import type { LevelScore, QuestionResult } from '../../domain/placement'
import type { Level } from '../../types'

interface Props {
  level: Level
  scores: readonly LevelScore[]
  results: readonly QuestionResult[]
}

/** Resultado do teste: nível em destaque, frase, acertos por nível e revisão das 6 perguntas. */
export default function PlacementResult({ level, scores, results }: Props) {
  return (
    <div>
      <p className="text-6xl font-black text-ink sm:text-7xl">
        <span className="block text-sm font-bold text-muted">Seu nível</span>
        {level}
      </p>
      <p className="mt-3 max-w-prose text-lg text-ink">{LEVEL_VERDICT[level]}</p>

      <h2 className="mt-8 border-b border-line pb-2 text-xl font-black text-ink">Acertos por nível</h2>
      <ul className="flex flex-wrap gap-x-8 gap-y-2 pt-3">
        {scores.map((s) => (
          <li key={s.level} className="text-ink">
            <span className="font-black">{s.level}</span>{' '}
            <span className="text-muted">
              {s.correct} de {s.total}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 border-b border-line pb-2 text-xl font-black text-ink">Revisão das perguntas</h2>
      <ol className="divide-y divide-line">
        {results.map((r, i) => {
          const { question: q } = r
          return (
            <li key={q.id} className="py-4">
              <p className="text-sm font-bold text-muted">
                Pergunta {i + 1} · {q.level} · {q.skill}{' '}
                <span className={r.correct ? 'text-on-ok' : 'text-on-danger'}>{r.correct ? '✓ Acertou' : '✗ Errou'}</span>
              </p>
              {q.passage && (
                <p lang="en" className="mt-1 text-sm text-muted">
                  {q.passage}
                </p>
              )}
              <p lang="en" className="mt-1 font-bold text-ink">
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
      </ol>
    </div>
  )
}
