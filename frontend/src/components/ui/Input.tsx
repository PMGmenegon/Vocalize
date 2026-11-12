import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: string
  hint?: string
  error?: string
}

interface ControlProps {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  className: string
}

const control = 'block w-full rounded-xl border-2 bg-canvas px-4 py-3 text-base text-ink placeholder:text-muted'

/** Campo com rótulo visível, dica e mensagem de erro ligados por aria-describedby. */
function Field({
  id,
  label,
  hint,
  error,
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
        className: `${control} ${error ? 'border-on-danger' : 'border-control'}`,
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

export function Input({ label, hint, error, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      {(p) => <input id={id} {...p} {...rest} />}
    </Field>
  )
}

export function Textarea({ label, hint, error, ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      {(p) => <textarea id={id} rows={3} {...p} {...rest} />}
    </Field>
  )
}
