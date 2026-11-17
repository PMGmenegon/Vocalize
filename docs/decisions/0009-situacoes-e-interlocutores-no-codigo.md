# 0009 — Situações e interlocutores como dados no código, não no banco

**Status:** aceita

## Contexto
O Vocalize tem situações de prática (hotel, restaurante, aeroporto...) e interlocutores (personagens por sotaque). Eles aparecem no frontend como dados (`data/scenarios.ts`) e serão usados pelo backend para montar os prompts da IA.

## Decisão
Situações e interlocutores **não são tabelas**. Continuam como dados versionados no código; o banco guarda apenas os **ids** em texto (`sessions.situation_id`, `sessions.interlocutor_id`) e a cena sorteada (`sessions.scene`), que fica gravada para o histórico não mudar se o texto da situação for editado.

## Alternativas consideradas
- **Tabelas `situations` e `interlocutors`** — permitiriam editar pelo banco, mas exigem migration/seed a cada mudança de conteúdo, não há administração prevista e o conteúdo (prompts, layout, ícones) acompanha o código.

## Consequências
- Mudar ou criar uma situação é um commit normal, revisado e testado; sem migration.
- Não há chave estrangeira para situações: a validação do id é feita pela aplicação (service/schema), não pelo banco.
- Se um id for removido do código, sessões antigas ainda o referenciam; ao remover uma situação, o código deve manter um rótulo de fallback para o histórico.
- Se um dia houver painel de administração, migrar para tabelas é possível, pois os ids já são estáveis.
