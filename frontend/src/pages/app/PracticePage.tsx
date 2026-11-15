import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../auth/useAuth'
import { ScenarioIcon } from '../../components/appIcons'
import ScenarioDetail from '../../components/picker/ScenarioDetail'
import ScenarioRow from '../../components/picker/ScenarioRow'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import { Page } from '../../components/ui/PageHeader'
import Skeleton from '../../components/ui/Skeleton'
import { characterFor, EXPERIENCE, SETTING_LABEL } from '../../data/scenarios'
import { useAsync } from '../../hooks/useAsync'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { ACCENT_LABEL, ACCENT_SHORT } from '../../lib/format'
import { scenarioService, sessionService, statsService } from '../../services'
import type { PracticeOverview, Scenario, ScenarioId, ScenarioSetting } from '../../types'

const SETTINGS: ScenarioSetting[] = ['in-person', 'online']

function PickerSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Carregando situações…</span>
      <Skeleton className="mb-8 h-32" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="hidden h-96 lg:block" />
      </div>
    </div>
  )
}

export default function PracticePage() {
  const user = useUser()
  const navigate = useNavigate()
  const groupName = useId()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const state = useAsync(async () => {
    const [scenarios, overview] = await Promise.all([
      scenarioService.list(),
      // O histórico é um complemento: se falhar, a página continua funcionando sem ele.
      statsService.getPracticeOverview().catch((): PracticeOverview | null => null),
    ])
    return { scenarios, overview }
  })
  const [scenarioId, setScenarioId] = useState<ScenarioId | null>(null)
  const [level, setLevel] = useState(user.level)
  const [accent, setAccent] = useState(user.accent)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function start() {
    if (!scenarioId) return
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
      <header className="mb-8 sm:mb-10">
        <p className="type-eyebrow text-brand">Praticar</p>
        <h1 className="type-display mt-2 text-4xl sm:text-5xl">O que vamos ouvir hoje?</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">Escolha uma situação do dia a dia. Em cada rodada você ouve, transcreve e responde, no seu nível e no sotaque que quiser treinar.</p>
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
          <div>
            <dt className="type-eyebrow">Nível</dt>
            <dd className="mt-0.5 text-xl font-black text-ink">{level}</dd>
          </div>
          <div>
            <dt className="type-eyebrow">Sotaque</dt>
            <dd className="mt-0.5 text-xl font-black text-ink">{ACCENT_LABEL[accent]}</dd>
          </div>
        </dl>
      </header>

      <Async
        state={state}
        skeleton={<PickerSkeleton />}
        isEmpty={(d) => d.scenarios.length === 0}
        empty={{ title: 'Nenhuma situação disponível', description: 'Volte daqui a pouco: estamos preparando novas situações.' }}
        errorMessage="Não foi possível carregar as situações."
      >
        {({ scenarios, overview }) => {
          const historyOf = (id: ScenarioId) => overview?.history.find((h) => h.scenarioId === id)
          const selected = scenarios.find((s) => s.id === scenarioId)
          const recommended = overview ? scenarios.find((s) => s.id === overview.recommendation.scenarioId) : undefined
          const summary = selected ? `${selected.title} · ${level} · ${ACCENT_SHORT[accent]}` : ''
          const detail = (s: Scenario) => <ScenarioDetail scenario={s} history={historyOf(s.id)} level={level} accent={accent} onLevel={setLevel} onAccent={setAccent} />

          return (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!busy) void start()
              }}
            >
              {/* Aviso para leitores de tela quando a seleção muda. */}
              <p role="status" aria-live="polite" className="sr-only">
                {selected ? `${selected.title} selecionada. Com ${characterFor(selected.id, accent).name}, ${characterFor(selected.id, accent).role.toLowerCase()}. ${EXPERIENCE[selected.layout].label}, cerca de ${selected.minutes} minutos.` : ''}
              </p>

              {recommended && overview && (
                <section aria-labelledby="rec-title" className="mb-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-y border-line py-6">
                  <div className="flex min-w-0 flex-1 gap-4 sm:basis-96">
                    <span className="pt-1 text-brand">
                      <ScenarioIcon icon={recommended.icon} className="h-9 w-9" />
                    </span>
                    <div>
                      <p className="type-eyebrow text-brand">Recomendada para hoje</p>
                      <h2 id="rec-title" className="type-display mt-1 text-3xl">
                        {recommended.title}
                      </h2>
                      <p className="mt-2 max-w-xl text-ink">{overview.recommendation.reason}</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="lg" aria-pressed={scenarioId === recommended.id} onClick={() => setScenarioId(recommended.id)} className="w-full sm:w-auto">
                    {scenarioId === recommended.id ? '✓ Selecionada' : 'Escolher esta'}
                  </Button>
                </section>
              )}

              <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
                <fieldset className="min-w-0">
                  <legend className="sr-only">Situação. Use as setas para escolher e Enter para começar.</legend>
                  <div className="space-y-8">
                    {SETTINGS.map((setting) => {
                      const group = scenarios.filter((s) => s.setting === setting)
                      if (group.length === 0) return null
                      return (
                        <div key={setting}>
                          <h2 className="type-eyebrow flex items-baseline justify-between border-b border-ink pb-2">
                            <span>{SETTING_LABEL[setting]}</span>
                            <span>{group.length}</span>
                          </h2>
                          <ul>
                            {group.map((s) => (
                              <li key={s.id}>
                                <ScenarioRow scenario={s} accent={accent} history={historyOf(s.id)} name={groupName} checked={s.id === scenarioId} onSelect={() => setScenarioId(s.id)} />
                                {!isDesktop && s.id === scenarioId && <div className="border-b border-line bg-surface px-5 pt-2 pb-6">{detail(s)}</div>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </fieldset>

                {isDesktop && (
                  <aside aria-label="Detalhes da situação" className="self-start lg:sticky lg:top-24 lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto">
                    <div className="border-l border-line pl-8">
                      {selected ? (
                        detail(selected)
                      ) : (
                        <div>
                          <p className="type-eyebrow">Detalhes</p>
                          <p className="type-display mt-2 text-2xl">Escolha uma situação</p>
                          <p className="mt-3 text-muted">Aqui aparecem a cena, o que você vai treinar e os ajustes de nível e sotaque.</p>
                        </div>
                      )}
                    </div>
                  </aside>
                )}
              </div>

              <div className="sticky bottom-0 z-30 -mx-4 mt-8 border-t border-ink bg-canvas px-4 py-3 sm:-mx-6 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="type-eyebrow">Sua sessão</p>
                    {selected ? (
                      <p className="font-black text-ink">{summary}</p>
                    ) : (
                      <p className="text-muted">Escolha uma situação para começar.</p>
                    )}
                    <p role="alert" className="text-sm font-bold text-on-danger empty:hidden">
                      {error}
                    </p>
                  </div>
                  <Button type="submit" size="lg" disabled={!selected || busy} aria-busy={busy} className="shrink-0 px-8">
                    {busy ? 'Preparando…' : 'Começar'}
                  </Button>
                </div>
              </div>
            </form>
          )
        }}
      </Async>
    </Page>
  )
}
