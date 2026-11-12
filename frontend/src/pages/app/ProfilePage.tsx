import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '../../auth/useAuth'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ChoiceGroup from '../../components/ui/ChoiceGroup'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import { ACCENT_OPTIONS, GOAL_OPTIONS, LEVEL_OPTIONS } from '../../content/options'
import { themeOf } from '../../lib/format'
import { useTheme } from '../../theme/useTheme'

export default function ProfilePage() {
  const user = useUser()
  const { savePreferences, logout } = useAuth()
  const { setAccent } = useTheme()
  const navigate = useNavigate()
  const [level, setLevel] = useState(user.level)
  const [accent, setAccentChoice] = useState(user.accent)
  const [goal, setGoal] = useState(user.dailyGoalMinutes)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const dirty = level !== user.level || accent !== user.accent || goal !== user.dailyGoalMinutes

  async function save() {
    setBusy(true)
    setMessage(null)
    try {
      await savePreferences({ level, accent, dailyGoalMinutes: goal })
      setMessage({ ok: true, text: '✓ Preferências salvas.' })
    } catch {
      setMessage({ ok: false, text: '✗ Não foi possível salvar. Tente de novo.' })
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <Page narrow>
      <PageHeader title="Perfil" />
      <Card as="section">
        <h2 className="text-xl font-black text-ink">Seus dados</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-bold text-muted">Nome</dt>
            <dd className="text-ink">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-muted">E-mail</dt>
            <dd className="break-all text-ink">{user.email}</dd>
          </div>
        </dl>
      </Card>

      <form
        className="mt-6 space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          void save()
        }}
      >
        <Card as="section" className="space-y-6">
          <h2 className="text-xl font-black text-ink">Preferências de estudo</h2>
          <ChoiceGroup legend="Nível" value={level} onChange={setLevel} options={LEVEL_OPTIONS} />
          <ChoiceGroup
            legend="Sotaque"
            value={accent}
            options={ACCENT_OPTIONS}
            onChange={(next) => {
              setAccentChoice(next)
              setAccent(themeOf(next))
            }}
          />
          <ChoiceGroup legend="Meta diária" columns="sm:grid-cols-2" value={goal} onChange={setGoal} options={GOAL_OPTIONS} />
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={busy || !dirty} aria-busy={busy}>
              {busy ? 'Salvando…' : 'Salvar alterações'}
            </Button>
            <p role="status" className={`text-sm font-bold ${message?.ok === false ? 'text-on-danger' : 'text-ink'}`}>
              {message?.text}
            </p>
          </div>
        </Card>
      </form>

      <div className="mt-8">
        <Button variant="danger" onClick={() => void signOut()}>
          Sair
        </Button>
      </div>
    </Page>
  )
}
