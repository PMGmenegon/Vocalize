/** Resposta do usuário (à direita). */
export default function UserBubble({ text }: { text: string }) {
  return (
    <div className="bubble-in flex justify-end">
      <p lang="en" className="surface-brand max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-on-brand">
        <span className="sr-only">Você: </span>
        {text}
      </p>
    </div>
  )
}
