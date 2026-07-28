# Deploy do site Sonar Acusticos

- **Arquitetura:** headless. O site (Vite + React, SPA estatica) e o front-end;
  a Shopify e o back-end de catalogo e checkout.
- **Loja oficial:** `sonaracusticos.myshopify.com` (plano Advanced, BRL, Brasil).
- **Repositorio:** `github.com/CaioNishio/acoustic-canvas`

---

## 0. O unico bloqueio real: o Storefront token

O site **nao lista produtos** enquanto `VITE_SHOPIFY_STOREFRONT_TOKEN` estiver
vazio. Tudo o mais ja esta pronto.

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

1. **Storefront token** (secao 0) — bloqueia o catalogo. Unica acao manual.
2. **Preco do `revestimento-ripado`** esta 0,00 na Shopify.
3. **Publicar os 23 produtos faltantes** na loja.
4. **Dominio proprio** — decidir e apontar DNS depois do teste na URL provisoria.
5. **17 erros de lint pre-existentes** (`any` explicito em `LojaDetalhe.tsx` e
   `Orcamento.tsx`, `require()` no `tailwind.config.ts`). O CI os reporta sem
   bloquear; quando forem zerados, remover o `continue-on-error` do workflow.

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
