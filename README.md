# Vocalize

App web para **aprender inglês ouvindo e conversando**. A IA fala em inglês (o texto fica escondido), você transcreve o que ouviu, vê seus erros palavra por palavra e responde para continuar a conversa.

1. **Ouvir** — a fala da IA toca em áudio, sem texto.
2. **Transcrever** — você digita o que entendeu; o backend compara palavra por palavra.
3. **Responder** — você responde por texto ou voz; a IA corrige e segue a conversa.

Interface em português (Brasil); conteúdo de estudo em inglês. Dois temas visuais conforme o sotaque: **US** (vermelho, estrelas e listras) e **UK** (azul-marinho, cruz da Union Jack).

> **Status:** Fase 2 (todas as telas com dados falsos). O backend (FastAPI), o login real, o áudio e a IA vêm nas próximas fases.

## Estrutura

```
frontend/   React + Vite + TypeScript + Tailwind + Recharts
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

## Dados falsos (mock) e camada de serviços

Nesta fase não há backend: tudo vem de dados falsos, mas organizado para ser trocado pela API real.

```
frontend/src/
  types/      tipos do domínio (User, Session, Turn, TranscriptionResult, Stats, ...)
  mocks/      dados falsos coerentes entre si (usuária B1 com 3 semanas de histórico)
  services/   única porta de entrada para dados; hoje devolvem mocks com atraso simulado
```

**Regra:** as telas **nunca** importam `mocks/`, só `services/`. Nas próximas fases troca-se apenas a implementação dos serviços.

O login é simulado: qualquer e-mail entra como a usuária de demonstração (com histórico). Uma conta criada em **Cadastro** começa sem histórico, então mostra os estados vazios. Os dados ficam no `localStorage` do navegador.

Para testar os estados de erro e vazio, abra qualquer tela da área logada com `?mock=` na URL (a escolha fica salva na aba até `?mock=normal`):

| URL | Efeito |
|---|---|
| `/app/estatisticas?mock=erro` | toda chamada de dados falha (tela de erro com "Tentar de novo") |
| `/app/estatisticas?mock=vazio` | listas voltam vazias (estado vazio) |
| `/app?mock=normal` | volta ao normal |

## O que ver no navegador

Rotas públicas: `/` (landing), `/login`, `/cadastro`. Todas as rotas `/app/*` exigem login.

- `/cadastro` e `/login` — validação (e-mail, senha de 8+ caracteres, confirmação). Ao entrar aparece a splash e depois o onboarding (conta nova) ou o início.
- `/app/onboarding` — 3 etapas: nível, sotaque (o tema muda na hora) e meta diária.
- `/app` — saudação do modo, sequência, meta de hoje, nível, recomendação, "Praticar agora", últimas sessões e palavras para revisar.
- `/app/praticar` — cenários, nível e sotaque.
- `/app/praticar/:sessaoId` — rodada: ouvir → transcrever → resultado palavra por palavra → responder → correção. Ainda **sem áudio** (botões só simulam).
- `/app/praticar/:sessaoId/resumo` — resumo da sessão.
- `/app/estatisticas` — gráficos (Recharts) com filtro de 7 dias, 30 dias ou tudo.
- `/app/revisao` — flashcards com avaliação (Errei, Difícil, Bom, Fácil).
- `/app/perfil` — dados, edição de nível/sotaque/meta e "Sair".
- Seletor **US / UK** no cabeçalho troca o tema; em telas pequenas o menu vira hambúrguer.

## Decisões de arquitetura

Registradas em [`docs/decisions/`](docs/decisions/):

- [0001 — Monorepo](docs/decisions/0001-monorepo.md)
- [0002 — Vite + React + React Router](docs/decisions/0002-vite-react-router.md)
- [0003 — Temas com variáveis CSS e Tailwind v4](docs/decisions/0003-temas-css-variables-tailwind.md)
- [0004 — TypeScript fixado na série 6.0](docs/decisions/0004-typescript-6.md)

## Licença

Veja [LICENSE](LICENSE).
