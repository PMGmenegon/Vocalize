import type { Correction } from '../../types'

/**
 * Cartão discreto preso à bolha do usuário: original × corrigida sempre visíveis;
 * explicação em português e vocabulário-chave ficam no trecho expansível.
 */
export default function CorrectionCard({ correction, defaultOpen = false }: { correction: Correction; defaultOpen?: boolean }) {
  return (
    <aside aria-label="Correção da sua resposta" className="bubble-in ml-auto max-w-[85%] rounded-xl border border-line bg-card p-3 text-sm text-ink">
      <p className="font-bold">
        {correction.changed ? (
          <span className="text-on-danger">
            <span aria-hidden="true">✗ </span>Com ajustes
          </span>
        ) : (
          <span className="text-on-ok">
            <span aria-hidden="true">✓ </span>Sem erros
          </span>
        )}
      </p>
      {correction.changed && (
        <p lang="en" className="mt-1 text-muted line-through decoration-on-danger decoration-2">
          <span className="sr-only">Original: </span>
          {correction.original}
        </p>
      )}
      <p lang="en" className="mt-1 rounded-lg bg-ok px-2 py-1 font-bold text-on-ok">
        <span className="sr-only">Corrigida: </span>
        <span aria-hidden="true">✓ </span>
        {correction.corrected}
      </p>
      <details open={defaultOpen} className="mt-2">
        <summary className="inline-flex min-h-9 cursor-pointer items-center rounded-lg text-xs font-bold text-link underline underline-offset-4">
          Por quê e vocabulário-chave
        </summary>
        <p className="mt-1">{correction.explanation}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {correction.vocabulary.map((item) => (
            <li key={item.term} className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs">
              <span lang="en" className="font-bold">
                {item.term}
              </span>
              <span className="text-muted"> — {item.meaning}</span>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  )
}
