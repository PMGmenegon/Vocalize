import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '../../auth/useAuth'
import Button from '../../components/ui/Button'
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
      <section aria-labelledby="data-title">
        <h2 id="data-title" className="border-b border-line pb-2 text-xl font-black text-ink">
          Seus dados
        </h2>
        <dl className="divide-y divide-line">
          <div className="flex flex-wrap justify-between gap-2 py-3">
            <dt className="font-bold text-muted">Nome</dt>
            <dd className="text-ink">{user.name}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2 py-3">
            <dt className="font-bold text-muted">E-mail</dt>
            <dd className="break-all text-ink">{user.email}</dd>
          </div>
        </dl>
      </section>

      <form
        className="mt-10"
        onSubmit={(e) => {
          e.preventDefault()
          void save()
        }}
      >
        <h2 className="border-b border-line pb-2 text-xl font-black text-ink">Preferências de estudo</h2>
        <div className="space-y-8 pt-6">
          <ChoiceGroup legend="Nível" variant="list" value={level} onChange={setLevel} options={LEVEL_OPTIONS} columns="sm:grid-cols-2" />
          <ChoiceGroup
            legend="Sotaque"
            variant="pill"
            value={accent}
            options={ACCENT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            onChange={(next) => {
              setAccentChoice(next)
              setAccent(themeOf(next))
            }}
          />
          <ChoiceGroup legend="Meta diária" variant="pill" value={goal} onChange={setGoal} options={GOAL_OPTIONS.map((o) => ({ value: o.value, label: `${o.value} min` }))} />
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={busy || !dirty} aria-busy={busy}>
              {busy ? 'Salvando…' : 'Salvar alterações'}
            </Button>
            <p role="status" className={`text-sm font-bold ${message?.ok === false ? 'text-on-danger' : 'text-ink'}`}>
              {message?.text}
            </p>
          </div>
        </div>
      </form>

      <section className="mt-10 border-t border-line pt-6">
        <Button variant="danger" onClick={() => void signOut()}>
          Sair
        </Button>
      </section>
    </Page>
  )
}
