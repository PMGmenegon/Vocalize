import { ACCENT_OPTIONS, LEVEL_OPTIONS } from '../../content/options'
import { characterFor, EXPERIENCE, introFor, SETTING_LABEL } from '../../data/scenarios'
import type { Accent, Level, Scenario, ScenarioHistory } from '../../types'
import ChoiceGroup from '../ui/ChoiceGroup'
import { LastResult } from './ScenarioRow'

interface ScenarioDetailProps {
  scenario: Scenario
  history?: ScenarioHistory
  level: Level
  accent: Accent
  onLevel: (level: Level) => void
  onAccent: (accent: Accent) => void
}

/** Painel da situação escolhida: cena, o que será treinado e ajustes de nível e sotaque. */
export default function ScenarioDetail({ scenario, history, level, accent, onLevel, onAccent }: ScenarioDetailProps) {
  const character = characterFor(scenario.id, accent)
  const experience = EXPERIENCE[scenario.layout]
  return (
    <div className="fade-swap">
      <p className="type-eyebrow text-brand">Situação selecionada</p>
      <h3 className="type-display mt-2 text-3xl">{scenario.title}</h3>
      <p className="mt-3 text-lg text-ink">{introFor(scenario.id, accent)}</p>
      <p className="mt-2 text-sm text-muted">
        {character.name} · {character.role} · {character.place}
      </p>

      <h4 className="type-eyebrow mt-6 border-t border-line pt-5">O que você vai treinar</h4>
      <ul className="mt-2 space-y-1.5 text-ink">
        {scenario.skills.map((skill) => (
          <li key={skill} className="flex gap-2">
            <span aria-hidden="true" className="text-brand">
              —
            </span>
            {skill}
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 text-sm sm:grid-cols-3 lg:grid-cols-2">
        <div>
          <dt className="type-eyebrow">Experiência</dt>
          <dd className="mt-1 font-bold text-ink">{experience.label}</dd>
          <dd className="text-muted">{SETTING_LABEL[scenario.setting]}</dd>
        </div>
        <div>
          <dt className="type-eyebrow">Duração</dt>
          <dd className="mt-1 font-bold text-ink">~{scenario.minutes} min</dd>
        </div>
        <div className="col-span-2 sm:col-span-1 lg:col-span-2">
          <dt className="type-eyebrow">Seu último acerto</dt>
          <dd className="mt-1">
            <LastResult history={history} compact />
          </dd>
        </div>
      </dl>

      <div className="mt-6 space-y-5 border-t border-line pt-5">
        <ChoiceGroup legend="Nível" variant="pill" value={level} onChange={onLevel} options={LEVEL_OPTIONS.map((o) => ({ value: o.value, label: o.value }))} />
        <ChoiceGroup legend="Sotaque" variant="pill" value={accent} onChange={onAccent} options={ACCENT_OPTIONS.map((o) => ({ value: o.value, label: o.value === 'en-US' ? 'Americano (US)' : 'Britânico (UK)' }))} />
      </div>
    </div>
  )
}
