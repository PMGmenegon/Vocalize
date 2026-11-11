# 0002 — Frontend com Vite + React + React Router (SPA)

**Status:** aceita

## Contexto
O frontend é um app de estudo: interface interativa, áudio (`speechSynthesis`), reconhecimento de voz (Web Speech API) e dados vindos da nossa API. Não há necessidade de SEO por página nem de renderização no servidor, e o custo de infraestrutura deve ser zero.

## Decisão
SPA com **Vite + React + TypeScript (strict)** e **React Router** para as rotas (`/` público, `/app/*` logado). ESLint (flat config) para lint.

## Alternativas consideradas
- **Next.js** — SSR/SEO e roteamento por arquivos, mas traz um servidor Node para hospedar e um modelo mental (server components) que não agrega ao app; a API já é um backend separado.
- **Create React App** — descontinuado.
- **Vue/Svelte** — ótimos, mas o requisito do projeto é React.

## Consequências
- Build estático barato de hospedar (qualquer CDN gratuita).
- A página inicial não é renderizada no servidor; aceitável, pois o valor do produto está dentro do app.
- Rotas em `BrowserRouter` exigem que o host redirecione qualquer caminho para `index.html` (configurar no deploy).
