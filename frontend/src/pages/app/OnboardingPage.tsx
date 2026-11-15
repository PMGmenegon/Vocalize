import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser, useAuth } from '../../auth/useAuth'
import PlacementQuestionView from '../../components/onboarding/PlacementQuestionView'
import PlacementResult from '../../components/onboarding/PlacementResult'
import ChoiceGroup from '../../components/ui/ChoiceGroup'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import { Page } from '../../components/ui/PageHeader'
import { ACCENT_OPTIONS, LEVEL_OPTIONS } from '../../content/options'
import { PLACEMENT_QUESTIONS } from '../../data/placementQuestions'
import { computeLevel, gradeAnswers, scoreByLevel } from '../../domain/placement'
import { themeOf } from '../../lib/format'
import { useTheme } from '../../theme/useTheme'
import type { Level, PlacementRecord } from '../../types'

type Stage = 'accent' | 'intro' | 'test' | 'result' | 'manual'

const TOTAL = PLACEMENT_QUESTIONS.length

export default function OnboardingPage() {
  const user = useUser()
  const { savePreferences } = useAuth()
  const { setAccent } = useTheme()
  const navigate = useNavigate()
  // Vindo do perfil ("Refazer teste"), o sotaque já está escolhido e a pessoa vai direto à introdução do teste.
  const redo = (useLocation().state as { redo?: boolean } | null)?.redo === true
  const [stage, setStage] = useState<Stage>(redo ? 'intro' : 'accent')
  const [accent, setAccentChoice] = useState(user.accent)
  const [answers, setAnswers] = useState<(number | null)[]>(() => PLACEMENT_QUESTIONS.map(() => null))
  const [current, setCurrent] = useState(0)
  const [manualLevel, setManualLevel] = useState<Level>(user.level)
  /** De onde veio a escolha manual: define o aviso e para onde "Voltar" leva. */
  const [manualFrom, setManualFrom] = useState<'intro' | 'result'>('intro')
  const [takenAt, setTakenAt] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  const results = useMemo(() => gradeAnswers(PLACEMENT_QUESTIONS, answers), [answers])
  const recommended = useMemo(() => computeLevel(results), [results])
  const scores = useMemo(() => scoreByLevel(results), [results])

  // A cada tela o foco vai para o título, para quem usa teclado ou leitor de tela.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    heading.current?.focus()
  }, [stage, current])

  const steps = redo ? (['Nível'] as const) : (['Sotaque', 'Nível'] as const)
  const stepIndex = stage === 'accent' ? 0 : steps.length - 1

  function startTest() {
    setAnswers(PLACEMENT_QUESTIONS.map(() => null))
    setCurrent(0)
    setStage('test')
  }

  function submitTest() {
    setTakenAt(new Date().toISOString())
    setStage('result')
  }

  async function finish(level: Level, placement?: PlacementRecord) {
    setBusy(true)
    setError('')
    try {
      await savePreferences({ level, accent, placement })
      navigate('/app', { replace: true })
    } catch {
      setError('Não foi possível salvar suas escolhas. Tente de novo.')
      setBusy(false)
    }
  }

  const record = (): PlacementRecord => ({ level: recommended, takenAt: takenAt ?? new Date().toISOString() })
  const answered = answers[current] != null
  const lastQuestion = current === TOTAL - 1

  return (
    <Page narrow>
      <p className="text-sm font-bold text-muted">
        Etapa {stepIndex + 1} de {steps.length} · {steps[stepIndex]}
      </p>
      <ProgressBar
        className="mt-2"
        label="Progresso do onboarding"
        value={stepIndex + 1}
        max={steps.length}
        valueText={`Etapa ${stepIndex + 1} de ${steps.length}`}
      />
      <ol className="mt-3 flex gap-2 text-xs font-bold" aria-label="Etapas">
        {steps.map((name, i) => (
          <li
            key={name}
            aria-current={i === stepIndex ? 'step' : undefined}
            className={`rounded-full px-3 py-1 ${i <= stepIndex ? 'bg-brand text-on-brand' : 'border border-line bg-surface text-muted'}`}
          >
            {i < stepIndex ? '✓ ' : ''}
            {name}
          </li>
        ))}
      </ol>

      <Card className="mt-6">
        {stage === 'accent' && (
          <>
            <h1 ref={heading} tabIndex={-1} className="text-2xl font-black text-brand focus:outline-none">
              Qual sotaque você quer treinar?
            </h1>
            <p className="mt-1 mb-5 text-muted">O tema do app muda junto com a sua escolha.</p>
            <ChoiceGroup
              legend="Sotaque"
              hideLegend
              value={accent}
              options={ACCENT_OPTIONS}
              onChange={(next) => {
                setAccentChoice(next)
                setAccent(themeOf(next))
              }}
            />
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStage('intro')}>Continuar</Button>
            </div>
          </>
        )}

        {stage === 'intro' && (
          <>
            <h1 ref={heading} tabIndex={-1} className="text-2xl font-black text-brand focus:outline-none">
              Vamos descobrir o seu nível
            </h1>
            <p className="mt-2 text-muted">
              São {TOTAL} perguntas de múltipla escolha em inglês, sem áudio. Leva cerca de 3 minutos. Você pode voltar e mudar
              respostas antes de finalizar.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              {redo ? (
                <Button variant="ghost" onClick={() => navigate('/app/perfil')}>
                  Cancelar
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => setStage('accent')}>
                  Voltar
                </Button>
              )}
              <Button size="lg" onClick={startTest}>
                Começar teste
              </Button>
            </div>
            <p className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setManualFrom('intro')
                  setStage('manual')
                }}
                className="min-h-9 cursor-pointer px-1 text-sm font-bold text-link underline underline-offset-4"
              >
                Prefiro escolher meu nível
              </button>
            </p>
          </>
        )}

        {stage === 'test' && (
          <>
            <h1 ref={heading} tabIndex={-1} className="text-sm font-bold text-muted focus:outline-none">
              Pergunta {current + 1} de {TOTAL}
            </h1>
            <ProgressBar className="mt-2 mb-5" label="Progresso do teste" value={current + 1} max={TOTAL} valueText={`Pergunta ${current + 1} de ${TOTAL}`} />
            <PlacementQuestionView
              question={PLACEMENT_QUESTIONS[current]!}
              value={answers[current] ?? null}
              onChange={(index) => setAnswers((prev) => prev.map((a, i) => (i === current ? index : a)))}
            />
            <div className="mt-6 flex justify-between gap-3">
              <Button variant="ghost" onClick={() => (current === 0 ? setStage('intro') : setCurrent(current - 1))}>
                Voltar
              </Button>
              {lastQuestion ? (
                <Button onClick={submitTest} disabled={!answered}>
                  Ver resultado
                </Button>
              ) : (
                <Button onClick={() => setCurrent(current + 1)} disabled={!answered}>
                  Próxima
                </Button>
              )}
            </div>
          </>
        )}

        {stage === 'result' && (
          <>
            <h1 ref={heading} tabIndex={-1} className="sr-only focus:outline-none">
              Seu nível: {recommended}
            </h1>
            <PlacementResult level={recommended} scores={scores} results={results} />
            <p role="alert" className="mt-4 text-sm font-bold text-on-danger">
              {error}
            </p>
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => {
                  setManualLevel(recommended)
                  setManualFrom('result')
                  setStage('manual')
                }}
              >
                Ajustar meu nível
              </Button>
              <Button size="lg" disabled={busy} aria-busy={busy} onClick={() => void finish(recommended, record())}>
                {busy ? 'Salvando…' : 'Começar a praticar'}
              </Button>
            </div>
          </>
        )}

        {stage === 'manual' && (
          <>
            <h1 ref={heading} tabIndex={-1} className="text-2xl font-black text-brand focus:outline-none">
              Qual é o seu nível de inglês?
            </h1>
            <p className="mt-1 mb-5 text-muted">
              {manualFrom === 'result'
                ? `O nível recomendado é o do teste: ${recommended}. Só mude se tiver certeza de que outro combina mais com você.`
                : 'Sem pressão: você pode mudar isso depois no perfil.'}
            </p>
            <ChoiceGroup legend="Nível" hideLegend value={manualLevel} options={LEVEL_OPTIONS} onChange={setManualLevel} />
            <p role="alert" className="mt-4 text-sm font-bold text-on-danger">
              {error}
            </p>
            <div className="mt-6 flex justify-between gap-3">
              <Button variant="ghost" disabled={busy} onClick={() => setStage(manualFrom)}>
                Voltar
              </Button>
              <Button
                disabled={busy}
                aria-busy={busy}
                onClick={() => void finish(manualLevel, manualFrom === 'result' ? record() : undefined)}
              >
                {busy ? 'Salvando…' : 'Concluir'}
              </Button>
            </div>
          </>
        )}
      </Card>
    </Page>
  )
}
