import { useEffect, useLayoutEffect, useRef } from 'react'
import flagUk from '../assets/deco/flag-uk.svg'
import flagUs from '../assets/deco/flag-us.svg'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/** Duração total da animação (o CSS em index.css usa os mesmos 2s: entrada + pausa + fade-out). */
const DURATION_MS = 2000
/** Com "reduzir movimento": sem animação, só uma exibição rápida da marca. */
const REDUCED_MOTION_DURATION_MS = 1200

/** Ponto onde a palavra é dividida (centro do viewBox 900x180). */
const SPLIT_X = 450
/** Faixa vertical ocupada pelas letras maiúsculas (unidades do viewBox); as bandeiras preenchem só ela. */
const LETTERS_TOP = 50
const LETTERS_HEIGHT = 92

interface SplashProps {
  /** Chamado quando a abertura termina (ou o usuário pula). Passe uma função estável (useCallback). */
  onDone: () => void
}

/**
 * Tela de abertura em tela cheia: a palavra VOCALIZE dividida ao meio —
 * "VOCA" preenchido com a bandeira dos EUA, "LIZE" com a do Reino Unido.
 *
 * São dois <text> SVG ancorados no mesmo x (um termina nele, o outro começa
 * nele), então a divisão cai exatamente no meio das duas metades. Como "VOCA"
 * é mais larga que "LIZE", depois de montar medimos as duas e (1) deslocamos a
 * palavra inteira para ficar visualmente centrada e (2) ajustamos cada bandeira
 * ao tamanho da sua metade.
 *
 * Clique ou Esc/Enter/Espaço pulam a animação.
 */
export default function Splash({ onDone }: SplashProps) {
  const reducedMotion = usePrefersReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)

  // Mede as metades antes da primeira pintura (sem "pulo" visual).
  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const pick = <T extends Element>(selector: string) => svg.querySelector<T>(selector)

    const left = pick<SVGTextElement>('.splash-left')
    const right = pick<SVGTextElement>('.splash-right')
    const word = pick<SVGGElement>('.splash-word')
    if (!left || !right || !word) return

    const leftWidth = left.getComputedTextLength()
    const rightWidth = right.getComputedTextLength()

    // Centraliza a palavra inteira: ela ocupa [SPLIT_X - leftWidth, SPLIT_X + rightWidth].
    word.setAttribute('transform', `translate(${(leftWidth - rightWidth) / 2} 0)`)

    // Cada bandeira passa a cobrir exatamente a sua metade.
    const fit = (id: string, x: number, width: number) => {
      const pattern = pick<SVGPatternElement>(`#${id}`)
      const image = pattern?.querySelector('image')
      pattern?.setAttribute('x', String(x))
      pattern?.setAttribute('width', String(width))
      image?.setAttribute('width', String(width))
    }
    fit('splash-fill-us', SPLIT_X - leftWidth, leftWidth)
    fit('splash-fill-uk', SPLIT_X, rightWidth)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(onDone, reducedMotion ? REDUCED_MOTION_DURATION_MS : DURATION_MS)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onDone()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onDone, reducedMotion])

  return (
    <div
      role="status"
      onClick={onDone}
      className="splash fixed inset-0 z-[100] grid cursor-pointer place-items-center bg-[#0a0c1c] px-4"
    >
      <span className="sr-only">Abrindo o Vocalize</span>
      <svg
        ref={svgRef}
        viewBox="0 0 900 180"
        className="w-[min(92vw,56rem)]"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Larguras/posições abaixo são só valores iniciais; o useLayoutEffect ajusta x e width. */}
          {/* EUA: ancorada no canto superior esquerdo para o canton com estrelas aparecer. */}
          <pattern
            id="splash-fill-us"
            patternUnits="userSpaceOnUse"
            x={0}
            y={LETTERS_TOP}
            width={SPLIT_X}
            height={LETTERS_HEIGHT}
          >
            <image href={flagUs} width={SPLIT_X} height={LETTERS_HEIGHT} preserveAspectRatio="xMinYMin slice" />
          </pattern>
          {/* Reino Unido: esticada para a bandeira inteira (cruz e diagonais) caber nas letras. */}
          <pattern
            id="splash-fill-uk"
            patternUnits="userSpaceOnUse"
            x={SPLIT_X}
            y={LETTERS_TOP}
            width={SPLIT_X}
            height={LETTERS_HEIGHT}
          >
            <image href={flagUk} width={SPLIT_X} height={LETTERS_HEIGHT} preserveAspectRatio="none" />
          </pattern>
        </defs>

        <g
          className="splash-word"
          dominantBaseline="central"
          stroke="#fff"
          strokeWidth="3"
          strokeLinejoin="round"
          paintOrder="stroke"
        >
          <text className="splash-left" x={SPLIT_X} y="92" textAnchor="end" fill="url(#splash-fill-us)">
            VOCA
          </text>
          <text className="splash-right" x={SPLIT_X} y="92" textAnchor="start" fill="url(#splash-fill-uk)">
            LIZE
          </text>
        </g>
      </svg>
    </div>
  )
}
