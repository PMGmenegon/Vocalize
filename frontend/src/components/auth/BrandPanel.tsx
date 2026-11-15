import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useTheme } from '../../theme/useTheme'
import { NAVY, WINE } from './brandColors'

/* ---------------------------------------------------------------------
   Conteúdo
   --------------------------------------------------------------------- */

interface Line {
  who: string
  at: string
  /** Trechos do texto; `fix` marca uma palavra transcrita errada e a correção. */
  parts: (string | { wrong: string; right: string })[]
}

interface Scene {
  title: string
  level: string
  accent: string
  /** Segundos já tocados quando o trecho aparece e duração total do áudio. */
  start: number
  total: number
  seed: number
  lines: Line[]
}

const SCENES: Scene[] = [
  {
    title: 'At the airport',
    level: 'B2',
    accent: 'US English',
    start: 12,
    total: 34,
    seed: 7,
    lines: [
      { who: 'Agent', at: '00:03', parts: ['Next, please. Where are you flying today?'] },
      { who: 'You', at: '00:08', parts: ['To Chicago. I’d like a ', { wrong: 'widow', right: 'window' }, ' seat, please.'] },
      { who: 'Agent', at: '00:14', parts: ['Sure. Any bags to check in?'] },
      { who: 'You', at: '00:19', parts: ['Just this one. It should be under fifty pounds.'] },
    ],
  },
  {
    title: 'At the restaurant',
    level: 'B1',
    accent: 'UK English',
    start: 9,
    total: 29,
    seed: 3,
    lines: [
      { who: 'Waiter', at: '00:02', parts: ['Good evening. Do you have a table booked?'] },
      { who: 'You', at: '00:07', parts: ['Yes, a table for ', { wrong: 'too', right: 'two' }, ', under Taylor.'] },
      { who: 'Waiter', at: '00:13', parts: ['Lovely. Would you like to see the menu?'] },
      { who: 'You', at: '00:18', parts: ['Please. And could we have some tap water?'] },
    ],
  },
  {
    title: 'Job interview',
    level: 'C1',
    accent: 'US English',
    start: 21,
    total: 41,
    seed: 11,
    lines: [
      { who: 'Recruiter', at: '00:04', parts: ['Thanks for coming in. Tell me about yourself.'] },
      { who: 'You', at: '00:09', parts: ['I’m ', { wrong: 'hear', right: 'here' }, ' because I love building products people use.'] },
      { who: 'Recruiter', at: '00:16', parts: ['What’s been your biggest challenge so far?'] },
      { who: 'You', at: '00:22', parts: ['Leading a team across three time zones.'] },
    ],
  },
]

/** Segundos que cada situação fica na tela antes da troca. */
const CYCLE = 7
const FADE_MS = 700

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

/* ---------------------------------------------------------------------
   Pequenos ganchos
   --------------------------------------------------------------------- */

const REDUCED = '(prefers-reduced-motion: reduce)'
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  )
}

/** Hora atual, atualizada no início de cada minuto. */
function useMinuteClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let id: number
    const tick = () => {
      setNow(new Date())
      id = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
    }
    id = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
    return () => window.clearTimeout(id)
  }, [])
  return now
}

const clock = (timeZone: string) => new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
const NYC = clock('America/New_York')
const LDN = clock('Europe/London')

/* ---------------------------------------------------------------------
   Forma de onda do trecho (barras finas; a parte já tocada em vinho)
   --------------------------------------------------------------------- */

const BARS = 96

function ScriptWave({ seed, progress }: { seed: number; progress: number }) {
  return (
    <svg viewBox={`0 0 ${BARS} 24`} preserveAspectRatio="none" className="block h-6 w-full" focusable="false">
      {Array.from({ length: BARS }, (_, i) => {
        const r = ((seed * 9301 + i * 49297 + ((i * i) % 17)) % 233280) / 233280
        const h = Math.max(3, 24 * (0.18 + 0.62 * Math.abs(Math.sin(i * 0.5 + r * 4)) * (0.55 + 0.45 * r)))
        const played = i / BARS < progress
        return (
          <rect key={i} x={i + 0.25} y={12 - h / 2} width={0.5} height={h} fill={played ? WINE : 'var(--muted)'} opacity={played ? 1 : 0.35} />
        )
      })}
    </svg>
  )
}

/* ---------------------------------------------------------------------
   Trecho de transcrição (alterna entre situações)
   --------------------------------------------------------------------- */

function Transcript() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [sec, setSec] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)
  const secRef = useRef(0)
  const swapTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(() => {
      secRef.current += 1
      if (secRef.current >= CYCLE) {
        secRef.current = 0
        setFading(true)
        window.clearTimeout(swapTimer.current)
        swapTimer.current = window.setTimeout(() => {
          setIndex((i) => (i + 1) % SCENES.length)
          setSec(0)
          setFading(false)
        }, FADE_MS)
      } else {
        setSec(secRef.current)
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [reduced, paused])

  useEffect(() => () => window.clearTimeout(swapTimer.current), [])

  const scene = SCENES[index] as Scene
  const elapsed = scene.start + sec

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="transition-opacity ease-in-out"
        style={{ opacity: fading ? 0 : 1, transitionDuration: reduced ? '0ms' : `${FADE_MS}ms` }}
      >
        <p className="type-eyebrow leading-relaxed">
          {scene.title} · {scene.level} · {scene.accent} · <span className="tabular-nums">{mmss(elapsed)} / {mmss(scene.total)}</span>
        </p>

        <ol className="mt-4 space-y-3 lg:space-y-3.5">
          {scene.lines.map((l, i) => (
            <li
              key={l.at}
              className={`grid grid-cols-[1fr_auto] gap-x-3 lg:grid-cols-[5.25rem_minmax(0,1fr)_auto] ${i === 3 ? '[@media(max-height:640px)]:hidden' : ''}`}
            >
              <span className="col-start-1 row-start-1 text-[13px] font-bold tracking-[0.12em] text-muted [font-variant-caps:all-small-caps] lg:pt-[3px]">
                {l.who}
              </span>
              <span className="col-start-2 row-start-1 text-[11px] tabular-nums text-muted lg:col-start-3 lg:pt-[5px]">{l.at}</span>
              <span className="font-editorial col-span-2 row-start-2 text-[1.0625rem] leading-snug text-ink lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:text-[1.125rem]">
                {l.parts.map((p, j) =>
                  typeof p === 'string' ? (
                    <span key={j}>{p}</span>
                  ) : (
                    <span key={j}>
                      <s className="decoration-2" style={{ color: WINE }}>{p.wrong}</s>{' '}
                      <span className="font-semibold" style={{ color: NAVY }}>{p.right}</span>
                    </span>
                  ),
                )}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-5">
          <ScriptWave seed={scene.seed} progress={elapsed / scene.total} />
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------
   Comparação US / UK
   --------------------------------------------------------------------- */

const ROWS: { label?: string; us: string; uk: string; ipa?: [string, string]; first?: boolean }[] = [
  { label: 'Grafia', us: 'color', uk: 'colour', first: true },
  { label: 'Vocabulário', us: 'elevator', uk: 'lift', first: true },
  { us: 'apartment', uk: 'flat' },
  { label: 'Pronúncia', us: 'tomato', uk: 'tomato', ipa: ['/təˈmeɪtoʊ/', '/təˈmɑːtəʊ/'], first: true },
  { us: 'schedule', uk: 'schedule', ipa: ['/ˈskedʒuːl/', '/ˈʃedjuːl/'] },
]

function Comparison({ accent }: { accent: 'us' | 'uk' }) {
  const col = (side: 'us' | 'uk') => (accent === side ? 'text-ink' : 'text-muted')
  const head = (side: 'us' | 'uk') => `type-eyebrow pb-2 text-left ${accent === side ? 'underline decoration-2 underline-offset-[6px]' : ''}`
  return (
    <table lang="en" className="w-full border-collapse text-left">
      <thead>
        <tr>
          <th scope="col" className="w-[26%] pb-2" />
          <th scope="col" className={head('us')} style={{ color: WINE }}>US English</th>
          <th scope="col" className={head('uk')} style={{ color: NAVY }}>UK English</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r, i) => (
          <tr key={i} className={r.first ? 'border-t border-line' : ''}>
            <th scope="row" className="type-eyebrow py-1.5 pr-3 align-baseline">
              {r.label}
            </th>
            {(['us', 'uk'] as const).map((side, k) => (
              <td key={side} className={`py-1.5 pr-3 align-baseline ${col(side)}`}>
                <span className={`font-editorial text-[1.0625rem] ${accent === side ? 'font-semibold' : ''}`}>{r[side]}</span>
                {r.ipa && <span className="ml-2 font-sans text-[13px] tabular-nums">{r.ipa[k]}</span>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ---------------------------------------------------------------------
   Lateral
   --------------------------------------------------------------------- */

/**
 * Lateral editorial de login e cadastro (decorativa): só tipografia, no mesmo fundo do app.
 * Hierarquia: frase principal → transcrição → comparação US/UK → rodapé.
 * Tablet: só a frase e a transcrição. Em telas baixas somem primeiro a tabela e depois o rodapé.
 */
export default function BrandPanel() {
  const { accent } = useTheme()
  const now = useMinuteClock()

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col justify-between overflow-hidden py-[var(--auth-pad-y)]"
    >
      <div className="w-full max-w-[40rem] space-y-[clamp(1.25rem,3.4vh,2.25rem)]">
        <header lang="en">
          <p className="type-eyebrow">Vocalize · Listening Lab</p>
          <h2 className="type-display mt-3 text-[length:var(--t-display-size)]">
            The world speaks.
            <br />
            <em className="font-normal" style={{ color: WINE }}>
              You should too.
            </em>
          </h2>
          <p lang="pt-BR" className="mt-4 hidden max-w-[30rem] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-relaxed text-muted lg:block [@media(max-height:620px)]:hidden">
            Ouça conversas reais, transcreva o que entendeu e responda, em inglês americano ou britânico.
          </p>
        </header>

        <section lang="en" className="border-t border-line pt-[clamp(1rem,2.4vh,1.5rem)]" aria-label="Transcript">
          <Transcript />
        </section>

        <section className="hidden border-t border-line pt-[clamp(0.75rem,1.8vh,1.25rem)] lg:block [@media(max-height:860px)]:!hidden">
          <Comparison accent={accent} />
        </section>
      </div>

      <footer
        lang="en"
        className="hidden w-full max-w-[40rem] items-baseline justify-between gap-4 border-t border-line pt-3 type-eyebrow lg:flex [@media(max-height:700px)]:!hidden"
      >
        <p>
          NYC <span className="tabular-nums text-ink">{NYC.format(now)}</span>
          <span className="mx-3">·</span>
          LDN <span className="tabular-nums text-ink">{LDN.format(now)}</span>
        </p>
        <p>A2 · B1 · B2 · C1</p>
      </footer>
    </div>
  )
}
