# Deploy do site Sonar Acusticos

- **Arquitetura:** headless. O site (Vite + React, SPA estatica) e o front-end;
  a Shopify e o back-end de catalogo e checkout.
- **Loja oficial:** `sonaracusticos.myshopify.com` (plano Advanced, BRL, Brasil).
- **Repositorio:** `github.com/CaioNishio/acoustic-canvas`

---

## 0. Storefront token — RESOLVIDO em 28/07/2026

> **Status: funcionando.** O token valido esta no `.env` local (gitignored) e foi
> verificado contra a loja: a `/loja` carrega os 22 produtos e o carrinho gera
> `checkoutUrl` real da Shopify. Falta apenas replicar a variavel nas variaveis
> de ambiente da hospedagem.
>
> Antes de subir qualquer token: `.\scripts\validar-token-shopify.ps1 -Token <valor>`

A secao abaixo fica como referencia para quando o token precisar ser rotacionado.

O site **nao lista produtos** enquanto `VITE_SHOPIFY_STOREFRONT_TOKEN` estiver
vazio.

Este token nao pode ser gerado por ferramenta de IA — o conector Shopify bloqueia
`storefrontAccessTokenCreate` por politica de seguranca. Precisa ser feito no
Admin, uma vez:

1. Admin da loja → **Settings** → **Apps and sales channels**
2. **Develop apps** → selecionar o app (ou **Create an app**, nome sugerido `Sonar Website`)
3. Aba **Configuration** → **Storefront API integration** → **Configure**
4. Marcar os escopos de leitura: `unauthenticated_read_product_listings`,
   `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`,
   `unauthenticated_read_checkouts`
5. **Save** → aba **API credentials** → **Install app**
6. Copiar o **Storefront API access token** (32 caracteres hexadecimais, sem prefixo)

> **Cuidado com o token errado.** Ja houve duas tentativas com valores que nao
> servem: `shpss_...` (API secret key do app) e `atkn_...` (token de outro
> servico). Ambos devolvem 401. O correto nao tem prefixo nenhum.

Onde colocar:

- **Local:** `.env` na raiz do site (ja no `.gitignore`, nunca commitar)
- **Netlify:** Site settings → Environment variables
- **Vercel:** Project Settings → Environment Variables (marcar Production + Preview)

Este token e **publico por design** — roda no navegador do visitante e so le
catalogo. O que **jamais** pode receber prefixo `VITE_` e o Admin API token
(`shpat_...`): esse apareceria no bundle publico do site.

---

## 1. Escolher a hospedagem

As duas estao configuradas no repositorio; e so conectar uma.

| | Netlify (`netlify.toml`) | Vercel (`vercel.json`) |
|---|---|---|
| Custo | Gratis ate 100 GB/mes, **uso comercial permitido** | Hobby e gratis mas **proibe uso comercial** — loja que vende exige Pro (US$ 20/mes) |
| CDN | Boa | Um pouco melhor |
| Banda extra | US$ 55 por 100 GB | Cobrada a parte |

**Recomendacao: Netlify.** O site vende — o free tier da Vercel nao permite uso
comercial nos termos, e o dos modelos 3D e um site de banda alta. A Netlify
resolve os dois pontos sem custo inicial.

### Passos (Netlify)

1. netlify.com → **Add new site** → **Import an existing project** → GitHub
2. Selecionar `CaioNishio/acoustic-canvas`
3. Build command e publish directory ja vem do `netlify.toml` — nao mexer
4. **Environment variables** → adicionar as quatro do `.env.example`
5. **Deploy**

O primeiro deploy sai numa URL `.netlify.app`. **Testar o checkout real nela
antes de apontar o dominio proprio** — se algo estiver errado no fluxo de
pagamento, o problema fica numa URL descartavel em vez de queimar o dominio.

---

## 2. Variaveis de ambiente

Todas em `.env.example`. Nenhuma e segredo forte, mas todas sao necessarias:

| Variavel | Para que serve |
|---|---|
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | Catalogo e carrinho (secao 0) |
| `VITE_SUPABASE_URL` | Back-end de dados (formularios, envio de fotos) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave publica do Supabase |
| `VITE_SUPABASE_PROJECT_ID` | Identificacao do projeto Supabase |

---

## 3. O que ja esta resolvido no repositorio

- **Rewrite SPA** (`netlify.toml` / `vercel.json`): sem ele, `/calculadora`
  acessada direto devolve 404, porque o roteamento vive no React Router.
- **Cache**: assets com hash e modelos 3D com `immutable` por 1 ano;
  `index.html` com `must-revalidate` (senao o navegador serve um HTML velho
  apontando para bundles que ja sumiram).
- **Cabecalhos de seguranca**: `nosniff`, `SAMEORIGIN`, `Referrer-Policy`,
  `Permissions-Policy`. CSP ficou de fora de proposito — o site carrega scripts
  da Shopify e do Supabase, e uma CSP mal calibrada derruba o checkout.
- **CI** (`.github/workflows/ci.yml`): lint, testes e build em todo push e PR.

---

## 4. Ponte catalogo local ↔ Shopify

O site tinha **dois catalogos que nao se falavam**: o local
(`src/data/products.ts`, 50 produtos, usado pela calculadora e por `/produtos`) e
o da Shopify (`/loja`). Um produto recomendado pela calculadora nao virava item
de carrinho.

`src/lib/shopifyCatalog.ts` costura os dois, mapeando slug local → handle Shopify.
`src/hooks/useShopifyPurchase.ts` resolve o `variantId` em runtime e expoe
`addToCart`, entao qualquer tela que conheca o slug consegue vender.

**Estado em 28/07/2026:** 21 dos 50 produtos locais sao compraveis.

Os 29 restantes estao fora de proposito, cada um com motivo declarado:

- **`sob-orcamento` (6):** portas acusticas, projeto 3D, consultoria, visita
  tecnica, integracao com transportadora. Preco depende de projeto — nao vendem
  por carrinho.
- **`nao-publicado` (23):** ainda nao cadastrados na loja. Sao a lista de
  trabalho comercial mais objetiva que existe hoje: cada um e uma venda que o
  site nao consegue fechar.

Caso especial: **`revestimento-ripado`** existe na Shopify, mas com **preco 0,00
e sem SKU**. Deixado fora da compra direta de proposito — um botao "Comprar" que
leva a um checkout de R$ 0,00 e pior do que nao ter botao. Basta corrigir o preco
na loja e mapea-lo.

Um teste (`src/test/shopifyCatalog.test.ts`) trava as duas pontas: se alguem
adicionar produto em `products.ts` e esquecer do mapa, o CI acusa.

---

## 5. Pendencias conhecidas

1. **Replicar `VITE_SHOPIFY_STOREFRONT_TOKEN`** nas variaveis de ambiente da
   hospedagem escolhida (o `.env` local nao vai junto no deploy).
2. **Preco do `revestimento-ripado`** esta 0,00 e sem SKU na Shopify. O site ja
   o mostra como "Sob consulta" com o botao desabilitado (ver
   `src/lib/formatCurrency.ts`), mas isso e rede de seguranca — a correcao de
   verdade e por o preco certo na loja.
3. **Rotacionar credenciais expostas:** a API secret key (`shpss_`) e o Admin API
   token (`shpat_`) foram compartilhados em chat em 28/07/2026. O Admin token e
   chave-mestra da operacao comercial — trocar em Develop apps > API credentials.
3. **Publicar os 23 produtos faltantes** na loja.
4. **Dominio proprio** — decidir e apontar DNS depois do teste na URL provisoria.
5. ~~17 erros de lint pre-existentes~~ — **resolvido em 01/08/2026.** Zerados e o
   `continue-on-error` foi removido do CI; lint vermelho agora e regressao real.
6. **Configurar os secrets do workflow `supabase-deploy.yml`** (ver secao 7) —
   sem eles, migracoes continuam precisando ser aplicadas a mao.
7. **Remover o app "Kilo Code"** da integracao do repositorio, se nao for mais
   usado (ver secao 8) — hoje ele deixa todo PR marcado como `unstable` por
   falta de creditos na conta, sem bloquear o merge de fato.

---

## 6. Peso da build (medido em 28/07/2026)

**`dist` completa: 31,7 MB.** O otimizador de imagens do Vite ja corta 77% no
build (129 MB de origem → 31,7 MB).

Maiores arquivos:

| Tamanho | Arquivo |
|---|---|
| 2,19 MB | `biombo-estudio-em-uso.png` |
| 1,78 MB | `estudio-difusores-produtor.png` |
| 1,14 MB | `nuvem-circular-azul-escuro.png` |
| 1,12 MB | `01-capa.png` |
| 0,80 MB | `OrbitControls.js` (three.js) |

**Leitura para o free tier:** 31,7 MB por visitante que carregue tudo daria
~3.150 visitas dentro dos 100 GB/mes da Netlify. Na pratica e bem mais, porque
ninguem baixa a build inteira numa sessao e o cache `immutable` evita rebaixar
os mesmos assets. Ainda assim, os 4 PNGs acima de 1 MB sao candidatos obvios a
conversao para WebP/AVIF — sozinhos representam ~6 MB, quase 20% da build.

---

## 7. Automacao do banco — `.github/workflows/supabase-deploy.yml`

**Por que isso existe:** em 01/08/2026 o formulario de `/orcamento` ficou
respondendo "configuracao pendente do servidor" em producao porque as
migracoes em `supabase/migrations/` nunca tinham sido aplicadas — elas
existiam so no repositorio. Alguem precisou colar SQL manualmente no
dashboard para destravar. Este workflow fecha esse buraco: a partir de agora,
toda migracao nova e toda mudanca em `supabase/functions/` sao aplicadas
sozinhas ao dar merge na `main`.

**O que ele faz, nessa ordem:**
1. Vincula ao projeto (`supabase link`)
2. `supabase db push` — aplica so as migracoes que ainda nao rodaram nesse
   banco (idempotente: migracao ja aplicada e pulada, nunca reexecutada)
3. `supabase functions deploy` — publica todas as Edge Functions da pasta
   `supabase/functions/`, incluindo a `send-quote-email`

**Configuracao unica, feita uma vez** — GitHub → repositorio → **Settings** →
**Secrets and variables** → **Actions** → **New repository secret**:

| Secret | Onde conseguir |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | supabase.com/dashboard/account/tokens → **Generate new token** |
| `SUPABASE_DB_PASSWORD` | a senha do banco Postgres do projeto (definida na criacao do projeto; se foi perdida, redefinir em **Project Settings → Database → Reset database password**) |

Sem esses dois secrets o workflow falha com uma mensagem clara de
autenticacao — nao aplica nada parcialmente.

**Os secrets `GMAIL_USER` e `GMAIL_APP_PASSWORD`** (usados pela
`send-quote-email` para enviar e-mail, nao pelo deploy em si) continuam sendo
configurados **separadamente**, direto no projeto Supabase — **Project
Settings → Edge Functions → Secrets** — porque sao credenciais da funcao em
runtime, nao do processo de deploy. Ver `supabase/functions/send-quote-email/index.ts`
para o passo a passo completo (gerar senha de app em
myaccount.google.com/apppasswords, exige verificacao em duas etapas).

**Rodar manualmente:** aba **Actions** do repositorio → workflow **Supabase
Deploy** → **Run workflow**. Util para aplicar migracoes existentes sem
esperar o proximo push em `supabase/`.

---

## 8. Remover a integracao "Kilo Code Review"

O app comenta automaticamente em todo PR, mas a conta esta sem creditos —
ele aparece como `action_required` e deixa o PR marcado `unstable` no GitHub,
sem de fato bloquear o merge (nao e um required check). Isso nao e algo que
uma ferramenta de IA consiga desfazer pela API do GitHub — desinstalar um
GitHub App e uma acao administrativa que so o dono/admin do repositorio pode
fazer pela interface:

1. github.com/CaioNishio/acoustic-canvas → **Settings** → **Integrations** →
   **GitHub Apps** (ou, se instalado a nivel de conta: github.com/settings/installations)
2. Encontrar **Kilo Code** na lista → **Configure**
3. Rolar ate o fim → **Uninstall**

Alternativa sem desinstalar: em app.kilo.ai, adicionar creditos ou trocar
para um modelo gratuito nas configuracoes de revisao de codigo — o app volta
a rodar normalmente sem precisar mexer na instalacao do GitHub.
