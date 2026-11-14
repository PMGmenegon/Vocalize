/** Forma de onda decorativa: alturas pseudo-aleatórias estáveis (a partir de `seed`) e preenchimento conforme o progresso. */
export default function Waveform({ seed, progress, bars = 48, height = 40, className = '' }: { seed: number; progress: number; bars?: number; height?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-[2px] ${className}`} style={{ height }}>
      {Array.from({ length: bars }, (_, i) => {
        const r = ((seed * 9301 + i * 49297 + (i * i) % 17) % 233280) / 233280
        const h = Math.max(4, Math.round(height * (0.2 + 0.8 * Math.abs(Math.sin(i * 0.55 + r * 4)) * (0.55 + 0.45 * r))))
        return <span key={i} className={`w-[3px] shrink-0 rounded-full ${i / bars < progress ? 'bg-brand' : 'bg-muted opacity-40'}`} style={{ height: h }} />
      })}
    </div>
  )
}
