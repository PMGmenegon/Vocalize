import { WINE } from './brandColors'

/** Celular (decorativo): só a etiqueta e a frase principal, em tamanho menor, acima do formulário. */
export default function BrandStrip() {
  return (
    <div aria-hidden="true" lang="en" className="mb-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Vocalize · Listening Lab</p>
      <p className="font-editorial mt-2 text-[1.75rem] font-medium leading-[1.08] tracking-tight text-ink">
        The world speaks.
        <br />
        <em className="font-normal" style={{ color: WINE }}>
          You should too.
        </em>
      </p>
    </div>
  )
}
