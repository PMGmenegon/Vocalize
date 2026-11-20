// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { profileService, type AuthSession } from '../services'
import { createFakeAuthService, FAKE_SESSION } from '../test/fakeAuthService'
import { AuthProvider } from './AuthProvider'
import GuestOnly from './GuestOnly'
import RequireAuth from './RequireAuth'
import { postLoginPath } from './redirect'

function Where() {
  const { pathname, state } = useLocation()
  const from = (state as { from?: { pathname: string } } | null)?.from?.pathname
  return <p>{`em:${pathname}${from ? ` (de ${from})` : ''}`}</p>
}

function renderAt(path: string, session: AuthSession | null = null) {
  const { service } = createFakeAuthService(session)
  return render(
    <AuthProvider service={service}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<GuestOnly />}>
            <Route path="login" element={<Where />} />
            <Route path="cadastro" element={<Where />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="app/*" element={<Where />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

const onboard = () => profileService.savePreferences(profileService.load(FAKE_SESSION.user), { level: 'B1', accent: 'en-US' })

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('rotas protegidas', () => {
  it('visitante em /app/praticar vai para /login guardando a rota pretendida', async () => {
    renderAt('/app/praticar')
    await screen.findByText('em:/login (de /app/praticar)')
  })

  it('durante o carregamento mostra só o estado de carregamento (sem piscar o login)', async () => {
    renderAt('/app', FAKE_SESSION)
    expect(screen.queryByText(/em:\/login/)).toBeNull()
    await screen.findByText('em:/app/onboarding')
  })

  it('logado sem onboarding é levado ao onboarding', async () => {
    renderAt('/app/praticar', FAKE_SESSION)
    await screen.findByText('em:/app/onboarding')
  })

  it('logado com onboarding concluído entra na rota pedida', async () => {
    await onboard()
    renderAt('/app/praticar', FAKE_SESSION)
    await screen.findByText('em:/app/praticar')
  })
})

describe('rotas públicas (login e cadastro)', () => {
  it('visitante vê o login e o cadastro', async () => {
    renderAt('/login')
    await screen.findByText('em:/login')
    cleanup()
    renderAt('/cadastro')
    await screen.findByText('em:/cadastro')
  })

  it('com sessão ativa, login e cadastro redirecionam para o app', async () => {
    await onboard()
    renderAt('/login', FAKE_SESSION)
    await screen.findByText('em:/app')
    cleanup()
    renderAt('/cadastro', FAKE_SESSION)
    await screen.findByText('em:/app')
  })

  it('com sessão ativa e sem onboarding, vão ao onboarding', async () => {
    renderAt('/login', FAKE_SESSION)
    await screen.findByText('em:/app/onboarding')
  })
})

describe('postLoginPath', () => {
  const from = { from: { pathname: '/app/revisao', search: '?a=1' } }
  it('usa a rota pretendida só se o onboarding está concluído e é dentro de /app', () => {
    expect(postLoginPath({ onboarded: true }, from)).toBe('/app/revisao?a=1')
    expect(postLoginPath({ onboarded: false }, from)).toBe('/app/onboarding')
    expect(postLoginPath({ onboarded: true })).toBe('/app')
    expect(postLoginPath({ onboarded: true }, { from: { pathname: 'https://evil.com' } })).toBe('/app')
  })
})
