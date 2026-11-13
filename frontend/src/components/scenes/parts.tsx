import type { ReactNode } from 'react'

/**
 * Peças reutilizáveis das ilustrações (viewBox 800×450). Estilo flat, sem marcas.
 * As animações (classes sc-*) ficam em index.css e só rodam sem "reduzir movimento".
 */

export function R({ x, y, w, h, f, rx = 0, o, className }: { x: number; y: number; w: number; h: number; f: string; rx?: number; o?: number; className?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={f} opacity={o} className={className} />
}

export function Cloud({ x, y, s = 1, f = '#fff', d = 0, o = 0.9 }: { x: number; y: number; s?: number; f?: string; d?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <g className="sc-drift" style={{ animationDelay: `${-d}s` }}>
        <ellipse cx="0" cy="0" rx="46" ry="16" fill={f} />
        <circle cx="-14" cy="-12" r="16" fill={f} />
        <circle cx="12" cy="-16" r="20" fill={f} />
      </g>
    </g>
  )
}

/** Fileira de prédios. Cada item é [x, largura, altura]; `lit` desenha janelas acesas. */
export function Skyline({ items, base, f, win, spire }: { items: [number, number, number][]; base: number; f: string; win?: string; spire?: number }) {
  return (
    <g>
      {items.map(([x, w, h], i) => (
        <g key={i}>
          <R x={x} y={base - h} w={w} h={h} f={f} />
          {win &&
            Array.from({ length: Math.floor(h / 22) }, (_, r) =>
              Array.from({ length: Math.floor(w / 16) }, (_, c) =>
                (r * 7 + c * 3 + i) % 4 === 0 ? null : <rect key={`${r}-${c}`} x={x + 5 + c * 16} y={base - h + 8 + r * 22} width="7" height="10" fill={win} opacity="0.85" />,
              ),
            )}
        </g>
      ))}
      {spire !== undefined && <path d={`M${spire - 10} ${base - 170}l10 -50 10 50z`} fill={f} />}
    </g>
  )
}

export function Steam({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7">
      {[0, 8, 16].map((dx, i) => (
        <path key={dx} className="sc-steam" style={{ animationDelay: `${i * 0.5}s` }} d={`M${x + dx} ${y} c-4 -6 4 -10 0 -16`} />
      ))}
    </g>
  )
}

export function Plane({ x, y, s = 1, f = '#fff', d = 0 }: { x: number; y: number; s?: number; f?: string; d?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="sc-fly" style={{ animationDelay: `${-d}s` }}>
        <ellipse cx="0" cy="0" rx="34" ry="6" fill={f} />
        <path d="M-6 0l-16 -22h8l18 22zM-6 0l-16 20h8l18 -20z" fill={f} opacity="0.9" />
        <path d="M28 -2l8 -12h-6l-8 12z" fill={f} />
      </g>
    </g>
  )
}

export function Tree({ x, y, s = 1, leaf = '#3f8f4f', trunk = '#6b4a2e' }: { x: number; y: number; s?: number; leaf?: string; trunk?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <R x={-6} y={-10} w={12} h={60} f={trunk} />
      <g className="sc-sway">
        <circle cx="0" cy="-40" r="38" fill={leaf} />
        <circle cx="-28" cy="-20" r="26" fill={leaf} opacity="0.92" />
        <circle cx="28" cy="-22" r="26" fill={leaf} opacity="0.92" />
      </g>
    </g>
  )
}

export function Bench({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <R x={-40} y={-26} w={80} h={8} f="#8a5a36" rx={2} />
      <R x={-40} y={-14} w={80} h={8} f="#9c6a40" rx={2} />
      <R x={-36} y={-6} w={6} h={22} f="#3a3a44" />
      <R x={30} y={-6} w={6} h={22} f="#3a3a44" />
    </g>
  )
}

export function Lamp({ x, y, glow = '#ffd36b', r = 8 }: { x: number; y: number; glow?: string; r?: number }) {
  return (
    <g>
      <line x1={x} y1="0" x2={x} y2={y - r} stroke="#2e2e38" strokeWidth="2" />
      <circle cx={x} cy={y} r={r * 2.2} fill={glow} opacity="0.25" className="sc-blink" />
      <circle cx={x} cy={y} r={r} fill={glow} />
    </g>
  )
}

/** Planta em vaso. */
export function Plant({ x, y, s = 1, pot = '#b5651d' }: { x: number; y: number; s?: number; pot?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-12 0h24l-4 24h-16z" fill={pot} />
      <path d="M0 0c-16 -10 -22 -28 -18 -44 12 8 18 24 18 44zM0 0c14 -12 20 -30 16 -48 -12 10 -16 28 -16 48zM0 0c-2 -16 2 -34 2 -50 6 14 4 34 -2 50z" fill="#3f8f4f" />
    </g>
  )
}

/** Janelão com moldura: o conteúdo vai dentro e é cortado pelo retângulo. */
export function Frame({ x, y, w, h, id, children, frame = '#e9e4dc' }: { x: number; y: number; w: number; h: number; id: string; children: ReactNode; frame?: string }) {
  return (
    <g>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={frame} strokeWidth="8" />
    </g>
  )
}

/** Piso quadriculado. */
export function Checker({ y, h, a, b, size = 40 }: { y: number; h: number; a: string; b: string; size?: number }) {
  const cols = Math.ceil(800 / size)
  const rows = Math.ceil(h / (size / 2))
  return (
    <g>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => <rect key={`${r}-${c}`} x={c * size} y={y + r * (size / 2)} width={size} height={size / 2} fill={(r + c) % 2 ? a : b} />),
      )}
    </g>
  )
}
