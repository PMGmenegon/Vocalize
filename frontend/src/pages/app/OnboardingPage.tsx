import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useAuth } from '../../auth/useAuth'
import ChoiceGroup from '../../components/ui/ChoiceGroup'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import { Page } from '../../components/ui/PageHeader'
import { ACCENT_OPTIONS, GOAL_OPTIONS, LEVEL_OPTIONS } from '../../content/options'
import { themeOf } from '../../lib/format'
import { useTheme } from '../../theme/useTheme'

const STEPS = ['Nível', 'Sotaque', 'Meta diária'] as const

export default function OnboardingPage() {
  const user = useUser()
  const { savePreferences } = useAuth()
  const { setAccent } = useTheme()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState(user.level)
  const [accent, setAccentChoice] = useState(user.accent)
  const [goal, setGoal] = useState(user.dailyGoalMinutes)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  // A cada etapa o foco vai para o título, para quem usa teclado ou leitor de tela.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    heading.current?.focus()
  }, [step])

  async function finish() {
    setBusy(true)
    setError('')
    try {
      await savePreferences({ level, accent, dailyGoalMinutes: goal })
      navigate('/app', { replace: true })
    } catch {
      setError('Não foi possível salvar suas escolhas. Tente de novo.')
      setBusy(false)
    }
  }

  const last = step === STEPS.length - 1

  return (
    <Page narrow>
      <p className="text-sm font-bold text-muted">
        Etapa {step + 1} de {STEPS.length} · {STEPS[step]}
      </p>
      <ProgressBar
        className="mt-2"
        label="Progresso do onboarding"
        value={step + 1}
        max={STEPS.length}
        valueText={`Etapa ${step + 1} de ${STEPS.length}`}
      />
      <ol className="mt-3 flex gap-2 text-xs font-bold" aria-label="Etapas">
        {STEPS.map((name, i) => (
          <li
            key={name}
            aria-current={i === step ? 'step' : undefined}
            className={`rounded-full px-3 py-1 ${i <= step ? 'bg-brand text-on-brand' : 'border border-line bg-surface text-muted'}`}
          >
            {i < step ? '✓ ' : ''}
            {name}
          </li>
        ))}
      </ol>

      <Card className="mt-6">
        <h1 ref={heading} tabIndex={-1} className="text-2xl font-black text-brand focus:outline-none">
          {step === 0 && 'Qual é o seu nível de inglês?'}
          {step === 1 && 'Qual sotaque você quer treinar?'}
          {step === 2 && 'Quanto tempo por dia você quer estudar?'}
        </h1>
        <p className="mt-1 mb-5 text-muted">
          {step === 0 && 'Sem pressão: você pode mudar isso depois no perfil.'}
          {step === 1 && 'O tema do app muda junto com a sua escolha.'}
          {step === 2 && 'Sua meta aparece no início e ajuda a manter a sequência.'}
        </p>

        {step === 0 && <ChoiceGroup legend="Nível" hideLegend value={level} options={LEVEL_OPTIONS} onChange={setLevel} />}
        {step === 1 && (
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
        )}
        {step === 2 && <ChoiceGroup legend="Meta diária" hideLegend value={goal} options={GOAL_OPTIONS} onChange={setGoal} />}

        <p role="alert" className="mt-4 text-sm font-bold text-on-danger">
          {error}
        </p>

        <div className="mt-6 flex justify-between gap-3">
          <Button variant="ghost" disabled={step === 0 || busy} onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
          {last ? (
            <Button onClick={finish} disabled={busy} aria-busy={busy}>
              {busy ? 'Salvando…' : 'Concluir'}
            </Button>
          ) : (
            <Button onClick={() => setStep(step + 1)}>Continuar</Button>
          )}
        </div>
      </Card>
    </Page>
  )
}
