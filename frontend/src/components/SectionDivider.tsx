import { useId } from 'react'
import { useTheme } from '../theme/useTheme'

/**
 * Divisória de seção. US: faixas com estrelas. UK: filetes com cruzes
 * inspiradas na Union Jack. Fina e discreta, só para marcar a troca de assunto.
 */
export default function SectionDivider({ className = '' }: { className?: string }) {
  const { accent } = useTheme()
  const id = useId()

  return (
    <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`} aria-hidden="true">
      <svg className="block h-5 w-full" role="presentation" focusable="false">
        <defs>
          {accent === 'us' ? (
            <pattern id={id} width="40" height="20" patternUnits="userSpaceOnUse">
              <polygon
                transform="translate(20 10)"
                points="0,-6 1.76,-2.42 5.7,-1.85 2.85,0.93 3.53,4.85 0,3 -3.53,4.85 -2.85,0.93 -5.7,-1.85 -1.76,-2.42"
                fill="var(--accent)"
              />
            </pattern>
          ) : (
            <pattern id={id} width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M12 10 H28 M20 2 V18" stroke="var(--brand)" strokeWidth="5" />
              <path d="M12 10 H28 M20 2 V18" stroke="var(--canvas)" strokeWidth="2.5" />
              <path d="M13 3 L27 17 M27 3 L13 17" stroke="var(--accent)" strokeWidth="1.5" />
            </pattern>
          )}
        </defs>
        <rect x="0" y="0" width="100%" height="2" fill="var(--brand)" />
        <rect x="0" y="18" width="100%" height="2" fill="var(--brand)" />
        <rect x="0" y="0" width="100%" height="20" fill={`url(#${id})`} />
      </svg>
    </div>
  )
}
