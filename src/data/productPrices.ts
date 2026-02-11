// ─── TABELA DE PREÇOS (gerada a partir da planilha PRECOS_COMPLETOS) ──────────
// Todos os valores em R$ (preço sugerido)
// Última atualização: 11/02/2026

export interface SizePrice {
  dimensions: string;
  price: number;
}

export interface ProductPricing {
  /** Preço base (menor preço ou preço único) */
  basePrice: number;
  /** Unidade: "un", "m²", "metro", "kit", "projeto", "hora", "visita", "serviço" */
  unit: string;
  /** Preços por tamanho (quando há variações) */
  sizes?: SizePrice[];
  /** Observação extra */
  note?: string;
}

/** Mapa slug → pricing */
export const productPrices: Record<string, ProductPricing> = {
  // ── PAINÉIS ACÚSTICOS ─────────────────────────────────────────
  "painel-acustico-snr3250": {
    basePrice: 92.45,
    unit: "un",
    sizes: [
      { dimensions: "600×600×50 mm", price: 92.45 },
      { dimensions: "800×600×50 mm", price: 122.45 },
      { dimensions: "1000×600×50 mm", price: 152.45 },
      { dimensions: "1200×600×50 mm", price: 182.45 },
      { dimensions: "1500×600×50 mm", price: 227.45 },
      { dimensions: "1800×600×50 mm", price: 272.45 },
      { dimensions: "2000×600×50 mm", price: 302.45 },
    ],
    note: "Sob medida: consultar",
  },

  "painel-acustico-snr6450": {
    basePrice: 119.95,
    unit: "un",
    sizes: [
      { dimensions: "600×600×50 mm", price: 119.95 },
      { dimensions: "800×600×50 mm", price: 158.95 },
      { dimensions: "1000×600×50 mm", price: 197.95 },
      { dimensions: "1200×600×50 mm", price: 236.95 },
      { dimensions: "1500×600×50 mm", price: 295.95 },
      { dimensions: "1800×600×50 mm", price: 353.95 },
      { dimensions: "2000×600×50 mm", price: 392.95 },
    ],
    note: "Sob medida: consultar",
  },

  "painel-acustico-snr3225-slim": {
    basePrice: 82.45,
    unit: "un",
  },

  "painel-moldura-madeira": {
    basePrice: 122.45,
    unit: "un",
  },

  "painel-imagem-plotada": {
    basePrice: 132.45,
    unit: "un",
  },

  "painel-mdf-vazado": {
    basePrice: 142.45,
    unit: "un",
  },

  // ── PAINÉIS ESPECIAIS ─────────────────────────────────────────
  "painel-hexagonal": {
    basePrice: 112.45,
    unit: "un",
  },

  "painel-circle-360": {
    basePrice: 122.45,
    unit: "un",
  },

  "painel-triangular-3s": {
    basePrice: 102.45,
    unit: "un",
  },

  "painel-led-rgb": {
    basePrice: 144.45,
    unit: "un",
  },

  "painel-led-fosco": {
    basePrice: 134.45,
    unit: "un",
  },

  "hexagono-led-decorativo": {
    basePrice: 92.45,
    unit: "un",
  },

  "reflexive-panels": {
    basePrice: 164.45,
    unit: "un",
  },

  // ── NUVENS ACÚSTICAS ──────────────────────────────────────────
  "nuvem-acustica-snr3250": {
    basePrice: 92.45,
    unit: "un",
    sizes: [
      { dimensions: "600×600×50 mm", price: 92.45 },
      { dimensions: "1000×600×50 mm", price: 152.45 },
      { dimensions: "1200×600×50 mm", price: 182.45 },
      { dimensions: "1500×600×50 mm", price: 227.45 },
      { dimensions: "1800×600×50 mm", price: 272.45 },
      { dimensions: "2000×600×50 mm", price: 302.45 },
    ],
  },

  // ── BASS TRAPS ────────────────────────────────────────────────
  "bass-trap-corner-3s-snr6430": {
    basePrice: 194.45,
    unit: "un",
  },

  "bass-trap-membrana-snr6420": {
    basePrice: 264.45,
    unit: "un",
  },

  // ── DIFUSORES ─────────────────────────────────────────────────
  "difusor-qrd": {
    basePrice: 339.45,
    unit: "un",
  },

  "difusor-skyline": {
    basePrice: 294.45,
    unit: "un",
  },

  "difusor-bidimensional": {
    basePrice: 314.45,
    unit: "un",
  },

  // ── BAFFLES & FORROS ──────────────────────────────────────────
  "baffles-acusticos": {
    basePrice: 92.45,
    unit: "un",
  },

  "forro-acustico-modular": {
    basePrice: 82.45,
    unit: "m²",
  },

  // ── BIOMBOS ACÚSTICOS ─────────────────────────────────────────
  "biombo-acustico-retratil": {
    basePrice: 624.45,
    unit: "un",
    sizes: [
      { dimensions: "180×60×5 cm", price: 924.45 },
      { dimensions: "150×60×5 cm", price: 774.45 },
      { dimensions: "120×60×5 cm", price: 624.45 },
    ],
  },

  "biombo-acustico-cavalete": {
    basePrice: 464.45,
    unit: "un",
  },

  // ── PORTAS & CORTINAS ─────────────────────────────────────────
  "cortina-acustica-snr96c": {
    basePrice: 774.45,
    unit: "un",
  },

  "porta-acustica-dupla": {
    basePrice: 2549.45,
    unit: "un",
  },

  "porta-acustica-anti-panico": {
    basePrice: 2949.45,
    unit: "un",
  },

  "painel-isolamento-d96": {
    basePrice: 399.45,
    unit: "un",
  },

  // ── MATÉRIA-PRIMA ─────────────────────────────────────────────
  "la-de-rocha-d32": {
    basePrice: 30.45,
    unit: "m²",
  },

  "la-de-rocha-d64": {
    basePrice: 40.45,
    unit: "m²",
  },

  "la-de-rocha-d96": {
    basePrice: 50.45,
    unit: "m²",
  },

  "la-de-pet": {
    basePrice: 37.45,
    unit: "m²",
  },

  "membrana-borracha": {
    basePrice: 67.95,
    unit: "m²",
  },

  "tecidos-acusticos": {
    basePrice: 37.45,
    unit: "m²",
  },

  "carpete-acustico": {
    basePrice: 47.45,
    unit: "m²",
  },

  "piso-emborrachado": {
    basePrice: 92.45,
    unit: "m²",
  },

  "drywall": {
    basePrice: 43.95,
    unit: "m²",
  },

  "espuma-expansiva": {
    basePrice: 19.95,
    unit: "un",
    note: "Lata 500ml",
  },

  // ── ACESSÓRIOS & SUPORTES ─────────────────────────────────────
  "suportes-instalacao": {
    basePrice: 4.20,
    unit: "un",
    note: "Preço por componente individual",
  },

  "velcro-50mm": {
    basePrice: 7.45,
    unit: "metro",
  },

  "microfone-medicao": {
    basePrice: 1349.45,
    unit: "un",
  },

  "cadeiras-estudio": {
    basePrice: 624.45,
    unit: "un",
    note: "Cadeira de escritório a partir de R$ 624,45",
  },

  "tapetes-acusticos": {
    basePrice: 57.45,
    unit: "m²",
  },

  "kit-fixacao-acustica": {
    basePrice: 13.95,
    unit: "kit",
    note: "Kit unitário (1 fixador + 2 parafusos + 2 buchas)",
  },

  // ── KITS COMPLETOS ────────────────────────────────────────────
  "kit-estudio-classic": {
    basePrice: 1549.45,
    unit: "kit",
  },

  "kit-estudio-premium": {
    basePrice: 2849.45,
    unit: "kit",
  },

  "kit-estudio-pro": {
    basePrice: 5099.45,
    unit: "kit",
  },

  // ── SERVIÇOS ──────────────────────────────────────────────────
  "projeto-3d": {
    basePrice: 524.45,
    unit: "projeto",
  },

  "consultoria-tecnica": {
    basePrice: 209.95,
    unit: "hora",
  },

  "visita-tecnica": {
    basePrice: 159.95,
    unit: "visita",
  },

  "integracao-transportadora": {
    basePrice: 94.95,
    unit: "serviço",
  },

  // ── REVESTIMENTOS ─────────────────────────────────────────────
  "revestimento-ripado": {
    basePrice: 0,
    unit: "m²",
    note: "Consultar",
  },
};

/** Formata preço em R$ brasileiro */
export function formatPrice(value: number): string {
  if (value <= 0) return "Sob consulta";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Retorna label de unidade amigável */
export function unitLabel(unit: string): string {
  const labels: Record<string, string> = {
    un: "/un",
    "m²": "/m²",
    metro: "/m",
    kit: "/kit",
    projeto: "",
    hora: "/hora",
    visita: "",
    serviço: "",
  };
  return labels[unit] ?? "";
}
