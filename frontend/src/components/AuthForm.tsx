import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { themeOf } from '../lib/format'
import { useTheme } from '../theme/useTheme'
import Button from './ui/Button'
import Card from './ui/Card'
import { Input } from './ui/Input'

type Mode = 'login' | 'register'
type Errors = Partial<Record<'name' | 'email' | 'password' | 'confirm', string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(mode: Mode, v: { name: string; email: string; password: string; confirm: string }): Errors {
  const errors: Errors = {}
  if (mode === 'register' && v.name.trim().length < 2) errors.name = 'Informe seu nome.'
  if (!EMAIL.test(v.email.trim())) errors.email = 'Informe um e-mail válido, como nome@exemplo.com.'
  if (v.password.length < 8) errors.password = 'A senha precisa ter pelo menos 8 caracteres.'
  if (mode === 'register' && v.confirm !== v.password) errors.confirm = 'A confirmação não é igual à senha.'
  return errors
}

/** Formulário de login ou cadastro (validação no cliente; a autenticação é simulada). */
export default function AuthForm({ mode }: { mode: Mode }) {
  const isLogin = mode === 'login'
  const { user, login, register } = useAuth()
  const { setAccent } = useTheme()
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [googleNote, setGoogleNote] = useState('')

  // Quem já está logado não precisa ver o formulário (a navegação pós-login cuida do próprio redirecionamento).
  if (user && !busy) return <Navigate to="/app" replace />

  const set = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    if (submitted) setErrors(validate(mode, next))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setFormError('')
    const found = validate(mode, values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Foca o primeiro campo com erro.
      window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    setBusy(true)
    try {
      const signedIn = isLogin
        ? await login({ email: values.email.trim(), password: values.password })
        : await register({ name: values.name.trim(), email: values.email.trim(), password: values.password })
      if (isLogin) setAccent(themeOf(signedIn.accent))
      navigate(signedIn.onboarded ? '/app' : '/app/onboarding', { replace: true })
    } catch {
      setFormError('Não foi possível concluir agora. Tente novamente em instantes.')
      setBusy(false)
    }
  }

  const errorCount = Object.keys(errors).length

  return (
    <section className="mx-auto max-w-md px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-black text-brand">{isLogin ? 'Entrar' : 'Criar conta'}</h1>
      <p className="mt-2 text-muted">
        {isLogin ? 'Que bom te ver de volta. Continue de onde parou.' : 'Em um minuto você começa a treinar seu ouvido.'}
      </p>

      <Card className="mt-6">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setGoogleNote('O login com Google chega numa fase futura. Por enquanto, use e-mail e senha.')}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
            <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z" />
            <path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.800-4.300H2.700v2.700A10 10 0 0 0 12 22z" />
            <path fill="#FBBC05" d="M6.200 13.600a6 6 0 0 1 0-3.800V7.100H2.700a10 10 0 0 0 0 9.200z" />
            <path fill="#EA4335" d="M12 5.900c1.500 0 2.900.5 4 1.500l3-3A10 10 0 0 0 2.700 7.100l3.500 2.700C7 7.700 9.300 5.900 12 5.900z" />
          </svg>
          Entrar com Google
        </Button>
        <p role="status" className="mt-2 text-sm text-muted">
          {googleNote}
        </p>

        <div className="my-5 flex items-center gap-3 text-sm text-muted" aria-hidden="true">
          <span className="h-px flex-1 bg-line" />
          ou
          <span className="h-px flex-1 bg-line" />
        </div>

        <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4">
          <div role="alert">
            {submitted && errorCount > 0 && (
              <p className="rounded-xl bg-danger p-3 text-sm font-bold text-on-danger">
                Corrija {errorCount === 1 ? 'o campo destacado' : `os ${errorCount} campos destacados`} para continuar.
              </p>
            )}
            {formError && <p className="rounded-xl bg-danger p-3 text-sm font-bold text-on-danger">{formError}</p>}
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
          <Input
            label="Senha"
            name="password"
            type="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            hint={isLogin ? undefined : 'Mínimo de 8 caracteres.'}
            value={values.password}
            onChange={set('password')}
            error={errors.password}
          />
          {!isLogin && (
            <Input
              label="Confirmar senha"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={values.confirm}
              onChange={set('confirm')}
              error={errors.confirm}
            />
          )}
          <Button type="submit" size="lg" className="w-full" disabled={busy} aria-busy={busy}>
            {busy ? 'Entrando…' : isLogin ? 'Entrar' : 'Criar conta'}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-muted">
        {isLogin ? 'Ainda não tem conta? ' : 'Já tem conta? '}
        <Link to={isLogin ? '/cadastro' : '/login'} className="font-bold text-link underline underline-offset-4">
          {isLogin ? 'Cadastre-se' : 'Entrar'}
        </Link>
      </p>
    </section>
  )
}
