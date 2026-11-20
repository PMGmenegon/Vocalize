// @vitest-environment jsdom
import { useEffect } from 'react'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createFakeAuthService, FAKE_SESSION } from '../test/fakeAuthService'
import { AuthProvider } from './AuthProvider'
import type { AuthContextValue } from './AuthContext'
import { useAuth } from './useAuth'

const probe = { ctx: null as unknown as AuthContextValue }
const get = () => probe.ctx
function Probe() {
  const ctx = useAuth()
  useEffect(() => {
    probe.ctx = ctx
  })
  return <p>{ctx.status === 'loading' ? 'carregando' : ctx.user ? `logado:${ctx.user.email}` : 'visitante'}</p>
}

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('AuthProvider', () => {
  it('começa carregando e termina visitante, sem sessão', async () => {
    const { service } = createFakeAuthService(null)
    render(
      <AuthProvider service={service}>
        <Probe />
      </AuthProvider>,
    )
    expect(screen.getByText('carregando')).toBeTruthy()
    await screen.findByText('visitante')
    expect(get().session).toBeNull()
  })

  it('restaura a sessão existente com o perfil (primeiro acesso: sem onboarding)', async () => {
    const { service } = createFakeAuthService(FAKE_SESSION)
    render(
      <AuthProvider service={service}>
        <Probe />
      </AuthProvider>,
    )
    await screen.findByText('logado:ana@exemplo.com')
    expect(get().user?.onboarded).toBe(false)
    expect(get().user?.id).toBe('u-1')
  })

  it('login com senha errada falha e com a certa entra', async () => {
    const { service } = createFakeAuthService(null)
    render(
      <AuthProvider service={service}>
        <Probe />
      </AuthProvider>,
    )
    await screen.findByText('visitante')
    await expect(get().signIn({ email: 'x@y.com', password: 'errada' })).rejects.toMatchObject({ code: 'invalid_credentials' })
    await act(async () => {
      await get().signIn({ email: 'x@y.com', password: 'senha1234' })
    })
    await screen.findByText('logado:x@y.com')
  })

  it('logout limpa usuário e sessão', async () => {
    const { service } = createFakeAuthService(FAKE_SESSION)
    render(
      <AuthProvider service={service}>
        <Probe />
      </AuthProvider>,
    )
    await screen.findByText('logado:ana@exemplo.com')
    await act(async () => {
      await get().signOut()
    })
    await screen.findByText('visitante')
    expect(get().session).toBeNull()
  })

  it('reage a mudanças vindas do serviço (ex.: logout em outra aba) e cancela a assinatura ao desmontar', async () => {
    const { service, listeners, setSession, emit } = createFakeAuthService(FAKE_SESSION)
    const { unmount } = render(
      <AuthProvider service={service}>
        <Probe />
      </AuthProvider>,
    )
    await screen.findByText('logado:ana@exemplo.com')
    act(() => {
      setSession(null)
      emit('SIGNED_OUT')
    })
    await waitFor(() => expect(screen.getByText('visitante')).toBeTruthy())
    unmount()
    expect(listeners.size).toBe(0)
  })

  it('salvar preferências conclui o onboarding e guarda por usuário', async () => {
    const { service } = createFakeAuthService(FAKE_SESSION)
    render(
      <AuthProvider service={service}>
        <Probe />
      </AuthProvider>,
    )
    await screen.findByText('logado:ana@exemplo.com')
    await act(async () => {
      await get().savePreferences({ level: 'B2', accent: 'en-GB' })
    })
    expect(get().user?.onboarded).toBe(true)
    expect(get().user?.level).toBe('B2')
    cleanup()
    render(
      <AuthProvider service={service}>
        <Probe />
      </AuthProvider>,
    )
    await screen.findByText('logado:ana@exemplo.com')
    expect(get().user?.onboarded).toBe(true)
  })
})
