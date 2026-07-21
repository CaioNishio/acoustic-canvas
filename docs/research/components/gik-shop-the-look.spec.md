# GikShopTheLook Specification

## Overview
- **Target file:** `src/components/gik/GikShopTheLook.tsx`
- **Screenshot:** `docs/design-references/gik-home-desktop-full.png` (seção "Shop The Look"); JSON: `docs/research/gik-shop-the-look.json`
- **Interaction model:** click-driven (hotspots trocam o produto em destaque) + carrossel de looks (dots)

## Computed Styles (getComputedStyle)
- Section: padding 72px 0; título eyebrow "Inspiring Spaces" 13px + H2 "Shop The Look" Lexend Giga bold ~30px, alinhado à esquerda
- Layout: grid 2 colunas (imagem grande ~2/3 + card produto 1/3), gap ~24px
- Imagem do look: ratio 3:2 (66.67%), rounded-2xl, overlay rgb(11,14,17)/0.40
- Hotspot: `<a>` 62×62px, absolute, translate(-50%,-50%) via margin -31px, círculo branco com anel; posicionado por --hotspot-x/--hotspot-y em %
- Tooltip do hotspot ativo: card branco bg rgb(253,254,254), 296×116px, padding 8px, flex row gap-2 (thumb + nome 14px + "A partir de R$")
- Card lateral: bg #F5F5F5 rounded-lg, badge "PATENTEADO" quando aplicável, imagem quadrada, nome + preço centralizados
- Dots: 3 pontos, ativo escuro

## Per-State Content (adaptação Sonar)
- Look 1 (foto estúdio/podcast): hotspots → Bass Trap Corner 3S (20%,41%), Painel SNR3250 (50%,30%), Difusor Skyline (90%,50%)
- Look 2 (foto nuvens/teto): hotspots → Nuvem Acústica SNR3250 (45%,25%), Painel SNR6450 (75%,55%)
- Dados de `products.ts` (imagem, nome, price ?? "Sob consulta")

## Behaviors
- Click hotspot: ativa produto (tooltip visível no hotspot ativo; card lateral atualiza), transition opacity/scale 200ms
- Dots: trocam o look (fade 300ms)
- Hover hotspot: scale 1.1

## Responsive
- Desktop: grid 2/3 + 1/3; Mobile: empilha (imagem full, card abaixo), tooltips escondidos (hidden md:flex — igual GIK)
