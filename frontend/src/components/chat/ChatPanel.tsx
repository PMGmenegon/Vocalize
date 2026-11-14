import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

interface ChatPanelProps {
  header: ReactNode
  footer: ReactNode
  /** Muda sempre que chega algo novo (para rolar até o fim). */
  scrollKey: string | number
  children: ReactNode
}

/**
 * Casca do chat: cabeçalho fixo, histórico rolável e campo na base.
 * Rola sozinho até a mensagem nova, mas só se o usuário estiver perto do fim:
 * quem rolou para cima para reler não é puxado de volta.
 */
export default function ChatPanel({ header, footer, scrollKey, children }: ChatPanelProps) {
  const list = useRef<HTMLDivElement>(null)
  const stick = useRef(true)
  const [away, setAway] = useState(false)

  const toBottom = useCallback((smooth: boolean) => {
    const el = list.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduced ? 'smooth' : 'auto' })
  }, [])

  useEffect(() => {
    if (stick.current) toBottom(true)
  }, [scrollKey, toBottom])

  return (
    <div className="flex h-full min-h-0 flex-col">
      {header}
      <div className="relative min-h-0 flex-1">
        <div
          ref={list}
          role="log"
          aria-live="polite"
          aria-label="Conversa"
          tabIndex={0}
          onScroll={(e) => {
            const el = e.currentTarget
            const nearEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 80
            stick.current = nearEnd
            setAway(!nearEnd)
          }}
          className="h-full overflow-y-auto overscroll-contain"
        >
          {children}
        </div>
        {away && (
          <button
            type="button"
            onClick={() => {
              stick.current = true
              setAway(false)
              toBottom(true)
            }}
            className="surface-brand absolute bottom-3 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-brand px-4 py-2 text-xs font-bold text-on-brand shadow-lg hover:bg-brand-strong"
          >
            ↓ Nova mensagem
          </button>
        )}
      </div>
      <div className="border-t border-line">{footer}</div>
    </div>
  )
}
