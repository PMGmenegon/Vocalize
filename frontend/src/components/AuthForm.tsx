import { useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { postLoginPath } from '../auth/redirect'
import { useAuth } from '../auth/useAuth'
import { themeOf } from '../lib/format'
import { PASSWORD_RULE_HINT, validateNewPassword } from '../lib/password'
import { AuthFailure, authErrorMessage } from '../services'
import { useTheme } from '../theme/useTheme'
import Button from './ui/Button'
import PasswordStrength from './auth/PasswordStrength'
import { Input, PasswordInput } from './ui/Input'

type Mode = 'login' | 'register'
type Errors = Partial<Record<'name' | 'email' | 'password' | 'confirm', string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(mode: Mode, v: { name: string; email: string; password: string; confirm: string }): Errors {
  const errors: Errors = {}
  if (mode === 'register' && v.name.trim().length < 2) errors.name = 'Informe seu nome.'
  if (!EMAIL.test(v.email.trim())) errors.email = 'Informe um e-mail válido, como nome@exemplo.com.'
  if (mode === 'register') {
    // O cadastro segue a regra do Supabase (8+ caracteres, letras e números). No login, vale a senha que já existe.
    const problem = validateNewPassword(v.password)
    if (problem) errors.password = problem
  } else if (v.password.length < 8) {
    errors.password = 'A senha precisa ter pelo menos 8 caracteres.'
  }
  if (mode === 'register' && v.confirm !== v.password) errors.confirm = 'A confirmação não é igual à senha.'
  return errors
}

/** Formulário de login ou cadastro (validação no cliente; a autenticação é do Supabase, via authService). */
export default function AuthForm({ mode }: { mode: Mode }) {
  const isLogin = mode === 'login'
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { setAccent } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [note, setNote] = useState('')

  // Quem já está logado nem chega aqui: o GuestOnly (nas rotas) redireciona.

  const set = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    if (submitted) setErrors(validate(mode, next))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setFormError('')
    setNeedsConfirmation(false)
    const found = validate(mode, values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Foca o primeiro campo com erro.
      window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    setBusy(true)
    try {
      const email = values.email.trim()
      if (isLogin) {
        const signedIn = await signIn({ email, password: values.password })
        setAccent(themeOf(signedIn.accent))
        navigate(postLoginPath(signedIn, location.state), { replace: true })
        return
      }
      const result = await signUp({ name: values.name.trim(), email, password: values.password })
      // Com a confirmação de e-mail ligada ainda não há sessão: pedimos para confirmar. Sem ela, segue para o onboarding.
      if (result.user) navigate(postLoginPath(result.user), { replace: true })
      else navigate('/confirmar-email', { replace: true, state: { email: result.email } })
    } catch (error) {
      setFormError(authErrorMessage(error))
      setNeedsConfirmation(error instanceof AuthFailure && error.code === 'email_not_confirmed')
      setBusy(false)
    }
  }

  const errorCount = Object.keys(errors).length

  return (
    <section className="auth-form flex w-full flex-1 flex-col">
      <h1 className="type-display text-[length:var(--t-title-size)]">{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h1>
      <p className="mt-[var(--sp-1)] text-muted">
        {isLogin ? 'Continue de onde parou e treine seu ouvido.' : 'Em um minuto você começa a treinar seu ouvido.'}
      </p>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-[var(--sp-3)] space-y-[var(--sp-2)]">
        <div role="alert">
          {submitted && errorCount > 0 && (
            <p className="rounded-md bg-danger p-3 text-sm font-bold text-on-danger">
              Corrija {errorCount === 1 ? 'o campo destacado' : `os ${errorCount} campos destacados`} para continuar.
            </p>
          )}
          {formError && <p className="rounded-md bg-danger p-3 text-sm font-bold text-on-danger">{formError}</p>}
          {needsConfirmation && (
            <p className="mt-2 text-sm">
              <Link
                to="/confirmar-email"
                state={{ email: values.email.trim() }}
                className="font-bold text-link underline underline-offset-4"
              >
                Reenviar e-mail de confirmação
              </Link>
            </p>
          )}
        </div>
        {!isLogin && (
          <Input label="Nome" name="name" autoComplete="name" value={values.name} onChange={set('name')} error={errors.name} />
        )}
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
        />
        <div>
          <PasswordInput
            label="Senha"
            name="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            hint={isLogin ? undefined : PASSWORD_RULE_HINT}
            value={values.password}
            onChange={set('password')}
            error={errors.password}
          />
          {!isLogin && <PasswordStrength password={values.password} />}
        </div>
        {!isLogin && (
          <PasswordInput
            label="Confirmar senha"
            name="confirm"
            autoComplete="new-password"
            value={values.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
          />
        )}
        {isLogin && (
          <div className="-mt-1 text-right">
            <Link
              to="/esqueci-senha"
              state={{ email: values.email.trim() }}
              className="inline-flex min-h-9 items-center px-1 text-sm font-bold text-link underline underline-offset-4"
            >
              Esqueci minha senha
            </Link>
          </div>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy} aria-busy={busy}>
          {busy ? 'Entrando…' : isLogin ? 'Entrar' : 'Criar conta'}
        </Button>
      </form>

      <div className="my-[var(--sp-3)] flex items-center gap-3 text-sm text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        variant="secondary"
        className="btn-line w-full"
        disabled={busy}
        onClick={() => {
          setNote('')
          // Com sucesso o navegador vai para o Google; só voltamos aqui se algo falhar (ex.: provedor desligado).
          signInWithGoogle().catch((error) => setNote(authErrorMessage(error)))
        }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
          <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z" />
          <path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.800-4.300H2.700v2.700A10 10 0 0 0 12 22z" />
          <path fill="#FBBC05" d="M6.200 13.600a6 6 0 0 1 0-3.800V7.100H2.700a10 10 0 0 0 0 9.200z" />
          <path fill="#EA4335" d="M12 5.900c1.500 0 2.900.5 4 1.500l3-3A10 10 0 0 0 2.700 7.100l3.500 2.700C7 7.700 9.300 5.900 12 5.900z" />
        </svg>
        Entrar com Google
      </Button>
      <p role="status" className="mt-2 min-h-5 text-sm text-muted empty:hidden">
        {note}
      </p>

      <p className="mt-auto pt-[var(--sp-3)] text-muted">
        {isLogin ? 'Ainda não tem conta? ' : 'Já tem conta? '}
        <Link to={isLogin ? '/cadastro' : '/login'} className="font-bold text-link underline underline-offset-4">
          {isLogin ? 'Cadastre-se' : 'Entrar'}
        </Link>
      </p>
    </section>
  )
}
