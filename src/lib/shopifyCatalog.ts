/**
 * Ponte entre o catalogo LOCAL do site (src/data/products.ts, indexado por `slug`)
 * e o catalogo da loja Shopify `sonaracusticos.myshopify.com` (indexado por `handle`).
 *
 * Por que existe: o site nasceu com um catalogo proprio (usado pela calculadora,
 * pelas paginas /produtos e /solucoes) e ganhou depois uma loja Shopify separada
 * em /loja. Os dois nunca se falaram — um produto recomendado pela calculadora
 * nao virava item de carrinho. Este mapa e a costura entre os dois mundos.
 *
 * Por que mapear por HANDLE e nao por variantId: o handle e estavel, legivel e
 * conferivel a olho; o variantId muda se o produto for recriado na Shopify e
 * quebraria silenciosamente. O variantId e resolvido em runtime, sob demanda,
 * reusando PRODUCT_BY_HANDLE_QUERY.
 *
 * Conferido contra a loja em 28/07/2026: 22 dos 50 produtos locais existem na
 * Shopify. Os demais estao marcados como `null` de proposito — sao itens que
 * ainda nao foram publicados na loja, ou servicos que nao se vendem por carrinho
 * (projeto 3D, consultoria, visita tecnica).
 */

/** Slugs do catalogo local. Fonte: src/data/products.ts (campo `slug`). */
export type LocalProductSlug =
  | 'painel-acustico-snr3250'
  | 'painel-acustico-snr6450'
  | 'painel-acustico-snr3225-slim'
  | 'painel-moldura-madeira'
  | 'painel-imagem-plotada'
  | 'painel-mdf-vazado'
  | 'painel-hexagonal'
  | 'painel-circle-360'
  | 'painel-triangular-3s'
  | 'painel-led-rgb'
  | 'painel-led-fosco'
  | 'hexagono-led-decorativo'
  | 'reflexive-panels'
  | 'nuvem-acustica-snr3250'
  | 'bass-trap-corner-3s-snr6430'
  | 'bass-trap-membrana-snr6420'
  | 'difusor-qrd'
  | 'difusor-skyline'
  | 'difusor-bidimensional'
  | 'baffles-acusticos'
  | 'forro-acustico-modular'
  | 'biombo-acustico-retratil'
  | 'biombo-acustico-cavalete'
  | 'cortina-acustica-snr96c'
  | 'porta-acustica-dupla'
  | 'porta-acustica-anti-panico'
  | 'painel-isolamento-d96'
  | 'la-de-rocha-d32'
  | 'la-de-rocha-d64'
  | 'la-de-rocha-d96'
  | 'la-de-pet'
  | 'membrana-borracha'
  | 'tecidos-acusticos'
  | 'carpete-acustico'
  | 'piso-emborrachado'
  | 'drywall'
  | 'espuma-expansiva'
  | 'suportes-instalacao'
  | 'velcro-50mm'
  | 'microfone-medicao'
  | 'cadeiras-estudio'
  | 'tapetes-acusticos'
  | 'kit-estudio-classic'
  | 'kit-estudio-premium'
  | 'kit-estudio-pro'
  | 'projeto-3d'
  | 'consultoria-tecnica'
  | 'visita-tecnica'
  | 'integracao-transportadora'
  | 'revestimento-ripado'
  | 'kit-fixacao-acustica';

/** Motivo pelo qual um produto local nao tem contraparte comprável na Shopify. */
export type UnmappedReason =
  /** Ainda nao publicado na loja — candidato natural a ser cadastrado. */
  | 'nao-publicado'
  /** Servico ou item sob medida: preco depende de projeto, nao vende por carrinho. */
  | 'sob-orcamento';

export interface ShopifyLink {
  /** Handle do produto na loja sonaracusticos.myshopify.com. */
  handle: string;
  /**
   * SKU da variante na Shopify, quando existe. Serve de conferencia humana:
   * se o handle mudar, o SKU denuncia o descasamento.
   */
  sku: string | null;
}

/**
 * Mapa TOTAL: todo slug local aparece aqui. `null` significa "conscientemente
 * sem contraparte na Shopify" e carrega o motivo em UNMAPPED_REASON.
 *
 * O tipo `Record<LocalProductSlug, ...>` e proposital: se alguem adicionar um
 * produto em products.ts e esquecer desta tabela, o TypeScript acusa. Um mapa
 * parcial deixaria o esquecimento passar em silencio.
 */
export const SHOPIFY_CATALOG_MAP: Record<LocalProductSlug, ShopifyLink | null> = {
  'painel-acustico-snr3250': {
    handle: 'painel-acustico-snr3250-la-de-rocha-50mm-absorcao-sob-medida',
    sku: 'SNR3250',
  },
  'painel-moldura-madeira': {
    handle: 'painel-acustico-com-moldura-de-madeira-acabamento-premium',
    sku: 'painel-moldura-madeira',
  },
  'painel-mdf-vazado': {
    handle: 'painel-acustico-mdf-vazado-absorcao-com-estetica-de-madeira',
    sku: 'painel-mdf-vazado',
  },
  'painel-hexagonal': {
    handle: 'painel-acustico-hexagonal-mosaico-decorativo-absorvente',
    sku: 'painel-hexagonal',
  },
  'painel-circle-360': {
    handle: 'painel-acustico-circular-circle-360-absorcao-decorativa',
    sku: 'SNR3250-360',
  },
  'hexagono-led-decorativo': {
    handle: 'hexagono-acustico-led-suspenso-modulo-decorativo-para-teto',
    sku: 'hexagono-led-decorativo',
  },
  'reflexive-panels': {
    handle: 'painel-reflexivo-acustico-em-madeira-direcionamento-sonoro',
    sku: 'reflexive-panels',
  },
  'nuvem-acustica-snr3250': {
    handle: 'nuvem-acustica-snr3250-suspensa-absorcao-dupla-face-para-teto',
    sku: 'nuvem-snr3250',
  },
  'bass-trap-corner-3s-snr6430': {
    handle: 'bass-trap-corner-3s-snr6430-controle-de-graves-e-modos-de-sala',
    sku: 'SNR6430',
  },
  'difusor-qrd': {
    handle: 'difusor-acustico-qrd-em-madeira-espalhamento-unidimensional',
    sku: 'difusor-qrd',
  },
  'difusor-skyline': {
    handle: 'difusor-acustico-skyline-3d-difusao-bidimensional-em-madeira',
    sku: 'difusor-skyline',
  },
  'difusor-bidimensional': {
    handle: 'difusor-acustico-bidimensional-espalhamento-em-dois-eixos',
    sku: 'difusor-bidimensional',
  },
  'baffles-acusticos': {
    handle: 'baffle-acustico-suspenso-vertical-absorcao-para-teto-exposto',
    sku: 'baffles-acusticos',
  },
  'forro-acustico-modular': {
    handle: 'forro-acustico-modular-625x625mm-sistema-de-teto-com-grid',
    sku: 'forro-acustico-modular',
  },
  'biombo-acustico-cavalete': {
    handle: 'biombo-acustico-cavalete-divisoria-acustica-independente',
    sku: 'biombo-acustico-cavalete',
  },
  'la-de-rocha-d32': {
    handle: 'la-de-rocha-d32-50mm-materia-prima-para-painel-acustico',
    sku: 'la-de-rocha-d32',
  },
  'la-de-rocha-d64': {
    handle: 'la-de-rocha-d64-50mm-absorcao-de-graves-para-bass-trap',
    sku: 'la-de-rocha-d64',
  },
  'la-de-rocha-d96': {
    handle: 'la-de-rocha-d96-isolamento-acustico-broadband-de-alta-densidade',
    sku: 'la-de-rocha-d96',
  },
  'suportes-instalacao': {
    handle: 'kit-de-suporte-universal-fixacao-de-paineis-acusticos',
    sku: 'suportes-instalacao',
  },
  'microfone-medicao': {
    handle: 'microfone-de-medicao-acustica-analise-de-rt60-e-resposta-da-sala',
    sku: 'microfone-medicao',
  },
  'kit-fixacao-acustica': {
    handle: 'kit-de-fixacao-acustica-fixador-dentado-bucha-e-parafuso',
    sku: 'kit-fixacao-acustica',
  },
  /**
   * Existe na Shopify, mas com preco 0,00 e sem SKU. Deixado FORA da compra
   * direta de proposito: publicar um botao "Comprar" que leva a um checkout de
   * R$ 0,00 e pior do que nao ter botao. Voltar a mapear quando tiver preco.
   */
  'revestimento-ripado': null,

  // --- Ainda nao publicados na loja ---
  'painel-acustico-snr6450': null,
  'painel-acustico-snr3225-slim': null,
  'painel-imagem-plotada': null,
  'painel-triangular-3s': null,
  'painel-led-rgb': null,
  'painel-led-fosco': null,
  'bass-trap-membrana-snr6420': null,
  'biombo-acustico-retratil': null,
  'cortina-acustica-snr96c': null,
  'painel-isolamento-d96': null,
  'la-de-pet': null,
  'membrana-borracha': null,
  'tecidos-acusticos': null,
  'carpete-acustico': null,
  'piso-emborrachado': null,
  'drywall': null,
  'espuma-expansiva': null,
  'velcro-50mm': null,
  'cadeiras-estudio': null,
  'tapetes-acusticos': null,
  'kit-estudio-classic': null,
  'kit-estudio-premium': null,
  'kit-estudio-pro': null,

  // --- Sob orcamento: nao se vendem por carrinho ---
  'porta-acustica-dupla': null,
  'porta-acustica-anti-panico': null,
  'projeto-3d': null,
  'consultoria-tecnica': null,
  'visita-tecnica': null,
  'integracao-transportadora': null,
};

/**
 * Por que cada slug nao mapeado esta de fora. Serve para a UI escolher o
 * fallback certo: "avise-me quando chegar" e uma coisa, "pedir orcamento" e outra.
 */
export const UNMAPPED_REASON: Partial<Record<LocalProductSlug, UnmappedReason>> = {
  'revestimento-ripado': 'nao-publicado',
  'painel-acustico-snr6450': 'nao-publicado',
  'painel-acustico-snr3225-slim': 'nao-publicado',
  'painel-imagem-plotada': 'nao-publicado',
  'painel-triangular-3s': 'nao-publicado',
  'painel-led-rgb': 'nao-publicado',
  'painel-led-fosco': 'nao-publicado',
  'bass-trap-membrana-snr6420': 'nao-publicado',
  'biombo-acustico-retratil': 'nao-publicado',
  'cortina-acustica-snr96c': 'nao-publicado',
  'painel-isolamento-d96': 'nao-publicado',
  'la-de-pet': 'nao-publicado',
  'membrana-borracha': 'nao-publicado',
  'tecidos-acusticos': 'nao-publicado',
  'carpete-acustico': 'nao-publicado',
  'piso-emborrachado': 'nao-publicado',
  'drywall': 'nao-publicado',
  'espuma-expansiva': 'nao-publicado',
  'velcro-50mm': 'nao-publicado',
  'cadeiras-estudio': 'nao-publicado',
  'tapetes-acusticos': 'nao-publicado',
  'kit-estudio-classic': 'nao-publicado',
  'kit-estudio-premium': 'nao-publicado',
  'kit-estudio-pro': 'nao-publicado',
  'porta-acustica-dupla': 'sob-orcamento',
  'porta-acustica-anti-panico': 'sob-orcamento',
  'projeto-3d': 'sob-orcamento',
  'consultoria-tecnica': 'sob-orcamento',
  'visita-tecnica': 'sob-orcamento',
  'integracao-transportadora': 'sob-orcamento',
};

/** Handle da Shopify para um slug local, ou null se nao houver contraparte. */
export function shopifyHandleFor(slug: string): string | null {
  const link = SHOPIFY_CATALOG_MAP[slug as LocalProductSlug];
  return link ? link.handle : null;
}

/** true quando o produto local pode virar item de carrinho na Shopify. */
export function isPurchasable(slug: string): boolean {
  return shopifyHandleFor(slug) !== null;
}

/**
 * Por que o produto nao e comprável. `undefined` quando ele E comprável ou
 * quando o slug nem existe no catalogo local.
 */
export function unmappedReasonFor(slug: string): UnmappedReason | undefined {
  return UNMAPPED_REASON[slug as LocalProductSlug];
}

/** Slugs locais que hoje tem contraparte na Shopify. Util em testes e auditorias. */
export function purchasableSlugs(): LocalProductSlug[] {
  return (Object.keys(SHOPIFY_CATALOG_MAP) as LocalProductSlug[]).filter((slug) =>
    Boolean(SHOPIFY_CATALOG_MAP[slug]),
  );
}
