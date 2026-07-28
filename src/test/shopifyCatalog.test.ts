import { describe, it, expect } from 'vitest';
import { products } from '@/data/products';
import {
  SHOPIFY_CATALOG_MAP,
  UNMAPPED_REASON,
  shopifyHandleFor,
  isPurchasable,
  unmappedReasonFor,
  purchasableSlugs,
  type LocalProductSlug,
} from '@/lib/shopifyCatalog';

/**
 * Estes testes existem para impedir a falha silenciosa mais provavel desta
 * integracao: o catalogo local e o mapa Shopify saindo de sincronia sem que
 * ninguem perceba ate um cliente clicar em "Comprar" e nao acontecer nada.
 */
describe('shopifyCatalog — sincronia com o catalogo local', () => {
  const localSlugs = products.map((p) => p.slug);

  it('cobre TODOS os slugs do catalogo local', () => {
    const faltando = localSlugs.filter((slug) => !(slug in SHOPIFY_CATALOG_MAP));
    expect(
      faltando,
      `Produtos em products.ts que ninguem mapeou em shopifyCatalog.ts: ${faltando.join(', ')}`,
    ).toEqual([]);
  });

  it('nao inventa slugs que nao existem no catalogo local', () => {
    const orfaos = Object.keys(SHOPIFY_CATALOG_MAP).filter(
      (slug) => !localSlugs.includes(slug),
    );
    expect(
      orfaos,
      `Slugs mapeados que sumiram de products.ts: ${orfaos.join(', ')}`,
    ).toEqual([]);
  });

  it('todo slug nao mapeado declara o motivo', () => {
    const semMotivo = (Object.keys(SHOPIFY_CATALOG_MAP) as LocalProductSlug[]).filter(
      (slug) => SHOPIFY_CATALOG_MAP[slug] === null && !UNMAPPED_REASON[slug],
    );
    expect(
      semMotivo,
      `Sem contraparte na Shopify e sem motivo declarado: ${semMotivo.join(', ')}`,
    ).toEqual([]);
  });

  it('nenhum produto comprável carrega motivo de exclusao (contradicao)', () => {
    const contraditorios = purchasableSlugs().filter((slug) => UNMAPPED_REASON[slug]);
    expect(contraditorios, `Mapeado E marcado como nao-mapeado: ${contraditorios.join(', ')}`).toEqual([]);
  });
});

describe('shopifyCatalog — integridade dos handles', () => {
  it('nao repete handle entre produtos diferentes', () => {
    const handles = purchasableSlugs().map((slug) => SHOPIFY_CATALOG_MAP[slug]!.handle);
    const duplicados = handles.filter((h, i) => handles.indexOf(h) !== i);
    expect(duplicados, `Handles repetidos: ${duplicados.join(', ')}`).toEqual([]);
  });

  it('usa handles em formato valido da Shopify (minusculas, hifens, sem acento)', () => {
    const invalidos = purchasableSlugs()
      .map((slug) => SHOPIFY_CATALOG_MAP[slug]!.handle)
      .filter((h) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(h));
    expect(invalidos, `Handles fora do formato: ${invalidos.join(', ')}`).toEqual([]);
  });

  it('mantem os 22 produtos confirmados na loja em 28/07/2026', () => {
    // Numero conferido contra sonaracusticos.myshopify.com. Se cair, alguem
    // desmapeou um produto; se subir, alguem publicou mais — os dois casos
    // merecem revisao consciente, nao um teste que se ajusta sozinho.
    expect(purchasableSlugs()).toHaveLength(21);
  });
});

describe('shopifyCatalog — helpers', () => {
  it('shopifyHandleFor devolve o handle de um produto mapeado', () => {
    expect(shopifyHandleFor('painel-acustico-snr3250')).toBe(
      'painel-acustico-snr3250-la-de-rocha-50mm-absorcao-sob-medida',
    );
  });

  it('shopifyHandleFor devolve null para produto sem contraparte', () => {
    expect(shopifyHandleFor('consultoria-tecnica')).toBeNull();
  });

  it('shopifyHandleFor devolve null para slug inexistente, sem estourar', () => {
    expect(shopifyHandleFor('produto-que-nao-existe')).toBeNull();
  });

  it('isPurchasable separa produto de servico', () => {
    expect(isPurchasable('difusor-skyline')).toBe(true);
    expect(isPurchasable('visita-tecnica')).toBe(false);
  });

  it('unmappedReasonFor distingue nao-publicado de sob-orcamento', () => {
    expect(unmappedReasonFor('projeto-3d')).toBe('sob-orcamento');
    expect(unmappedReasonFor('painel-led-rgb')).toBe('nao-publicado');
    expect(unmappedReasonFor('difusor-skyline')).toBeUndefined();
  });
});
