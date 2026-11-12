import { useId, useState } from 'react'

const QUESTIONS = [
  {
    q: 'É gratuito?',
    a: 'Por enquanto, sim. O Vocalize é um projeto de portfólio e não tem planos pagos.',
  },
  {
    q: 'Preciso de microfone?',
    a: 'Só se quiser responder falando. Você pode responder digitando. Para ouvir, basta fone de ouvido ou alto-falante.',
  },
  {
    q: 'Funciona no celular?',
    a: 'Sim, a interface foi feita para telas pequenas. O reconhecimento de voz depende do navegador do aparelho.',
  },
  {
    q: 'Qual navegador devo usar?',
    a: 'Recomendamos o Google Chrome, que costuma ter o melhor suporte a fala e reconhecimento de voz. Em outros navegadores, os recursos de voz podem ser limitados; digitando, funciona em qualquer um.',
  },
] as const

/** Perguntas frequentes em acordeão: botões com aria-expanded/aria-controls. */
export default function Faq() {
  const base = useId()
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set())

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-black text-ink sm:text-4xl">Perguntas frequentes</h2>
      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface">
        {QUESTIONS.map((item, i) => {
          const expanded = open.has(i)
          const panelId = `${base}-panel-${i}`
          const buttonId = `${base}-button-${i}`
          return (
            <div key={item.q}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-5 py-3 text-left text-base font-bold text-ink hover:bg-canvas/60"
                >
                  {item.q}
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 shrink-0 text-brand transition-transform ${expanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!expanded} className="px-5 pb-5 text-muted">
                {item.a}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
