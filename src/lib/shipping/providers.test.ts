import { describe, expect, it } from 'vitest';
import { FrenetAdapter } from './providers';

describe('FrenetAdapter', () => {
  it('envia cada volume calculado e normaliza somente tarifas válidas', async () => {
    let payload: Record<string, unknown> | undefined;
    const adapter = new FrenetAdapter('private-token', async (_url, init) => {
      payload = JSON.parse(String(init?.body));
      return new Response(JSON.stringify({ ShippingSevicesArray: [
        { ServiceCode: 'ECO', ServiceDescription: 'Econômico', Carrier: 'Central', CarrierCode: 'CTR', ShippingPrice: '189.90', DeliveryTime: '5', Error: false },
        { ServiceCode: 'BAD', Error: true, ShippingPrice: '0' },
      ] }));
    });
    const rates = await adapter.quote({
      originPostalCode: '01001-000', destinationPostalCode: '20040-020', declaredValueCents: 50000,
      volumes: [
        { id: 'a', family: 'ABSORPTIVE_PANEL_RECT', lengthCm: 122, widthCm: 62, heightCm: 22, weightKg: 14.05, productWeightKg: 14, tareWeightKg: 0.05, items: [{ variantId: '1', quantity: 4 }], exclusive: false, confidence: 'validated' },
        { id: 'b', family: 'ABSORPTIVE_PANEL_RECT', lengthCm: 122, widthCm: 62, heightCm: 7, weightKg: 3.55, productWeightKg: 3.5, tareWeightKg: 0.05, items: [{ variantId: '1', quantity: 1 }], exclusive: false, confidence: 'validated' },
      ],
    });
    expect((payload?.ShippingItemArray as unknown[])).toHaveLength(2);
    expect(rates).toEqual([expect.objectContaining({ priceCents: 18990, serviceCode: 'frenet_ctr_eco' })]);
  });
});
