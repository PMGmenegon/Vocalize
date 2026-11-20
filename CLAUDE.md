# CLAUDE.md — Vocalize

Instruções permanentes do projeto. Detalhes longos ficam no [README](README.md) e nos [ADRs](docs/decisions/); aqui só o essencial.

## 1. Visão geral

Vocalize é um app web para **aprender inglês ouvindo e conversando**: a IA fala em inglês (texto escondido), o usuário transcreve o que ouviu, vê os erros palavra por palavra e responde para continuar a conversa. Interface em português (Brasil); conteúdo de estudo em inglês. Dois temas por sotaque: **US** e **UK**.

- **Frontend:** React + Vite + TypeScript (strict) + Tailwind v4 + React Router + Recharts + Vitest.
- **Backend:** FastAPI + SQLAlchemy (async) + asyncpg + Alembic + PostgreSQL 16; uv, ruff, mypy (strict), pytest + Testcontainers.

## 2. Estrutura do monorepo

- `frontend/` — app React (`src/` com `pages`, `components/ui`, `services`, `mocks`, `data`, `domain`, `hooks`, `audio`, `types`, `theme`).
- `backend/` — API FastAPI (`app/`), migrations (`alembic/`), testes (`tests/`), `Dockerfile`.
- `docs/` — `design-system.md` e `decisions/` (ADRs numerados).
- `.github/` — workflows de CI (`backend.yml`, `frontend.yml`) e Dependabot.
- `docker-compose.yml` — API + PostgreSQL 16.

## 3. Comandos (sempre a partir da raiz)

```bash
# Frontend
npm --prefix frontend install
npm --prefix frontend run dev
npm --prefix frontend run lint
npm --prefix frontend run typecheck
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix frontend run check:contrast     # contraste WCAG AA dos dois temas

# Backend (local; precisa de backend/.env, copie de backend/.env.example)
uv --directory backend sync
uv --directory backend run uvicorn app.main:app --reload
uv --directory backend run pytest                        # todos (Docker aberto)
uv --directory backend run pytest -m "not integration"   # rápidos, sem Docker
uv --directory backend run ruff check .
uv --directory backend run ruff format --check .
uv --directory backend run mypy

# Backend com Docker e banco
docker compose up --build                    # API + banco
docker compose up -d db                      # só o banco
docker compose down                          # para tudo (mantém o volume)

# Migrations
uv --directory backend run alembic upgrade head
uv --directory backend run alembic revision --autogenerate -m "descricao"
docker compose exec api alembic upgrade head   # com a API no Docker
```

O CI roda esses mesmos checks (ver [ADR 0010](docs/decisions/0010-ci-github-actions.md)).

## 4. Regras de trabalho

**Fluxo Git obrigatório**
1. Nunca commitar na `main`. Atualize-a (`git switch main`, `git pull`) e crie **uma branch por tarefa** com prefixo `feat/`, `fix/`, `docs/`, `chore/` ou `refactor/`.
2. Commits em **Conventional Commits** (`feat:`, `fix:`, `docs:`, `build:`...).
3. Push e PR com `gh pr create` (título também em Conventional Commits).
4. Acompanhar o CI (`gh pr checks --watch`) e corrigir se falhar.
5. Merge com `gh pr merge --squash --delete-branch`.
6. Voltar para a `main` atualizada e **informar o link do PR**.

**Outras regras**
- **Nunca** adicionar `Co-Authored-By`, "Generated with Claude Code" ou qualquer atribuição ao Claude em commits ou PRs.
- Não usar `cd` combinado com outras operações. Preferir `uv --directory backend ...` e `npm --prefix frontend ...`.
- Não encerrar processos do usuário nem alterar o PATH do sistema: **avisar** o usuário.
- Rodar os checks relevantes (lado alterado) antes de abrir o PR.
- Nunca commitar `.env` com valores reais.

## 5. Regras de frontend

- **Camada de serviços:** telas e componentes **nunca** importam `mocks/`; só `services/`. Trocar mock por API real = trocar a implementação do serviço.
- **Design system:** siga [docs/design-system.md](docs/design-system.md). Use os tokens de cor (`canvas`, `ink`, `muted`, `line`, `brand`, `accent`...) e as classes de tipografia (`type-eyebrow`, `type-display`...), nunca cores/tamanhos soltos. Poucos cards: tente `Section` + `List` antes de uma caixa. Temas **US/UK** via `data-theme` (ADR [0003](docs/decisions/0003-temas-css-variables-tailwind.md)); ao mexer em cores, rode `check:contrast`.
- **Acessibilidade (WCAG AA):** tudo operável por teclado, foco sempre visível, alvos de 44px, um `h1` por página, mudanças dinâmicas com `aria-live="polite"`/`role="status"` e erros com `role="alert"`, nada dependendo só de cor, conteúdo em inglês com `lang="en"`.
- **Idioma:** interface 100% em português, sem palavras em inglês soltas. Inglês só como conteúdo do exercício (falas, transcrições, perguntas do teste, flashcards).
- **Tema ≠ sotaque:** o tema visual é independente do sotaque de estudo e só muda pelo seletor. `Theme` ('us' | 'uk', `src/theme`, `useTheme`) é preferência visual salva no navegador; `Accent` ('en-US' | 'en-GB', `src/types`) é o sotaque de estudo do perfil e define só a voz. Onboarding, login, perfil e sessão de prática nunca chamam `setTheme`.
- **Autenticação:** sempre via `services/authService.ts` (Supabase Auth); telas e componentes nunca importam `@supabase/supabase-js` nem `lib/supabase.ts`. Erros do Supabase são traduzidos em um único lugar (`services/authErrors.ts`). O frontend usa **somente a chave pública** (publishable/anon, em `frontend/.env.local`, que nunca é commitado); a chave secret/`service_role` jamais entra no frontend. Rotas protegidas são só experiência do usuário: a segurança real é o JWT validado no backend (Fase 8). Senha: 8+ caracteres com letras e números (`lib/password.ts`). A porta do Vite é fixa em 5173.
- **Login e cadastro:** têm layout próprio. **Não alterar** sem pedido explícito.
- **Áudio:** sempre pela abstração em `src/audio/` (`SpeechPlayer`, hook `useSpeechPlayer`, reconhecimento em `recognition.ts`); componentes não chamam `speechSynthesis` direto ([ADR 0005](docs/decisions/0005-audio-web-speech.md)).

## 6. Regras de backend

Arquitetura em camadas ([ADR 0007](docs/decisions/0007-fastapi-arquitetura-em-camadas.md)), em `backend/app/`:

| Camada | Papel |
|---|---|
| `api/v1/` | rotas finas: validam entrada e chamam services |
| `services/` | regras de negócio; comandam a transação (commit) |
| `domain/` | lógica pura, sem I/O |
| `repositories/` | acesso ao banco, sem commit |
| `models/` | tabelas SQLAlchemy |
| `schemas/` | formatos de entrada/saída (Pydantic) |
| `clients/` | integrações externas (IA, Fase 10) |
| `core/` | configuração, logs e erros |

- Lógica pura (ex.: comparação do ditado) vai em `domain/` **com testes**.
- **Formato padrão de erro:** `{"error": {"code": "...", "message": "..."}}`, sempre.
- **Migrations sempre via Alembic.** Nunca alterar o banco na mão; **revise o arquivo gerado** pelo `--autogenerate` antes de commitar ([ADR 0008](docs/decisions/0008-sqlalchemy-alembic-asyncpg.md)).
- **Situações e interlocutores ficam no código, não no banco**; o banco guarda só os ids e a cena sorteada ([ADR 0009](docs/decisions/0009-situacoes-e-interlocutores-no-codigo.md)).
- Testes de integração usam Testcontainers (Docker aberto); marque-os com `integration`.

## 7. Decisões importantes

Todas em [docs/decisions/](docs/decisions/). As que mais pesam:

- **Respostas da conversa avaliadas por IA** ([0006](docs/decisions/0006-avaliacao-de-respostas-por-ia.md)): não existe "resposta correta". A IA devolve um `ReplyFeedback` em JSON validado (coerência, adequação ao nível, frase corrigida, pontos de melhoria, sugestões). Sem notas punitivas.
- **Ditado = comparação exata por algoritmo**, palavra por palavra, **sem IA**. Hoje em `src/domain/transcription.ts`; na Fase 9 o backend vira a fonte oficial.
- **Próximas fases:** Fase 9 (backend compara o ditado) e Fase 10 (IA avalia respostas e gera o diálogo). Até a Fase 10 o serviço devolve uma avaliação neutra simulada.
- **Supabase Auth no frontend** ([0011](docs/decisions/0011-supabase-auth-no-frontend.md)): authService na camada de serviços; onboarding concluído ainda é mock (vai para o backend na Fase 8).
- Outras: [0001](docs/decisions/0001-monorepo.md) monorepo, [0002](docs/decisions/0002-vite-react-router.md) Vite + React Router, [0004](docs/decisions/0004-typescript-6.md) TypeScript 6.0, [0010](docs/decisions/0010-ci-github-actions.md) CI.

Ao tomar uma decisão arquitetural nova, registre um ADR numerado em `docs/decisions/`.

## 8. Ao terminar uma tarefa

- Explique **o que mudou** e **como testar**.
- **Pare.** Não avance para a próxima fase/tarefa sem aprovação do usuário.
