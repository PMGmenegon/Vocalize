import { describe, expect, it } from 'vitest'
import { AuthFailure, authErrorMessage, translateAuthError } from './authErrors'

const code = (raw: unknown) => translateAuthError(raw).code

describe('translateAuthError', () => {
  it('e-mail ou senha incorretos', () => {
    expect(code({ code: 'invalid_credentials', status: 400 })).toBe('invalid_credentials')
    expect(code({ message: 'Invalid login credentials' })).toBe('invalid_credentials')
    expect(authErrorMessage({ code: 'invalid_credentials' })).toBe('E-mail ou senha incorretos.')
  })
  it('e-mail já cadastrado', () => {
    expect(code({ code: 'user_already_exists' })).toBe('email_taken')
    expect(code({ code: 'email_exists' })).toBe('email_taken')
    expect(code({ message: 'User already registered' })).toBe('email_taken')
  })
  it('senha fraca', () => {
    expect(code({ code: 'weak_password' })).toBe('weak_password')
    expect(code({ message: 'Password should contain at least one character of each' })).toBe('weak_password')
  })
  it('e-mail não confirmado', () => {
    expect(code({ code: 'email_not_confirmed' })).toBe('email_not_confirmed')
    expect(code({ message: 'Email not confirmed' })).toBe('email_not_confirmed')
  })
  it('muitas tentativas e limite de e-mails (distintos)', () => {
    expect(code({ code: 'over_request_rate_limit', status: 429 })).toBe('rate_limited')
    expect(code({ status: 429 })).toBe('rate_limited')
    expect(code({ code: 'over_email_send_rate_limit', status: 429 })).toBe('email_rate_limited')
    expect(code({ message: 'email rate limit exceeded' })).toBe('email_rate_limited')
  })
  it('erro de conexão', () => {
    expect(code({ name: 'AuthRetryableFetchError', status: 0, message: 'Failed to fetch' })).toBe('network')
    expect(code(new TypeError('Failed to fetch'))).toBe('network')
  })
  it('link expirado e mesma senha', () => {
    expect(code({ name: 'AuthSessionMissingError' })).toBe('link_expired')
    expect(code({ code: 'same_password' })).toBe('same_password')
  })
  it('desconhecido cai numa mensagem genérica, sem vazar texto em inglês', () => {
    const failure = translateAuthError({ message: 'Something weird' })
    expect(failure.code).toBe('unknown')
    expect(failure.message).not.toMatch(/weird/)
    expect(translateAuthError(null).code).toBe('unknown')
  })
  it('não traduz duas vezes', () => {
    const failure = new AuthFailure('network')
    expect(translateAuthError(failure)).toBe(failure)
  })
})
