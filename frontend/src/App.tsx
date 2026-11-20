import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GuestOnly from './auth/GuestOnly'
import RequireAuth from './auth/RequireAuth'
import { SkeletonBlock } from './components/ui/Skeleton'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import PublicLayout from './layouts/PublicLayout'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/app/DashboardPage'
import OnboardingPage from './pages/app/OnboardingPage'
import PracticePage from './pages/app/PracticePage'
import PracticeSessionPage from './pages/app/PracticeSessionPage'
import ProfilePage from './pages/app/ProfilePage'
import ReviewPage from './pages/app/ReviewPage'
import SummaryPage from './pages/app/SummaryPage'

/** Estatísticas carregam sob demanda: o Recharts pesa mais que o resto do app. */
const StatsPage = lazy(() => import('./pages/app/StatsPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site público */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Login e cadastro: tela dividida com painel de identidade visual */}
        <Route element={<AuthLayout />}>
          <Route element={<GuestOnly />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="cadastro" element={<RegisterPage />} />
            <Route path="confirmar-email" element={<ConfirmEmailPage />} />
            <Route path="esqueci-senha" element={<ForgotPasswordPage />} />
          </Route>
          <Route path="redefinir-senha" element={<ResetPasswordPage />} />
        </Route>

        {/* Área logada: exige login (Supabase) e onboarding concluído */}
        <Route element={<RequireAuth />}>
          <Route path="app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="praticar" element={<PracticePage />} />
            <Route path="praticar/:sessaoId" element={<PracticeSessionPage />} />
            <Route path="praticar/:sessaoId/resumo" element={<SummaryPage />} />
            <Route
              path="estatisticas"
              element={
                <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><SkeletonBlock lines={4} label="Carregando estatísticas…" /></div>}>
                  <StatsPage />
                </Suspense>
              }
            />
            <Route path="revisao" element={<ReviewPage />} />
            <Route path="perfil" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
