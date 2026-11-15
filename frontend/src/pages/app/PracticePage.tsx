import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../auth/useAuth'
import { ScenarioIcon } from '../../components/appIcons'
import ScenarioDetail from '../../components/picker/ScenarioDetail'
import ScenarioRow from '../../components/picker/ScenarioRow'
import Async from '../../components/ui/Async'
import Button from '../../components/ui/Button'
import DetailPanel from '../../components/ui/DetailPanel'
import { List } from '../../components/ui/List'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import Section from '../../components/ui/Section'
import Skeleton from '../../components/ui/Skeleton'
import { Stat, StatList } from '../../components/ui/Stat'
import StickyActionBar from '../../components/ui/StickyActionBar'
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
      <PageHeader
        eyebrow="Praticar"
        title="O que vamos ouvir hoje?"
        description="Escolha uma situação do dia a dia. Em cada rodada você ouve, transcreve e responde, no seu nível e no sotaque que quiser treinar."
        stats={
          <StatList>
            <Stat label="Nível" value={level} />
            <Stat label="Sotaque" value={ACCENT_LABEL[accent]} />
          </StatList>
        }
      />

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
                        <Section key={setting} id={`grupo-${setting}`} title={SETTING_LABEL[setting]} meta={group.length}>
                          <List className="border-b border-line">
                            {group.map((s) => (
                              <li key={s.id}>
                                <ScenarioRow scenario={s} accent={accent} history={historyOf(s.id)} name={groupName} checked={s.id === scenarioId} onSelect={() => setScenarioId(s.id)} />
                                {!isDesktop && s.id === scenarioId && <div className="bg-surface px-5 pt-2 pb-6">{detail(s)}</div>}
                              </li>
                            ))}
                          </List>
                        </Section>
                      )
                    })}
                  </div>
                </fieldset>

                {isDesktop && (
                  <DetailPanel label="Detalhes da situação">
                    {selected ? (
                      detail(selected)
                    ) : (
                      <div>
                        <p className="type-eyebrow">Detalhes</p>
                        <p className="type-display mt-2 text-2xl">Escolha uma situação</p>
                        <p className="mt-3 text-muted">Aqui aparecem a cena, o que você vai treinar e os ajustes de nível e sotaque.</p>
                      </div>
                    )}
                  </DetailPanel>
                )}
              </div>

              <StickyActionBar label="Sua sessão" summary={selected ? summary : <span className="font-normal text-muted">Escolha uma situação para começar.</span>} error={error}>
                <Button type="submit" size="lg" disabled={!selected || busy} aria-busy={busy} className="px-8">
                  {busy ? 'Preparando…' : 'Começar'}
                </Button>
              </StickyActionBar>
            </form>
          )
        }}
      </Async>
    </Page>
  )
}
