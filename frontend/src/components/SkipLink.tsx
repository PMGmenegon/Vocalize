/** Link "pular para o conteúdo": só aparece ao navegar por teclado (Tab). */
export default function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="sr-only rounded-lg bg-brand px-4 py-2 font-bold text-on-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
    >
      Pular para o conteúdo
    </a>
  )
}
