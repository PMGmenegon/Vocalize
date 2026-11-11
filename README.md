# Vocalize

App web para **aprender inglês ouvindo e conversando**. A IA fala em inglês (o texto fica escondido), você transcreve o que ouviu, vê seus erros palavra por palavra e responde para continuar a conversa.

1. **Ouvir** — a fala da IA toca em áudio, sem texto.
2. **Transcrever** — você digita o que entendeu; o backend compara palavra por palavra.
3. **Responder** — você responde por texto ou voz; a IA corrige e segue a conversa.

Interface em português (Brasil); conteúdo de estudo em inglês. Dois temas visuais conforme o sotaque: **US** (vermelho, estrelas e listras) e **UK** (azul-marinho, cruz da Union Jack).

> **Status:** Fase 1 (frontend e identidade visual). O backend (FastAPI), o login e a conversa com a IA vêm nas próximas fases.

## Estrutura

```
frontend/   React + Vite + TypeScript + Tailwind (esta fase)
backend/    FastAPI (ainda vazio)
docs/       documentação e decisões de arquitetura (docs/decisions/)
```

## Como rodar o frontend

Pré-requisito: [Node.js](https://nodejs.org) 20 ou superior (testado com 22).

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço que o Vite mostrar no terminal (normalmente `http://localhost:5173`; se a porta estiver ocupada, ele usa a próxima livre).

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento com recarga automática |
| `npm run build` | checa os tipos e gera o build de produção em `dist/` |
| `npm run preview` | serve o build de produção localmente |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (strict), sem gerar arquivos |
| `npm run check:contrast` | verifica o contraste WCAG AA das cores dos dois temas |

## O que ver no navegador

- `/` — página inicial pública: o que é o Vocalize, os 3 passos e o botão **Começar**.
- `/app` — área logada: ao entrar aparece a **tela de abertura** (~2 s) e depois o layout com cabeçalho e navegação (Praticar, Estatísticas, Revisão, Perfil — páginas vazias por enquanto). O login real chega numa fase futura.
- Seletor **US / UK** no cabeçalho: troca o tema e a escolha fica salva no navegador.
- Em telas pequenas o menu vira um botão hambúrguer.

## Decisões de arquitetura

Registradas em [`docs/decisions/`](docs/decisions/):

- [0001 — Monorepo](docs/decisions/0001-monorepo.md)
- [0002 — Vite + React + React Router](docs/decisions/0002-vite-react-router.md)
- [0003 — Temas com variáveis CSS e Tailwind v4](docs/decisions/0003-temas-css-variables-tailwind.md)
- [0004 — TypeScript fixado na série 6.0](docs/decisions/0004-typescript-6.md)

## Licença

Veja [LICENSE](LICENSE).
