import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../auth/useAuth'
import { ScenarioIcon } from '../../components/appIcons'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import ChoiceGroup from '../../components/ui/ChoiceGroup'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import Skeleton from '../../components/ui/Skeleton'
import { ACCENT_OPTIONS, LEVEL_OPTIONS } from '../../content/options'
import { useAsync } from '../../hooks/useAsync'
import { scenarioService, sessionService } from '../../services'
import type { ScenarioId } from '../../types'

export default function PracticePage() {
  const user = useUser()
  const navigate = useNavigate()
  const state = useAsync(() => scenarioService.list())
  const [scenarioId, setScenarioId] = useState<ScenarioId>('restaurant')
  const [level, setLevel] = useState(user.level)
  const [accent, setAccent] = useState(user.accent)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function start() {
    setBusy(true)
    setError('')
    try {
      const session = await sessionService.start({ scenarioId, level, accent })
      navigate(`/app/praticar/${session.id}`)
    } catch {
      setError('Não foi possível iniciar a sessão. Tente de novo.')
      setBusy(false)
    }
  }

  return (
    <Page>
      <PageHeader title="Praticar" description="Escolha uma situação, o nível e o sotaque. Você ouve, transcreve e responde." />
      <Async
        state={state}
        skeleton={
          <div role="status" aria-live="polite" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <span className="sr-only">Carregando cenários…</span>
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        }
        isEmpty={(list) => list.length === 0}
        empty={{ title: 'Nenhum cenário disponível', description: 'Volte daqui a pouco: estamos preparando novas situações.' }}
        errorMessage="Não foi possível carregar os cenários."
      >
        {(scenarios) => (
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault()
              void start()
            }}
          >
            <ChoiceGroup
              legend="Cenário"
              columns="sm:grid-cols-2 lg:grid-cols-3"
              value={scenarioId}
              onChange={setScenarioId}
              options={scenarios.map((s) => ({
                value: s.id,
                label: s.title,
                description: s.description,
                icon: <ScenarioIcon id={s.id} className="h-8 w-8" />,
              }))}
            />
            <div className="grid gap-8 md:grid-cols-2">
              <ChoiceGroup legend="Nível da conversa" columns="grid-cols-2" value={level} onChange={setLevel} options={LEVEL_OPTIONS.map((o) => ({ value: o.value, label: o.value }))} />
              <ChoiceGroup legend="Sotaque" columns="grid-cols-2" value={accent} onChange={setAccent} options={ACCENT_OPTIONS.map((o) => ({ value: o.value, label: o.value === 'en-US' ? 'Americano (US)' : 'Britânico (UK)' }))} />
            </div>
            <p role="alert" className="text-sm font-bold text-on-danger">
              {error}
            </p>
            <Button type="submit" size="lg" disabled={busy} aria-busy={busy} className="w-full sm:w-auto">
              {busy ? 'Preparando…' : 'Começar sessão'}
            </Button>
          </form>
        )}
      </Async>
    </Page>
  )
}
