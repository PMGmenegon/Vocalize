import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { PasswordInput } from '../components/ui/Input'
import PasswordStrength from '../components/auth/PasswordStrength'
import { SkeletonBlock } from '../components/ui/Skeleton'
import { postLoginPath } from '../auth/redirect'
import { useAuth } from '../auth/useAuth'
import { PASSWORD_RULE_HINT, validateNewPassword } from '../lib/password'
import { authErrorMessage } from '../services'

/**
 * Nova senha. O link do e-mail traz o usuário já com uma sessão de recuperação (o Supabase a cria ao abrir o link);
 * sem sessão, o link é inválido ou expirou.
 */
export default function ResetPasswordPage() {
  const { user, status, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  if (status === 'loading') return <SkeletonBlock lines={3} label="Verificando o link…" />

  if (!user) {
    return (
      <section className="auth-form flex w-full flex-1 flex-col">
        <h1 className="type-display text-[length:var(--t-title-size)]">Link inválido</h1>
        <p role="alert" className="mt-[var(--sp-1)] text-muted">
          Este link de redefinição é inválido ou expirou. Peça um novo para criar sua senha.
        </p>
        <div className="mt-[var(--sp-3)]">
          <Button to="/esqueci-senha" size="lg" className="w-full">
            Pedir novo link
          </Button>
        </div>
      </section>
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const found = {
      password: validateNewPassword(password) ?? undefined,
      confirm: confirm !== password ? 'A confirmação não é igual à senha.' : undefined,
    }
    setErrors(found)
    if (found.password || found.confirm) return
    setBusy(true)
    try {
      await updatePassword(password)
      navigate(postLoginPath(user!), { replace: true })
    } catch (error) {
      setFormError(authErrorMessage(error))
      setBusy(false)
    }
  }

  return (
    <section className="auth-form flex w-full flex-1 flex-col">
      <h1 className="type-display text-[length:var(--t-title-size)]">Crie uma nova senha</h1>
      <p className="mt-[var(--sp-1)] text-muted">Escolha a senha que você vai usar para entrar.</p>

      <form onSubmit={onSubmit} noValidate className="mt-[var(--sp-3)] space-y-[var(--sp-2)]">
        <div role="alert">{formError && <p className="rounded-md bg-danger p-3 text-sm font-bold text-on-danger">{formError}</p>}</div>
        <div>
          <PasswordInput
            label="Nova senha"
            name="password"
            autoComplete="new-password"
            hint={PASSWORD_RULE_HINT}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <PasswordStrength password={password} />
        </div>
        <PasswordInput
          label="Confirmar senha"
          name="confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />
        <Button type="submit" size="lg" className="w-full" disabled={busy} aria-busy={busy}>
          {busy ? 'Salvando…' : 'Salvar nova senha'}
        </Button>
      </form>

      <p className="mt-auto pt-[var(--sp-3)] text-muted">
        <Link to="/app" className="font-bold text-link underline underline-offset-4">
          Cancelar
        </Link>
      </p>
    </section>
  )
}
