import { Outlet } from 'react-router-dom'
import Header, { type NavItem } from '../components/Header'
import SkipLink from '../components/SkipLink'

const ITEMS: readonly NavItem[] = [
  { label: 'Como funciona', to: '/#como-funciona' },
  { label: 'Funcionalidades', to: '/#funcionalidades' },
  { label: 'Sotaques', to: '/#sotaques' },
  { label: 'Níveis', to: '/#niveis' },
  { label: 'Entrar', to: '/login' },
]
const CTA: NavItem = { label: 'Começar', to: '/cadastro' }

/** Layout do site público (página inicial e afins). */
export default function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Header logoTo="/" items={ITEMS} cta={CTA} />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted sm:px-6">
          Vocalize · projeto de portfólio · interface em português, conteúdo de estudo em inglês.
        </div>
      </footer>
    </div>
  )
}
