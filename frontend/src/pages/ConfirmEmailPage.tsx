import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuth } from '../auth/useAuth'
import { authErrorMessage } from '../services'

/** "Confirme seu e-mail": mostrada depois do cadastro (o endereço vem do state da navegação). */
export default function ConfirmEmailPage() {
  const { resendConfirmation } = useAuth()
  const email = (useLocation().state as { email?: string } | null)?.email
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)

  if (!email) return <Navigate to="/cadastro" replace />

  async function resend() {
    setBusy(true)
    setStatus(null)
    try {
      await resendConfirmation(email!)
      setStatus({ ok: true, text: 'Enviamos um novo e-mail. Confira também a caixa de spam.' })
    } catch (error) {
      setStatus({ ok: false, text: authErrorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-form flex w-full flex-1 flex-col">
      <h1 className="type-display text-[length:var(--t-title-size)]">Confirme seu e-mail</h1>
      <p className="mt-[var(--sp-1)] text-muted">
        Enviamos um link de confirmação para <strong className="break-all text-ink">{email}</strong>. Abra o e-mail e clique no link para ativar sua
        conta.
      </p>
      <p className="mt-[var(--sp-2)] text-muted">Não chegou? Confira a caixa de spam ou peça um novo e-mail.</p>

      <div className="mt-[var(--sp-3)]">
        <Button variant="secondary" className="btn-line w-full" disabled={busy} aria-busy={busy} onClick={() => void resend()}>
          {busy ? 'Enviando…' : 'Reenviar e-mail'}
        </Button>
        <p
          role={status && !status.ok ? 'alert' : 'status'}
          className={`mt-2 min-h-5 text-sm empty:hidden ${status?.ok === false ? 'font-bold text-on-danger' : 'text-muted'}`}
        >
          {status?.text}
        </p>
      </div>

      <p className="mt-auto pt-[var(--sp-3)] text-muted">
        Já confirmou?{' '}
        <Link to="/login" className="font-bold text-link underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </section>
  )
}
