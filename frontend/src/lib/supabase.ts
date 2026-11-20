import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Único lugar que cria o cliente do Supabase (só `services/authService.ts` o usa).
 * Usa apenas a chave pública (publishable/anon); a chave secret/service_role NUNCA entra no frontend.
 * Criado sob demanda: se as variáveis faltarem, o erro é claro e acontece no primeiro uso.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'Configuração do Supabase ausente: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em frontend/.env.local (veja frontend/.env.example e o README).',
    )
  }
  client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
  return client
}
