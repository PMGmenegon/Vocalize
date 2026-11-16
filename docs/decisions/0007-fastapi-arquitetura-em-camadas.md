# 0007 — FastAPI e arquitetura em camadas no backend

**Status:** aceita

## Contexto
O backend precisa expor uma API JSON para o frontend, validar entradas, falar com um banco (PostgreSQL) e, mais adiante, com uma IA. É um projeto de portfólio: o código deve ser fácil de ler, testar e evoluir por fases.

## Decisão
- **FastAPI** (Python 3.12+) com Pydantic para validação e **documentação OpenAPI automática** em `/docs`.
- **Arquitetura em camadas** dentro de `backend/app/`, com dependências apontando só para baixo:
  - `api/v1/` — rotas finas: recebem, validam e chamam services;
  - `services/` — regras de negócio;
  - `domain/` — lógica pura, sem I/O (fácil de testar);
  - `repositories/` — acesso ao banco;
  - `models/` — tabelas (SQLAlchemy);
  - `schemas/` — formatos de entrada e saída (Pydantic);
  - `clients/` — integrações externas (IA);
  - `core/` — configuração, logs e erros.
- Erros sempre no formato `{"error": {"code", "message"}}`; erros inesperados viram 500 sem expor detalhes.
- `uv` para dependências, Ruff (lint e formatação) e mypy em modo strict.

## Alternativas consideradas
- **Django/DRF** — traz admin, ORM e auth prontos, mas é pesado para uma API pequena e a validação/documentação são menos diretas.
- **Flask** — simples, mas validação, tipos e OpenAPI exigem bibliotecas extras.
- **Tudo nas rotas (sem camadas)** — mais rápido no início, mas mistura HTTP, regra e banco, dificultando testes.

## Consequências
- A lógica de negócio e o domínio podem ser testados sem HTTP nem banco.
- Trocar o banco ou o provedor de IA afeta só `repositories/` ou `clients/`.
- Há mais arquivos e pastas do que o necessário para o tamanho atual; aceitamos esse custo pela clareza futura.
