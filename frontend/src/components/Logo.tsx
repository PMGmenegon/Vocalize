interface LogoProps {
  className?: string
  /** Mostra só o símbolo (útil em espaços muito apertados). */
  markOnly?: boolean
}

/** Alturas das barras de "onda sonora" dentro do balão de fala. */
const BARS = [4, 9, 13, 8, 4] as const

/** Símbolo: balão de fala (diálogo) com ondas sonoras (listening). Usa a cor do tema atual. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path
        d="M4 6a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H14l-6 6v-6H8a4 4 0 0 1-4-4z"
        fill="var(--brand)"
      />
      {BARS.map((h, i) => (
        <rect key={i} x={7 + i * 4} y={12 - h / 2} width="2.5" height={h} rx="1.25" fill="#fff" />
      ))}
    </svg>
  )
}

/**
 * Logo do Vocalize: símbolo + palavra "VOCALIZE" dividida em duas cores
 * (cor da marca e cor secundária do tema), ecoando a tela de abertura.
 */
export default function Logo({ className = '', markOnly = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      {markOnly ? (
        <span className="sr-only">Vocalize</span>
      ) : (
        <>
          <span className="sr-only">Vocalize</span>
          <span aria-hidden="true" className="text-xl font-black tracking-wider">
            <span className="text-brand">VOCA</span>
            <span className="text-accent">LIZE</span>
          </span>
        </>
      )}
    </span>
  )
}
