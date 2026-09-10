import type { ShippingFamily, ShippingMode } from './types';

export const SHIPPING_RULE_VERSION = '1.0';
export const PACKAGING = { defaultExtraCm: 2, maximumExtraCm: 3, tareKg: 0.05 } as const;

export const FAMILY_DEFAULTS: Partial<Record<ShippingFamily, {
  shippingMode: ShippingMode;
  maxUnitsPerVolume?: number;
  maxStackThicknessCm?: number;
  unitsPerLayer?: number;
  baseLengthCm?: number;
  baseWidthCm?: number;
  defaultUnitWeightKg?: number;
  exclusive?: boolean;
  unitsPerFactoryPack?: number;
}>> = {
  ABSORPTIVE_PANEL_RECT: { shippingMode: 'automatic', maxStackThicknessCm: 20 },
  PANEL_60X60: { shippingMode: 'automatic', maxUnitsPerVolume: 8, unitsPerLayer: 2, baseLengthCm: 120, baseWidthCm: 60 },
  DIFFUSER_SKYLINE_50: { shippingMode: 'automatic', maxUnitsPerVolume: 2, defaultUnitWeightKg: 6, exclusive: true },
  BASS_TRAP_CORNER: { shippingMode: 'automatic', exclusive: true },
  BASS_TRAP_MEMBRANE: { shippingMode: 'automatic', maxUnitsPerVolume: 1, defaultUnitWeightKg: 12, exclusive: true },
  RETRACTABLE_SCREEN: { shippingMode: 'automatic', maxUnitsPerVolume: 1, exclusive: true },
  MOBILE_SCREEN_TRESTLE: { shippingMode: 'automatic', maxUnitsPerVolume: 1, exclusive: true },
  ACOUSTIC_CURTAIN: { shippingMode: 'automatic_after_validation', exclusive: true },
  ACOUSTIC_DOOR: { shippingMode: 'quote_required' },
  EXPANDING_FOAM: { shippingMode: 'automatic', maxUnitsPerVolume: 12 },
  // A quantidade comercial deve representar um pacote fechado de seis placas.
  // Na V1 cada pacote viaja como volume próprio até haver validação de consolidação.
  ROCK_WOOL: { shippingMode: 'automatic_after_validation', unitsPerFactoryPack: 6, maxUnitsPerVolume: 1, exclusive: true },
  MANUAL_REVIEW: { shippingMode: 'quote_required' },
};
