import type { Correction } from '../../types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

interface CorrectionStepProps {
  correction: Correction
  isLast: boolean
  onNext: () => void
}

/** Correção: resposta original × corrigida, explicação em português e vocabulário-chave. */
export default function CorrectionStep({ correction, isLast, onNext }: CorrectionStepProps) {
  return (
    <div className="space-y-5">
      <div role="status">
        <Badge tone={correction.changed ? 'danger' : 'ok'}>
          {correction.changed ? '✗ Com ajustes' : '✓ Sem erros'}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-sm font-bold text-muted">Sua resposta</p>
          <p lang="en" className={`mt-1 text-lg ${correction.changed ? 'text-ink line-through decoration-on-danger decoration-2' : 'font-bold text-ink'}`}>
            {correction.original}
          </p>
        </div>
        <div className="rounded-xl bg-ok p-4 text-on-ok">
          <p className="text-sm font-bold">Versão corrigida</p>
          <p lang="en" className="mt-1 text-lg font-bold">
            <span aria-hidden="true">✓ </span>
            {correction.corrected}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-black text-ink">Por quê?</h3>
        <p className="mt-1 text-ink">{correction.explanation}</p>
      </div>

      <div>
        <h3 className="font-black text-ink">Vocabulário-chave</h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {correction.vocabulary.map((v) => (
            <li key={v.term} className="rounded-lg border border-line bg-card px-3 py-2">
              <span lang="en" className="font-bold text-ink">
                {v.term}
              </span>
              <span className="text-muted"> — {v.meaning}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button size="lg" onClick={onNext}>
        {isLast ? 'Concluir sessão' : 'Próxima rodada'}
      </Button>
    </div>
  )
}
