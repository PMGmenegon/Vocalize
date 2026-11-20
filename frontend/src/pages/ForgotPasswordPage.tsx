import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../auth/useAuth'
import { authErrorMessage } from '../services'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** "Esqueci minha senha": envia o link de redefinição por e-mail. */
export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const initial = (useLocation().state as { email?: string } | null)?.email ?? ''
  const [email, setEmail] = useState(initial)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const value = email.trim()
    if (!EMAIL.test(value)) {
      setError('Informe um e-mail válido, como nome@exemplo.com.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await requestPasswordReset(value)
      setSentTo(value)
    } catch (err) {
      setFormError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-form flex w-full flex-1 flex-col">
      <h1 className="type-display text-[length:var(--t-title-size)]">Esqueceu a senha?</h1>
      <p className="mt-[var(--sp-1)] text-muted">Informe seu e-mail e enviamos um link para você criar uma nova senha.</p>

      {sentTo ? (
        <p role="status" className="mt-[var(--sp-3)] text-ink">
          Se existir uma conta para <strong className="break-all">{sentTo}</strong>, o link de redefinição já está a caminho. Confira também a caixa de
          spam.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-[var(--sp-3)] space-y-[var(--sp-2)]">
          <div role="alert">{formError && <p className="rounded-md bg-danger p-3 text-sm font-bold text-on-danger">{formError}</p>}</div>
          <Input
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Button type="submit" size="lg" className="w-full" disabled={busy} aria-busy={busy}>
            {busy ? 'Enviando…' : 'Enviar link'}
          </Button>
        </form>
      )}

      <p className="mt-auto pt-[var(--sp-3)] text-muted">
        Lembrou?{' '}
        <Link to="/login" className="font-bold text-link underline underline-offset-4">
          Voltar para entrar
        </Link>
      </p>
    </section>
  )
}
