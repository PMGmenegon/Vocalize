# Vocalize

[![Backend](https://github.com/PMGmenegon/Vocalize/actions/workflows/backend.yml/badge.svg?branch=main)](https://github.com/PMGmenegon/Vocalize/actions/workflows/backend.yml)
[![Frontend](https://github.com/PMGmenegon/Vocalize/actions/workflows/frontend.yml/badge.svg?branch=main)](https://github.com/PMGmenegon/Vocalize/actions/workflows/frontend.yml)

App web para **aprender inglês ouvindo e conversando**. A IA fala em inglês (o texto fica escondido), você transcreve o que ouviu, vê seus erros palavra por palavra e responde para continuar a conversa.

1. **Ouvir** — a fala da IA toca em áudio, sem texto.
2. **Transcrever** — você digita o que entendeu; o backend compara palavra por palavra.
3. **Responder** — você responde por texto ou voz; não existe uma única resposta certa, então a IA avalia se faz sentido na conversa e no seu nível, corrige a sua frase e sugere outras formas de responder.

Interface em português (Brasil); conteúdo de estudo em inglês. Dois temas visuais conforme o sotaque: **US** (vermelho, estrelas e listras) e **UK** (azul-marinho, cruz da Union Jack).

> **Status:** frontend com dados falsos + backend com banco de dados PostgreSQL (Fases 4 e 5). O login real, o áudio e a IA vêm nas próximas fases.

## Próximas fases

- **Fase 9:** backend (FastAPI) como fonte oficial da comparação do ditado.
- **Fase 10:** IA avaliando as **respostas** da conversa (coerência, adequação ao nível, frase corrigida, pontos de melhoria e respostas sugeridas), devolvendo um `ReplyFeedback` em JSON validado. Até lá o serviço devolve uma avaliação neutra simulada. O ditado continua com comparação exata, sem IA. Ver [docs/decisions/0006-avaliacao-de-respostas-por-ia.md](docs/decisions/0006-avaliacao-de-respostas-por-ia.md).

## Estrutura

```
frontend/   React + Vite + TypeScript + Tailwind + Recharts
backend/    FastAPI + PostgreSQL (health, /api/v1, erros padronizados, models e migrations; sem login/IA ainda)
docs/       documentação e decisões de arquitetura (docs/decisions/)
```

## Integração contínua

Dois workflows do GitHub Actions (em `.github/workflows/`) rodam em **todo pull request para a `main`** e em **todo push na `main`**, sem filtro de pastas (assim os checks podem ser obrigatórios na proteção da branch). Um push novo na mesma branch cancela a execução anterior.

| Workflow (check) | O que verifica, nesta ordem |
|---|---|
| **Backend checks** | `ruff check`, `ruff format --check`, `mypy` (strict) e `pytest`, incluindo os testes de integração com Testcontainers (PostgreSQL 16 no Docker do runner). Python 3.12, como no Dockerfile. |
| **Frontend checks** | `npm run lint`, `typecheck`, testes Vitest, `build` e `check:contrast` (WCAG AA). Node 22. |

Os passos rodam em ordem de custo (o mais barato primeiro), então a falha aparece rápido. O **Dependabot** abre PRs semanais para npm, dependências Python (uv) e GitHub Actions, agrupando atualizações menores/patch. Decisão completa em [0010](docs/decisions/0010-ci-github-actions.md).

## Fluxo de trabalho

1. **Branch por tarefa** a partir da `main` atualizada (ex.: `feat/fase-6-ci`). Nada de commit direto na `main`.
2. Commits no padrão Conventional Commits (`feat:`, `fix:`, `docs:`, `build:`...).
3. **Pull request** para a `main`, com título também em Conventional Commits.
4. **CI** precisa ficar verde (Backend checks e Frontend checks).
5. **Squash merge** (`gh pr merge --squash --delete-branch`): um commit por PR na `main`, e a branch é apagada.

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
| `npm run test` | testes unitários (Vitest), como o cálculo do nível do teste de nivelamento |
| `npm run check:contrast` | verifica o contraste WCAG AA das cores dos dois temas |

## Como rodar o backend

Pré-requisitos: [uv](https://docs.astral.sh/uv/) e Python 3.12+ (para o jeito local); [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para o jeito com Docker). Todos os comandos são a partir da raiz do repositório.

Primeiro, crie o arquivo de configuração (o `.env` real nunca vai para o Git):

```bash
cp backend/.env.example backend/.env
```

**Localmente, com uv:**

```bash
uv --directory backend sync
uv --directory backend run uvicorn app.main:app --reload
```

**Com Docker Compose** (API + PostgreSQL 16):

```bash
docker compose up --build
docker compose down        # para tudo (o volume do banco é mantido)
```

Se a porta 5432 do seu computador já estiver em uso, defina outra: `DB_PORT=5433 docker compose up`.

A API fica em `http://localhost:8000`:

| URL | O que mostra |
|---|---|
| `/health` | `{"status": "ok"}` (liveness: a API está de pé) |
| `/health/ready` | `{"status": "ready"}` (readiness: a API consegue falar com o banco) |
| `/api/v1/` | nome e versão da API |
| `/docs` | documentação interativa (Swagger) da **Vocalize API** |

### Banco de dados e migrations

O banco é o PostgreSQL 16 do `docker-compose.yml`. A conexão vem de `DATABASE_URL` (veja `backend/.env.example`): com a API **local** o host é `localhost`; com a API **no Docker** o host é `db` (o compose já força isso).

```bash
docker compose up -d db                              # sobe só o banco
uv --directory backend run alembic upgrade head      # aplica as migrations (API local)
docker compose exec api alembic upgrade head         # aplica as migrations (API no Docker)
```

Outros comandos úteis do Alembic (a partir da raiz, com `uv --directory backend run`):

```bash
alembic current                                      # versão aplicada
alembic downgrade -1                                 # desfaz a última migration
alembic revision --autogenerate -m "descricao"       # gera migration a partir dos models (revise o arquivo!)
```

**Liveness × readiness.** `/health` (liveness) só diz que o processo responde; não toca no banco, então não cai se o banco cair, e um orquestrador não reinicia a API à toa. `/health/ready` (readiness) executa `SELECT 1`: devolve `200` se o banco responde e `503` (formato padrão de erro) se não, indicando que a API ainda não deve receber tráfego.

**Consultar as tabelas pelo terminal:**

```bash
docker compose exec db psql -U vocalize -d vocalize
```

Três comandos úteis dentro do `psql`:

| Comando | O que faz |
|---|---|
| `\dt` | lista as tabelas |
| `\d users` | mostra colunas, constraints e índices de uma tabela |
| `SELECT * FROM users LIMIT 10;` | consulta linhas (termine com `;`; `\q` sai) |

Para apagar o banco e começar do zero: `docker compose down -v` (o `-v` remove o volume) e aplique as migrations de novo.

### Testes e checks

Os testes de integração sobem um PostgreSQL 16 temporário com Testcontainers, aplicam as migrations e isolam cada teste com rollback: **o Docker Desktop precisa estar aberto**. Os testes sem banco continuam rápidos e independentes.

```bash
uv --directory backend run pytest                    # todos (com banco)
uv --directory backend run pytest -m "not integration"   # só os rápidos, sem Docker
uv --directory backend run ruff check .
uv --directory backend run ruff format --check .
uv --directory backend run mypy
```

### Estrutura do backend

```
backend/app/
  api/v1/        rotas finas (validam e chamam services)
  services/      regras de negócio
  domain/        lógica pura, sem I/O
  repositories/  acesso ao banco (sem commit: quem comanda a transação é o service)
  models/        tabelas (SQLAlchemy)
  schemas/       formatos de entrada e saída (Pydantic)
  clients/       integrações externas (IA, Fase 10)
  core/          configuração, logs e erros
```

Erros seguem sempre `{"error": {"code": "...", "message": "..."}}`. Configuração por variáveis de ambiente (`APP_ENV`, `CORS_ORIGINS`, `LOG_LEVEL`, `DATABASE_URL`); em desenvolvimento o frontend em `http://localhost:5173` a `5199` já é aceito pelo CORS.

## Dados falsos (mock) e camada de serviços

Nesta fase não há backend: tudo vem de dados falsos, mas organizado para ser trocado pela API real.

```
frontend/src/
  types/      tipos do domínio (User, Session, Turn, TranscriptionResult, Stats, ...)
  data/       situações (id, nome, contexto, ícone, layout, personagem por sotaque, introdução)
  mocks/      dados falsos coerentes entre si (usuária B1 com 3 semanas de histórico)
  services/   única porta de entrada para dados; hoje devolvem mocks com atraso simulado
```

**Regra:** as telas **nunca** importam `mocks/`, só `services/`. Nas próximas fases troca-se apenas a implementação dos serviços.

Para criar uma situação nova basta acrescentá-la em `data/scenarios.ts` e criar o banco de falas em `mocks/bank.ts`; a tela de prática escolhe o layout (`training` ou `chat`) pelo campo `layout`. A lógica da sessão fica num único hook (`hooks/usePracticeSession.ts`) usado pelos dois layouts. No mock, cerca de 10% das próximas falas falham de propósito para exercitar o estado de erro.

O login é simulado: qualquer e-mail entra como a usuária de demonstração (com histórico). Uma conta criada em **Cadastro** começa sem histórico, então mostra os estados vazios. Os dados ficam no `localStorage` do navegador.

Para testar os estados de erro e vazio, abra qualquer tela da área logada com `?mock=` na URL (a escolha fica salva na aba até `?mock=normal`):

| URL | Efeito |
|---|---|
| `/app/estatisticas?mock=erro` | toda chamada de dados falha (tela de erro com "Tentar de novo") |
| `/app/estatisticas?mock=vazio` | listas voltam vazias (estado vazio) |
| `/app?mock=normal` | volta ao normal |

## O que ver no navegador

Rotas públicas: `/` (landing), `/login`, `/cadastro`. Todas as rotas `/app/*` exigem login.

- `/cadastro` e `/login` — validação (e-mail, senha de 8+ caracteres, confirmação). Ao entrar o usuário vai direto ao onboarding (conta nova) ou ao início.
- `/app/onboarding` — sotaque (o tema muda na hora) e teste de nivelamento: 6 perguntas fixas de múltipla escolha em inglês, resultado com nível, acertos por nível e revisão. Dá para escolher o nível na mão (A2–C1) ou ajustar o do teste. A lógica fica em `src/domain/placement.ts` (funções puras) e as perguntas em `src/data/placementQuestions.ts`.
- `/app` — saudação do modo, sequência, nível, recomendação, "Praticar agora", últimas sessões e palavras para revisar.
- `/app/praticar` — escolha da **situação** (restaurante, conversa na rua, aeroporto, hotel, compras, entrevista, bate-papo virtual), nível e sotaque.
- `/app/praticar/:sessaoId` — introdução da situação e botão "Começar"; depois o layout definido nos dados da situação:
  - **Treino** (situações presenciais): tela focada com player (forma de onda, play/pause, voltar 3 s, repetir, 0.75×), transcrição, resultado palavra por palavra, resposta e correção, roteiro lateral recolhível e atalhos de teclado (Ctrl+Espaço, Ctrl+R, Ctrl+S, Enter).
  - **Chat** (bate-papo virtual): conversa por mensagens de voz numa moldura de celular (tela inteira no celular).
  - Não há roteiro fixo: as falas chegam uma a uma e de forma assíncrona (com "preparando a próxima fala…" e "Tentar de novo"), de 3 a ~30 palavras, e a sessão termina em "Encerrar" ou no limite de rodadas (`DEFAULT_MAX_TURNS`). Ainda **sem áudio** (a reprodução é simulada).
- `/app/praticar/:sessaoId/resumo` — resumo da sessão.
- `/app/estatisticas` — gráficos (Recharts) com filtro de 7 dias, 30 dias ou tudo.
- `/app/revisao` — flashcards com avaliação (Errei, Difícil, Bom, Fácil).
- `/app/perfil` — dados, edição de nível/sotaque, "Nível definido por teste em DD/MM/AAAA", "Refazer teste de nivelamento" e "Sair".
- Seletor **US / UK** no cabeçalho troca o tema; em telas pequenas o menu vira hambúrguer.

## Decisões de arquitetura

Registradas em [`docs/decisions/`](docs/decisions/):

- [0001 — Monorepo](docs/decisions/0001-monorepo.md)
- [0002 — Vite + React + React Router](docs/decisions/0002-vite-react-router.md)
- [0003 — Temas com variáveis CSS e Tailwind v4](docs/decisions/0003-temas-css-variables-tailwind.md)
- [0004 — TypeScript fixado na série 6.0](docs/decisions/0004-typescript-6.md)
- [0007 — FastAPI e arquitetura em camadas](docs/decisions/0007-fastapi-arquitetura-em-camadas.md)
- [0010 — CI com GitHub Actions](docs/decisions/0010-ci-github-actions.md)

## Licença

Veja [LICENSE](LICENSE).
