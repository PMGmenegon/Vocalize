import { passwordStrength } from '../../lib/password'

const LEVELS = ['Muito fraca', 'Fraca', 'Média', 'Boa', 'Forte'] as const

/** Indicador de força da senha: 4 segmentos E um texto (não depende só de cor). Reflete a regra do Supabase (8+, letras e números). */
export default function PasswordStrength({ password }: { password: string }) {
  const points = passwordStrength(password)
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
