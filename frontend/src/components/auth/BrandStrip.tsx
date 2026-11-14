/** Faixa editorial fina para o celular (decorativa): a mesma frase e o mesmo par US/UK da lateral. */
export default function BrandStrip() {
  return (
    <div aria-hidden="true" lang="en" className="flex h-14 items-center justify-between gap-3 overflow-hidden border-b border-line bg-surface px-4">
      <p className="font-editorial text-[15px] leading-tight text-ink">
        The world speaks. <em className="text-[#9b1c2e]">You should too.</em>
      </p>
      <p className="hidden shrink-0 text-[11px] font-bold uppercase tracking-[0.18em] min-[380px]:block">
        <span className="text-[#9b1c2e]">US</span>
        <span className="mx-1 text-muted">/</span>
        <span className="text-[#012169]">UK</span>
      </p>
    </div>
  )
}
