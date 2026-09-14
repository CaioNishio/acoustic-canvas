import type { NormalizedRate, QuoteInput, ShippingProvider } from './types';

type FrenetResponse = { ShippingSevicesArray?: Array<{ ServiceCode?: string; ServiceDescription?: string; Carrier?: string; CarrierCode?: string; ShippingPrice?: string | number; DeliveryTime?: string | number; Error?: boolean; Msg?: string }> };

export class FrenetAdapter implements ShippingProvider {
  readonly id = 'frenet';
  constructor(private readonly token: string, private readonly fetcher: typeof fetch = fetch) {}

  async quote(input: QuoteInput): Promise<NormalizedRate[]> {
    if (!this.token) throw new Error('FRENET_TOKEN não configurado.');
    const response = await this.fetcher('https://api.frenet.com.br/shipping/quote', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', token: this.token },
      body: JSON.stringify({
        SellerCEP: input.originPostalCode.replace(/\D/g, ''),
        RecipientCEP: input.destinationPostalCode.replace(/\D/g, ''),
        ShipmentInvoiceValue: input.declaredValueCents / 100,
        RecipientCountry: 'BR',
        ShippingItemArray: input.volumes.map((volume) => ({ Height: volume.heightCm, Length: volume.lengthCm, Width: volume.widthCm, Weight: volume.weightKg, Quantity: 1, SKU: volume.items.map((item) => item.sku ?? item.variantId).join(',') })),
      }),
    });
    if (!response.ok) throw new Error(`Frenet respondeu HTTP ${response.status}.`);
    const data = await response.json() as FrenetResponse;
    return (data.ShippingSevicesArray ?? [])
      .filter((rate) => !rate.Error && Number(rate.ShippingPrice) > 0 && rate.ServiceCode)
      .map((rate) => ({
        provider: this.id,
        carrier: rate.Carrier ?? 'Transportadora',
        serviceName: rate.ServiceDescription ?? 'Frete',
        serviceCode: `frenet_${rate.CarrierCode ?? 'service'}_${rate.ServiceCode}`.toLowerCase(),
        priceCents: Math.round(Number(rate.ShippingPrice) * 100),
        deliveryDays: Number(rate.DeliveryTime) || undefined,
        description: `Cotação Frenet para os volumes físicos do pedido.`,
      }));
  }
}

/** Adaptador deliberadamente inativo até receber endpoint e credencial oficial da conta Sonar. */
export class PendingProviderAdapter implements ShippingProvider {
  constructor(readonly id: string) {}
  async quote(_input: QuoteInput): Promise<NormalizedRate[]> {
    throw new Error(`${this.id}: integração pendente de credencial e documentação oficial da conta.`);
  }
}

export const centralDoFrete = new PendingProviderAdapter('central-do-frete');
export const goFretes = new PendingProviderAdapter('go-fretes');
export const melhorEnvio = new PendingProviderAdapter('melhor-envio');
