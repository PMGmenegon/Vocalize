import type { Accent } from '../../theme/accents'
import {
  BigBen,
  DoubleDecker,
  GoldenGate,
  Liberty,
  LondonEye,
  NycSkyline,
  PhoneBox,
  Taxi,
} from './landmarks'

interface SceneProps {
  accent: Accent
  /** Classes do <svg>. A cor das silhuetas vem de `text-*` (currentColor). */
  className?: string
}

// Prédios baixos ao fundo da cena britânica: [x, largura, altura].
const LONDON_ROOFS: readonly (readonly [number, number, number])[] = [
  [20, 26, 34],
  [48, 22, 46],
  [72, 30, 30],
  [250, 24, 40],
  [276, 20, 52],
  [298, 28, 34],
  [410, 22, 44],
  [434, 26, 32],
]

function ground(width: number, y: number) {
  return (
    <>
      <rect x="0" y={y} width={width} height="3" fill="currentColor" opacity="0.5" />
      <rect x="0" y={y + 3} width={width} height="14" fill="currentColor" opacity="0.14" />
    </>
  )
}

/** Cena grande (hero e cartões): ilustração do modo atual. */
export function ModeScene({ accent, className = '' }: SceneProps) {
  return (
    <svg
      key={accent}
      viewBox="0 0 480 270"
      className={`scene-in ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {accent === 'us' ? (
        <>
          {ground(480, 250)}
          <GoldenGate transform="translate(92 250) scale(0.95)" opacity="0.5" />
          <NycSkyline transform="translate(245 250)" opacity="0.32" />
          <Liberty transform="translate(405 250) scale(1.2)" />
          <Taxi transform="translate(215 266) scale(1.35)" />
        </>
      ) : (
        <>
          {ground(480, 250)}
          <g fill="currentColor" opacity="0.25">
            {LONDON_ROOFS.map(([x, w, h]) => (
              <rect key={x} x={x} y={250 - h} width={w} height={h} />
            ))}
          </g>
          <BigBen transform="translate(88 250) scale(1.05)" />
          <LondonEye transform="translate(318 250) scale(1.25)" opacity="0.9" />
          <DoubleDecker transform="translate(200 266) scale(1.2)" />
          <PhoneBox transform="translate(440 266) scale(1.25)" />
        </>
      )}
    </svg>
  )
}

/**
 * Faixa larga e baixa (rodapé e fundo do cabeçalho da área logada).
 * O desenho é ancorado no canto inferior direito e cortado se o espaço for curto.
 */
export function SceneStrip({ accent, className = '' }: SceneProps) {
  return (
    <svg
      key={accent}
      viewBox="0 0 1200 90"
      preserveAspectRatio="xMaxYMax slice"
      className={`scene-in ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {accent === 'us' ? (
        <>
          {ground(1200, 80)}
          <GoldenGate transform="translate(180 80) scale(0.6)" opacity="0.5" />
          <NycSkyline transform="translate(470 80) scale(0.62)" opacity="0.4" />
          <Liberty transform="translate(700 80) scale(0.62)" />
          <Taxi transform="translate(880 88) scale(0.85)" />
          <NycSkyline transform="translate(1090 80) scale(0.5)" opacity="0.4" />
        </>
      ) : (
        <>
          {ground(1200, 80)}
          <BigBen transform="translate(150 80) scale(0.5)" />
          <LondonEye transform="translate(420 80) scale(0.62)" opacity="0.9" />
          <DoubleDecker transform="translate(700 88) scale(0.8)" />
          <PhoneBox transform="translate(800 88) scale(0.9)" />
          <BigBen transform="translate(1080 80) scale(0.42)" opacity="0.4" />
        </>
      )}
    </svg>
  )
}
