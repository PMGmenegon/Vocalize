# 0004 — Fixar o TypeScript na série 6.0

**Status:** aceita (revisar quando o `typescript-eslint` suportar 7.x)

## Contexto
O template atual do Vite instalou TypeScript 7.0. O `typescript-eslint` (necessário para o ESLint entender TS) declara como peer dependency `typescript >=4.8.4 <6.1.0`, então `npm install` falhou com `ERESOLVE`.

## Decisão
Fixar `typescript@~6.0.0`, a versão mais nova que o `typescript-eslint` suporta oficialmente.

## Alternativas consideradas
- **`--force` / `--legacy-peer-deps`** — instala, mas esconde uma incompatibilidade real; o linter poderia falhar de forma sutil.
- **Ficar no TS 7 e usar o oxlint (padrão do template)** — o requisito do projeto é ESLint.

## Consequências
- Lint e checagem de tipos usam a mesma versão do compilador, sem avisos.
- Quando o `typescript-eslint` suportar o TS 7, basta subir a versão e rodar `npm run typecheck && npm run lint`.
