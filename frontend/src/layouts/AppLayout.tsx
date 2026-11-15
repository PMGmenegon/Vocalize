import { Outlet } from 'react-router-dom'
import Header, { type NavItem } from '../components/Header'
import SkipLink from '../components/SkipLink'
import { MODE_COPY } from '../theme/modeCopy'
import { useTheme } from '../theme/useTheme'

const ITEMS: readonly NavItem[] = [
  { label: 'Início', to: '/app', end: true },
  { label: 'Praticar', to: '/app/praticar' },
  { label: 'Estatísticas', to: '/app/estatisticas' },
  { label: 'Revisão', to: '/app/revisao' },
  { label: 'Perfil', to: '/app/perfil' },
]

/** Layout da área logada (/app): cabeçalho com navegação + conteúdo da página. */
export default function AppLayout() {
  const { accent } = useTheme()

  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Header logoTo="/app" items={ITEMS} trackActive greeting={MODE_COPY[accent].greeting} />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
