import type { ShippingFamily } from './types';

/**
 * Classificação inicial por produto local. Ela só identifica a regra aplicável;
 * a cotação continua bloqueada até cada variante Shopify receber medidas e peso
 * embalados validados no catálogo físico privado.
 */
export const LOCAL_PRODUCT_FAMILY: Record<string, ShippingFamily> = {
  'painel-acustico-snr3250': 'ABSORPTIVE_PANEL_RECT',
  'painel-acustico-snr6450': 'ABSORPTIVE_PANEL_RECT',
  'painel-acustico-snr3225-slim': 'ABSORPTIVE_PANEL_RECT',
  'painel-moldura-madeira': 'ABSORPTIVE_PANEL_RECT',
  'painel-imagem-plotada': 'ABSORPTIVE_PANEL_RECT',
  'painel-mdf-vazado': 'MANUAL_REVIEW',
  'painel-hexagonal': 'MANUAL_REVIEW',
  'painel-circle-360': 'MANUAL_REVIEW',
  'painel-triangular-3s': 'MANUAL_REVIEW',
  'painel-led-rgb': 'MANUAL_REVIEW',
  'painel-led-fosco': 'MANUAL_REVIEW',
  'hexagono-led-decorativo': 'MANUAL_REVIEW',
  'reflexive-panels': 'MANUAL_REVIEW',
  'nuvem-acustica-snr3250': 'MANUAL_REVIEW',
  'bass-trap-corner-3s-snr6430': 'BASS_TRAP_CORNER',
  'bass-trap-membrana-snr6420': 'BASS_TRAP_MEMBRANE',
  'difusor-qrd': 'MANUAL_REVIEW',
  'difusor-skyline': 'DIFFUSER_SKYLINE_50',
  'difusor-bidimensional': 'MANUAL_REVIEW',
  'baffles-acusticos': 'MANUAL_REVIEW',
  'forro-acustico-modular': 'MANUAL_REVIEW',
  'biombo-acustico-retratil': 'RETRACTABLE_SCREEN',
  'biombo-acustico-cavalete': 'MOBILE_SCREEN_TRESTLE',
  'cortina-acustica-snr96c': 'ACOUSTIC_CURTAIN',
  'porta-acustica-dupla': 'ACOUSTIC_DOOR',
  'porta-acustica-anti-panico': 'ACOUSTIC_DOOR',
  'la-de-rocha-d32': 'ROCK_WOOL',
  'la-de-rocha-d64': 'ROCK_WOOL',
  'la-de-rocha-d96': 'ROCK_WOOL',
  'espuma-expansiva': 'EXPANDING_FOAM',
};

export function familyForLocalProduct(slug: string): ShippingFamily {
  return LOCAL_PRODUCT_FAMILY[slug] ?? 'MANUAL_REVIEW';
}
