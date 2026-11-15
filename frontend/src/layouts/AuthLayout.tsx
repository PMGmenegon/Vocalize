import { Link, Outlet, useLocation } from 'react-router-dom'
import AccentSwitch from '../components/AccentSwitch'
import BrandPanel from '../components/auth/BrandPanel'
import BrandStrip from '../components/auth/BrandStrip'
import Logo from '../components/Logo'
import SkipLink from '../components/SkipLink'

/**
 * Layout de login e cadastro: uma única superfície contínua, sem linha, borda ou cor separando as colunas.
 * Grade de 12 colunas (md: 6/6; lg: formulário 5, lateral 7, pois a lateral carrega transcrição e tabela e precisa de mais largura).
 * Margens externas iguais (--auth-margin) e espaço generoso entre as colunas (--auth-gutter).
 * As duas colunas têm a mesma altura e o mesmo respiro vertical: o topo do logo alinha com o topo da etiqueta da lateral
 * e o fim do formulário (link de troca) com o rodapé da lateral.
 * O painel fica fixo; só o formulário troca (com uma transição suave) ao ir de login a cadastro.
 */
export default function AuthLayout() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-dvh md:grid md:grid-cols-12 md:px-[var(--auth-margin)] md:[column-gap:var(--auth-gutter)]">
      <SkipLink />
      <main
        id="conteudo"
        className="relative flex min-h-dvh flex-col px-4 pb-10 pt-20 sm:px-8 md:col-span-6 md:px-0 md:py-[var(--auth-pad-y)] lg:col-span-5"
      >
        <div className="absolute right-4 top-4 sm:right-6 md:hidden">
          <AccentSwitch />
        </div>
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col md:mx-0 md:max-w-[28rem]">
          <div className="md:hidden">
            <BrandStrip />
          </div>
          <Link to="/" aria-label="Vocalize — página inicial" className="mb-[var(--sp-4)] inline-flex self-start rounded-lg">
            <Logo />
          </Link>
          <div key={pathname} className="fade-swap flex flex-1 flex-col">
            <Outlet />
          </div>
        </div>
      </main>

      {/* A lateral acompanha a rolagem: em telas baixas (formulário maior que a janela) ela continua inteira à vista */}
      <div className="relative hidden md:col-span-6 md:block lg:col-span-7">
        <div className="absolute right-0 top-[var(--auth-pad-y)] z-10">
          <AccentSwitch />
        </div>
        <div className="sticky top-0 h-dvh">
          <BrandPanel />
        </div>
      </div>
    </div>
  )
}
