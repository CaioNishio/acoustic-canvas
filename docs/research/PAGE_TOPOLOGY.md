# GIK Acoustics Home — Topologia (alvo do clone com dados Sonar)

Fonte: https://www.gikacoustics.com/ (extraído 21/07/2026, desktop 1440px)
Artefatos: `gik-globals.json`, `gik-sections.json`, `gik-header-scroll.json`, screenshots em `docs/design-references/gik-*.png`.

## Design tokens globais
- Fontes: **Lexend** (corpo) e **Lexend Giga** (títulos) — Google Fonts, pesos 100..900
- Cores base: body bg `rgb(253,254,254)`, texto `rgb(11,14,17)`, título h3 `rgb(25,49,57)` (verde-petróleo escuro), seções escuras bg quase-preto com texto `rgb(253,254,254)`
- H1 40px/700 Lexend Giga; H2 ~29.7px/700; H3 20px/600; corpo 16px/400; small 13px

## Ordem das seções (top → bottom)
| # | Seção | Interação | Equivalente Sonar (dados) |
|---|-------|-----------|---------------------------|
| 1 | Announcement bar (48px, escura) | estática | frete/aviso |
| 2 | Header sticky (116px, logo + nav + busca/conta/carrinho) | sticky, muda com scroll | nav atual do site |
| 3 | Hero image+text overlay (638px, texto claro sobre foto escura) | estática | painel SNR3250 hero |
| 4 | Best Sellers (868px) — pills de categoria + grid 4 cards produto | click-driven (pills trocam cards) | categorias/products.ts |
| 5 | Video/text overlay escuro "Q11D Diffuser" (638px) | estática + CTA | Difusor Skyline |
| 6 | "For Every Environment" carrossel de ambientes (cards foto+label) | carrossel setas | applications (Estúdio, Igreja...) |
| 7 | Trusted by Experts — faixa de logos | estática | logos parceiros/certificações |
| 8 | Premium Acoustic Fabrics — imagem full + texto overlay | estática | 34+ cores de tecido |
| 9 | Shop The Look — fotos ambiente com hotspots de produto | hover/click hotspots | fotos reais products/ |
| 10 | Testimonial escuro com aspas grandes | estática/carrossel | depoimento cliente |
| 11 | Plan Your Space — 2 cards grandes (Expert / 3D Designer) | estática | Consultoria & Projetos |
| 12 | Knowledge Base — grid de artigos (1 grande + 2 pequenos) | estática | educationalArticles.ts |
| 13 | Barra 3 features (ícone+título+texto) | estática | diferenciais Sonar |
| 14 | Footer escuro multi-coluna + newsletter + social + pagamentos | estática | footer atual |

## Comportamento do header (gik-header-scroll.json)
Sticky; verificar diff exato no JSON (bg/shadow antes vs depois de 600px de scroll).

## Implementação
- Rota nova `/gik-home` no repo Sonar (Vite+React+Tailwind) para não quebrar a home atual.
- Componentes em `src/components/gik/`.
- Dados: importar de `src/data/products.ts` e `educationalArticles.ts`; textos PT-BR.
