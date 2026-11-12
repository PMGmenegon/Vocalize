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

/** Mapa com marcador — cenários reais. */
export function PinIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </Icon>
  )
}

/** Ondas sonoras com lápis — ditado. */
export function DictationIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M3 10v4M7 7v10M11 9v6" />
      <path d="M14 20h3.5L22 15.5a2.1 2.1 0 0 0-3-3L14.5 17z" />
    </Icon>
  )
}

/** Globo — sotaques. */
export function GlobeIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 2.6 4 5.6 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.6-4-9s1.2-6.4 4-9z" />
    </Icon>
  )
}


/** Visto dentro de um balão — correção com explicação. */
export function CheckNoteIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H10l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M8 10.5l3 3 5-6" />
    </Icon>
  )
}

/** Degraus — níveis. */
export function StairsIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M3 20h5v-5h5v-5h5V5h3" />
    </Icon>
  )
}


/** Gráfico de barras — estatísticas. */
export function ChartIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 20V4M4 20h16" />
      <rect x="8" y="12" width="3" height="5" />
      <rect x="13" y="8" width="3" height="9" />
      <rect x="18" y="14" width="2" height="3" />
    </Icon>
  )
}


