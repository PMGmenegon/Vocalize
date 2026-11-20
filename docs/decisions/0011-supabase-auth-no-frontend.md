# 0011 — Supabase Auth no frontend

**Status:** aceita

## Contexto
Login e cadastro eram simulados (mock no navegador). Precisamos de autenticação real, com confirmação de e-mail, recuperação de senha e login com Google, sem montar e manter um sistema de contas próprio. A Fase 8 levará o perfil de estudo para o backend FastAPI, que precisará saber quem é o usuário.

## Decisão
- **Supabase Auth** (e-mail e senha com confirmação de e-mail; Google opcional) usado direto pelo frontend com `@supabase/supabase-js`. Sessão persistente e renovação automática do token são o padrão do SDK.
- **`authService` na camada de serviços** (`src/services/authService.ts`): interface própria (`signUp`, `signIn`, `signInWithGoogle`, `signOut`, `getSession`, `onAuthStateChange`, `requestPasswordReset`, `updatePassword`, `resendConfirmation`) com uma implementação Supabase. Telas e componentes nunca importam o SDK; o cliente é criado em um único lugar (`src/lib/supabase.ts`), sob demanda, com erro claro se as variáveis `VITE_SUPABASE_*` faltarem. Trocar de provedor ou usar um falso nos testes é trocar a implementação.
- **Erros traduzidos em um único lugar** (`services/authErrors.ts`): o SDK devolve mensagens em inglês; a interface só vê `AuthFailure` com código e texto em português.
- **Estado**: `AuthProvider` (Context) + `useAuth()`, com carregamento inicial discreto para não piscar a tela de login a quem já está logado.
- **Somente a chave pública** (publishable/anon) no frontend. A chave secret/`service_role` nunca entra no frontend nem no Git.
- **Rotas protegidas são experiência do usuário, não segurança.** `/app/*` redireciona visitantes para `/login` (guardando a rota pretendida) e login/cadastro redirecionam quem já tem sessão, mas qualquer pessoa pode alterar o código do navegador. A segurança real será a **validação do JWT do Supabase no backend (Fase 8)**.
- **Perfil de estudo** (nível, sotaque, "onboarding concluído") continua mock, guardado por id do usuário logado (`profileService`), até a Fase 8.
- **Regra de senha** igual à do Supabase (8+ caracteres, letras e números), validada no cliente em `lib/password.ts` para dar mensagem clara antes de chamar a API.
- **Porta do Vite fixa em 5173** (`strictPort`): Site URL e Redirect URLs do Supabase dependem dela.
- **Testes e CI sem chaves reais**: `AuthProvider` aceita um serviço por parâmetro; os testes usam um `authService` falso e o workflow define valores fictícios.

## Alternativas consideradas
- **Autenticação própria no backend** (senhas, e-mails, tokens) — mais controle, muito mais código e superfície de risco.
- **Chamar o Supabase nas telas** — mais rápido, mas espalha o SDK e impede trocar a implementação ou testar com falsos.
- **Proteger dados só pelas rotas do frontend** — enganoso; por isso o backend validará o JWT.

## Consequências
- Cadastro exige confirmar o e-mail (há tela e reenvio); o e-mail embutido do Supabase tem limite de envios, tratado com mensagem própria.
- Contas novas começam sem histórico: o histórico falso era só da usuária de demonstração antiga.
- Na Fase 8 o frontend envia o token da sessão ao backend e o perfil sai do mock.
