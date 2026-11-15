import eagle from '../assets/brand/aguia_vocalize.png'

type Size = 'sm' | 'md' | 'lg'

interface LogoProps {
  /** full: águia + palavra VOCALIZE · mark: só a águia (espaços pequenos, como o celular). */
  variant?: 'full' | 'mark'
  size?: Size
  className?: string
}

/** Altura da águia em px por tamanho (o PNG tem ~510px de altura útil, então nunca é ampliado). */
const EAGLE_PX: Record<Size, number> = { sm: 28, md: 40, lg: 56 }
const WORD_CLASS: Record<Size, string> = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }

/**
 * O PNG original (1408×768) tem a águia no meio de uma tela transparente. O viewBox abaixo mostra só a área
 * da águia (aspecto 522×511), sem tocar na imagem: nada é recortado do desenho nem redimensionado fora de escala.
 */
const VIEWBOX = '344 54 522 511'
const ASPECT = 522 / 511

function Eagle({ size, label }: { size: Size; label?: string }) {
  const h = EAGLE_PX[size]
  return (
    <svg
      viewBox={VIEWBOX}
      width={Math.round(h * ASPECT)}
      height={h}
      className="shrink-0"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <image href={eagle} width="1408" height="768" />
    </svg>
  )
}

/**
 * Logo único do Vocalize. Texto alternativo "Vocalize": na variante completa a águia fica aria-hidden
 * (a palavra já nomeia a marca); na variante só símbolo a própria águia leva o rótulo.
 */
export default function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  if (variant === 'mark') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <Eagle size={size} label="Vocalize" />
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Eagle size={size} />
      <span className="sr-only">Vocalize</span>
      <span aria-hidden="true" className={`font-black tracking-wider max-[340px]:hidden ${WORD_CLASS[size]}`}>
        <span className="text-brand">VOCA</span>
        <span className="text-accent">LIZE</span>
      </span>
    </span>
  )
}
