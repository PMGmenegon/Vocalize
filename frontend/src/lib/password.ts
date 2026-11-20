/** Regra de senha do Supabase deste projeto: mínimo de 8 caracteres, com letras e números. */
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_RULE_HINT = 'Mínimo de 8 caracteres, com letras e números.'

export function meetsPasswordRule(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH && /[A-Za-z]/.test(password) && /\d/.test(password)
}

/** Mensagem de erro em português, ou null se a senha é válida. */
export function validateNewPassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) return 'A senha precisa ter pelo menos 8 caracteres.'
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'A senha precisa ter letras e números.'
  return null
}

/**
 * Força de 0 a 4 para o indicador. Senha que não cumpre a regra do Supabase fica em 0 ou 1;
 * cumprindo, parte de 2 e sobe com tamanho (12+), maiúscula e minúscula e símbolo.
 */
export function passwordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0
  if (!meetsPasswordRule(password)) {
    const met = [password.length >= PASSWORD_MIN_LENGTH, /[A-Za-z]/.test(password), /\d/.test(password)].filter(Boolean).length
    return met >= 2 ? 1 : 0
  }
  let points = 2
  if (password.length >= 12) points++
  if ((/[a-z]/.test(password) && /[A-Z]/.test(password)) || /[^A-Za-z0-9]/.test(password)) points++
  return points as 2 | 3 | 4
}
