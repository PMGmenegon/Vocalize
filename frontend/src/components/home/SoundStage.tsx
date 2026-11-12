import { useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { ACCENTS } from '../../theme/accents'
import { MODE_COPY } from '../../theme/modeCopy'
import { useTheme } from '../../theme/useTheme'

const BARS = 44
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

/** Altura "de repouso" das barras (usada também quando o movimento está reduzido). */
const rest = (i: number, t = 0) => 0.28 + 0.14 * Math.sin(t * 1.2 + i * 0.45) + 0.08 * Math.sin(t * 0.7 + i * 0.2)

/**
 * Palco sonoro do hero: barras de onda que "respiram" sozinhas, crescem perto do
 * mouse/dedo e dançam quando a frase é falada. Enquanto a voz toca, cada palavra
 * da frase acende (estilo karaokê).
 */
export default function SoundStage() {
  const { accent } = useTheme()
  const reduced = usePrefersReducedMotion()
  const phrase = MODE_COPY[accent].tagline
  const locale = ACCENTS[accent].locale

  const words = useMemo(() => phrase.split(' '), [phrase])
  // Posição (em caracteres) onde cada palavra começa, para casar com os eventos de fala.
  const starts = useMemo(
    () => words.map((_, i) => (i === 0 ? 0 : words.slice(0, i).join(' ').length + 1)),
    [words],
  )

  const barRefs = useRef<(HTMLSpanElement | null)[]>([])
  const pointer = useRef<number | null>(null)
  const speakingRef = useRef(false)
  const [speaking, setSpeaking] = useState(false)
  const [active, setActive] = useState(-1)
  const ticker = useRef<number | undefined>(undefined)

  // Animação das barras.
  useEffect(() => {
    const heights = Array.from({ length: BARS }, (_, i) => rest(i))
    const apply = () =>
      barRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleY(${Math.max(0.08, Math.min(1, heights[i] ?? 0.3))})`
      })
    if (reduced) {
      apply()
      return
    }
    let raf = 0
    const loop = (ms: number) => {
      const t = ms / 1000
      const px = pointer.current
      for (let i = 0; i < BARS; i++) {
        let target = rest(i, t)
        if (px !== null) {
          const d = (i / (BARS - 1) - px) * 7
          target += 0.55 * Math.exp(-d * d)
        }
        if (speakingRef.current) {
          target += 0.3 * Math.abs(Math.sin(t * 9 + i * 0.9)) * (0.6 + 0.4 * Math.sin(i * 0.6 + t * 2))
        }
        heights[i] = (heights[i] ?? 0) + (target - (heights[i] ?? 0)) * 0.18
      }
      apply()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  // Ao sair da página ou trocar de modo, interrompe a voz e o karaokê.
  useEffect(() => {
    return () => {
      window.clearInterval(ticker.current)
      if (canSpeak) window.speechSynthesis.cancel()
    }
  }, [])

  function finish() {
    window.clearInterval(ticker.current)
    speakingRef.current = false
    setSpeaking(false)
    setActive(-1)
  }

  function play() {
    if (speakingRef.current) {
      if (canSpeak) window.speechSynthesis.cancel()
      finish()
      return
    }
    speakingRef.current = true
    setSpeaking(true)
    setActive(0)

    // Plano B: se o navegador não avisar a palavra atual, avançamos por tempo.
    let gotBoundary = false
    let fallbackIndex = 0
    window.clearInterval(ticker.current)
    ticker.current = window.setInterval(() => {
      if (gotBoundary) return
      fallbackIndex += 1
      if (fallbackIndex >= words.length) {
        if (!canSpeak) finish()
        return
      }
      setActive(fallbackIndex)
    }, 420)

    if (!canSpeak) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(phrase)
    utterance.lang = locale
    utterance.rate = 0.9
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-') === locale)
    if (voice) utterance.voice = voice
    utterance.onboundary = (e) => {
      gotBoundary = true
      let idx = 0
      starts.forEach((s, i) => {
        if (e.charIndex >= s) idx = i
      })
      setActive(idx)
    }
    utterance.onend = finish
    utterance.onerror = finish
    window.speechSynthesis.speak(utterance)
  }

  const setPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointer.current = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  }

  return (
    <div className="rounded-3xl border-2 border-line bg-surface p-4 shadow-sm sm:p-6">
      <div
        className="flex h-40 touch-pan-y items-center gap-[3px] sm:h-48"
        onPointerMove={setPointer}
        onPointerDown={setPointer}
        onPointerLeave={() => {
          pointer.current = null
        }}
        aria-hidden="true"
      >
        {Array.from({ length: BARS }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              barRefs.current[i] = el
            }}
            className="h-full min-w-0 flex-1 origin-center rounded-full will-change-transform"
            style={{
              background: `color-mix(in srgb, var(--brand) ${Math.round((1 - i / (BARS - 1)) * 100)}%, var(--accent))`,
              transform: `scaleY(${rest(i)})`,
            }}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={play}
          aria-pressed={speaking}
          aria-label={speaking ? 'Parar a frase' : `Ouvir a frase em ${ACCENTS[accent].label.toLowerCase()}`}
          className="inline-flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand shadow-md transition-all hover:bg-brand-strong active:scale-90"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            {speaking ? <path d="M7 6h3.5v12H7zM13.5 6H17v12h-3.5z" /> : <path d="M8 5.5v13l11-6.5z" />}
          </svg>
        </button>

        <p lang="en" className="flex flex-wrap gap-x-1.5 gap-y-1 text-xl font-black text-ink sm:text-2xl">
          {words.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className={`rounded-md px-1 transition-colors duration-150 ${
                i === active ? 'bg-brand text-on-brand' : ''
              }`}
            >
              {w}
            </span>
          ))}
        </p>
      </div>
      <p className="mt-3 text-sm text-muted">
        Passe o mouse (ou o dedo) sobre as ondas e toque em play para ouvir no sotaque do seu modo.
      </p>
    </div>
  )
}
