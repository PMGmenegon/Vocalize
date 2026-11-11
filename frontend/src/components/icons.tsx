import type { ReactNode } from 'react'

/** Moldura comum dos ícones: traço contínuo na cor do texto (currentColor). */
function Icon({ children, className = 'h-7 w-7' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

/** Fones de ouvido — passo "Ouvir". */
export function HeadphonesIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4" height="7" rx="1.5" />
      <rect x="17" y="14" width="4" height="7" rx="1.5" />
    </Icon>
  )
}

/** Lápis — passo "Transcrever". */
export function PencilIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
      <path d="M13.5 6.5l4 4" />
    </Icon>
  )
}

/** Balões de conversa — passo "Responder". */
export function ChatIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      <path d="M19 9h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-3-3h-4" />
    </Icon>
  )
}
