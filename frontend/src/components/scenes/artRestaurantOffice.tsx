import { Checker, Cloud, Frame, Lamp, Plant, R, Skyline, Steam } from './parts'

/** Diner americano: balcão, bancos vermelhos, jukebox e janela com a cidade. */
export function DinerUS() {
  return (
    <g>
      {/* fundo */}
      <R x={0} y={0} w={800} h={340} f="#f3e3c3" />
      <R x={0} y={250} w={800} h={12} f="#b22234" />
      <R x={0} y={262} w={800} h={6} f="#fff" />
      <Frame x={470} y={50} w={290} h={170} id="sc-diner-win">
        <R x={470} y={50} w={290} h={170} f="#9fd3ee" />
        <Cloud x={560} y={90} s={0.8} d={4} />
        <Skyline items={[[470, 50, 110], [525, 40, 140], [570, 60, 90], [635, 45, 125], [685, 70, 100], [750, 30, 80]]} base={220} f="#5d7389" win="#ffe9a8" />
      </Frame>
      {/* meio */}
      <Checker y={335} h={115} a="#2e2e38" b="#f3e3c3" />
      <g>
        <R x={40} y={150} w={110} h={190} f="#c43b3b" rx={14} />
        <path d="M40 164a55 55 0 0 1 110 0z" fill="#8f1b2a" />
        <R x={58} y={190} w={74} h={70} f="#ffd36b" rx={8} o={0.9} className="sc-blink" />
        <R x={58} y={190} w={74} h={70} f="#ffb347" rx={8} o={0.5} />
        <circle cx="95" cy="296" r="14" fill="#f5f5f5" />
        <circle cx="95" cy="296" r="5" fill="#2e2e38" />
        <R x={52} y={318} w={86} h={10} f="#d9d9d9" rx={3} />
      </g>
      {/* balcão */}
      <R x={170} y={300} w={630} h={40} f="#b22234" />
      <R x={170} y={288} w={630} h={14} f="#e8e8ee" />
      {[250, 380, 510, 640].map((x) => (
        <g key={x}>
          <R x={x - 2} y={345} w={4} h={80} f="#c9c9d1" />
          <ellipse cx={x} cy={340} rx="28" ry="9" fill="#b22234" />
          <ellipse cx={x} cy={336} rx="28" ry="8" fill="#d6404f" />
        </g>
      ))}
      {/* primeiro plano */}
      <R x={560} y={266} w={26} h={22} f="#fff" rx={4} />
      <path d="M586 270h8a6 6 0 0 1 0 12h-8" fill="none" stroke="#fff" strokeWidth="3" />
      <Steam x={567} y={262} />
      <R x={240} y={274} w={34} h={14} f="#ffd36b" rx={7} />
      <R x={0} y={425} w={800} h={25} f="#1d1d26" o={0.35} />
    </g>
  )
}

/** Pub britânico: madeira escura, torneiras de chope e lareira. */
export function PubUK() {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f="#4a2f20" />
      {Array.from({ length: 20 }, (_, i) => (
        <R key={i} x={i * 40} y={0} w={2} h={340} f="#3a2418" />
      ))}
      <R x={0} y={335} w={800} h={115} f="#2b1b12" />
      {/* prateleiras com garrafas */}
      <R x={40} y={110} w={330} h={8} f="#8a5a36" />
      <R x={40} y={190} w={330} h={8} f="#8a5a36" />
      {Array.from({ length: 13 }, (_, i) => (
        <g key={i}>
          <R x={50 + i * 25} y={72} w={12} h={38} f={['#2f6b4f', '#7a3b1e', '#c9a227', '#5a2a4a'][i % 4]!} rx={3} />
          <R x={50 + i * 25} y={152} w={12} h={38} f={['#7a3b1e', '#2f6b4f', '#5a2a4a', '#c9a227'][i % 4]!} rx={3} />
        </g>
      ))}
      <R x={40} y={118} w={330} h={32} f="#c9a227" o={0.18} />
      {/* lareira */}
      <path d="M520 340V170a90 90 0 0 1 180 0v170z" fill="#8a8078" />
      <path d="M545 340V180a65 65 0 0 1 130 0v160z" fill="#1b1210" />
      <R x={500} y={150} w={220} h={14} f="#6b4226" rx={3} />
      <path className="sc-flicker" d="M610 340c-30 -10 -34 -40 -10 -60 2 16 14 20 14 8 14 14 40 32 6 52z" fill="#ff9a2e" />
      <path className="sc-flicker" style={{ animationDelay: '0.3s' }} d="M612 340c-16 -6 -18 -24 -4 -36 6 10 22 18 4 36z" fill="#ffd36b" />
      {/* lâmpadas */}
      <Lamp x={140} y={50} glow="#ffcf7a" />
      <Lamp x={300} y={40} glow="#ffcf7a" />
      {/* balcão */}
      <R x={0} y={300} w={460} h={60} f="#6b4226" />
      <R x={0} y={290} w={460} h={14} f="#8a5a36" />
      {[70, 130, 190].map((x) => (
        <g key={x}>
          <R x={x - 4} y={258} w={8} h={32} f="#d9d9d9" rx={2} />
          <R x={x - 10} y={252} w={20} h={8} f="#b0b0b8" rx={3} />
          <R x={x - 2} y={290} w={4} h={8} f="#d9d9d9" />
        </g>
      ))}
      {/* caneca com espuma */}
      <R x={300} y={255} w={30} h={35} f="#e8a735" rx={4} />
      <R x={300} y={250} w={30} h={10} f="#fffaf0" rx={5} />
      <R x={0} y={425} w={800} h={25} f="#000" o={0.3} />
    </g>
  )
}

function Desk() {
  return (
    <g>
      <R x={0} y={340} w={800} h={110} f="#d8cdb8" />
      <R x={0} y={330} w={800} h={14} f="#a98457" />
      <R x={420} y={296} w={120} h={8} f="#3a3a44" rx={3} />
      <path d="M430 296l14 -44h92l14 44z" fill="#52525e" />
      <R x={150} y={304} w={10} h={26} f="#fff" rx={2} />
      <R x={190} y={312} w={36} h={18} f="#fff" rx={4} />
      <Steam x={200} y={308} />
      <Plant x={680} y={330} s={1.3} />
      <R x={0} y={425} w={800} h={25} f="#000" o={0.12} />
    </g>
  )
}

/** Escritório moderno com vista de arranha-céus de Nova York. */
export function OfficeUS() {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f="#e6e8ee" />
      <Frame x={40} y={30} w={720} h={290} id="sc-office-us-win" frame="#c9ccd6">
        <R x={40} y={30} w={720} h={290} f="#8fc3e8" />
        <Cloud x={200} y={90} d={3} />
        <Cloud x={560} y={70} s={1.2} d={9} />
        <Skyline items={[[40, 70, 150], [100, 50, 200], [170, 80, 120], [260, 60, 230], [330, 90, 160], [430, 55, 210], [500, 80, 140], [600, 60, 190], [670, 90, 130]]} base={320} f="#8aa3bd" win="#dff0ff" />
        <Skyline items={[[60, 60, 100], [220, 70, 140], [390, 40, 90], [560, 60, 120], [700, 60, 110]]} base={320} f="#4b6580" win="#ffe9a8" spire={415} />
      </Frame>
      <R x={398} y={30} w={6} h={290} f="#c9ccd6" />
      <Desk />
    </g>
  )
}

/** Escritório com vista para o rio e a silhueta de Londres. */
export function OfficeUK() {
  return (
    <g>
      <R x={0} y={0} w={800} h={450} f="#ece6dc" />
      <R x={0} y={0} w={800} h={40} f="#2d3a55" />
      <Frame x={60} y={60} w={680} h={260} id="sc-office-uk-win" frame="#2d3a55">
        <R x={60} y={60} w={680} h={260} f="#b8c4d3" />
        <Cloud x={190} y={110} s={1.3} f="#e8edf3" d={2} />
        <Cloud x={520} y={95} s={1.1} f="#e8edf3" d={8} />
        {/* silhueta: cúpula, torre do relógio, roda-gigante */}
        <g fill="#6b7a91">
          <R x={110} y={230} w={90} h={60} f="#6b7a91" />
          <path d="M120 230a35 35 0 0 1 70 0z" />
          <R x={150} y={178} w={10} h={14} f="#6b7a91" />
          <R x={300} y={150} w={34} h={140} f="#6b7a91" />
          <path d="M296 150l21 -44 21 44z" />
          <circle cx="317" cy="180" r="9" fill="#e8edf3" />
          <R x={360} y={250} w={80} h={40} f="#6b7a91" />
          <R x={450} y={235} w={50} h={55} f="#6b7a91" />
        </g>
        <g fill="none" stroke="#6b7a91" strokeWidth="3">
          <circle cx="600" cy="190" r="70" />
          <circle cx="600" cy="190" r="5" fill="#6b7a91" />
          <path d="M600 120v140M530 190h140M550 140l100 100M650 140l-100 100" strokeWidth="1.5" />
        </g>
        <R x={60} y={290} w={680} h={40} f="#5f8aa8" />
        <path className="sc-wave" d="M60 300q40 -8 80 0t80 0 80 0 80 0 80 0 80 0 80 0 80 0 80 0" fill="none" stroke="#cfe2ef" strokeWidth="2" />
      </Frame>
      <Desk />
    </g>
  )
}
