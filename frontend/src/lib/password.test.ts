import { describe, expect, it } from 'vitest'
import { meetsPasswordRule, passwordStrength, validateNewPassword } from './password'

describe('validateNewPassword (regra do Supabase: 8+, letras e números)', () => {
  it('aceita 8+ caracteres com letras e números', () => {
    expect(validateNewPassword('abcdef12')).toBeNull()
    expect(validateNewPassword('Senha1234')).toBeNull()
  })
  it('recusa menos de 8 caracteres', () => {
    expect(validateNewPassword('abc123')).toMatch(/pelo menos 8/)
  })
  it('recusa só letras ou só números', () => {
    expect(validateNewPassword('somenteletras')).toMatch(/letras e números/)
    expect(validateNewPassword('12345678')).toMatch(/letras e números/)
  })
  it('exatamente 8 caracteres vale', () => {
    expect(meetsPasswordRule('abcd1234')).toBe(true)
    expect(meetsPasswordRule('abcd123')).toBe(false)
  })
})

describe('passwordStrength', () => {
  it('vazia = 0; fora da regra fica em 0 ou 1', () => {
    expect(passwordStrength('')).toBe(0)
    expect(passwordStrength('abc')).toBe(0)
    expect(passwordStrength('abcdefghij')).toBe(1)
    expect(passwordStrength('12345678')).toBe(1)
  })
  it('cumprindo a regra, parte de 2 e sobe com tamanho, caixa mista e símbolo', () => {
    expect(passwordStrength('abcd1234')).toBe(2)
    expect(passwordStrength('abcdefgh1234')).toBe(3)
    expect(passwordStrength('Abcdefgh1234!')).toBe(4)
  })
})
