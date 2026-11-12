import { useRef, useState, type KeyboardEvent } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AccentSwitch from './AccentSwitch'
import Logo from './Logo'

export interface NavItem {
  label: string
  to: string
}

interface HeaderProps {
  /** Para onde o logo leva. */
  logoTo: string
  items: readonly NavItem[]
  /** Usa NavLink (destaca a página atual). Em links com #âncora deixe desligado. */
  trackActive?: boolean
  /** Botão de destaque ao lado da navegação. */
  cta?: NavItem
  /** Saudação do modo atual (área logada). Mostra uma faixa com ilustração sob o cabeçalho. */
  greeting?: string
}

const baseLink = 'rounded-lg px-3 py-2 text-sm font-semibold transition-colors'
const ctaClass =
  'items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-bold text-on-brand transition-colors hover:bg-brand-strong'

/**
 * Cabeçalho compartilhado pelo site público e pela área logada.
 * Em telas >= md mostra a navegação inline; abaixo disso vira menu hambúrguer.
 */
export default function Header({ logoTo, items, trackActive = false, cta, greeting }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const menuId = 'menu-principal'

  const close = () => setOpen(false)

  // Esc fecha o menu e devolve o foco ao botão que o abriu.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      close()
      menuButton.current?.focus()
    }
  }

  function renderLink(item: NavItem, mobile: boolean) {
    const size = mobile ? 'block px-3 py-3 text-base' : ''
    if (trackActive) {
      return (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={close}
          className={({ isActive }) =>
            `${baseLink} ${size} ${isActive ? 'bg-surface text-link underline decoration-2 underline-offset-8' : 'text-ink hover:bg-surface'}`
          }
        >
          {item.label}
        </NavLink>
      )
    }
    return (
      <Link key={item.to} to={item.to} onClick={close} className={`${baseLink} ${size} text-ink hover:bg-surface`}>
        {item.label}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas" onKeyDown={onKeyDown}>
      <div className="accent-stripe" aria-hidden="true" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <Link to={logoTo} aria-label="Vocalize — página inicial" className="rounded-lg">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {items.map((item) => renderLink(item, false))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <AccentSwitch />
          {cta && (
            <Link to={cta.to} className={`${ctaClass} hidden lg:inline-flex`}>
              {cta.label}
            </Link>
          )}
          <button
            ref={menuButton}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border-2 border-control text-brand hover:bg-surface lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {greeting && (
        <div className="relative isolate overflow-hidden border-t border-line bg-surface">
          <p className="mx-auto flex h-11 max-w-6xl items-center px-4 text-sm font-bold text-ink sm:px-6">
            <span lang="en" className="text-base font-black text-brand">{greeting}</span>
          </p>
        </div>
      )}

      {open && (
        <nav id={menuId} aria-label="Principal" className="border-t border-line bg-canvas px-4 pb-4 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {items.map((item) => renderLink(item, true))}
            {cta && (
              <Link to={cta.to} onClick={close} className={`${ctaClass} mt-2 flex py-3 text-base`}>
                {cta.label}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
