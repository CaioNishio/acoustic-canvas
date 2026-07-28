/**
 * Formatacao de moeda para as telas de loja.
 *
 * Existe porque a Shopify devolve preco como { amount: "92.45", currencyCode: "BRL" }
 * e o codigo vinha concatenando os dois: "BRL 92.45". Numa loja brasileira isso
 * le como erro de sistema — e a tela onde o cliente decide gastar dinheiro e o
 * pior lugar para parecer quebrado.
 */

/** Preco no formato que a Storefront API devolve. */
export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

/**
 * "92.45" + "BRL" -> "R$ 92,45".
 *
 * Usa Intl para respeitar o separador decimal e a posicao do simbolo de cada
 * moeda, em vez de assumir o formato brasileiro na mao — a loja ja vende em BRL
 * hoje, mas Markets da Shopify pode trazer outras moedas sem aviso.
 */
export function formatMoney(price: ShopifyMoney | null | undefined, locale = 'pt-BR'): string {
  if (!price) return '';
  const valor = Number.parseFloat(price.amount);
  if (!Number.isFinite(valor)) return '';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: price.currencyCode,
    }).format(valor);
  } catch {
    // currencyCode desconhecido derruba o Intl. Melhor um fallback feio do que
    // uma tela de produto em branco.
    return `${price.currencyCode} ${valor.toFixed(2)}`;
  }
}

/**
 * true quando o preco nao pode virar uma venda de verdade.
 *
 * Nao e preciosismo: em 28/07/2026 a loja tinha um produto ativo com preco 0,00
 * e sem SKU (`revestimento-ripado`). Com o botao "Comprar" ligado, um cliente
 * fecharia um pedido de R$ 0,00 — a loja teria a obrigacao de entregar. Barrar
 * no front-end e a rede de seguranca; a correcao definitiva e por o preco certo
 * na Shopify.
 */
export function isPrecoInvalido(price: ShopifyMoney | null | undefined): boolean {
  if (!price) return true;
  const valor = Number.parseFloat(price.amount);
  return !Number.isFinite(valor) || valor <= 0;
}
