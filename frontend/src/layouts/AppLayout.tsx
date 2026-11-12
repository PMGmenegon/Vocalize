import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header, { type NavItem } from '../components/Header'
import SkipLink from '../components/SkipLink'
import Splash from '../components/Splash'
import { MODE_COPY } from '../theme/modeCopy'
import { useTheme } from '../theme/useTheme'

const ITEMS: readonly NavItem[] = [
  { label: 'Início', to: '/app', end: true },
  { label: 'Praticar', to: '/app/praticar' },
  { label: 'Estatísticas', to: '/app/estatisticas' },
  { label: 'Revisão', to: '/app/revisao' },
  { label: 'Perfil', to: '/app/perfil' },
]

/**
 * Layout da área logada (/app): cabeçalho com navegação + conteúdo da página.
 *
 * A splash aparece toda vez que este layout é montado: logo após o login/cadastro
 * (que navega para /app) e ao recarregar a página. A tela já fica renderizada por
 * baixo; `inert` a tira do foco/leitores de tela enquanto a splash cobre tudo.
 */
export default function AppLayout() {
  const [splashDone, setSplashDone] = useState(false)
  const { accent } = useTheme()
  const finishSplash = useCallback(() => setSplashDone(true), [])

  return (
    <>
      {!splashDone && <Splash onDone={finishSplash} />}
      <div inert={!splashDone} className="flex min-h-dvh flex-col">
        <SkipLink />
        <Header logoTo="/app" items={ITEMS} trackActive greeting={MODE_COPY[accent].greeting} />
        <main id="conteudo" className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  )
}
