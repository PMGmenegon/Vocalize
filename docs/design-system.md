# Design system do Vocalize

O padrão nasceu na página de escolha da prática (`/app/praticar`) e vale para todo o app, exceto **login e cadastro**, que têm layout próprio (lateral de identidade) e não seguem este documento.

## Princípios

1. **Editorial, não "dashboard".** Poucos cards. Estrutura vem de títulos em etiqueta, linhas finas e espaço em branco.
2. **Uma hierarquia só.** Etiqueta (eyebrow) → título serifado → texto de apoio → dados. Toda página abre do mesmo jeito.
3. **Linha escura separa seções; linha clara separa itens.** `border-ink` embaixo do título de seção, `border-line` entre linhas de lista.
4. **Cor com propósito.** Vinho (US) ou azul-marinho (UK) = `brand`: etiquetas de destaque, ícones, seleção e botão principal. O outro lado da bandeira = `accent`, usado só em detalhes (foco, logo, destaques pontuais).
5. **Português na interface.** Inglês só aparece quando é o conteúdo do exercício (falas, transcrições, perguntas do teste, palavras dos flashcards). Nunca como enfeite ou etiqueta. Inglês dentro de explicação sempre vem acompanhado de texto em português.
6. **Nada depende só de cor.** Acerto/erro levam símbolo (✓ ✗) e texto, não só verde/vermelho.
7. **Movimento sutil e opcional.** Transições curtas de cor/posição. `prefers-reduced-motion` zera tudo (regra global em `index.css`).

## Tokens

Definidos em `src/index.css` e trocados pelo atributo `data-theme` (`us` | `uk`) no `<html>`. O contraste de todos os pares é verificado por `npm run check:contrast`.

| Token | Uso |
| --- | --- |
| `canvas` | fundo da página e das barras fixas |
| `surface` | seleção e áreas rebaixadas (linha selecionada, faixa de destaque) |
| `card` | só campos de formulário e tooltips (evite caixas) |
| `ink` / `muted` | texto principal / de apoio; `ink` também é a linha de título de seção |
| `line` | divisórias finas |
| `brand` / `brand-strong` / `on-brand` | cor dominante do tema, hover e texto sobre ela |
| `accent` | cor secundária do tema (detalhes) |
| `ok` / `danger` (+ `on-ok`, `on-danger`) | acerto e erro, iguais nos dois temas |
| `focus` | anel de foco (3px, sempre visível) |

### Tipografia

| Classe / combinação | Onde |
| --- | --- |
| `type-eyebrow` | etiquetas: nome da área, títulos de seção, rótulos de dado |
| `type-display text-4xl sm:text-5xl` | título da página (h1) |
| `type-display text-3xl` | título de destaque dentro da página, estados vazio/erro |
| `type-display text-2xl` | título de painel |
| `text-lg text-muted` | descrição sob o título |
| `text-ink` / `text-sm text-muted` | corpo / apoio |
| `text-xl font-black` | números de cabeçalho (`Stat`); `text-4xl` nas faixas de resumo |

### Espaçamento e grid

* Contêiner: `Page` (`max-w-6xl`, `px-4 sm:px-6`, `py-8 sm:py-12`). `Page narrow` (`max-w-3xl`) para fluxos de uma coluna (onboarding, resumo, perfil).
* Duas colunas: `grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_23rem]` (lista + painel de detalhes).
* Entre seções: `space-y-10` (ou `mt-10`). Entre cabeçalho e conteúdo: `mb-8 sm:mb-10` (já no `PageHeader`).

## Componentes (`src/components/ui`)

| Componente | Quando usar |
| --- | --- |
| `Page`, `PageHeader` | toda página da área logada. Etiqueta + título + descrição + `stats` + `action` |
| `Stat`, `StatList` | números curtos. `StatList` solto no cabeçalho; `StatList divided` + `Stat large divided` para faixas de resumo entre duas linhas finas |
| `Section` | grupo de conteúdo com título em etiqueta e linha escura. Aceita `meta` (contagem) e `action` |
| `List`, `ListItem` | linhas com divisórias finas: título, apoio, ícone à esquerda, valor à direita |
| `DetailPanel` | coluna lateral fixa (desktop) com linha à esquerda; em telas estreitas vira bloco no fluxo |
| `StickyActionBar` | decisão final da página (começar sessão, salvar, continuar). Resumo à esquerda, ação à direita |
| `EmptyState`, `ErrorState`, `Skeleton` | estados de vazio, erro e carregamento, via `Async`. Sem caixas: linhas finas e título serifado |
| `ChoiceGroup` | escolha única com rádios nativos: `list` (linhas, padrão para opções longas) e `pill` (poucas opções curtas) |
| `ProgressBar` | progresso fino; sempre com `label` e `valueText` |
| `Button` | primário (ação principal, uma por tela), `secondary`, `ghost`, `danger` |

Regra prática: se você pensou em um card, tente primeiro `Section` + `List`, ou uma faixa entre duas linhas finas. Caixas com fundo só para o que é conteúdo "elevado" de verdade (campo de formulário, bolha de chat).

## Estados e microinterações

* **Seleção:** fundo `surface`, barra de 4px `brand` à esquerda e "✓ Selecionada" (`ScenarioRow`).
* **Hover:** fundo `surface` suave nas linhas; botões trocam de cor (`brand-strong`).
* **Foco:** `:focus-visible` global, 3px, cor `focus`. Linhas clicáveis usam `has-[:focus-visible]` para mostrar o anel no item inteiro.
* **Entrada de conteúdo:** `fade-swap` (6px, 450ms) quando o painel troca de conteúdo; `rise`/`reveal` só na landing. Tudo some com `prefers-reduced-motion`.

## Acessibilidade

* Um `h1` por página; seções com `aria-labelledby` (o `Section` exige `id`).
* Mudanças dinâmicas anunciadas com `role="status"` / `aria-live="polite"`; erros com `role="alert"`.
* Alvos de toque de pelo menos 44px nos controles principais.
* Conteúdo em inglês marcado com `lang="en"`.
