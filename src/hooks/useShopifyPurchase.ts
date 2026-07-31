import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  type ShopifyProduct,
} from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { shopifyHandleFor, unmappedReasonFor, type UnmappedReason } from '@/lib/shopifyCatalog';

/**
 * Liga um produto do catalogo LOCAL (identificado por slug) ao carrinho Shopify.
 *
 * Antes desta ponte, um produto recomendado pela calculadora ou aberto em
 * /produtos era um beco sem saida: o cliente via a recomendacao e precisava
 * reencontrar o item na /loja por conta propria. Agora qualquer tela que conheca
 * o slug consegue vender.
 *
 * O variantId e resolvido em runtime pelo handle (ver shopifyCatalog.ts) e
 * cacheado pelo react-query — nao ha ID de variante congelado no codigo.
 */

export type PurchaseStatus =
  /** Comprável: variante resolvida, da para adicionar ao carrinho. */
  | 'disponivel'
  /** Resolvendo o produto na Shopify. */
  | 'carregando'
  /** Existe na loja, mas a variante esta esgotada. */
  | 'esgotado'
  /** Nao ha contraparte na Shopify: ainda nao publicado. */
  | 'nao-publicado'
  /** Servico/item sob medida: vende por orcamento, nao por carrinho. */
  | 'sob-orcamento'
  /** Mapeado, mas a loja nao respondeu ou o handle nao existe mais. */
  | 'indisponivel';

export interface UseShopifyPurchaseResult {
  status: PurchaseStatus;
  /** Preco da variante na Shopify (fonte de verdade), quando resolvido. */
  price: { amount: string; currencyCode: string } | null;
  /** Produto completo da Shopify, para telas que queiram imagens/descricao da loja. */
  product: ShopifyProduct | null;
  /** Adiciona ao carrinho. No-op silencioso quando status !== 'disponivel'. */
  addToCart: (quantity?: number) => Promise<void>;
  /** true enquanto o carrinho esta sincronizando com a Shopify. */
  isAddingToCart: boolean;
}

interface ResolvedVariant {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

/** Traduz o motivo de exclusao do mapa para o status exposto a UI. */
function statusFromReason(reason: UnmappedReason): PurchaseStatus {
  return reason === 'sob-orcamento' ? 'sob-orcamento' : 'nao-publicado';
}

async function resolveVariant(handle: string): Promise<ResolvedVariant | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  const product = data?.data?.product;
  if (!product) return null;

  // Primeira variante disponivel; se nenhuma estiver, a primeira mesmo — assim
  // a UI consegue distinguir "esgotado" de "produto sumiu da loja".
  const variants = product.variants?.edges?.map((e: { node: unknown }) => e.node) ?? [];
  if (variants.length === 0) return null;
  const variant =
    variants.find((v: { availableForSale: boolean }) => v.availableForSale) ?? variants[0];

  return {
    product: { node: product } as ShopifyProduct,
    variantId: variant.id,
    variantTitle: variant.title,
    price: variant.price,
    availableForSale: Boolean(variant.availableForSale),
    selectedOptions: variant.selectedOptions ?? [],
  };
}

export function useShopifyPurchase(slug: string): UseShopifyPurchaseResult {
  const handle = shopifyHandleFor(slug);
  const reason = unmappedReasonFor(slug);
  const addItem = useCartStore((s) => s.addItem);
  const isAddingToCart = useCartStore((s) => s.isLoading);

  const { data, isLoading } = useQuery({
    queryKey: ['shopify-variant', handle],
    queryFn: () => resolveVariant(handle!),
    // Sem handle nao ha o que buscar — evita uma request condenada a falhar.
    enabled: Boolean(handle),
    // Preco e disponibilidade mudam devagar; 5 min evita uma request por card
    // renderizado numa grade de produtos.
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const status: PurchaseStatus = !handle
    ? statusFromReason(reason ?? 'nao-publicado')
    : isLoading
      ? 'carregando'
      : !data
        ? 'indisponivel'
        : data.availableForSale
          ? 'disponivel'
          : 'esgotado';

  const addToCart = useCallback(
    async (quantity = 1) => {
      if (status !== 'disponivel' || !data) return;
      await addItem({
        product: data.product,
        variantId: data.variantId,
        variantTitle: data.variantTitle,
        price: data.price,
        quantity,
        selectedOptions: data.selectedOptions,
      });
      toast.success('Adicionado ao carrinho', {
        description: data.product.node.title,
      });
    },
    [status, data, addItem],
  );

  return {
    status,
    price: data?.price ?? null,
    product: data?.product ?? null,
    addToCart,
    isAddingToCart,
  };
}
