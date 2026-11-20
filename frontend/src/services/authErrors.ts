/** Códigos de erro de autenticação que a interface sabe tratar. */
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_taken'
  | 'weak_password'
  | 'same_password'
  | 'email_not_confirmed'
  | 'rate_limited'
  | 'email_rate_limited'
  | 'provider_unavailable'
  | 'link_expired'
  | 'network'
  | 'unknown'

const MESSAGES: Record<AuthErrorCode, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_taken: 'Este e-mail já está cadastrado. Tente entrar ou recuperar a senha.',
  weak_password: 'Senha fraca. Use pelo menos 8 caracteres, com letras e números.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  email_not_confirmed: 'Seu e-mail ainda não foi confirmado. Abra o link que enviamos para você.',
  rate_limited: 'Muitas tentativas. Aguarde um pouco e tente de novo.',
  email_rate_limited: 'Limite de envio de e-mails atingido. Aguarde alguns minutos e tente de novo.',
  provider_unavailable: 'Login com Google ainda não está disponível.',
  link_expired: 'Este link é inválido ou expirou. Peça um novo.',
  network: 'Erro de conexão. Verifique sua internet e tente de novo.',
  unknown: 'Não foi possível concluir agora. Tente novamente em instantes.',
}

/** Erro já traduzido, seguro para mostrar ao usuário. */
export class AuthFailure extends Error {
  readonly code: AuthErrorCode
  constructor(code: AuthErrorCode) {
    super(MESSAGES[code])
    this.name = 'AuthFailure'
    this.code = code
  }
}

/** Formato mínimo de um erro do Supabase (AuthError); evita importar o SDK aqui. */
interface RawAuthError {
  name?: string
  message?: string
  code?: string
  status?: number
}

/** ÚNICO lugar que traduz erros do Supabase Auth para português. */
export function translateAuthError(error: unknown): AuthFailure {
  if (error instanceof AuthFailure) return error
  const e = (typeof error === 'object' && error !== null ? error : {}) as RawAuthError
  const code = e.code ?? ''
  const message = e.message ?? ''

  if (code === 'invalid_credentials' || /invalid login credentials/i.test(message)) return new AuthFailure('invalid_credentials')
  if (code === 'email_not_confirmed' || /email not confirmed/i.test(message)) return new AuthFailure('email_not_confirmed')
  if (code === 'user_already_exists' || code === 'email_exists' || /already (been )?registered/i.test(message))
    return new AuthFailure('email_taken')
  if (code === 'same_password' || /different from the old password/i.test(message)) return new AuthFailure('same_password')
  if (code === 'weak_password' || /password (should|must)|weak password|at least \d+ characters/i.test(message))
    return new AuthFailure('weak_password')
  if (code === 'over_email_send_rate_limit' || /email rate limit/i.test(message)) return new AuthFailure('email_rate_limited')
  if (code === 'over_request_rate_limit' || e.status === 429 || /rate limit|too many requests/i.test(message))
    return new AuthFailure('rate_limited')
  if (/provider is not enabled|unsupported provider/i.test(message)) return new AuthFailure('provider_unavailable')
  if (e.name === 'AuthSessionMissingError' || code === 'session_not_found' || code === 'otp_expired' || /expired|invalid.*(token|link)/i.test(message))
    return new AuthFailure('link_expired')
  if (e.name === 'AuthRetryableFetchError' || e.status === 0 || error instanceof TypeError || /failed to fetch|network/i.test(message))
    return new AuthFailure('network')
  return new AuthFailure('unknown')
}

/** Texto para mostrar na tela a partir de qualquer erro capturado. */
export function authErrorMessage(error: unknown): string {
  return translateAuthError(error).message
}
