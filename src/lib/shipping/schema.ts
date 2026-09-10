import { z } from 'zod';
import type { ShippingCartItem } from './types';

const positiveNumber = z.number().finite().positive();

export const shippingCatalogItemSchema = z.object({
  variantId: z.string().min(1),
  sku: z.string().min(1).optional(),
  title: z.string().min(1),
  family: z.enum([
    'ABSORPTIVE_PANEL_RECT', 'PANEL_60X60', 'DIFFUSER_SKYLINE_50',
    'BASS_TRAP_CORNER', 'BASS_TRAP_MEMBRANE', 'RETRACTABLE_SCREEN',
    'MOBILE_SCREEN_TRESTLE', 'ACOUSTIC_CURTAIN', 'ACOUSTIC_DOOR',
    'EXPANDING_FOAM', 'ROCK_WOOL', 'MANUAL_REVIEW',
  ]),
  lengthCm: positiveNumber.optional(),
  widthCm: positiveNumber.optional(),
  thicknessCm: positiveNumber.optional(),
  unitWeightKg: positiveNumber.optional(),
  validationStatus: z.enum(['validated', 'estimated', 'manual_review']).default('manual_review'),
  shippingMode: z.enum(['automatic', 'automatic_after_validation', 'quote_required']).optional(),
  packedLengthCm: positiveNumber.optional(),
  packedWidthCm: positiveNumber.optional(),
  packedHeightCm: positiveNumber.optional(),
  maxUnitsPerVolume: z.number().int().positive().optional(),
  unitsPerLayer: z.number().int().positive().optional(),
});

export const shippingCatalogSchema = z.array(shippingCatalogItemSchema);
export type ShippingCatalogItem = z.infer<typeof shippingCatalogItemSchema>;

export function makeCartItem(item: ShippingCatalogItem, quantity: number, declaredValueCents: number): ShippingCartItem {
  return {
    variantId: String(item.variantId),
    sku: item.sku,
    title: String(item.title),
    family: item.family as ShippingCartItem['family'],
    lengthCm: item.lengthCm,
    widthCm: item.widthCm,
    thicknessCm: item.thicknessCm,
    unitWeightKg: item.unitWeightKg,
    validationStatus: item.validationStatus as ShippingCartItem['validationStatus'],
    shippingMode: item.shippingMode as ShippingCartItem['shippingMode'],
    packedLengthCm: item.packedLengthCm,
    packedWidthCm: item.packedWidthCm,
    packedHeightCm: item.packedHeightCm,
    maxUnitsPerVolume: item.maxUnitsPerVolume,
    unitsPerLayer: item.unitsPerLayer,
    quantity,
    declaredValueCents,
  };
}
