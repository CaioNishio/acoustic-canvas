/**
 * Motor de layout acústico — decide ONDE cada material vai, como DADOS.
 *
 * Este módulo não renderiza nada. Ele produz uma lista de posições validadas,
 * que o Room3DViewer apenas desenha. A separação é o que torna possível:
 *
 *   - garantir que nada se sobreponha (há um gerenciador de espaço por superfície)
 *   - garantir alinhamento rígido (tudo compartilha linha de base e grade)
 *   - testar o layout sem precisar de WebGL
 *
 * Referências técnicas — ver memória `acoustics-reference-library`:
 *   - Everest & Pohlmann, "Master Handbook of Acoustics", 6ª ed. — cap. 12 (absorvedores)
 *   - Toole, "Sound Reproduction", 3ª ed. — cap. 9 (reflexões precoces)
 *   - Cox & D'Antonio, "Acoustic Absorbers and Diffusers", 3ª ed. — cap. 9 (campo do difusor)
 */

export type LayoutPreset = "simetrico" | "reflexao" | "hibrido";

export type Surface = "left" | "right" | "back" | "front" | "ceiling";

export type ItemKind =
  | "panel"
  | "slim"
  | "bassTrap"
  | "cloud"
  | "diffuser"
  | "baffle";

export interface ProductPlacement {
  name: string;
  placement: string;
  qty: number;
  slug: string;
}

/** Uma peça já posicionada e validada no espaço da sala. */
export interface Placement {
  id: string;
  kind: ItemKind;
  surface: Surface;
  /** centro da peça, em metros, origem no centro do piso */
  position: [number, number, number];
  /** largura e altura da FACE da peça (no plano da superfície) */
  size: [number, number];
  /** profundidade a partir da superfície */
  depth: number;
  /** rotação extra em radianos (usada na inclinação das nuvens) */
  tilt?: number;
  color: string;
  /** número de unidades, para difusores compostos */
  units?: number;
}

export interface LayoutResult {
  placements: Placement[];
  /** avisos técnicos honestos — o que não coube ou não é recomendável */
  warnings: string[];
  /** quantas peças de cada tipo foram efetivamente colocadas vs. pedidas */
  fitted: Record<string, { requested: number; placed: number }>;
}

// ─────────────────────────────────────────────────────────────
// DIMENSÕES REAIS DO CATÁLOGO SONAR (metros)
// ─────────────────────────────────────────────────────────────
const GEO = {
  panel: { w: 1.2, h: 0.6, d: 0.05 },
  slim: { w: 1.2, h: 0.6, d: 0.025 },
  cloud: { w: 1.2, h: 0.6, d: 0.05 },
  baffle: { w: 1.2, h: 0.6, d: 0.05 },
  diffuserUnit: { w: 0.6, h: 0.6, d: 0.1 },
  bassTrapSide: 0.3,
} as const;

const COLOR = {
  panelPrimary: "#4A7FAA",
  panelSecondary: "#5A8FBF",
  panelFront: "#6AAED4",
  slim: "#7EB8E0",
  bassTrap: "#C76D2E",
  cloud: "#3B82F6",
  diffuser: "#8B6914",
  baffle: "#2563EB",
} as const;

/** Margem mínima da borda da parede, para não colar no canto. */
const EDGE_MARGIN = 0.15;
/** Folga mínima entre peças vizinhas. */
const MIN_GAP = 0.08;

// ─────────────────────────────────────────────────────────────
// GRADE: o coração do alinhamento
// ─────────────────────────────────────────────────────────────

interface GridSpec {
  /** posições ao longo do eixo horizontal da superfície */
  cols: number[];
  /** posições ao longo do eixo vertical da superfície */
  rows: number[];
  /** capacidade total */
  capacity: number;
}

/**
 * Calcula uma grade CENTRADA que garantidamente cabe na superfície.
 *
 * Em vez de espaçar os centros uniformemente (o que sobrepõe quando há muitas
 * peças), calcula-se primeiro quantas peças cabem de fato, considerando a
 * largura real da peça e a folga mínima. O bloco resultante é então centralizado.
 */
function buildGrid(
  surfaceW: number,
  surfaceH: number,
  itemW: number,
  itemH: number,
  wanted: number,
  opts: { baseline?: number; maxRows?: number } = {},
): GridSpec {
  const usableW = surfaceW - 2 * EDGE_MARGIN;
  const usableH = surfaceH - 2 * EDGE_MARGIN;

  const maxCols = Math.max(0, Math.floor((usableW + MIN_GAP) / (itemW + MIN_GAP)));
  const maxRowsFit = Math.max(0, Math.floor((usableH + MIN_GAP) / (itemH + MIN_GAP)));
  const maxRows = Math.min(maxRowsFit, opts.maxRows ?? maxRowsFit);

  if (maxCols === 0 || maxRows === 0) {
    return { cols: [], rows: [], capacity: 0 };
  }

  const nCols = Math.min(maxCols, Math.max(1, wanted));
  const nRows = Math.min(maxRows, Math.ceil(wanted / nCols));

  // Distribui os centros das colunas de forma simétrica em torno de zero.
  const pitchX = nCols > 1 ? Math.min(itemW + MIN_GAP, usableW / nCols) : 0;
  const spanX = pitchX * (nCols - 1);
  const cols = Array.from({ length: nCols }, (_, i) => -spanX / 2 + i * pitchX);

  // Linhas empilham a partir da linha de base, para cima.
  const baseline = opts.baseline ?? 0;
  const pitchY = itemH + MIN_GAP;
  const rows = Array.from({ length: nRows }, (_, i) => baseline + i * pitchY);

  return { cols, rows, capacity: nCols * nRows };
}

/**
 * Altura da linha de base dos painéis de parede.
 *
 * Referência: Everest & Pohlmann — o tratamento de primeira reflexão deve cobrir
 * a altura do ouvido sentado (~1.20 m). Centramos a peça nessa cota, e nunca
 * deixamos ela ultrapassar o teto.
 */
function earLevel(roomH: number): number {
  return Math.min(1.2, roomH * 0.5);
}

// ─────────────────────────────────────────────────────────────
// PONTOS DE PRIMEIRA REFLEXÃO (fontes-imagem)
// ─────────────────────────────────────────────────────────────

/**
 * Calcula onde a primeira reflexão lateral atinge cada parede, pelo método
 * das fontes-imagem (Kuttruff, "Room Acoustics", cap. 4).
 *
 * Espelha a fonte através da parede e traça a reta até o ouvinte; a interseção
 * com o plano da parede é o ponto a tratar.
 */
function firstReflectionZ(
  wallX: number,
  speakerX: number,
  speakerZ: number,
  listenerX: number,
  listenerZ: number,
): number {
  const imageX = 2 * wallX - speakerX; // fonte espelhada
  const dx = listenerX - imageX;
  if (Math.abs(dx) < 1e-6) return (speakerZ + listenerZ) / 2;
  const t = (wallX - imageX) / dx;
  return speakerZ + t * (listenerZ - speakerZ);
}

// ─────────────────────────────────────────────────────────────
// CLASSIFICAÇÃO DE PRODUTO
// ─────────────────────────────────────────────────────────────

export function classify(name: string): ItemKind | null {
  const n = name.toLowerCase();
  if (n.includes("bass trap")) return "bassTrap";
  if (n.includes("nuvem")) return "cloud";
  if (n.includes("difusor")) return "diffuser";
  if (n.includes("baffle")) return "baffle";
  if (n.includes("slim")) return "slim";
  if (n.includes("painel")) return "panel";
  return null; // kits de fixação, insumos etc. não têm representação 3D
}

// ─────────────────────────────────────────────────────────────
// MOTOR PRINCIPAL
// ─────────────────────────────────────────────────────────────

export function computeLayout(
  products: ProductPlacement[],
  room: { w: number; l: number; h: number },
  preset: LayoutPreset,
  ctx: { hasMonitors: boolean; hasSub: boolean },
): LayoutResult {
  const { w, l, h } = room;
  const placements: Placement[] = [];
  const warnings: string[] = [];
  const fitted: LayoutResult["fitted"] = {};

  const earH = earLevel(h);

  // Agrupa por tipo — dois produtos "Painel" diferentes somam quantidade
  // em vez de disputarem a mesma parede (era a causa da sobreposição).
  const byKind = new Map<ItemKind, { qty: number; slugs: string[] }>();
  for (const p of products) {
    const kind = classify(p.name);
    if (!kind) continue;
    const entry = byKind.get(kind) ?? { qty: 0, slugs: [] };
    entry.qty += p.qty;
    entry.slugs.push(p.slug);
    byKind.set(kind, entry);
  }

  const record = (kind: string, requested: number, placed: number) => {
    fitted[kind] = { requested, placed };
    if (placed < requested) {
      warnings.push(
        `${kind}: ${requested} unidades recomendadas, ${placed} cabem fisicamente nas superfícies desta sala.`,
      );
    }
  };

  // ── BASS TRAPS: colunas de canto, do piso ao teto ──
  // Referência visual do cliente + Everest cap. 12: absorvedor de canto precisa
  // de profundidade e altura para atuar no regime modal.
  const bass = byKind.get("bassTrap");
  if (bass) {
    const corners: [number, number][] = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];
    const n = Math.min(bass.qty, 4);
    for (let i = 0; i < n; i++) {
      const [cx, cz] = corners[i];
      placements.push({
        id: `bassTrap-${i}`,
        kind: "bassTrap",
        surface: cx < 0 ? "left" : "right",
        // centro vertical no meio da altura: a coluna vai do piso ao teto
        position: [(cx * w) / 2, h / 2, (cz * l) / 2],
        size: [GEO.bassTrapSide, h],
        depth: GEO.bassTrapSide,
        color: COLOR.bassTrap,
      });
    }
    record("Bass Traps", bass.qty, n);
  }

  // ── PAINÉIS DE PAREDE ──
  const panel = byKind.get("panel");
  if (panel) {
    const requested = panel.qty;
    let placed = 0;
    const { w: pw, h: ph, d: pd } = GEO.panel;

    if (preset === "reflexao") {
      // Posição de escuta no eixo, a ~38% do comprimento (razão áurea de Bolt).
      const listenerZ = -l / 2 + l * 0.38;
      const speakerZ = -l / 2 + l * 0.15;
      const speakerX = Math.min(w * 0.25, 1.1);

      const zL = firstReflectionZ(-w / 2, -speakerX, speakerZ, 0, listenerZ);
      const zR = firstReflectionZ(w / 2, speakerX, speakerZ, 0, listenerZ);
      const clampZ = (z: number) =>
        Math.max(-l / 2 + EDGE_MARGIN + pw / 2, Math.min(l / 2 - EDGE_MARGIN - pw / 2, z));

      // Par de primeira reflexão — sempre espelhado, mesma cota.
      for (const [side, z] of [
        [-1, clampZ(zL)],
        [1, clampZ(zR)],
      ] as const) {
        placements.push({
          id: `panel-frp-${side < 0 ? "l" : "r"}`,
          kind: "panel",
          surface: side < 0 ? "left" : "right",
          position: [(side * w) / 2 - (side * pd) / 2, earH, z],
          size: [pw, ph],
          depth: pd,
          color: COLOR.panelPrimary,
        });
        placed++;
      }

      // O restante vai para as laterais atrás do ouvinte, em grade alinhada.
      const remaining = Math.max(0, requested - placed);
      const perSide = Math.floor(remaining / 2);
      if (perSide > 0) {
        const zoneStart = clampZ(zL) + pw / 2 + MIN_GAP;
        const zoneLen = Math.max(0, l / 2 - EDGE_MARGIN - zoneStart);
        const grid = buildGrid(zoneLen, h, pw, ph, perSide, { baseline: earH, maxRows: 2 });
        const zoneCenter = zoneStart + zoneLen / 2;
        let k = 0;
        for (const row of grid.rows) {
          for (const col of grid.cols) {
            if (k >= perSide) break;
            for (const side of [-1, 1] as const) {
              placements.push({
                id: `panel-side-${side < 0 ? "l" : "r"}-${k}`,
                kind: "panel",
                surface: side < 0 ? "left" : "right",
                position: [(side * w) / 2 - (side * pd) / 2, row, zoneCenter + col],
                size: [pw, ph],
                depth: pd,
                color: COLOR.panelSecondary,
              });
            }
            placed += 2;
            k++;
          }
        }
      }
    } else {
      // simetrico e hibrido: grade espelhada nas laterais + parede traseira.
      const sideShare = preset === "hibrido" ? 0.7 : 0.8;
      const perSide = Math.max(1, Math.floor((requested * sideShare) / 2));
      const backCount = Math.max(0, requested - perSide * 2);

      // No híbrido usamos DUAS fileiras com offset regular (padrão das
      // referências do cliente) — rítmico, nunca aleatório.
      const maxRows = preset === "hibrido" ? 2 : 1;
      const baseline = preset === "hibrido" ? earH - (ph + MIN_GAP) / 2 : earH;

      const grid = buildGrid(l, h, pw, ph, perSide, { baseline, maxRows });
      let k = 0;
      for (let r = 0; r < grid.rows.length; r++) {
        for (let c = 0; c < grid.cols.length; c++) {
          if (k >= perSide) break;
          // offset de meia-célula na fileira de cima → padrão de tijolo alinhado
          const stagger = preset === "hibrido" && r % 2 === 1 ? (pw + MIN_GAP) / 2 : 0;
          const z = grid.cols[c] + stagger;
          if (Math.abs(z) > l / 2 - EDGE_MARGIN - pw / 2) continue;
          for (const side of [-1, 1] as const) {
            placements.push({
              id: `panel-${side < 0 ? "l" : "r"}-${r}-${c}`,
              kind: "panel",
              surface: side < 0 ? "left" : "right",
              position: [(side * w) / 2 - (side * pd) / 2, grid.rows[r], z],
              size: [pw, ph],
              depth: pd,
              color: r % 2 === 0 ? COLOR.panelSecondary : COLOR.panelPrimary,
            });
          }
          placed += 2;
          k++;
        }
      }

      if (backCount > 0) {
        const backGrid = buildGrid(w, h, pw, ph, backCount, { baseline: earH, maxRows: 2 });
        let b = 0;
        for (const row of backGrid.rows) {
          for (const col of backGrid.cols) {
            if (b >= backCount) break;
            placements.push({
              id: `panel-back-${b}`,
              kind: "panel",
              surface: "back",
              position: [col, row, -l / 2 + pd / 2],
              size: [pw, ph],
              depth: pd,
              color: COLOR.panelPrimary,
            });
            placed++;
            b++;
          }
        }
      }
    }
    record("Painéis", requested, placed);
  }

  // ── PAINÉIS SLIM: parede frontal ──
  const slim = byKind.get("slim");
  if (slim) {
    const { w: sw, h: sh, d: sd } = GEO.slim;
    const grid = buildGrid(w, h, sw, sh, slim.qty, { baseline: earH, maxRows: 2 });
    let placed = 0;
    for (const row of grid.rows) {
      for (const col of grid.cols) {
        if (placed >= slim.qty) break;
        placements.push({
          id: `slim-${placed}`,
          kind: "slim",
          surface: "front",
          position: [col, row, l / 2 - sd / 2],
          size: [sw, sh],
          depth: sd,
          color: COLOR.slim,
        });
        placed++;
      }
    }
    record("Painéis Slim", slim.qty, placed);
  }

  // ── NUVENS DE TETO: grade regular, levemente inclinadas ──
  const cloud = byKind.get("cloud");
  if (cloud) {
    const { w: cw, h: cd, d: ct } = GEO.cloud;
    const drop = Math.min(0.25, h * 0.08);
    // A grade do teto usa o plano X-Z: "largura" = w, "altura" = l
    const grid = buildGrid(w, l, cw, cd, cloud.qty, { baseline: -l / 2 + EDGE_MARGIN + cd / 2 });
    let placed = 0;
    for (const rowZ of grid.rows) {
      for (const colX of grid.cols) {
        if (placed >= cloud.qty) break;
        placements.push({
          id: `cloud-${placed}`,
          kind: "cloud",
          surface: "ceiling",
          position: [colX, h - drop, rowZ],
          size: [cw, cd],
          depth: ct,
          // inclinação alternada sutil: quebra o paralelismo teto/piso
          tilt: (placed % 2 === 0 ? 1 : -1) * 0.06,
          color: COLOR.cloud,
        });
        placed++;
      }
    }
    record("Nuvens", cloud.qty, placed);
  }

  // ── BAFFLES: fileiras suspensas ──
  const baffle = byKind.get("baffle");
  if (baffle) {
    const { w: bw, h: bh, d: bd } = GEO.baffle;
    const drop = Math.min(0.5, h * 0.15);
    // Baffles ficam pendurados em fileiras paralelas ao eixo curto.
    const pitchZ = bh + 0.4;
    const rows = Math.max(1, Math.min(baffle.qty, Math.floor((l - 2 * EDGE_MARGIN) / pitchZ)));
    const colsPerRow = Math.max(
      1,
      Math.min(Math.ceil(baffle.qty / rows), Math.floor((w - 2 * EDGE_MARGIN + MIN_GAP) / (bw + MIN_GAP))),
    );
    const spanZ = pitchZ * (rows - 1);
    const pitchX = bw + MIN_GAP;
    const spanX = pitchX * (colsPerRow - 1);
    let placed = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < colsPerRow; c++) {
        if (placed >= baffle.qty) break;
        placements.push({
          id: `baffle-${r}-${c}`,
          kind: "baffle",
          surface: "ceiling",
          position: [-spanX / 2 + c * pitchX, h - drop, -spanZ / 2 + r * pitchZ],
          size: [bw, bh],
          depth: bd,
          color: COLOR.baffle,
        });
        placed++;
      }
    }
    record("Baffles", baffle.qty, placed);
  }

  // ── DIFUSORES: parede traseira, centralizados ──
  const diff = byKind.get("diffuser");
  if (diff) {
    const u = GEO.diffuserUnit;
    // Cox & D'Antonio: o difusor precisa de campo para formar o padrão de
    // espalhamento — cerca de 3x a maior dimensão da estrutura.
    const maxUnits = Math.max(0, Math.floor((w - 2 * EDGE_MARGIN) / u.w));
    const units = Math.min(diff.qty, maxUnits);
    const arrayW = units * u.w;
    const requiredField = arrayW * 3;

    if (units > 0 && l >= requiredField) {
      placements.push({
        id: "diffuser-array",
        kind: "diffuser",
        surface: "back",
        position: [0, Math.min(h * 0.5, earH + 0.3), -l / 2 + u.d / 2],
        size: [arrayW, u.h],
        depth: u.d,
        color: COLOR.diffuser,
        units,
      });
      record("Difusores", diff.qty, units);
    } else if (units > 0) {
      warnings.push(
        `Difusor omitido: a sala tem ${l.toFixed(1)} m de profundidade, mas um painel de ${arrayW.toFixed(
          1,
        )} m exige cerca de ${requiredField.toFixed(1)} m de campo livre para difundir. Nesta sala, absorção rende mais.`,
      );
      record("Difusores", diff.qty, 0);
    }
  }

  // ── Avisos técnicos gerais ──
  const volume = w * l * h;
  if (volume < 50) {
    warnings.push(
      `Sala de ${volume.toFixed(0)} m³: abaixo da frequência de Schroeder o campo não é difuso. O controle de graves nos cantos importa mais que a área total de absorção.`,
    );
  }
  if (ctx.hasSub && (!bass || bass.qty < 4)) {
    warnings.push("Com subwoofer, os 4 cantos verticais devem receber bass trap.");
  }

  return { placements, warnings, fitted };
}
