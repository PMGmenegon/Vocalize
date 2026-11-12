/** Bloco cinza pulsante para estados de carregamento. Decorativo: o aviso para leitores de tela vem do pai. */
export default function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-line ${className}`} />
}

/** Várias linhas de esqueleto + aviso "Carregando…" para leitores de tela. */
export function SkeletonBlock({ lines = 3, label = 'Carregando…' }: { lines?: number; label?: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={i === 0 ? 'h-6 w-2/3' : 'h-4 w-full'} />
      ))}
    </div>
  )
}
