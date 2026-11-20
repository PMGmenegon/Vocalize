import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSignOut, useUser } from '../../auth/useAuth'
import Button from '../../components/ui/Button'
import ChoiceGroup from '../../components/ui/ChoiceGroup'
import PageHeader, { Page } from '../../components/ui/PageHeader'
import Section from '../../components/ui/Section'
import StickyActionBar from '../../components/ui/StickyActionBar'
import { ACCENT_OPTIONS, LEVEL_OPTIONS } from '../../content/options'
import { formatFullDate } from '../../lib/format'

export default function ProfilePage() {
  const user = useUser()
  const { savePreferences } = useAuth()
  const signOut = useSignOut()
  const navigate = useNavigate()
  const [level, setLevel] = useState(user.level)
  const [accent, setAccent] = useState(user.accent)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const dirty = level !== user.level || accent !== user.accent

  async function save() {
    setBusy(true)
    setMessage(null)
    try {
      // Mudar o nível na mão não apaga o registro do teste; ele só deixa de ser "o nível definido por teste".
      await savePreferences({ level, accent, placement: user.placement })
      setMessage({ ok: true, text: '✓ Preferências salvas.' })
    } catch {
      setMessage({ ok: false, text: '✗ Não foi possível salvar. Tente de novo.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Page narrow>
      <PageHeader eyebrow="Conta" title="Perfil" description="Seus dados e as preferências de estudo." />

      <Section id="data-title" title="Seus dados">
        <dl className="divide-y divide-line">
          <div className="flex flex-wrap justify-between gap-2 py-3.5">
            <dt className="font-bold text-muted">Nome</dt>
            <dd className="text-ink">{user.name}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2 py-3.5">
            <dt className="font-bold text-muted">E-mail</dt>
            <dd className="break-all text-ink">{user.email}</dd>
          </div>
        </dl>
      </Section>

      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault()
          void save()
        }}
      >
        <Section id="prefs-title" title="Preferências de estudo">
          <div className="space-y-8 pt-6">
            <div>
              <ChoiceGroup legend="Nível" variant="list" value={level} onChange={setLevel} options={LEVEL_OPTIONS} columns="sm:grid-cols-2" />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <p className="text-sm text-muted">
                  {!user.placement
                    ? 'Nível escolhido por você.'
                    : user.placement.level === user.level
                      ? `Nível definido por teste em ${formatFullDate(user.placement.takenAt)}`
                      : `Nível ajustado por você. O teste de ${formatFullDate(user.placement.takenAt)} indicou ${user.placement.level}.`}
                </p>
                <Button variant="ghost" onClick={() => navigate('/app/onboarding', { state: { redo: true } })}>
                  Refazer teste de nivelamento
                </Button>
              </div>
            </div>
            <ChoiceGroup
              legend="Sotaque"
              variant="pill"
              value={accent}
              options={ACCENT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              onChange={(next) => {
                setAccent(next)
              }}
            />
          </div>
        </Section>

        <StickyActionBar
          label="Preferências"
          summary={
            <span role="status" className={message?.ok === false ? 'text-on-danger' : undefined}>
              {message?.text ?? (dirty ? 'Alterações não salvas' : <span className="font-normal text-muted">Tudo salvo.</span>)}
            </span>
          }
        >
          <Button type="submit" size="lg" disabled={busy || !dirty} aria-busy={busy} className="px-8">
            {busy ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </StickyActionBar>
      </form>

      <Section id="sessao-title" title="Sessão" className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <p className="text-muted">Sair deste navegador. Seus dados continuam guardados.</p>
          <Button variant="danger" onClick={() => void signOut()}>
            Sair
          </Button>
        </div>
      </Section>
    </Page>
  )
}
