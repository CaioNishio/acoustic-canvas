/**
 * Motor acústico — dimensionamento por banda de oitava.
 *
 * Substitui a regra de bolso "percentual da superfície" por Sabine/Eyring de verdade:
 * parte-se do RT60 alvo, calcula-se a absorção requerida, desconta-se o que a sala nua
 * já tem, e só então se converte em quantidade de produto usando o α medido de cada um.
 *
 * Referências (ver E:\Sonar-MCP\20_CONHECIMENTO_WEB_ACUSTICA\01_ACUSTICA):
 *   - Sabine / Eyring .......... Everest & Pohlmann, "Master Handbook of Acoustics", cap. 7
 *                                Kuttruff, "Room Acoustics", cap. 5
 *   - Frequência de Schroeder .. Kuttruff, cap. 3
 *   - Limite de absorção ....... Toole, "Sound Reproduction", cap. 9
 *
 * PROCEDÊNCIA DOS COEFICIENTES
 *   - Produtos: lã de rocha THERMAX® (ROCKFIBRAS/SOPREMA), ensaiada conforme
 *     ISO/R 354 e ASTM C 423 em corpos de prova de 51 mm. Mesma fonte de
 *     `absorptionTableD32_50` em `src/data/products.ts` e das fichas de produto.
 *   - Sala nua: valores típicos de literatura para os acabamentos assumidos. NÃO são
 *     ensaio do ambiente do cliente — por isso o resultado é declarado como estimativa,
 *     e a suposição de acabamento é exibida na interface.
 *
 * LIMITE DE PROJETO: o ensaio reporta α > 1,0 em algumas bandas (previsto em norma,
 * por difração de borda no corpo de prova). Para dimensionamento, o próprio catálogo
 * determina considerar 1,0 — usar 1,28 superestimaria a absorção e entregaria uma sala
 * mais reverberante que o previsto. O limite é aplicado em `clampForDesign()`.
 */

/** Teto de projeto para α. Ver nota de norma no cabeçalho. */
const clampForDesign = (a: BandValuesLike): BandValues =>
  a.map((v) => Math.min(v, 1.0)) as BandValues;

type BandValuesLike = readonly number[];

/** Bandas de oitava usadas em todo o motor. Coincidem com as do catálogo. */
export const BANDS = [125, 250, 500, 1000, 2000, 4000] as const;
export type BandValues = [number, number, number, number, number, number];

/** Banda de referência para RT60 de projeto (convenção de mercado e ISO 3382). */
const REF_BAND_INDEX = 2; // 500 Hz

// ─────────────────────────────────────────────────────────────
// COEFICIENTES
// ─────────────────────────────────────────────────────────────

/**
 * α da sala nua, por superfície. Valores típicos de literatura.
 *
 * A calculadora não pergunta acabamento, então assumimos o caso mais comum e mais
 * desfavorável em salas brasileiras: alvenaria/drywall pintado com piso duro.
 * Esta suposição é EXIBIDA ao usuário — não é escondida.
 */
const BARE = {
  /** parede de alvenaria pintada ou drywall sobre montantes */
  wall: [0.14, 0.10, 0.06, 0.05, 0.05, 0.05] as BandValues,
  /** laje / forro rígido pintado */
  ceiling: [0.14, 0.10, 0.06, 0.05, 0.05, 0.05] as BandValues,
  /** piso duro: cerâmica, porcelanato, laminado sobre contrapiso */
  floor: [0.02, 0.02, 0.02, 0.03, 0.03, 0.03] as BandValues,
};

/**
 * α dos produtos, por banda. Origem: `absorptionTableD32_50` (products.ts).
 * Chave = densidade do núcleo em kg/m³, espessura 51 mm.
 */
const PRODUCT_ALPHA: Record<number, BandValues> = {
  32: clampForDesign([0.16, 0.52, 0.82, 0.92, 0.94, 0.96]),
  48: clampForDesign([0.26, 0.7, 1.08, 1.02, 0.76, 0.96]),
  64: clampForDesign([0.16, 0.66, 1.0, 1.05, 1.02, 1.04]),
  96: clampForDesign([0.13, 0.66, 1.13, 1.28, 1.23, 1.26]),
};

export type ProductAcoustic = {
  /** área de uma unidade, em m² */
  unitArea: number;
  alpha: BandValues;
  /** true quando o α não vem de ensaio do produto, e sim de estimativa */
  estimated?: boolean;
  note?: string;
};

/**
 * Deslocamento de uma oitava para baixo.
 *
 * Aproximação documentada: dobrar a espessura efetiva de um absorvedor poroso desloca a
 * curva de absorção cerca de uma oitava para baixo (`f ≈ c/4d`). Serve para estimar
 * peças de 100 mm a partir do ensaio de 51 mm — e é SEMPRE marcado como estimativa,
 * nunca apresentado como medição.
 */
function shiftOctaveDown(a: BandValues): BandValues {
  // o valor de cada banda passa a ser o da banda imediatamente acima
  return [a[1], a[2], a[3], a[4], a[5], a[5]];
}

export const CATALOG_ACOUSTIC: Record<string, ProductAcoustic> = {
  // Painel 1200×600 mm, D32, 50 mm — dado de ensaio
  "painel-acustico-snr3250": { unitArea: 1.2 * 0.6, alpha: PRODUCT_ALPHA[32] },
  // Painel 1200×600 mm, D64, 50 mm — dado de ensaio
  "painel-acustico-snr6450": { unitArea: 1.2 * 0.6, alpha: PRODUCT_ALPHA[64] },
  // Slim 25 mm — metade da espessura: curva sobe uma oitava (estimativa)
  "painel-acustico-snr3225-slim": {
    unitArea: 1.2 * 0.6,
    alpha: [0.08, 0.16, 0.52, 0.82, 0.92, 0.94],
    estimated: true,
    note: "Estimado a partir do ensaio de 51 mm, deslocado uma oitava para cima (25 mm).",
  },
  // Nuvem: exposta nas duas faces — área acústica efetiva maior que a geométrica
  "nuvem-acustica-snr3250": {
    unitArea: 1.2 * 0.6 * 1.8,
    alpha: PRODUCT_ALPHA[32],
    estimated: true,
    note: "Suspensa: absorve pelas duas faces. Fator 1,8× sobre a área geométrica.",
  },
  // Bass trap de canto 300×300×1200, D64, 100 mm
  "bass-trap-corner-3s-snr6430": {
    unitArea: 0.3 * 1.2 * 2,
    alpha: shiftOctaveDown(PRODUCT_ALPHA[64]),
    estimated: true,
    note: "Estimado: 100 mm em canto, curva deslocada uma oitava abaixo do ensaio de 51 mm.",
  },
  // Baffle: pendurado, duas faces
  "baffles-acusticos": {
    unitArea: 1.2 * 0.6 * 1.8,
    alpha: PRODUCT_ALPHA[32],
    estimated: true,
    note: "Suspenso: absorve pelas duas faces.",
  },
};

// ─────────────────────────────────────────────────────────────
// NÚCLEO
// ─────────────────────────────────────────────────────────────

export interface Room {
  w: number;
  l: number;
  h: number;
}

export const volumeOf = (r: Room) => r.w * r.l * r.h;
export const surfaceOf = (r: Room) => 2 * (r.w * r.l + r.w * r.h + r.l * r.h);

/** Absorção da sala nua, em sabines métricos, por banda. */
export function bareAbsorption(r: Room): BandValues {
  const floor = r.w * r.l;
  const ceiling = r.w * r.l;
  const walls = 2 * (r.w * r.h + r.l * r.h);
  return BANDS.map(
    (_, i) => floor * BARE.floor[i] + ceiling * BARE.ceiling[i] + walls * BARE.wall[i],
  ) as BandValues;
}

/**
 * RT60 por banda.
 *
 * Sabine vale para campo difuso e ᾱ baixo. Acima de ᾱ ≈ 0,2 ele superestima — prevê
 * reverberação que não existe — então usamos Eyring. A troca é automática e o método
 * escolhido é reportado, para o usuário saber o que está vendo.
 */
export function rt60ByBand(
  r: Room,
  absorption: BandValues,
): { rt: BandValues; method: ("sabine" | "eyring")[] } {
  const V = volumeOf(r);
  const S = surfaceOf(r);
  const rt: number[] = [];
  const method: ("sabine" | "eyring")[] = [];

  for (let i = 0; i < BANDS.length; i++) {
    const A = Math.max(absorption[i], 0.01);
    const alphaBar = Math.min(A / S, 0.99);
    if (alphaBar < 0.2) {
      rt.push((0.161 * V) / A);
      method.push("sabine");
    } else {
      rt.push((0.161 * V) / (-S * Math.log(1 - alphaBar)));
      method.push("eyring");
    }
  }
  return { rt: rt as BandValues, method };
}

/**
 * Frequência de Schroeder — abaixo dela o campo não é difuso e o RT60 estatístico
 * perde significado físico. Kuttruff, cap. 3.
 */
export function schroederFrequency(V: number, rtMid: number): number {
  return 2000 * Math.sqrt(rtMid / V);
}

/** Absorção requerida (sabines) para atingir o RT alvo, na banda de referência. */
export function requiredAbsorption(r: Room, rtTarget: number): number {
  return (0.161 * volumeOf(r)) / rtTarget;
}

export interface Recommendation {
  slug: string;
  qty: number;
}

/** Absorção total (nua + tratamento) por banda. */
export function treatedAbsorption(r: Room, items: Recommendation[]): BandValues {
  const total = [...bareAbsorption(r)] as BandValues;
  for (const it of items) {
    const p = CATALOG_ACOUSTIC[it.slug];
    if (!p) continue;
    for (let i = 0; i < BANDS.length; i++) {
      // o produto cobre superfície que antes era parede: desconta-se o α da parede
      const net = Math.max(p.alpha[i] - BARE.wall[i], 0);
      total[i] += it.qty * p.unitArea * net;
    }
  }
  return total;
}

export interface Dimensioning {
  volume: number;
  surface: number;
  rtTarget: number;
  /** absorção que falta na banda de 500 Hz, em sabines */
  missingAtRef: number;
  /** unidades do painel principal para cobrir o que falta */
  mainPanelQty: number;
  /** teto de absorção: acima disso a sala fica "morta" (Toole, cap. 9) */
  cappedByComfort: boolean;
  schroeder: number;
  warnings: string[];
  assumptions: string[];
}

/**
 * Dimensionamento honesto: RT alvo → absorção requerida → desconto da sala nua →
 * quantidade pelo α real do produto.
 */
export function dimension(
  r: Room,
  rtTarget: number,
  mainPanelSlug: string,
): Dimensioning {
  const V = volumeOf(r);
  const S = surfaceOf(r);
  const bare = bareAbsorption(r);
  const required = requiredAbsorption(r, rtTarget);
  const missing = Math.max(required - bare[REF_BAND_INDEX], 0);

  const panel = CATALOG_ACOUSTIC[mainPanelSlug] ?? CATALOG_ACOUSTIC["painel-acustico-snr3250"];
  const netAlpha = Math.max(panel.alpha[REF_BAND_INDEX] - BARE.wall[REF_BAND_INDEX], 0.01);
  const perUnit = panel.unitArea * netAlpha;

  let qty = Math.ceil(missing / perUnit);

  // Teto de conforto: não cobrir mais que 60% da superfície com absorção.
  // Sala "morta" é tão ruim quanto sala viva (Toole, cap. 9).
  const maxUnits = Math.floor((S * 0.6) / panel.unitArea);
  const capped = qty > maxUnits;
  if (capped) qty = maxUnits;

  const warnings: string[] = [];
  const assumptions: string[] = [];

  assumptions.push(
    "Sala nua considerada com paredes e teto em alvenaria/drywall pintado e piso duro.",
  );
  assumptions.push(
    "Coeficientes dos produtos conforme ficha técnica (ensaio a 51 mm); peças de outras espessuras são estimativas declaradas.",
  );

  const { rt } = rt60ByBand(r, bare);
  const fs = schroederFrequency(V, rt[REF_BAND_INDEX]);

  if (fs > 125) {
    warnings.push(
      `Frequência de Schroeder ≈ ${Math.round(fs)} Hz. Abaixo disso o campo não é difuso e o RT60 calculado não descreve a sala — o controle de graves nos cantos importa mais que a área total de absorção.`,
    );
  }
  if (capped) {
    warnings.push(
      `Para atingir ${rtTarget.toFixed(2)} s seria necessário exceder 60% da superfície em absorção. A quantidade foi limitada: acima disso a sala fica surda e desconfortável.`,
    );
  }
  if (missing <= 0) {
    warnings.push(
      "A sala nua já atinge o RT60 alvo na banda de referência. O tratamento aqui é de refino — foque em primeira reflexão e graves.",
    );
  }

  return {
    volume: V,
    surface: S,
    rtTarget,
    missingAtRef: missing,
    mainPanelQty: Math.max(qty, 0),
    cappedByComfort: capped,
    schroeder: fs,
    warnings,
    assumptions,
  };
}
