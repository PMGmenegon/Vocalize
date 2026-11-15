import { useId } from 'react'
import { characterFor, EXPERIENCE } from '../../data/scenarios'
import { formatDate } from '../../lib/format'
import type { Accent, Scenario, ScenarioHistory } from '../../types'
import { ScenarioIcon } from '../appIcons'

interface ScenarioRowProps {
  scenario: Scenario
  accent: Accent
  history?: ScenarioHistory
  name: string
  checked: boolean
  onSelect: () => void
}

export function LastResult({ history, compact = false }: { history?: ScenarioHistory; compact?: boolean }) {
  if (!history) return <span className="text-sm text-muted">Ainda não praticada</span>
  const good = history.lastAccuracy >= 85
  return (
    <span className="block">
      <span className={`font-black ${good ? 'text-on-ok' : 'text-ink'} ${compact ? '' : 'text-lg'}`}>
        {good && <span aria-hidden="true">✓ </span>}
        {history.lastAccuracy}%
      </span>
      <span className="block text-sm text-muted">Último acerto · {formatDate(history.lastDate)}</span>
    </span>
  )
}

/** Uma linha do índice de situações: um botão de rádio nativo (setas do teclado) com todo o contexto da cena. */
export default function ScenarioRow({ scenario, accent, history, name, checked, onSelect }: ScenarioRowProps) {
  const id = useId()
  const character = characterFor(scenario.id, accent)
  return (
    <label
      className={`group relative grid cursor-pointer grid-cols-[auto_1fr] gap-x-4 gap-y-3 border-b border-line py-5 pr-3 pl-5 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:-outline-offset-3 has-[:focus-visible]:outline-(--focus) sm:grid-cols-[auto_1fr_auto] ${
        checked ? 'bg-surface' : 'hover:bg-surface/70'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`} className="sr-only" />
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 transition-colors ${checked ? 'bg-brand' : 'bg-transparent group-hover:bg-line'}`} />
      <span className="pt-0.5 text-brand">
        <ScenarioIcon icon={scenario.icon} className="h-7 w-7" />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span id={`${id}-t`} className="text-lg font-black text-ink">
            {scenario.title}
          </span>
          <span className="type-eyebrow">
            {EXPERIENCE[scenario.layout].label} · {scenario.minutes} min
          </span>
          {checked && (
            <span className="text-sm font-black text-brand">
              <span aria-hidden="true">✓ </span>Selecionada
            </span>
          )}
        </span>
        <span id={`${id}-d`} className="block">
          <span className="mt-1 block text-ink">{scenario.description}</span>
          <span className="mt-1 block text-sm text-muted">
            Com {character.name}, {character.role.toLowerCase()}
          </span>
          <span className="mt-2 block text-sm text-muted">
            <span className="sr-only">Vocabulário típico: </span>
            <span lang="en" className="italic">
              {scenario.vocab[accent].join(' · ')}
            </span>
          </span>
        </span>
      </span>
      <span className="col-start-2 sm:col-start-3 sm:row-start-1 sm:text-right">
        <LastResult history={history} />
      </span>
    </label>
  )
}
