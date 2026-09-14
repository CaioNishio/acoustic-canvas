export type ShippingFamily =
  | 'ABSORPTIVE_PANEL_RECT'
  | 'PANEL_60X60'
  | 'DIFFUSER_SKYLINE_50'
  | 'BASS_TRAP_CORNER'
  | 'BASS_TRAP_MEMBRANE'
  | 'RETRACTABLE_SCREEN'
  | 'MOBILE_SCREEN_TRESTLE'
  | 'ACOUSTIC_CURTAIN'
  | 'ACOUSTIC_DOOR'
  | 'EXPANDING_FOAM'
  | 'ROCK_WOOL'
  | 'MANUAL_REVIEW';

export type ValidationStatus = 'validated' | 'estimated' | 'manual_review';
export type ShippingMode = 'automatic' | 'automatic_after_validation' | 'quote_required';

export interface ShippingCartItem {
  variantId: string;
  sku?: string;
  title: string;
  quantity: number;
  family: ShippingFamily;
  lengthCm?: number;
  widthCm?: number;
  thicknessCm?: number;
  unitWeightKg?: number;
  validationStatus?: ValidationStatus;
  shippingMode?: ShippingMode;
  packedLengthCm?: number;
  packedWidthCm?: number;
  packedHeightCm?: number;
  maxUnitsPerVolume?: number;
  unitsPerLayer?: number;
  declaredValueCents?: number;
}

export interface ShippingVolume {
  id: string;
  family: ShippingFamily;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  productWeightKg: number;
  tareWeightKg: number;
  items: Array<{ variantId: string; sku?: string; quantity: number }>;
  exclusive: boolean;
  confidence: 'validated' | 'estimated';
}

export interface ManualQuoteItem {
  variantId: string;
  title: string;
  quantity: number;
  reason: string;
}

export interface PackingWarning {
  code: string;
  message: string;
  variantId?: string;
}

export interface PackingResult {
  volumes: ShippingVolume[];
  manualQuoteItems: ManualQuoteItem[];
  warnings: PackingWarning[];
  assumptions: string[];
}

export interface QuoteInput {
  originPostalCode: string;
  destinationPostalCode: string;
  declaredValueCents: number;
  volumes: ShippingVolume[];
}

export interface NormalizedRate {
  provider: string;
  carrier: string;
  serviceName: string;
  serviceCode: string;
  priceCents: number;
  deliveryDays?: number;
  description: string;
}

export interface ShippingProvider {
  readonly id: string;
  quote(input: QuoteInput): Promise<NormalizedRate[]>;
}
