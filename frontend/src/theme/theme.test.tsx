// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AuthProvider } from '../auth/AuthProvider'
import { useAuth } from '../auth/useAuth'
import AuthForm from '../components/AuthForm'
import ThemeSwitch from '../components/ThemeSwitch'
import OnboardingPage from '../pages/app/OnboardingPage'
import { profileService } from '../services'
import { createFakeAuthService, FAKE_SESSION } from '../test/fakeAuthService'
import { THEME_STORAGE_KEY } from './themes'
import { ThemeProvider } from './ThemeProvider'

const htmlTheme = () => document.documentElement.dataset.theme
const savedTheme = () => localStorage.getItem(THEME_STORAGE_KEY)

/** Só mostra os filhos quando a sessão terminou de carregar; expõe se há usuário logado. */
function Ready({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth()
  if (status === 'loading') return null
  return (
    <>
      <p>{user ? 'logado' : 'visitante'}</p>
      {children}
    </>
  )
}

function setup(ui: React.ReactNode, session = FAKE_SESSION) {
  const { service } = createFakeAuthService(session)
  return render(
    <ThemeProvider>
      <AuthProvider service={service}>
        <MemoryRouter>
          <Ready>{ui}</Ready>
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>,
  )
}

beforeEach(() => {
  // O jsdom não tem matchMedia; o ThemeProvider o usa para respeitar "menos movimento".
  window.matchMedia = ((query: string) => ({ matches: false, media: query }) as MediaQueryList) as typeof window.matchMedia
  localStorage.clear()
  delete document.documentElement.dataset.theme
})
afterEach(cleanup)

describe('tema visual × sotaque de estudo', () => {
  it('o seletor US/UK troca o tema e o salva no navegador', async () => {
    setup(<ThemeSwitch />, null as never)
    await waitFor(() => expect(htmlTheme()).toBe('us'))
    fireEvent.click(screen.getByRole('button', { name: /britânico/i }))
    await waitFor(() => expect(htmlTheme()).toBe('uk'))
    expect(savedTheme()).toBe('uk')
  })

  it('escolher o sotaque no onboarding não muda o tema', async () => {
    setup(<OnboardingPage />)
    const britanico = await screen.findByRole('radio', { name: /britânico/i })
    fireEvent.click(britanico)
    expect((britanico as HTMLInputElement).checked).toBe(true)
    expect(htmlTheme()).toBe('us')
    expect(savedTheme()).toBeNull()
  })

  it('login de usuário com sotaque diferente do tema atual não muda o tema', async () => {
    // Perfil salvo com sotaque britânico; o navegador está no tema US.
    await profileService.savePreferences(profileService.load(FAKE_SESSION.user), { level: 'B1', accent: 'en-GB' })
    setup(<AuthForm mode="login" />, null as never)
    await screen.findByText('visitante')
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@exemplo.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha1234' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await screen.findByText('logado')
    expect(htmlTheme()).toBe('us')
    expect(savedTheme()).toBeNull()
  })
})
