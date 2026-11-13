import type { TranscriptionResult as Result, WordResult, WordStatus } from '../../types'
import ProgressBar from '../ui/ProgressBar'

const META: Record<WordStatus, { symbol: string; label: string; legend: string; style: string }> = {
  correct: { symbol: '✓', label: 'Certa', legend: 'certa', style: 'bg-ok text-on-ok' },
  wrong: { symbol: '✗', label: 'Errada', legend: 'errada', style: 'bg-danger text-on-danger' },
  missing: { symbol: '–', label: 'Faltando', legend: 'faltando', style: 'border-2 border-dashed border-on-danger bg-card text-on-danger' },
  extra: { symbol: '+', label: 'Sobrando', legend: 'sobrando', style: 'border border-line bg-surface text-muted line-through' },
}
const ORDER: WordStatus[] = ['correct', 'wrong', 'missing', 'extra']

function Word({ w }: { w: WordResult }) {
  const m = META[w.status]
  const shown = w.status === 'extra' ? w.typed : w.expected
  return (
    <li lang="en" className={`inline-flex flex-col rounded-lg px-2.5 py-1 text-base font-bold ${m.style}`}>
      <span>
        <span className="sr-only">{m.label}: </span>
        <span aria-hidden="true">{m.symbol} </span>
        {shown}
      </span>
      {w.status === 'wrong' && (
        <span className="text-xs font-normal">
          <span className="sr-only">Você digitou </span>
          <span aria-hidden="true">você: </span>
          <s>{w.typed}</s>
        </span>
      )}
    </li>
  )
}

/**
 * Frase revelada, palavra por palavra. Cada situação tem cor, símbolo e texto
 * (não depende só de cor). O resumo em texto é lido por leitores de tela.
 */
export default function TranscriptionResult({ result }: { result: Result }) {
  const counts = ORDER.map((s) => ({ s, n: result.words.filter((w) => w.status === s).length }))
  const summary = `Resultado: ${result.accuracy}% de acerto. ${counts.map(({ s, n }) => `${n} ${META[s].legend}${n === 1 ? '' : 's'}`).join(', ')}.`

  return (
    <div className="mt-2 space-y-3">
      <p className="sr-only">{summary}</p>
      <div aria-hidden="true">
        <p className="text-2xl font-black text-ink">
          {result.accuracy}% <span className="text-sm font-bold">de acerto</span>
        </p>
      </div>
      <ProgressBar label="Acerto do ditado" value={result.accuracy} valueText={`${result.accuracy}%`} />
      <ul aria-label="Comparação palavra por palavra" className="flex flex-wrap gap-1.5">
        {result.words.map((w, i) => (
          <Word key={i} w={w} />
        ))}
      </ul>
      <ul aria-label="Legenda" className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink">
        {counts.map(({ s, n }) => (
          <li key={s} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={`inline-flex h-5 w-5 items-center justify-center rounded text-[11px] font-black ${META[s].style}`}>
              {META[s].symbol}
            </span>
            {META[s].label} ({n})
          </li>
        ))}
      </ul>
    </div>
  )
}
