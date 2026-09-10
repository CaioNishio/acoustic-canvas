import { packCart } from '../../src/lib/shipping/packing-engine';
import { FrenetAdapter } from '../../src/lib/shipping/providers';
import { makeCartItem, shippingCatalogSchema } from '../../src/lib/shipping/schema';

const SONAR_ORIGIN_POSTAL_CODE = '03619100';

type ShopifyRateItem = { variant_id?: number | string; quantity?: number; price?: number; grams?: number };
type ShopifyRateRequest = { rate?: { origin?: { postal_code?: string }; destination?: { postal_code?: string }; items?: ShopifyRateItem[] } };

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const cleanPostalCode = (value?: string) => (value ?? '').replace(/\D/g, '');

/**
 * Shopify CarrierService callback. It stays inert until the merchant sets the
 * catalog JSON and Frenet token in Netlify, then registers this public URL as
 * the Carrier Service callback. Missing or unvalidated data returns no rates,
 * never a made-up price.
 */
export default async (request: Request) => {
  if (request.method !== 'POST') return json(405, { error: 'Método não permitido.' });
  try {
    const payload = await request.json() as ShopifyRateRequest;
    const destinationPostalCode = cleanPostalCode(payload.rate?.destination?.postal_code);
    const originPostalCode = cleanPostalCode(process.env.SONAR_SHIPPING_ORIGIN_POSTAL_CODE ?? SONAR_ORIGIN_POSTAL_CODE);
    const rawCatalog = process.env.SONAR_SHIPPING_CATALOG_JSON;
    if (!rawCatalog || !originPostalCode || !destinationPostalCode) return json(200, { rates: [] });

    const catalog = shippingCatalogSchema.parse(JSON.parse(rawCatalog));
    const items = payload.rate?.items ?? [];
    const cartItems = [];
    let declaredValueCents = 0;
    for (const item of items) {
      const variantId = String(item.variant_id ?? '');
      const catalogItem = catalog.find((candidate) => candidate.variantId === variantId);
      if (!catalogItem || !item.quantity || item.quantity < 1) return json(200, { rates: [] });
      const itemValue = Math.max(0, Number(item.price ?? 0)) * item.quantity;
      declaredValueCents += itemValue;
      cartItems.push(makeCartItem(catalogItem, item.quantity, itemValue));
    }
    const packed = packCart(cartItems);
    if (packed.manualQuoteItems.length || !packed.volumes.length) return json(200, { rates: [] });

    const token = process.env.FRENET_TOKEN;
    if (!token) return json(200, { rates: [] });
    const rates = await new FrenetAdapter(token).quote({ originPostalCode, destinationPostalCode, declaredValueCents, volumes: packed.volumes });
    return json(200, { rates: rates.map((rate) => ({ service_name: `${rate.carrier} — ${rate.serviceName}`, service_code: rate.serviceCode, total_price: String(rate.priceCents), currency: 'BRL', description: `${rate.description}${rate.deliveryDays ? ` Prazo estimado: ${rate.deliveryDays} dias úteis.` : ''}` })) });
  } catch (error) {
    console.error(JSON.stringify({ event: 'shipping_rate_failure', ruleVersion: '1.0', message: error instanceof Error ? error.message : 'unknown' }));
    // Shopify must use its configured fallback rates instead of receiving a guessed quote.
    return json(200, { rates: [] });
  }
};
