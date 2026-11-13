import { Cloud, Frame, Plane, Plant, R } from './parts'

function Board({ x, y, uk }: { x: number; y: number; uk: boolean }) {
  return (
    <g>
      <R x={x} y={y} w={230} h={120} f="#12161f" rx={6} />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <R x={x + 14} y={y + 14 + i * 20} w={52} h={8} f={uk ? '#7fb2ff' : '#ffb347'} rx={2} className={i % 2 ? 'sc-blink' : undefined} />
          <R x={x + 78} y={y + 14 + i * 20} w={90} h={8} f="#e8e8ee" rx={2} o={0.8} />
          <R x={x + 180} y={y + 14 + i * 20} w={36} h={8} f={i === 2 ? '#ff6b6b' : '#6bdc8a'} rx={2} />
        </g>
      ))}
    </g>
  )
}

/** Saguão de aeroporto: painel de voos, janelão com aviões. `uk` deixa o céu nublado. */
export function Airport({ uk }: { uk: boolean }) {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f={uk ? '#dfe3ea' : '#eef1f6'} />
      <Frame x={40} y={90} w={720} h={210} id={uk ? 'sc-air-uk-win' : 'sc-air-us-win'} frame="#aeb5c4">
        <R x={40} y={90} w={720} h={210} f={uk ? '#aab5c4' : '#7fc4ee'} />
        {uk ? (
          <>
            <Cloud x={150} y={140} s={1.6} f="#d5dbe4" d={1} o={1} />
            <Cloud x={420} y={120} s={1.8} f="#cfd6e0" d={6} o={1} />
            <Cloud x={680} y={150} s={1.5} f="#d5dbe4" d={10} o={1} />
          </>
        ) : (
          <>
            <Cloud x={200} y={130} d={2} />
            <Cloud x={560} y={150} s={1.2} d={7} />
          </>
        )}
        <R x={40} y={252} w={720} h={48} f="#6f7683" />
        <R x={40} y={274} w={720} h={3} f="#f4f4f4" o={0.8} />
        <Plane x={260} y={200} s={1.3} d={0} f={uk ? '#e8ecf2' : '#fff'} />
        <Plane x={620} y={235} s={0.8} d={8} f={uk ? '#e8ecf2' : '#fff'} />
        {/* avião parado no portão */}
        <g>
          <ellipse cx="470" cy="262" rx="90" ry="14" fill={uk ? '#f2f4f8' : '#fff'} />
          <path d="M520 258l30 -38h14l-18 40z" fill={uk ? '#012169' : '#b22234'} />
          <path d="M440 262l-20 14h60z" fill="#c9ced8" />
        </g>
      </Frame>
      {[210, 400, 590].map((x) => (
        <R key={x} x={x} y={90} w={6} h={210} f="#aeb5c4" />
      ))}
      <Board x={285} y={14} uk={uk} />
      <R x={0} y={310} w={800} h={140} f={uk ? '#b9bfcb' : '#c9d0dc'} />
      <R x={0} y={330} w={800} h={4} f="#fff" o={0.6} />
      {/* assentos */}
      {[60, 150, 240].map((x) => (
        <g key={x}>
          <R x={x} y={350} w={70} h={40} f={uk ? '#012169' : '#1d4f8f'} rx={8} />
          <R x={x} y={336} w={70} h={20} f={uk ? '#1a3a8a' : '#2f6dc0'} rx={8} />
          <R x={x + 8} y={390} w={6} h={26} f="#3a3a44" />
          <R x={x + 56} y={390} w={6} h={26} f="#3a3a44" />
        </g>
      ))}
      {/* malas */}
      <R x={560} y={366} w={54} h={56} f={uk ? '#7d3b3b' : '#e4872c'} rx={8} />
      <R x={574} y={352} w={26} h={16} f="none" rx={4} />
      <path d="M574 366v-12h26v12" fill="none" stroke="#3a3a44" strokeWidth="4" />
      <R x={630} y={380} w={64} h={42} f="#3a3a44" rx={8} />
      <Plant x={740} y={400} s={1.2} />
    </g>
  )
}

/** Recepção americana: porta giratória, carregador de malas e carrinho. */
export function HotelUS() {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f="#f1e6d3" />
      <R x={0} y={0} w={800} h={60} f="#7a1f2b" />
      {[130, 400, 670].map((x) => (
        <g key={x}>
          <R x={x - 6} y={60} w={12} h={290} f="#d8b04a" />
          <circle cx={x} cy="40" r="10" fill="#ffd36b" className="sc-blink" />
        </g>
      ))}
      {/* porta giratória */}
      <g>
        <R x={560} y={90} w={170} h={250} f="#b9d9ea" rx={10} o={0.7} />
        <circle cx="645" cy="215" r="76" fill="#cfe6f2" opacity="0.8" stroke="#d8b04a" strokeWidth="8" />
        <g className="sc-spin" style={{ transformOrigin: '645px 215px' }}>
          <path d="M645 215v-72M645 215l62 36M645 215l-62 36" stroke="#d8b04a" strokeWidth="6" strokeLinecap="round" />
        </g>
      </g>
      {/* balcão */}
      <R x={40} y={230} w={300} h={120} f="#7a1f2b" />
      <R x={30} y={218} w={320} h={16} f="#d8b04a" />
      <R x={80} y={194} w={40} h={24} f="#fff" rx={3} />
      <circle cx="270" cy="206" r="10" fill="#d8b04a" />
      <R x={265} y={206} w={10} h={12} f="#d8b04a" />
      <R x={0} y={345} w={800} h={105} f="#a47a52" />
      <R x={0} y={345} w={800} h={6} f="#7a1f2b" />
      {/* carrinho de malas */}
      <g>
        <path d="M400 380h110M410 380v-110M500 380v-110" stroke="#d8b04a" strokeWidth="5" fill="none" />
        <circle cx="415" cy="398" r="9" fill="#2e2e38" />
        <circle cx="498" cy="398" r="9" fill="#2e2e38" />
        <R x={418} y={318} w={70} h={56} f="#2f5d8a" rx={6} />
        <R x={430} y={278} w={50} h={42} f="#e4872c" rx={6} />
        <path d="M444 278v-10h22v10" fill="none" stroke="#3a3a44" strokeWidth="4" />
      </g>
      <Plant x={350} y={390} s={1.2} pot="#7a1f2b" />
    </g>
  )
}

/** Recepção clássica britânica: tapete vermelho, escada e quadro de chaves. */
export function HotelUK() {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f="#e4dccd" />
      <R x={0} y={0} w={800} h={30} f="#1c3557" />
      {/* papel de parede listrado */}
      {Array.from({ length: 27 }, (_, i) => (
        <R key={i} x={i * 30} y={30} w={14} h={310} f="#d9cfbc" />
      ))}
      {/* escada */}
      <g>
        {Array.from({ length: 7 }, (_, i) => (
          <R key={i} x={470 + i * 45} y={330 - i * 36} w={330 - i * 45} h={36} f={i % 2 ? '#7a1f2b' : '#8f2a38'} />
        ))}
        <path d="M470 326L800 80" stroke="#6b4226" strokeWidth="8" />
        {Array.from({ length: 7 }, (_, i) => (
          <R key={i} x={474 + i * 45} y={270 - i * 36} w={4} h={56} f="#6b4226" />
        ))}
      </g>
      {/* quadro de chaves */}
      <R x={60} y={70} w={230} h={130} f="#5a3a22" rx={6} />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <circle cx={90 + (i % 6) * 36} cy={100 + Math.floor(i / 6) * 50} r="3" fill="#d8b04a" />
          <path d={`M${90 + (i % 6) * 36} ${103 + Math.floor(i / 6) * 50}v16`} stroke="#d8b04a" strokeWidth="2" className={i === 4 ? 'sc-blink' : undefined} />
          <R x={84 + (i % 6) * 36} y={118 + Math.floor(i / 6) * 50} w={12} h={14} f="#c9a227" rx={2} />
        </g>
      ))}
      {/* balcão */}
      <R x={40} y={240} w={330} h={110} f="#5a3a22" />
      <R x={30} y={228} w={350} h={14} f="#8a5a36" />
      <R x={180} y={206} w={30} h={22} f="#d8b04a" rx={11} />
      {/* piso e tapete */}
      <R x={0} y={345} w={800} h={105} f="#6b5a48" />
      <R x={120} y={345} w={560} h={105} f="#7a1f2b" />
      <R x={120} y={345} w={560} h={8} f="#d8b04a" />
      <R x={120} y={430} w={560} h={8} f="#d8b04a" />
      {/* chave grande em primeiro plano */}
      <g transform="translate(560 392)">
        <circle cx="0" cy="0" r="12" fill="none" stroke="#c9a227" strokeWidth="5" />
        <path d="M12 0h40M40 0v10M50 0v8" stroke="#c9a227" strokeWidth="5" />
      </g>
    </g>
  )
}
