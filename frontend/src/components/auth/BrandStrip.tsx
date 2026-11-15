import { WINE } from './brandColors'

/** Celular (decorativo): só a etiqueta e a frase principal, em tamanho menor, acima do formulário. */
export default function BrandStrip() {
  return (
    <div aria-hidden="true" lang="en" className="mb-8">
      <p className="type-eyebrow">Vocalize · Listening Lab</p>
      <p className="type-display mt-2 text-[1.75rem]">
        The world speaks.
        <br />
        <em className="font-normal" style={{ color: WINE }}>
          You should too.
        </em>
      </p>
    </div>
  )
}
