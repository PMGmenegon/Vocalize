import { Link, Outlet, useLocation } from 'react-router-dom'
import AccentSwitch from '../components/AccentSwitch'
import BrandPanel from '../components/auth/BrandPanel'
import BrandStrip from '../components/auth/BrandStrip'
import Logo from '../components/Logo'
import SkipLink from '../components/SkipLink'

/**
 * Layout de login e cadastro: formulário à esquerda e painel de identidade visual à direita
 * (≥ lg: 40/60; tablet: 55/45; celular: sem painel, só uma faixa fina no topo).
 * O painel fica fixo; só o formulário troca (com uma transição suave) ao ir de login a cadastro.
 */
export default function AuthLayout() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-dvh flex-col md:grid md:grid-cols-[55fr_45fr] lg:grid-cols-[40fr_60fr]">
      <SkipLink />
      <div className="md:hidden">
        <BrandStrip />
      </div>

      <main id="conteudo" className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 md:min-h-dvh">
        <div className="absolute right-4 top-4 sm:right-6">
          <AccentSwitch />
        </div>
        <div className="w-full max-w-md">
          <Link to="/" aria-label="Vocalize — página inicial" className="mb-6 inline-flex rounded-lg">
            <Logo />
          </Link>
          <div key={pathname} className="fade-swap">
            <Outlet />
          </div>
        </div>
      </main>

      <div className="relative hidden md:block">
        <BrandPanel />
      </div>
    </div>
  )
}
