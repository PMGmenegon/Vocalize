const LEVELS = ['Muito fraca', 'Fraca', 'Média', 'Boa', 'Forte'] as const

/** Pontua de 0 a 4: tamanho, maiúscula+minúscula, número e símbolo. */
function score(password: string): number {
  if (!password) return 0
  let points = 0
  if (password.length >= 8) points++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++
  if (/\d/.test(password)) points++
  if (/[^A-Za-z0-9]/.test(password)) points++
  return password.length < 8 ? Math.min(points, 1) : points
}

/** Indicador de força da senha: 4 segmentos E um texto (não depende só de cor). */
export default function PasswordStrength({ password }: { password: string }) {
  const points = score(password)
  return (
    <div className="mt-2" aria-live="polite">
      <div aria-hidden="true" className="flex gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-1.5 flex-1 rounded-full ${password && n <= points ? 'bg-brand' : 'bg-line'}`} />
        ))}
      </div>
      <p className="mt-1 text-sm text-muted">
        Força da senha: <strong className="text-ink">{password ? LEVELS[points] : '—'}</strong>
      </p>
    </div>
  )
}
