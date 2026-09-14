import { FAMILY_DEFAULTS, PACKAGING } from './rules';
import type { PackingResult, ShippingCartItem, ShippingFamily, ShippingVolume } from './types';

const positive = (value: number | undefined) => typeof value === 'number' && Number.isFinite(value) && value > 0;

function manual(result: PackingResult, item: ShippingCartItem, reason: string) {
  result.manualQuoteItems.push({ variantId: item.variantId, title: item.title, quantity: item.quantity, reason });
}

function chunks(total: number, size: number): number[] {
  const values: number[] = [];
  for (let remaining = total; remaining > 0; remaining -= size) values.push(Math.min(size, remaining));
  return values;
}

function makeVolume(item: ShippingCartItem, quantity: number, dimensions: [number, number, number], weight: number, exclusive: boolean, sequence: number): ShippingVolume {
  const confidence = item.validationStatus === 'estimated' ? 'estimated' : 'validated';
  return {
    id: `${item.variantId}-volume-${sequence}`,
    family: item.family,
    lengthCm: dimensions[0] + PACKAGING.defaultExtraCm,
    widthCm: dimensions[1] + PACKAGING.defaultExtraCm,
    heightCm: dimensions[2] + PACKAGING.defaultExtraCm,
    productWeightKg: weight,
    tareWeightKg: PACKAGING.tareKg,
    weightKg: weight + PACKAGING.tareKg,
    items: [{ variantId: item.variantId, sku: item.sku, quantity }],
    exclusive,
    confidence,
  };
}

function baseDimensions(item: ShippingCartItem): [number, number, number] | null {
  if (positive(item.packedLengthCm) && positive(item.packedWidthCm) && positive(item.packedHeightCm)) {
    return [item.packedLengthCm!, item.packedWidthCm!, item.packedHeightCm!];
  }
  if (!positive(item.lengthCm) || !positive(item.widthCm) || !positive(item.thicknessCm)) return null;
  return [item.lengthCm!, item.widthCm!, item.thicknessCm!];
}

function packItem(item: ShippingCartItem, result: PackingResult): void {
  const defaults = FAMILY_DEFAULTS[item.family];
  const mode = item.shippingMode ?? defaults?.shippingMode ?? 'quote_required';
  if (mode === 'quote_required' || item.validationStatus === 'manual_review') return manual(result, item, 'FRETE_SOB_CONSULTA');

  const dimensions = baseDimensions(item);
  const unitWeight = item.unitWeightKg ?? defaults?.defaultUnitWeightKg;
  if (!dimensions || !positive(unitWeight) || !Number.isInteger(item.quantity) || item.quantity < 1) {
    result.warnings.push({ code: 'MISSING_SHIPPING_DATA', message: 'Dados físicos insuficientes para cotação automática.', variantId: item.variantId });
    return manual(result, item, 'DADOS_FISICOS_INCOMPLETOS');
  }
  if (mode === 'automatic_after_validation' && item.validationStatus !== 'validated') return manual(result, item, 'VALIDACAO_FISICA_PENDENTE');

  const exclusive = Boolean(defaults?.exclusive);
  let capacity = item.maxUnitsPerVolume ?? defaults?.maxUnitsPerVolume;
  let length = dimensions[0];
  let width = dimensions[1];

  if (item.family === 'ABSORPTIVE_PANEL_RECT') {
    capacity = item.maxUnitsPerVolume ?? Math.floor((defaults?.maxStackThicknessCm ?? 20) / dimensions[2]);
  } else if (item.family === 'PANEL_60X60') {
    capacity = item.maxUnitsPerVolume ?? defaults?.maxUnitsPerVolume ?? 8;
    length = defaults?.baseLengthCm ?? 120;
    width = defaults?.baseWidthCm ?? 60;
  } else if (item.family === 'BASS_TRAP_CORNER') {
    capacity = item.maxUnitsPerVolume ?? (dimensions[0] <= 100 ? 4 : 2);
  }
  if (!capacity || capacity < 1) return manual(result, item, 'REGRA_DE_EMBALAGEM_NAO_CONFIGURADA');

  let sequence = 1;
  for (const quantity of chunks(item.quantity, capacity)) {
    let height = dimensions[2] * quantity;
    if (item.family === 'PANEL_60X60') {
      const perLayer = item.unitsPerLayer ?? defaults?.unitsPerLayer ?? 2;
      height = Math.ceil(quantity / perLayer) * dimensions[2];
    }
    result.volumes.push(makeVolume(item, quantity, [length, width, height], unitWeight * quantity, exclusive, sequence++));
  }
}

export function packCart(cartItems: ShippingCartItem[]): PackingResult {
  const result: PackingResult = { volumes: [], manualQuoteItems: [], warnings: [], assumptions: [] };
  for (const item of cartItems) packItem(item, result);
  return result;
}
