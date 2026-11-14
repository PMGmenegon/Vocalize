import { LDN_TZ, NYC_TZ, useWorldClock } from '../../hooks/useWorldClock'
import { useTheme } from '../../theme/useTheme'

const RED = '#b22234'
const NAVY = '#012169'
const NAVY_DEEP = '#00174a'
const UK_RED = '#c8102e'
const IVORY = '#faf7f2'
const FONT = '"Arial Black","Segoe UI Black","Helvetica Neue",ui-sans-serif,system-ui,sans-serif'

/** Estrela de 5 pontas centrada em (cx, cy). */
function star(cx: number, cy: number, r: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.382
    const a = (Math.PI / 5) * i - Math.PI / 2
    return `${(cx + radius * Math.cos(a)).toFixed(1)},${(cy + radius * Math.sin(a)).toFixed(1)}`
  }).join(' ')
}

const Float = ({ d = 0, dur = 11, children }: { d?: number; dur?: number; children: React.ReactNode }) => (
  <g className="auth-float" style={{ animationDelay: `${-d}s`, animationDuration: `${dur}s` }}>
    {children}
  </g>
)

const Pair = ({ x, y, size = 30, text }: { x: number; y: number; size?: number; text: string }) => (
  <text x={x} y={y} fill={IVORY} fontFamily={FONT} fontSize={size} fontWeight={900} letterSpacing="1">
    {text}
  </text>
)

function Clock({ x, y, city, time, active }: { x: number; y: number; city: string; time: string; active: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width="190" height="66" rx="18" fill={active ? IVORY : 'none'} stroke={IVORY} strokeWidth={active ? 0 : 2} opacity={active ? 1 : 0.85} />
      <text x={x + 20} y={y + 41} fontFamily={FONT} fontSize="18" fontWeight={900} fill={active ? RED : IVORY} letterSpacing="2">
        {city}
      </text>
      <text x={x + 168} y={y + 43} textAnchor="end" fontFamily="ui-monospace,Consolas,monospace" fontSize="30" fontWeight={700} fill={active ? NAVY : IVORY}>
        {time}
      </text>
    </g>
  )
}

function Greeting({ x, y, w, text, active }: { x: number; y: number; w: number; text: string; active: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="46" rx="23" fill={active ? IVORY : 'none'} stroke={IVORY} strokeWidth={active ? 0 : 2} />
      <text x={x + w / 2} y={y + 31} textAnchor="middle" fontFamily={FONT} fontSize="21" fontWeight={900} fill={active ? NAVY : IVORY}>
        {text}
      </text>
    </g>
  )
}

/**
 * Painel de identidade visual (decorativo): formas geométricas espaçadas e tipografia que
 * equilibram EUA (vermelho) e Reino Unido (azul-marinho). O tema ativo destaca a saudação e o
 * relógio do seu país, mas o painel sempre mostra os dois. As formas flutuam bem devagar.
 *
 * O desenho usa viewBox 700×800 com `meet` (nada é cortado) e os fundos de cor se estendem além dele.
 * No tablet, as formas só decorativas (classe `max-lg:hidden`) somem para deixar o painel mais leve.
 */
export default function BrandPanel() {
  const { accent } = useTheme()
  const nyc = useWorldClock(NYC_TZ)
  const ldn = useWorldClock(LDN_TZ)

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#012169]">
      <svg viewBox="0 0 700 800" preserveAspectRatio="xMidYMid meet" className="block h-full w-full overflow-visible" focusable="false">
        <defs>
          <clipPath id="auth-jack">
            <circle cx="545" cy="115" r="72" />
          </clipPath>
        </defs>

        {/* fundo dividido por uma diagonal: EUA à esquerda, Reino Unido à direita */}
        {/* os campos de cor passam bem além do desenho: em painéis de outras proporções não sobra faixa vazia */}
        <rect x="-3000" y="-2000" width="7000" height="4800" fill={NAVY} />
        <polygon points="-3000,-2000 680,-2000 20,2800 -3000,2800" fill={RED} />

        {/* ---- EUA: estrelas, listras e formas ---- */}
        <Float d={0} dur={12}>
          <polygon points={star(110, 85, 26)} fill={IVORY} />
          <polygon points={star(172, 62, 17)} fill={IVORY} />
          <polygon points={star(160, 122, 13)} fill={IVORY} />
        </Float>
        <polygon className="max-lg:hidden" points={star(268, 100, 22)} fill="none" stroke={IVORY} strokeWidth="2.5" strokeLinejoin="round" />
        <Pair x={130} y={215} text="color / colour" />
        <Greeting x={130} y={242} w={156} text="Hey there!" active={accent === 'us'} />
        {[340, 358, 376, 394].map((y) => (
          <line className="max-lg:hidden" key={y} x1="130" y1={y} x2={y < 370 ? 330 : 290} y2={y} stroke={IVORY} strokeWidth="6" strokeLinecap="round" opacity="0.65" />
        ))}
        <Pair x={130} y={452} size={26} text="apartment / flat" />
        <Float d={4} dur={14}>
          <rect x="296" y="478" width="64" height="64" rx="18" fill={NAVY} />
        </Float>
        <Float d={7} dur={13}>
          <circle className="max-lg:hidden" cx="92" cy="500" r="40" fill="none" stroke={NAVY} strokeWidth="4" />
        </Float>

        {/* ---- Reino Unido: diagonais e cruz como linhas e faixas ---- */}
        <Float d={2} dur={15}>
          <g clipPath="url(#auth-jack)">
            <rect x="460" y="30" width="170" height="170" fill={NAVY_DEEP} />
            <path d="M460 30L630 200M630 30L460 200" stroke={IVORY} strokeWidth="18" />
            <path d="M460 30L630 200M630 30L460 200" stroke={UK_RED} strokeWidth="6" />
            <path d="M545 30v170M460 115h170" stroke={IVORY} strokeWidth="30" />
            <path d="M545 30v170M460 115h170" stroke={UK_RED} strokeWidth="16" />
          </g>
          <circle cx="545" cy="115" r="72" fill="none" stroke={IVORY} strokeWidth="2" />
        </Float>
        <Greeting x={448} y={222} w={112} text="Hiya!" active={accent === 'uk'} />
        <Pair x={440} y={322} size={28} text="elevator / lift" />
        <Float d={5} dur={12}>
          <polygon className="max-lg:hidden" points="470,372 520,458 420,458" fill="none" stroke={IVORY} strokeWidth="2.5" strokeLinejoin="round" />
        </Float>
        <rect className="max-lg:hidden" x="590" y="372" width="84" height="84" rx="24" fill="none" stroke={UK_RED} strokeWidth="5" />
        <Pair x={440} y={512} size={26} text="fall / autumn" />
        <Clock x={130} y={548} city="NYC" time={nyc} active={accent === 'us'} />
        <Clock x={352} y={548} city="LDN" time={ldn} active={accent === 'uk'} />
        <g className="max-lg:hidden">
          <Pair x={440} y={700} size={24} text="cookie / biscuit" />
        </g>
        <Float d={9} dur={13}>
          <path d="M560 790a56 56 0 0 1 112 0z" fill={UK_RED} />
        </Float>
        <path className="max-lg:hidden" d="M600 560l90 90M690 560l-90 90" stroke={IVORY} strokeWidth="2" opacity="0.5" />

        {/* ---- frase de destaque ---- */}
        <text x="130" y="668" fill={IVORY} fontFamily={FONT} fontSize="38" fontWeight={900}>
          Ouça o mundo
        </text>
        <text x="130" y="712" fill={IVORY} fontFamily={FONT} fontSize="38" fontWeight={900}>
          em inglês.
        </text>
        <text x="130" y="748" fill={IVORY} fontFamily="system-ui,sans-serif" fontSize="17" opacity="0.92">
          Americano ou britânico — você escolhe.
        </text>
      </svg>
    </div>
  )
}
