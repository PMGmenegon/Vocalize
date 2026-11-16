# 0006 — Avaliação das respostas da conversa por IA (Fase 10)

**Status:** aceita (implementação na Fase 10; até lá o serviço devolve uma avaliação neutra simulada)

## Contexto
Numa conversa não existe uma única resposta correta: várias respostas são válidas para a mesma fala do personagem. Comparar a resposta do usuário com um gabarito e marcar como erro tudo o que for diferente está errado.

## Decisão
- Na Fase 10, a IA analisa a resposta do usuário considerando o **contexto da conversa** e o **nível do usuário**, e devolve um `ReplyFeedback` (`src/types/`) em **JSON validado**:
  - `coherence` (`coherent` | `partially_coherent` | `off_topic`): a resposta faz sentido como continuação da conversa?
  - `levelFit` (`below` | `at` | `above`): está adequada ao nível do usuário?
  - `correctedReply`: a frase **do próprio usuário** com os erros de gramática/vocabulário corrigidos, mantendo a ideia dele (`null` se não há erros);
  - `issues`: pontos de melhoria, cada um com categoria (`verb_tense`, `preposition`, `article`, `word_order`, `vocabulary`, `spelling`, `other`) e explicação curta em português;
  - `suggestedReplies`: 1 ou 2 respostas naturais para aquele momento, no nível do usuário;
  - `comment`: comentário curto e encorajador, em português.
- A interface não mostra notas punitivas nem "resposta correta"; mostra "Sua resposta", "Sua frase corrigida", "Pontos de melhoria" e "Respostas sugeridas".
- **A transcrição (ditado) não muda:** continua com comparação exata palavra por palavra, feita por algoritmo (`src/domain/transcription.ts`), sem IA.

## Consequências
- Até a Fase 10, `sessionService.submitReply` devolve uma avaliação neutra (`coherent`, `at`, sem correções), com as sugestões tiradas dos dados mock da fala. Ele não julga a resposta.
- A resposta da IA precisa ser validada contra o formato de `ReplyFeedback` antes de chegar à tela.

## Interlocutores e cenas por sessão (geração do diálogo na Fase 10)
Cada situação tem vários interlocutores (`Interlocutor` em `src/types/`: `role`, `userRole`, `context`, `scenes`). O usuário escolhe só a situação, o nível e o sotaque.

- **Hoje (mock):** ao iniciar a sessão, `drawInterlocutor` (`src/services/drawInterlocutor.ts`, função pura com a aleatoriedade injetada) sorteia um interlocutor da situação e uma cena dele; o diálogo vem de `src/mocks/bank.ts` (4 a 6 rodadas por interlocutor). Interlocutor e cena ficam fixos até o fim da sessão.
- **Fase 10:** ao iniciar a sessão, o **backend** escolhe o interlocutor e a cena da situação (podendo variar e até criar cenas novas), e a **IA gera o diálogo** rodada a rodada a partir de `situation`, `interlocutor.role`, `interlocutor.userRole`, `interlocutor.context`, da cena, do nível e do sotaque. Assim as conversas nunca se repetem.
- Funções e cenas são neutras em gênero, pois a voz pode ser masculina ou feminina. Estatísticas continuam por situação (não por interlocutor).
