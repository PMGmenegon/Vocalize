import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser, useAuth } from '../../auth/useAuth'
import PlacementQuestionView from '../../components/onboarding/PlacementQuestionView'
import PlacementResult from '../../components/onboarding/PlacementResult'
import ChoiceGroup from '../../components/ui/ChoiceGroup'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import { Stat, StatList } from '../../components/ui/Stat'
import StickyActionBar from '../../components/ui/StickyActionBar'
import { ACCENT_OPTIONS, LEVEL_OPTIONS } from '../../content/options'
import { PLACEMENT_QUESTIONS } from '../../data/placementQuestions'
import { computeLevel, gradeAnswers, scoreByLevel } from '../../domain/placement'
import { ACCENT_LABEL } from '../../lib/format'
import type { Level, PlacementRecord } from '../../types'

type Stage = 'accent' | 'intro' | 'test' | 'result' | 'manual'

const TOTAL = PLACEMENT_QUESTIONS.length

export default function OnboardingPage() {
  const user = useUser()
  const { savePreferences } = useAuth()
  const navigate = useNavigate()
  // Vindo do perfil ("Refazer teste"), o sotaque já está escolhido e a pessoa vai direto à introdução do teste.
  const redo = (useLocation().state as { redo?: boolean } | null)?.redo === true
  const [stage, setStage] = useState<Stage>(redo ? 'intro' : 'accent')
  const [accent, setAccent] = useState(user.accent)
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

  const stepLabel = `Etapa ${stepIndex + 1} de ${steps.length} · ${steps[stepIndex]}`

  return (
    <Page narrow>
      {stage !== 'test' && stage !== 'result' && (
        <ProgressBar className="mb-8" label="Progresso do onboarding" value={stepIndex + 1} max={steps.length} valueText={`Etapa ${stepIndex + 1} de ${steps.length}`} />
      )}

      {stage === 'accent' && (
        <>
          <PageHeader titleRef={heading} eyebrow={stepLabel} title="Qual sotaque você quer treinar?" description="Define a voz das falas nos seus estudos. Você pode mudar depois no perfil." />
          <ChoiceGroup
            legend="Sotaque"
            hideLegend
            value={accent}
            options={ACCENT_OPTIONS}
            onChange={(next) => {
              setAccent(next)
            }}
          />
          <StickyActionBar label="Sua escolha" summary={ACCENT_LABEL[accent]}>
            <Button size="lg" onClick={() => setStage('intro')} className="px-8">
              Continuar
            </Button>
          </StickyActionBar>
        </>
      )}

      {stage === 'intro' && (
        <>
          <PageHeader
            titleRef={heading}
            eyebrow={stepLabel}
            title="Vamos descobrir o seu nível"
            description="Perguntas de múltipla escolha em inglês, sem áudio. Você pode voltar e mudar respostas antes de finalizar."
            stats={
              <StatList>
                <Stat label="Perguntas" value={TOTAL} />
                <Stat label="Duração" value="~3 min" />
              </StatList>
            }
          />
          <p>
            <button
              type="button"
              onClick={() => {
                setManualFrom('intro')
                setStage('manual')
              }}
              className="min-h-11 cursor-pointer text-sm font-bold text-link underline underline-offset-4"
            >
              Prefiro escolher meu nível
            </button>
          </p>
          <StickyActionBar label="Teste de nivelamento" summary={`${TOTAL} perguntas`}>
            {redo ? (
              <Button variant="ghost" size="lg" onClick={() => navigate('/app/perfil')}>
                Cancelar
              </Button>
            ) : (
              <Button variant="ghost" size="lg" onClick={() => setStage('accent')}>
                Voltar
              </Button>
            )}
            <Button size="lg" onClick={startTest} className="px-8">
              Começar teste
            </Button>
          </StickyActionBar>
        </>
      )}

      {stage === 'test' && (
        <>
          <h1 ref={heading} tabIndex={-1} className="type-eyebrow text-brand focus:outline-none">
            Pergunta {current + 1} de {TOTAL}
          </h1>
          <ProgressBar className="mt-3 mb-8" label="Progresso do teste" value={current + 1} max={TOTAL} valueText={`Pergunta ${current + 1} de ${TOTAL}`} />
          <PlacementQuestionView
            question={PLACEMENT_QUESTIONS[current]!}
            value={answers[current] ?? null}
            onChange={(index) => setAnswers((prev) => prev.map((a, i) => (i === current ? index : a)))}
          />
          <StickyActionBar label="Teste de nivelamento" summary={answered ? 'Resposta marcada' : <span className="font-normal text-muted">Escolha uma alternativa.</span>}>
            <Button variant="ghost" size="lg" onClick={() => (current === 0 ? setStage('intro') : setCurrent(current - 1))}>
              Voltar
            </Button>
            {lastQuestion ? (
              <Button size="lg" onClick={submitTest} disabled={!answered} className="px-8">
                Ver resultado
              </Button>
            ) : (
              <Button size="lg" onClick={() => setCurrent(current + 1)} disabled={!answered} className="px-8">
                Próxima
              </Button>
            )}
          </StickyActionBar>
        </>
      )}

      {stage === 'result' && (
        <>
          <h1 ref={heading} tabIndex={-1} className="sr-only focus:outline-none">
            Seu nível: {recommended}
          </h1>
          <PlacementResult level={recommended} scores={scores} results={results} />
          <StickyActionBar label="Seu nível" summary={recommended} error={error}>
            <Button
              variant="ghost"
              size="lg"
              disabled={busy}
              onClick={() => {
                setManualLevel(recommended)
                setManualFrom('result')
                setStage('manual')
              }}
            >
              Ajustar
            </Button>
            <Button size="lg" disabled={busy} aria-busy={busy} onClick={() => void finish(recommended, record())} className="px-6">
              {busy ? 'Salvando…' : 'Começar a praticar'}
            </Button>
          </StickyActionBar>
        </>
      )}

      {stage === 'manual' && (
        <>
          <PageHeader
            titleRef={heading}
            eyebrow={stepLabel}
            title="Qual é o seu nível de inglês?"
            description={
              manualFrom === 'result'
                ? `O nível recomendado é o do teste: ${recommended}. Só mude se tiver certeza de que outro combina mais com você.`
                : 'Sem pressão: você pode mudar isso depois no perfil.'
            }
          />
          <ChoiceGroup legend="Nível" hideLegend value={manualLevel} options={LEVEL_OPTIONS} onChange={setManualLevel} />
          <StickyActionBar label="Seu nível" summary={manualLevel} error={error}>
            <Button variant="ghost" size="lg" disabled={busy} onClick={() => setStage(manualFrom)}>
              Voltar
            </Button>
            <Button size="lg" disabled={busy} aria-busy={busy} onClick={() => void finish(manualLevel, manualFrom === 'result' ? record() : undefined)} className="px-8">
              {busy ? 'Salvando…' : 'Concluir'}
            </Button>
          </StickyActionBar>
        </>
      )}
    </Page>
  )
}
