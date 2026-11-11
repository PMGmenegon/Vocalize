import { Outlet } from 'react-router-dom'
import Header, { type NavItem } from '../components/Header'
import SkipLink from '../components/SkipLink'

const ITEMS: readonly NavItem[] = [
  { label: 'Praticar', to: '/app/praticar' },
  { label: 'Estatísticas', to: '/app/estatisticas' },
  { label: 'Revisão', to: '/app/revisao' },
  { label: 'Perfil', to: '/app/perfil' },
]

/** Layout da área logada (/app): cabeçalho com navegação + conteúdo da página. */
export default function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Header logoTo="/app" items={ITEMS} trackActive />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
