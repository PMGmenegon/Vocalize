import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header, { type NavItem } from '../components/Header'
import SkipLink from '../components/SkipLink'
import Splash from '../components/Splash'

const ITEMS: readonly NavItem[] = [
  { label: 'Praticar', to: '/app/praticar' },
  { label: 'Estatísticas', to: '/app/estatisticas' },
  { label: 'Revisão', to: '/app/revisao' },
  { label: 'Perfil', to: '/app/perfil' },
]

/**
 * Layout da área logada (/app): cabeçalho com navegação + conteúdo da página.
 *
 * A splash aparece toda vez que este layout é montado (ao entrar em /app).
 * Quando houver login real, ela passará a ser acionada logo após o login.
 * O dashboard já fica renderizado por baixo; `inert` o tira do foco/leitores
 * de tela enquanto a splash cobre a tela.
 */
export default function AppLayout() {
  const [splashDone, setSplashDone] = useState(false)
  const finishSplash = useCallback(() => setSplashDone(true), [])

  return (
    <>
      {!splashDone && <Splash onDone={finishSplash} />}
      <div inert={!splashDone} className="flex min-h-dvh flex-col">
        <SkipLink />
        <Header logoTo="/app" items={ITEMS} trackActive />
        <main id="conteudo" className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  )
}
