import { Link, Outlet, useLocation } from 'react-router-dom'
import AccentSwitch from '../components/AccentSwitch'
import BrandPanel from '../components/auth/BrandPanel'
import BrandStrip from '../components/auth/BrandStrip'
import Logo from '../components/Logo'
import SkipLink from '../components/SkipLink'

/**
 * Layout de login e cadastro: formulário à esquerda e painel de identidade visual à direita
 * (≥ lg: 40/60; tablet: 55/45; celular: sem painel, só a etiqueta e a frase principal acima do formulário).
 * As duas colunas usam o fundo da página (sem blocos de cor); só uma linha fina as separa.
 * O painel fica fixo; só o formulário troca (com uma transição suave) ao ir de login a cadastro.
 */
export default function AuthLayout() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-dvh flex-col md:grid md:grid-cols-[55fr_45fr] lg:grid-cols-[40fr_60fr]">
      <SkipLink />
      <main id="conteudo" className="relative flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-20 sm:px-8 md:min-h-dvh md:py-10">
        <div className="absolute right-4 top-4 sm:right-6">
          <AccentSwitch />
        </div>
        <div className="w-full max-w-[400px]">
          <div className="md:hidden">
            <BrandStrip />
          </div>
          <Link to="/" aria-label="Vocalize — página inicial" className="mb-8 inline-flex rounded-lg">
            <Logo />
          </Link>
          <div key={pathname} className="fade-swap">
            <Outlet />
          </div>
        </div>
      </main>

      {/* A lateral acompanha a rolagem: em telas baixas (formulário maior que a janela) ela continua inteira à vista */}
      <div className="hidden border-l border-line md:block">
        <div className="sticky top-0 h-dvh">
          <BrandPanel />
        </div>
      </div>
    </div>
  )
}
