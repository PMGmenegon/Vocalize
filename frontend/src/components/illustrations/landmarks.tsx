import type { SVGProps } from 'react'

/**
 * Desenhos próprios e simples (estilo flat) de pontos turísticos e veículos.
 * Cada peça tem a ORIGEM na base, no centro, e cresce para cima (y negativo).
 * Silhuetas usam `currentColor`; só os detalhes (táxi, ônibus, chama) têm cor fixa.
 */
type PieceProps = SVGProps<SVGGElement>

const OUTLINE = '#1c1b3a'
const GLASS = '#dff0ff'

/** Estátua da Liberdade (~128 de altura). */
export function Liberty(props: PieceProps) {
  return (
    <g {...props}>
      <path d="M-18 0 L-13 -24 H13 L18 0Z" fill="currentColor" />
      <rect x="-11" y="-30" width="22" height="6" fill="currentColor" />
      <path d="M-9 -30 L-12 -64 L-6 -80 H6 L10 -64 L10 -30Z" fill="currentColor" />
      <circle cx="0" cy="-86" r="6.5" fill="currentColor" />
      <path
        d="M-7 -90 L-13 -96 M-3.5 -92 L-6 -101 M0 -93 V-103 M3.5 -92 L6 -101 M7 -90 L13 -96"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 -72 L15 -98 L17 -110"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M17 -110 C11 -118 15 -124 17 -128 C20 -122 23 -117 17 -110Z" fill="#f7b500" />
    </g>
  )
}

const BRIDGE_TOWERS = [-42, 42] as const
// Pontos do cabo principal entre as torres (curva quadrática) para desenhar os tirantes.
const SUSPENDERS = Array.from({ length: 13 }, (_, i) => {
  const x = -36 + i * 6
  const t = (x + 42) / 84
  const y = (1 - t) ** 2 * -88 + 2 * t * (1 - t) * -26 + t ** 2 * -88
  return { x, y }
})

/** Ponte estilo Golden Gate (largura 160, ~90 de altura). */
export function GoldenGate(props: PieceProps) {
  return (
    <g {...props}>
      <rect x="-80" y="-22" width="160" height="4" fill="currentColor" />
      {BRIDGE_TOWERS.map((x) => (
        <g key={x} fill="currentColor">
          <rect x={x - 5} y="-90" width="3.5" height="90" />
          <rect x={x + 1.5} y="-90" width="3.5" height="90" />
          <rect x={x - 5} y="-72" width="10" height="3" />
          <rect x={x - 5} y="-52" width="10" height="3" />
          <rect x={x - 5} y="-32" width="10" height="3" />
        </g>
      ))}
      <path
        d="M-80 -24 Q-62 -24 -42 -88 Q0 -26 42 -88 Q62 -24 80 -24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <g stroke="currentColor" strokeWidth="1">
        {SUSPENDERS.map(({ x, y }) => (
          <line key={x} x1={x} y1={y} x2={x} y2="-22" />
        ))}
      </g>
    </g>
  )
}

// [x, largura, altura] dos prédios (o Empire State fica no centro, desenhado à parte).
const BUILDINGS: readonly (readonly [number, number, number])[] = [
  [-85, 14, 46],
  [-70, 12, 66],
  [-57, 16, 54],
  [-40, 14, 88],
  [-25, 14, 62],
  [-11, 22, 74],
  [12, 14, 70],
  [27, 16, 92],
  [44, 14, 56],
  [59, 14, 76],
  [74, 11, 42],
]

/** Skyline de Nova York com torre escalonada ao centro (largura ~170, ~125 de altura). */
export function NycSkyline(props: PieceProps) {
  return (
    <g {...props} fill="currentColor">
      {BUILDINGS.map(([x, w, h]) => (
        <rect key={x} x={x} y={-h} width={w} height={h} />
      ))}
      <rect x="-7" y="-96" width="14" height="22" />
      <rect x="-4" y="-108" width="8" height="12" />
      <rect x="-1" y="-126" width="2" height="18" />
      <rect x="29" y="-98" width="12" height="6" />
    </g>
  )
}

/** Táxi amarelo (largura 64, ~31 de altura). */
export function Taxi(props: PieceProps) {
  return (
    <g {...props} stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round">
      <rect x="-32" y="-16" width="64" height="11" rx="3" fill="#f7b500" />
      <path d="M-18 -16 L-12 -27 H12 L20 -16Z" fill="#f7b500" />
      <path d="M-14 -17.5 L-10 -25 H-1 V-17.5Z M2 -17.5 V-25 H11 L16 -17.5Z" fill={GLASS} strokeWidth="0.6" />
      <rect x="-5" y="-31" width="10" height="4" rx="1" fill={OUTLINE} />
      <path d="M-32 -10.5 H32" strokeWidth="1.6" strokeDasharray="3 3" />
      <circle cx="-19" cy="-5" r="5.5" fill={OUTLINE} />
      <circle cx="19" cy="-5" r="5.5" fill={OUTLINE} />
      <circle cx="-19" cy="-5" r="2" fill="#e8e8f0" stroke="none" />
      <circle cx="19" cy="-5" r="2" fill="#e8e8f0" stroke="none" />
    </g>
  )
}

/** Torre do relógio (estilo Big Ben), ~170 de altura. */
export function BigBen(props: PieceProps) {
  return (
    <g {...props}>
      <g fill="currentColor">
        <rect x="-10" y="-96" width="20" height="96" />
        <rect x="-12" y="-100" width="24" height="6" />
        <rect x="-13" y="-128" width="26" height="30" />
        <path d="M-14 -128 H14 L8 -138 H-8Z" />
        <path d="M-8 -138 L0 -170 L8 -138Z" />
        <rect x="-15" y="-136" width="4" height="10" />
        <rect x="11" y="-136" width="4" height="10" />
      </g>
      <circle cx="0" cy="-113" r="9" fill="#fff" />
      <path d="M0 -113 V-119 M0 -113 L4 -111" stroke={OUTLINE} strokeWidth="1.6" strokeLinecap="round" />
      <g fill="#fff" opacity="0.4">
        <rect x="-3" y="-84" width="6" height="12" />
        <rect x="-3" y="-60" width="6" height="12" />
        <rect x="-3" y="-36" width="6" height="12" />
      </g>
    </g>
  )
}

const EYE_ANGLES = Array.from({ length: 16 }, (_, i) => (i * Math.PI * 2) / 16)

/** Roda-gigante (estilo London Eye), raio 56, ~120 de altura. */
export function LondonEye(props: PieceProps) {
  return (
    <g {...props} fill="none" stroke="currentColor">
      <circle cx="0" cy="-64" r="56" strokeWidth="3" />
      <circle cx="0" cy="-64" r="50" strokeWidth="1" />
      <g strokeWidth="0.8">
        {EYE_ANGLES.map((a, i) => (
          <line key={i} x1="0" y1="-64" x2={Math.cos(a) * 56} y2={-64 + Math.sin(a) * 56} />
        ))}
      </g>
      <path d="M0 -64 L-24 0 M0 -64 L24 0" strokeWidth="4" strokeLinecap="round" />
      <g fill="currentColor" stroke="none">
        {EYE_ANGLES.map((a, i) => (
          <circle key={i} cx={Math.cos(a) * 56} cy={-64 + Math.sin(a) * 56} r="2.8" />
        ))}
      </g>
    </g>
  )
}

/** Ônibus vermelho de dois andares (largura 88, ~42 de altura). */
export function DoubleDecker(props: PieceProps) {
  return (
    <g {...props} stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round">
      <rect x="-44" y="-42" width="88" height="34" rx="4" fill="#c8102e" />
      <path d="M-44 -24.5 H44" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
      <g fill={GLASS} strokeWidth="0.6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={`u${i}`} x={-40 + i * 14} y="-38" width="10" height="9" rx="1" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`l${i}`} x={-40 + i * 14} y="-21" width="10" height="9" rx="1" />
        ))}
        <rect x="28" y="-21" width="12" height="13" rx="1" />
      </g>
      <circle cx="-26" cy="-6" r="6" fill={OUTLINE} />
      <circle cx="26" cy="-6" r="6" fill={OUTLINE} />
      <circle cx="-26" cy="-6" r="2.2" fill="#e8e8f0" stroke="none" />
      <circle cx="26" cy="-6" r="2.2" fill="#e8e8f0" stroke="none" />
    </g>
  )
}

/** Cabine telefônica vermelha (largura 16, ~38 de altura). */
export function PhoneBox(props: PieceProps) {
  return (
    <g {...props}>
      <path d="M-8 -34 Q0 -42 8 -34 V0 H-8Z" fill="#c8102e" stroke={OUTLINE} strokeWidth="1" />
      <rect x="-5.5" y="-30" width="11" height="22" fill={GLASS} />
      <path d="M-5.5 -22.7 H5.5 M-5.5 -15.4 H5.5 M0 -30 V-8" stroke="#c8102e" strokeWidth="1.2" />
    </g>
  )
}
