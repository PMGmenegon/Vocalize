# 0003 — Temas US/UK com variáveis CSS, `data-theme` e Tailwind v4

**Status:** aceita

## Contexto
O visual tem duas variações (US e UK), escolhidas só pelo seletor US/UK; o tema é independente do sotaque de estudo do perfil (que define apenas a voz). As duas bandeiras usam vermelho, azul e branco, então os temas precisam se diferenciar pelo tom dominante (vermelho × azul-marinho) e por detalhes gráficos (estrelas e listras × cruz). Os textos e botões precisam de contraste WCAG AA nos dois.

## Decisão
- Cada tema é um conjunto de **variáveis CSS** (`--brand`, `--accent`, `--ink`...) definido sob `html[data-theme="us"|"uk"]` em `src/index.css`.
- O Tailwind v4 expõe essas variáveis como utilitários (`bg-brand`, `text-ink`...) via `@theme inline`, então **os componentes não conhecem o tema** — só usam nomes semânticos.
- Um `ThemeContext` guarda o tema (`us` | `uk`), grava `data-theme` no `<html>` e persiste em `localStorage`. Um script inline no `index.html` aplica o tema salvo antes do React carregar, evitando "piscar" no tema errado.
- O contraste é verificado por `npm run check:contrast`, que lê os tokens do próprio CSS.

## Alternativas consideradas
- **Classes `dark:`-style / duas folhas de estilo** — duplicam estilos por componente.
- **Variantes do Tailwind por tema em cada componente** (`us:bg-red-700 uk:bg-blue-900`) — espalha a decisão de cor por todo o código.
- **CSS-in-JS com ThemeProvider** — troca de tema em runtime, mas adiciona dependência e custo de JS sem necessidade.

## Consequências
- Trocar de tema não re-renderiza a árvore: o navegador só recalcula o CSS.
- Mudar uma cor é editar um token; o script de contraste avisa se algum par deixar de passar.
- Novos temas (ex.: modo escuro) cabem no mesmo mecanismo.
