# 0008 — SQLAlchemy 2.0 + Alembic + asyncpg para a persistência

**Status:** aceita

## Contexto
A API (FastAPI, assíncrona) precisa persistir usuários, sessões de prática, turnos e palavras erradas em PostgreSQL 16, com esquema versionado e testável.

## Decisão
- **SQLAlchemy 2.0** (estilo `Mapped`/`mapped_column`) como ORM, com `AsyncSession`.
- **asyncpg** como driver (`postgresql+asyncpg://...`): combina com o modelo assíncrono do FastAPI e não bloqueia o event loop.
- **Alembic** para migrations, em modo assíncrono, lendo `DATABASE_URL` das settings e os metadados dos models. O esquema só muda por migration; testes verificam upgrade, downgrade e que os models não divergem das migrations (`alembic check`).
- Uma sessão por requisição (`get_db`); **commit e rollback ficam nos services**, que decidem onde termina cada operação de negócio. Repositories só fazem `flush`.
- Constraints com **naming convention** (nomes previsíveis) e `CHECK` para valores fixos (nível, sotaque, precisão 0–100): o banco recusa dados inválidos mesmo que a aplicação erre.
- Testes de integração com **Testcontainers** (Postgres 16 real); SQLite não serve, pois o esquema usa JSONB, timestamptz e identity.

## Alternativas consideradas
- **SQLModel** — menos código, mas camada extra sobre SQLAlchemy e menos controle de constraints/índices.
- **SQL puro / asyncpg direto** — máximo controle, mas muito código repetido e sem migrations automáticas.
- **Tortoise/Django ORM** — não se integram tão bem ao restante da stack.
- **psycopg 3 async** — também válido; asyncpg foi escolhido pelo desempenho e uso comum com SQLAlchemy.

## Consequências
- Todo acesso a dados é `async`/`await`; é preciso cuidado com lazy loading (use `selectinload`/consultas explícitas).
- Mudar um model exige gerar e **revisar** uma migration.
- Os testes de integração exigem Docker aberto.

## Índices e motivo de cada um
| Índice | Para quê |
|---|---|
| `sessions (user_id, started_at DESC)` | listar as sessões recentes de um usuário (início, histórico, estatísticas) já na ordem, sem ordenar em memória |
| `turns (session_id)` | carregar os turnos de uma sessão (resumo). O `UNIQUE (session_id, turn_index)` também indexa, mas este índice deixa explícita a consulta mais comum |
| `missed_words (user_id, due_at)` | achar as palavras que vencem para revisão (`due_at <= agora`) de um usuário |
| `level_history (user_id, changed_at DESC)` | mostrar a evolução do nível, da mais recente para a mais antiga |
| `placement_attempts (user_id, created_at DESC)` | buscar a última tentativa do teste de nivelamento ("nível definido em DD/MM/AAAA") |

Todos começam por `user_id` (ou `session_id`) porque toda consulta é filtrada pelo dono; a segunda coluna atende a ordenação/intervalo, evitando um passo de ordenação.
