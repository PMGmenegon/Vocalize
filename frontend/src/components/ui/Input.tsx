import { useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: string
  hint?: string
  error?: string
  /** Texto maior e mais confortável (áreas de transcrição). */
  large?: boolean
}

interface ControlProps {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  className: string
}

const control = 'block w-full rounded-xl border-2 bg-card px-4 py-3 text-ink placeholder:text-muted'

/** Campo com rótulo visível, dica e mensagem de erro ligados por aria-describedby. */
function Field({
  id,
  label,
  hint,
  error,
  large,
  children,
}: FieldProps & { id: string; children: (props: ControlProps) => ReactNode }) {
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink">
        {label}
      </label>
      {children({
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        className: `${control} ${large ? 'text-xl leading-relaxed' : 'text-base'} ${error ? 'border-on-danger' : 'border-control'}`,
      })}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-bold text-on-danger">
          <span aria-hidden="true">✗ </span>
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({ label, hint, error, large, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Field id={id} label={label} hint={hint} error={error} large={large}>
      {(p) => <input id={id} {...p} {...rest} />}
    </Field>
  )
}

export function Textarea({ label, hint, error, large, ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Field id={id} label={label} hint={hint} error={error} large={large}>
      {(p) => <textarea id={id} rows={3} {...p} {...rest} />}
    </Field>
  )
}

/** Campo de senha com botão "Mostrar/Ocultar" (alterna o tipo do campo; o botão informa o estado por aria-pressed). */
export function PasswordInput({ label, hint, error, ...rest }: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      {(p) => (
        <div className="relative">
          <input id={id} type={visible ? 'text' : 'password'} {...p} {...rest} className={`${p.className} pr-24`} />
          <button
            type="button"
            aria-pressed={visible}
            aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`}
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-1.5 right-1.5 cursor-pointer rounded-lg px-3 text-sm font-bold text-link hover:bg-surface"
          >
            {visible ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      )}
    </Field>
  )
}
