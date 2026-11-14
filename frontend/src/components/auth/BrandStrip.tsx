import { LDN_TZ, NYC_TZ, useWorldClock } from '../../hooks/useWorldClock'

const FONT = '"Arial Black","Segoe UI Black","Helvetica Neue",ui-sans-serif,system-ui,sans-serif'
const star = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.382
    const a = (Math.PI / 5) * i - Math.PI / 2
    return `${(cx + radius * Math.cos(a)).toFixed(1)},${(cy + radius * Math.sin(a)).toFixed(1)}`
  }).join(' ')

/** Faixa decorativa fina para o celular: mesma identidade do painel, sem atrapalhar o formulário. */
export default function BrandStrip() {
  const nyc = useWorldClock(NYC_TZ)
  const ldn = useWorldClock(LDN_TZ)
  return (
    <div aria-hidden="true" className="h-16 w-full overflow-hidden">
      <svg viewBox="0 0 400 64" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" focusable="false">
        <rect width="400" height="64" fill="#012169" />
        <polygon points="0,0 215,0 185,64 0,64" fill="#b22234" />
        <polygon points={star(26, 20, 11)} fill="#faf7f2" />
        <polygon points={star(52, 40, 7)} fill="#faf7f2" />
        <text x="76" y="26" fill="#faf7f2" fontFamily={FONT} fontSize="14" fontWeight={900}>
          color / colour
        </text>
        <text x="76" y="46" fill="#faf7f2" fontFamily="ui-monospace,Consolas,monospace" fontSize="13" fontWeight={700}>
          NYC {nyc}
        </text>
        <path d="M320 0l60 64M380 0l-60 64" stroke="#faf7f2" strokeWidth="5" opacity="0.85" />
        <path d="M350 0v64M312 32h76" stroke="#c8102e" strokeWidth="6" />
        <text x="216" y="46" fill="#faf7f2" fontFamily="ui-monospace,Consolas,monospace" fontSize="13" fontWeight={700}>
          LDN {ldn}
        </text>
      </svg>
    </div>
  )
}
