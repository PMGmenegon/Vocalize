import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonStyles'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type ActionProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>
type LinkProps = CommonProps & { to: string }

/** Botão; vira link (<a>) com a mesma aparência quando recebe `to`. */
export default function Button(props: ActionProps | LinkProps) {
  if ('to' in props) {
    const { to, variant, size, className, children } = props
    return (
      <Link to={to} className={buttonClass(variant, size, className)}>
        {children}
      </Link>
    )
  }
  const { variant, size, className, children, type = 'button', ...rest } = props
  return (
    <button type={type} {...rest} className={buttonClass(variant, size, className)}>
      {children}
    </button>
  )
}
