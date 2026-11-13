import { Bench, Checker, Cloud, Lamp, Plant, R, Tree } from './parts'

/** Vitrine com manequim. */
function Shopfront({ x, w, wall, sign, glass = '#cfe9f2', dress = '#e0566b' }: { x: number; w: number; wall: string; sign: string; glass?: string; dress?: string }) {
  return (
    <g>
      <R x={x} y={70} w={w} h={270} f={wall} />
      <R x={x} y={70} w={w} h={46} f={sign} />
      <R x={x + 14} y={84} w={w - 28} h={18} f="#fff" rx={4} o={0.85} />
      <R x={x + 14} y={136} w={w - 28} h={170} f={glass} />
      <R x={x + 14} y={136} w={(w - 28) / 2} h={170} f="#fff" o={0.18} />
      <circle cx={x + w / 2} cy="190" r="12" fill="#e8c9a5" />
      <path d={`M${x + w / 2 - 22} 306l8 -100h28l8 100z`} fill={dress} />
      <R x={x + w - 60} y={286} w={36} h={20} f="#3a3a44" rx={3} />
    </g>
  )
}

/** Shopping center: vitrines, claraboia e piso brilhante. */
export function MallUS() {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f="#f4f1ec" />
      <R x={0} y={0} w={800} h={60} f="#bfe0ee" />
      {[0, 160, 320, 480, 640].map((x) => (
        <path key={x} d={`M${x} 0l80 60h-80z`} fill="#fff" opacity="0.45" />
      ))}
      <Shopfront x={30} w={220} wall="#e9d9c4" sign="#b22234" />
      <Shopfront x={290} w={220} wall="#d9e3ee" sign="#3c3b6e" dress="#3c3b6e" glass="#e6f2f6" />
      <Shopfront x={550} w={220} wall="#efe0e3" sign="#e4872c" dress="#2f6dc0" />
      <Lamp x={270} y={46} glow="#ffe7a8" />
      <Lamp x={530} y={46} glow="#ffe7a8" />
      <Checker y={340} h={110} a="#e8e4dc" b="#d4cfc4" size={60} />
      <R x={0} y={340} w={800} h={5} f="#fff" o={0.8} />
      <Plant x={270} y={372} s={1.4} />
      <Plant x={530} y={372} s={1.4} />
      <g>
        <R x={80} y={380} w={90} h={14} f="#e0566b" rx={3} />
        <R x={92} y={394} w={6} h={32} f="#3a3a44" />
        <R x={152} y={394} w={6} h={32} f="#3a3a44" />
      </g>
      <R x={0} y={425} w={800} h={25} f="#000" o={0.08} />
    </g>
  )
}

function Brick({ x, w, wall, awning, win = '#dfeaf2' }: { x: number; w: number; wall: string; awning: string; win?: string }) {
  return (
    <g>
      <R x={x} y={60} w={w} h={290} f={wall} />
      {Array.from({ length: 12 }, (_, i) => (
        <R key={i} x={x} y={72 + i * 24} w={w} h={2} f="#000" o={0.08} />
      ))}
      <R x={x + 18} y={80} w={w - 36} h={60} f={win} />
      <R x={x + 18} y={80} w={(w - 36) / 2 - 2} h={60} f="#fff" o={0.2} />
      <path d={`M${x + 6} 170h${w - 12}l-8 34h${-(w - 28)}z`} fill={awning} />
      <R x={x + 18} y={210} w={w - 36} h={110} f={win} />
      <R x={x + w / 2 - 14} y={286} w={28} h={64} f="#2d3a55" />
      <path d={`M${x + w - 12} 120h30`} stroke="#2e2e38" strokeWidth="3" />
      <circle cx={x + w + 6} cy="136" r="10" fill="#d8b04a" />
    </g>
  )
}

/** Rua comercial britânica (high street) com fachadas tradicionais e bandeirolas. */
export function HighStreetUK() {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f="#b8c7d6" />
      <Cloud x={160} y={40} s={1.4} f="#e2e8ef" d={3} />
      <Cloud x={560} y={30} s={1.2} f="#e2e8ef" d={9} />
      <Brick x={20} w={180} wall="#a8503f" awning="#2f6b4f" />
      <Brick x={225} w={190} wall="#d8c7a5" awning="#7a1f2b" />
      <Brick x={440} w={170} wall="#7a8fa8" awning="#c9a227" />
      <Brick x={635} w={160} wall="#b8856a" awning="#012169" />
      {/* bandeirolas */}
      <path d="M0 50q200 40 400 0t400 0" fill="none" stroke="#2e2e38" strokeWidth="2" />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M${i * 50 + 12} ${60 + Math.sin(i) * 3}l12 0 -6 16z`} fill={['#c8102e', '#fff', '#012169'][i % 3]!} />
      ))}
      <R x={0} y={345} w={800} h={105} f="#8d8f98" />
      <R x={0} y={345} w={800} h={10} f="#b7b9c2" />
      <Lamp x={425} y={60} glow="#ffe7a8" />
      <R x={420} y={60} w={10} h={300} f="#2d3a55" />
      <R x={0} y={425} w={800} h={25} f="#000" o={0.15} />
    </g>
  )
}

/** Parque com bancos e food truck. */
export function ParkUS() {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f="#a9dcf2" />
      <Cloud x={160} y={70} s={1.3} d={2} />
      <Cloud x={480} y={50} d={7} />
      <Cloud x={690} y={95} s={1.1} d={11} />
      <path d="M0 250q200 -60 400 -10t400 -20v230H0z" fill="#79c07a" />
      <Tree x={90} y={250} s={1.3} />
      <Tree x={720} y={240} s={1.1} leaf="#4f9d5a" />
      <R x={0} y={310} w={800} h={140} f="#5fae63" />
      <path d="M0 400q400 -60 800 -30v30H0z" fill="#d9c9a3" />
      {/* food truck */}
      <g>
        <R x={290} y={200} w={250} h={120} f="#e4872c" rx={10} />
        <R x={290} y={200} w={250} h={22} f="#b3561b" rx={6} />
        <R x={330} y={238} w={130} h={56} f="#2e2e38" rx={4} />
        <path d="M322 232h146l-8 -14h-130z" fill="#fff" />
        <path d="M322 232h24l-6 -14h-18zM370 232h24l-6 -14h-18zM418 232h24l-6 -14h-18z" fill="#b22234" />
        <R x={470} y={236} w={56} h={44} f="#cfe9f2" rx={4} />
        <circle cx="350" cy="320" r="18" fill="#2e2e38" />
        <circle cx="350" cy="320" r="7" fill="#c9c9d1" />
        <circle cx="490" cy="320" r="18" fill="#2e2e38" />
        <circle cx="490" cy="320" r="7" fill="#c9c9d1" />
        <Lamp x={330} y={206} glow="#ffe7a8" r={4} />
        <Lamp x={410} y={206} glow="#ffe7a8" r={4} />
        <Lamp x={490} y={206} glow="#ffe7a8" r={4} />
      </g>
      <Bench x={150} y={390} s={1.3} />
      <Bench x={650} y={400} s={1.2} />
    </g>
  )
}

/** Parque britânico com coreto, café ao ar livre e bancos. */
export function ParkUK() {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f="#bccddb" />
      <Cloud x={150} y={60} s={1.6} f="#e8edf2" d={1} o={1} />
      <Cloud x={470} y={40} s={1.4} f="#dde4ec" d={6} o={1} />
      <Cloud x={700} y={80} s={1.5} f="#e8edf2" d={10} o={1} />
      <path d="M0 260q200 -50 400 -10t400 -10v210H0z" fill="#6aa86a" />
      <Tree x={70} y={260} s={1.2} leaf="#4a8c58" />
      <R x={0} y={320} w={800} h={130} f="#5a9e5e" />
      {/* coreto */}
      <g>
        <R x={430} y={250} w={230} h={16} f="#e9e4dc" />
        <R x={440} y={266} w={210} h={60} f="#f4f1ec" />
        {[450, 500, 550, 600, 640].map((x) => (
          <R key={x} x={x} y={156} w={8} h={96} f="#fff" />
        ))}
        <path d="M416 158l129 -66 129 66z" fill="#7a1f2b" />
        <path d="M545 92v-22" stroke="#2e2e38" strokeWidth="3" />
        <path d="M545 70l18 6 -18 6z" fill="#c8102e" />
        <R x={420} y={156} w={250} h={8} f="#e9e4dc" />
      </g>
      {/* café ao ar livre */}
      {[130, 270].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 52} 340h104l-52 -40z`} fill={i ? '#012169' : '#c8102e'} />
          <R x={x - 2} y={340} w={4} h={50} f="#3a3a44" />
          <ellipse cx={x} cy={392} rx="34" ry="8" fill="#e9e4dc" />
          <R x={x - 24} y={406} w={4} h={22} f="#3a3a44" />
          <R x={x + 20} y={406} w={4} h={22} f="#3a3a44" />
        </g>
      ))}
      <Bench x={700} y={405} s={1.2} />
    </g>
  )
}
