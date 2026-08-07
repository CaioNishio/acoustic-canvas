import { toast } from "sonner";

const SHOPIFY_API_VERSION = '2025-07';
// Loja oficial (confirmada pelo dono em 27/07/2026). A antiga
// 'sssonar-f4ae6.myshopify.com' era loja de TESTE e foi descartada
// (hoje responde HTTP 402 / congelada).
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'sonaracusticos.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
// Storefront API access token — lido de variavel de ambiente (Vite).
// Nunca hardcode: o valor antigo ('36246b...') pertencia a loja de TESTE
// sssonar-f4ae6 e foi removido em 27/07/2026 (retornava 401 na loja nova).
//
// Este token roda no NAVEGADOR, portanto usa prefixo VITE_ e e publico por
// design (token de leitura da Storefront API). O Admin API token JAMAIS pode
// receber prefixo VITE_ — isso o exporia no bundle publico do site.
//
// VALIDADO em 29/07/2026 contra a Storefront API real: token de 32 hex (sem
// prefixo) retornou shop.name = "SONAR " e a listagem de produtos, com
// extensions.cost presente (marca de request autenticada). Cadastrado como
// VITE_SHOPIFY_STOREFRONT_TOKEN no painel da Netlify.
//
// O dominio acima ('sonaracusticos.myshopify.com') tambem ficou confirmado no
// mesmo teste — nao e preciso usar o dominio permanente 'ppwc90-qt.myshopify.com'.
//
// Se um dia voltar 401, gerar outro em:
//   Admin da loja > Settings > Apps and sales channels > Develop apps
//   > (app) > Configuration > Storefront API > Install > Reveal token
// Formato esperado: 32 caracteres hexadecimais, SEM prefixo.
//
// Historico: em 27/07/2026 foram fornecidos dois valores que NAO eram
// Storefront token (um shpss_ = API secret key do app, outro atkn_ = token de
// outro servico); ambos deram 401.
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;

// --- Types ---

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    sobConsulta: { value: string } | null;
  };
}

// --- Regra comercial centralizada ---
//
// Um so lugar decide se o CTA e "Comprar/Adicionar ao carrinho" ou
// "Solicitar orcamento". Nao duplicar esta logica em Loja.tsx, LojaDetalhe.tsx
// nem em nenhum componente futuro — todos devem chamar esta funcao.
//
// price <= 0 cobre o caso de produto sem metafield ainda preenchido (nem todo
// produto tem comercial.sob_consulta setado); o metafield e o sinal
// autoritativo quando presente.
export function isPurchasable(priceAmount: string, availableForSale: boolean, sobConsulta?: { value: string } | null): boolean {
  if (sobConsulta?.value === "true") return false;
  if (!availableForSale) return false;
  return parseFloat(priceAmount) > 0;
}

// --- API Helper ---

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  if (!SHOPIFY_STOREFRONT_TOKEN) {
    toast.error("Loja indisponivel no momento", {
      description: "Catalogo temporariamente fora do ar. Fale conosco pelo WhatsApp.",
    });
    console.warn('[shopify] VITE_SHOPIFY_STOREFRONT_TOKEN ausente. Defina no .env do site.');
    return;
  }

  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your store needs to be upgraded to a paid plan.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }
  return data;
}

// --- Queries ---

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
          sobConsulta: metafield(namespace: "comercial", key: "sob_consulta") {
            value
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
      sobConsulta: metafield(namespace: "comercial", key: "sob_consulta") {
        value
      }
    }
  }
`;

// --- Cart Mutations ---

export const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

// --- Cart Helpers ---

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: Array<{ field: string[] | null; message: string }>): boolean {
  return userErrors.some(e => e.message.toLowerCase().includes('cart not found') || e.message.toLowerCase().includes('does not exist'));
}

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

export async function createShopifyCart(item: CartItem): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });
  const cart = data?.data?.cartCreate?.cart;
  if (data?.data?.cartCreate?.userErrors?.length > 0 || !cart?.checkoutUrl) return null;
  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;
  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(cartId: string, item: CartItem): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });
  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find((l: { node: { id: string; merchandise: { id: string } } }) => l.node.merchandise.id === item.variantId);
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}
