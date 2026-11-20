import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // O Supabase redireciona de volta para http://localhost:5173: a porta não pode mudar.
  server: { port: 5173, strictPort: true },
  test: {
    // Os testes nunca usam as chaves reais: o cliente do Supabase é sempre substituído por um falso.
    env: { VITE_SUPABASE_URL: 'http://localhost:54321', VITE_SUPABASE_ANON_KEY: 'chave-ficticia-de-teste' },
  },
})
