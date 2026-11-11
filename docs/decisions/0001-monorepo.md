# 0001 — Monorepo com `frontend/`, `backend/` e `docs/`

**Status:** aceita

## Contexto
O Vocalize terá um frontend (React) e um backend (FastAPI) que evoluem juntos. É um projeto de portfólio: quem avalia quer abrir **um** repositório e entender tudo.

## Decisão
Um único repositório com três pastas: `frontend/`, `backend/` (vazia até a fase do backend) e `docs/` (ADRs e documentação). Cada app tem seu próprio gerenciador de pacotes e configuração; não há ferramenta de monorepo (Nx, Turborepo...).

## Alternativas consideradas
- **Dois repositórios** — isolamento total, mas mudanças que cruzam front e back viram dois PRs, e quem avalia precisa abrir dois links.
- **Monorepo com ferramenta (Nx/Turborepo/pnpm workspaces)** — cache e scripts compartilhados, mas aqui há só um pacote JS e um Python: a ferramenta seria complexidade sem ganho.

## Consequências
- Um commit pode atravessar front e back; o histórico conta a história completa.
- O CI (fase futura) precisa de jobs separados por pasta.
- O `.gitignore` da raiz cobre Node e Python.
