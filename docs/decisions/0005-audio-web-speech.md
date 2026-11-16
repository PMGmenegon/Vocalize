# 0005 — Voz e áudio no navegador (Web Speech API) atrás de uma abstração

**Status:** aceita (revisar se a qualidade das vozes do navegador não bastar)

## Contexto
O app precisa falar as frases dos personagens e ouvir a resposta do usuário, sem custo de serviços pagos nesta etapa e antes de existir backend.

## Decisão
- **Fala:** `speechSynthesis` (Web Speech API) por trás da interface `SpeechPlayer` (`src/audio/`). Os componentes só usam o hook `useSpeechPlayer`; trocar de motor (ex.: áudio gerado no servidor) é escrever outra implementação da interface.
- **Escolha de voz:** uma lista de preferências por navegador e sotaque em `src/audio/voicePreferences.ts` (Chrome: vozes Google; Safari/iOS: vozes Apple; Edge: vozes "Online (Natural)"; demais: melhor voz do idioma), com fallback para outro sotaque e depois qualquer inglês.
- **Pausa e "voltar":** `pause()`/`resume()` do navegador são pouco confiáveis, e não existe seek. Pausar cancela e retomar recomeça da palavra atual; "voltar ~3 s" recomeça algumas palavras antes (o equivalente a 3 s na velocidade atual).
- **Progresso e duração:** a API não dá o sinal de áudio nem a duração. O progresso segue os eventos de início/fronteira de palavra/fim; se a voz não enviar fronteiras (vozes online do Chrome), avança por tempo estimado (~0,4 s por palavra a 1x). A duração exibida é estimada.
- **Falas longas:** o Chrome corta falas longas, então o texto é falado frase a frase.
- **Ditado:** a comparação real fica em `src/domain/transcription.ts` (Levenshtein por palavra). É temporária no frontend; na Fase 9 o backend passa a ser a fonte oficial.
- **Resposta por voz:** `SpeechRecognition`/`webkitSpeechRecognition` (Chrome, Edge, Safari). Onde não existe (Firefox), o botão some e a digitação continua.

## Consequências
- Custo zero e nenhuma chave de API, mas a qualidade e o suporte variam por navegador e sistema.
- O texto da fala chega ao cliente (só o mock faz isso; com backend a fala virá como áudio).
- O reconhecimento do Chrome e do Edge envia o áudio aos serviços do próprio navegador (Google/Microsoft).
