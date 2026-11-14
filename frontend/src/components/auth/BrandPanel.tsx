import Waveform from '../practice/Waveform'

/** Cores das duas variantes do inglês (vinho dos EUA e azul-marinho do Reino Unido), fixas nos dois temas. */
const US = 'text-[#9b1c2e]'
const UK = 'text-[#012169]'

const PAIRS = [
  ['Color', 'Colour'],
  ['Elevator', 'Lift'],
  ['Apartment', 'Flat'],
] as const

/**
 * Lateral editorial de login e cadastro (decorativa): só tipografia sobre o fundo off-white.
 * Hierarquia: frase principal → frase de apoio → pares US/UK → pequeno diálogo com áudio.
 * Tudo se alinha à mesma margem esquerda. Em telas baixas os blocos opcionais somem
 * (em vez de se sobrepor): primeiro o diálogo, depois o terceiro par.
 */
export default function BrandPanel() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-surface px-[clamp(1.75rem,5vw,5rem)] py-[clamp(1.5rem,5vh,3.5rem)]"
    >
      <header className="rise flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
        <span>VocaLize</span>
        <span className="hidden lg:inline">Listening · Dialogues · Pronunciation</span>
      </header>

      <div className="my-auto py-8">
        <p className="rise mb-5 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ '--d': '80ms' } as React.CSSProperties}>
          <span className={US}>US English</span>
          <span className="mx-2 text-muted">/</span>
          <span className={UK}>UK English</span>
        </p>

        <h2 lang="en" className="rise font-editorial text-[clamp(2.4rem,4.2vw,4.9rem)] font-medium leading-[1.03] tracking-tight text-ink" style={{ '--d': '160ms' } as React.CSSProperties}>
          The world speaks.
          <br />
          <em className={`${US} font-normal`}>You should too.</em>
        </h2>

        <p className="rise mt-6 max-w-md text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-muted" style={{ '--d': '260ms' } as React.CSSProperties}>
          Treine o ouvido com conversas reais, do sotaque de Nova York ao de Londres.
        </p>

        <ul lang="en" className="rise mt-10 max-w-md" style={{ '--d': '360ms' } as React.CSSProperties}>
          {PAIRS.map(([us, uk], i) => (
            <li
              key={us}
              className={`flex items-baseline justify-between gap-4 border-t border-line py-3 font-editorial text-[clamp(1.25rem,1.9vw,1.85rem)] ${i === 2 ? '[@media(max-height:660px)]:hidden' : ''} ${i === PAIRS.length - 1 ? 'border-b' : ''}`}
            >
              <span className={US}>{us}</span>
              <span className="text-muted">/</span>
              <span className={UK}>{uk}</span>
            </li>
          ))}
        </ul>
      </div>

      <figure lang="en" className="rise max-w-md border-l-2 border-ink pl-5 [@media(max-height:780px)]:hidden" style={{ '--d': '460ms' } as React.CSSProperties}>
        <figcaption className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Diner, New York</figcaption>
        <p className="font-editorial text-lg italic leading-snug text-ink">
          <span className="not-italic text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Mike</span>
          <br />
          “Welcome in! Do you have a reservation?”
        </p>
        <div className="my-3 flex items-center gap-3">
          <Waveform seed={7} progress={0.55} bars={40} height={24} className="min-w-0 flex-1 overflow-hidden" />
          <span className="text-xs tabular-nums text-muted">0:04</span>
        </div>
        <p className="font-editorial text-lg italic leading-snug text-ink">
          <span className="not-italic text-[11px] font-bold uppercase tracking-[0.18em] text-muted">You</span>
          <br />
          “Yes, I booked a table for two.”
        </p>
      </figure>
    </div>
  )
}
