# 0010 — CI com GitHub Actions

**Status:** aceita

## Contexto
O monorepo tem frontend (React/Vite) e backend (FastAPI, com testes de integração que usam Docker). Antes, os checks só rodavam na máquina de quem desenvolve. O repositório é público e o desenvolvimento é solo, com fluxo por pull requests.

## Decisão
- **GitHub Actions**, com **dois workflows** independentes: `backend.yml` (job "Backend checks") e `frontend.yml` (job "Frontend checks").
- **Sempre executados**: disparam em push na `main` e em todo PR para a `main`, **sem filtro de pastas**. Com filtro, um PR que não toca a pasta nunca receberia o check, e um check obrigatório que não roda bloqueia o merge para sempre. O custo extra é pequeno.
- **Nomes de job estáveis** ("Backend checks", "Frontend checks"): são os nomes usados como checks obrigatórios na proteção da `main`; renomear quebra a proteção.
- **Fail fast**: do mais barato ao mais caro (ruff → format → mypy → pytest; lint → typecheck → testes → build → contraste).
- **Cache**: uv (por `backend/uv.lock`) e npm (por `frontend/package-lock.json`). Instalação reprodutível com `uv sync --frozen` e `npm ci`.
- **Testcontainers no runner**: o `ubuntu-latest` já tem Docker, então os testes de integração rodam como localmente, sem service container separado.
- **Boas práticas**: `permissions: contents: read`, `timeout-minutes`, `concurrency` cancelando execuções antigas da mesma branch e actions fixadas em versão major.
- **Dependabot** semanal para npm (`/frontend`), uv (`/backend`) e github-actions (`/`), com atualizações minor/patch agrupadas num PR só.
- **Fluxo**: branch por tarefa → pull request → CI verde → **squash merge** (histórico linear, um commit por PR, branch apagada).

## Alternativas consideradas
- **Workflows com `paths:`** — menos execuções, mas incompatíveis com checks obrigatórios (ver acima).
- **Um workflow único** — mais simples, mas um erro num lado esconde o resultado do outro e os checks ficam menos granulares.
- **Fixar actions por SHA** — mais seguro contra supply chain, porém mais trabalho; o Dependabot já mantém as versões major atualizadas. Pode ser reavaliado.
- **Service container do Postgres** — evitaria Docker no teste, mas divergiria do ambiente local e do Testcontainers.

## Consequências
- Todo PR espera o CI (alguns minutos, principalmente por causa dos testes de integração).
- Falhas só no CI devem ser reproduzidas com os mesmos comandos dos workflows.
- A proteção da branch (checks obrigatórios) é configurada manualmente no GitHub.
