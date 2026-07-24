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

/**
 * Identificador de um dos 30 padrões de posicionamento (ver PANEL_PATTERNS).
 * Mantido como string para o seletor da interface; os ids válidos são os de
 * `PANEL_PATTERNS`. Os três históricos — "simetrico", "reflexao", "hibrido" —
 * continuam válidos e são os padrões de entrada.
 */
export type LayoutPreset = string;

/** Dimensões da sala, em metros. */
export interface Room {
  w: number;
  l: number;
  h: number;
}

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
// CATÁLOGO DE 30 PADRÕES DE POSICIONAMENTO
// ─────────────────────────────────────────────────────────────
//
// Cada padrão é uma CONFIGURAÇÃO, não uma função de geometria à parte. Todos passam
// pela mesma máquina de grade (buildGrid) e pelo mesmo posicionador (placePanels),
// então a ausência de sobreposição e o alinhamento são garantidos por construção —
// variar o padrão nunca reintroduz os bugs que já corrigimos.
//
// A variação estética vem de quatro eixos combináveis, todos determinísticos
// (nunca aleatórios — ritmo, não ruído):
//   - superfícies usadas (quais paredes recebem painel)
//   - número de fileiras horizontais e a banda vertical
//   - o "stagger": como a cota vertical varia de coluna para coluna
//   - inclinação (tilt) opcional para composições dinâmicas
//
// Base estética: 36 referências do cliente + `sonar-3d-layout-patterns` na memória.

export type PanelSurface = "left" | "right" | "back" | "front";

/** Como a cota vertical de cada coluna varia ao longo da parede. Determinístico. */
type Stagger =
  | "none" // tudo na mesma linha de base
  | "brick" // fileira de cima deslocada meia-célula na horizontal
  | "stairUp" // sobe da esquerda para a direita
  | "stairDown" // desce da esquerda para a direita
  | "valley" // desce em direção ao centro (vale)
  | "peak" // sobe em direção ao centro (crista)
  | "sawtooth"; // alterna acima/abaixo, coluna a coluna

type Band = "ear" | "upper" | "lower" | "full";

export interface PanelPattern {
  id: string;
  label: string;
  group: string;
  desc: string;
  /** paredes que recebem painel; a simetria L/R é mantida quando ambas entram */
  surfaces: PanelSurface[];
  rows: 1 | 2 | 3;
  band: Band;
  stagger: Stagger;
  /** inclinação em radianos, para os padrões dinâmicos */
  tilt?: number;
  /** quando true, esquerda e direita recebem stagger espelhado (não idêntico) */
  mirrorStagger?: boolean;
  /**
   * Tamanho da peça. O catálogo Sonar fabrica de 600x600 ate 2000x600 mm sob medida,
   * entao aumentar a peça é opção legítima — e visualmente mais limpo que multiplicar
   * peças pequenas numa parede pequena.
   */
  peca?: "padrao" | "grande" | "compacta";
  /**
   * Orientação da peça na superfície.
   * "paisagem" = deitada (1200x600) · "retrato" = em pé (600x1200).
   * Peça em pé cobre altura com menos unidades e muda completamente a leitura visual.
   */
  orient?: "paisagem" | "retrato";
  /** rota para o cálculo acústico de primeira reflexão */
  special?: "reflexao";
  /** também trata a parede do fundo no modo reflexão */
  reflexaoBack?: boolean;
}

const L: PanelSurface[] = ["left", "right"];
const LB: PanelSurface[] = ["left", "right", "back"];
const LBF: PanelSurface[] = ["left", "right", "back", "front"];

export const PANEL_PATTERNS: PanelPattern[] = [
  // ── A. Simétricos clássicos ──
  { id: "simetrico", label: "Simétrico", group: "Simétricos", desc: "Fileira única no nível do ouvido, espelhada nas laterais.", surfaces: L, rows: 1, band: "ear", stagger: "none" },
  { id: "simetrico-duplo", label: "Simétrico Duplo", group: "Simétricos", desc: "Duas fileiras espelhadas, cobertura ampliada.", surfaces: L, rows: 2, band: "ear", stagger: "none" },
  { id: "simetrico-triplo", label: "Simétrico Triplo", group: "Simétricos", desc: "Três fileiras densas para salas de alto tratamento.", surfaces: L, rows: 3, band: "full", stagger: "none" },
  { id: "cinturao", label: "Cinturão", group: "Simétricos", desc: "Faixa contínua a meia-altura nas laterais e no fundo.", surfaces: LB, rows: 1, band: "ear", stagger: "none" },
  { id: "moldura", label: "Moldura Perimetral", group: "Simétricos", desc: "Contorna as quatro paredes como uma moldura equilibrada.", surfaces: LBF, rows: 1, band: "ear", stagger: "none" },

  // ── B. Reflexão / técnicos ──
  { id: "reflexao", label: "Primeira Reflexão", group: "Técnicos", desc: "Painéis nos pontos de reflexão precoce — máxima precisão de escuta.", surfaces: L, rows: 1, band: "ear", stagger: "none", special: "reflexao" },
  { id: "reflexao-amplo", label: "Reflexão + Fundo", group: "Técnicos", desc: "Primeira reflexão nas laterais e absorção na parede traseira.", surfaces: L, rows: 1, band: "ear", stagger: "none", special: "reflexao", reflexaoBack: true },
  { id: "foco-frontal", label: "Foco Frontal", group: "Técnicos", desc: "Concentra o tratamento à frente, ao redor da fonte sonora.", surfaces: ["left", "right", "front"], rows: 1, band: "ear", stagger: "none" },
  { id: "fundo-forte", label: "Fundo Reforçado", group: "Técnicos", desc: "Parede traseira densa para conter reflexões de retorno.", surfaces: LB, rows: 2, band: "ear", stagger: "none" },
  { id: "frontal-difusor", label: "Frontal Difusor", group: "Técnicos", desc: "Frente tratada e laterais leves, para preservar vivacidade.", surfaces: ["left", "right", "front"], rows: 2, band: "ear", stagger: "none" },

  // ── C. Ritmo e estética ──
  { id: "hibrido", label: "Tijolo (Híbrido)", group: "Ritmo", desc: "Duas fileiras em padrão de tijolo — visual premium equilibrado.", surfaces: L, rows: 2, band: "ear", stagger: "brick" },
  { id: "escada-sobe", label: "Escada Ascendente", group: "Ritmo", desc: "As peças sobem em direção ao fundo, dando movimento à sala.", surfaces: L, rows: 1, band: "ear", stagger: "stairUp", mirrorStagger: true },
  { id: "escada-desce", label: "Escada Descendente", group: "Ritmo", desc: "Descida suave da frente para o fundo.", surfaces: L, rows: 1, band: "ear", stagger: "stairDown", mirrorStagger: true },
  { id: "onda-vale", label: "Onda em Vale", group: "Ritmo", desc: "Cota desce em direção ao centro e sobe nas pontas.", surfaces: L, rows: 1, band: "ear", stagger: "valley", mirrorStagger: true },
  { id: "onda-crista", label: "Onda em Crista", group: "Ritmo", desc: "Cota sobe ao centro — foco visual na posição de escuta.", surfaces: L, rows: 1, band: "ear", stagger: "peak", mirrorStagger: true },
  { id: "diagonal", label: "Diagonal Espelhada", group: "Ritmo", desc: "Sobe de um lado, desce do outro — dinâmica simétrica.", surfaces: L, rows: 1, band: "ear", stagger: "stairUp", mirrorStagger: true },
  { id: "dente-serra", label: "Dente de Serra", group: "Ritmo", desc: "Alterna acima e abaixo, coluna a coluna, com ritmo constante.", surfaces: L, rows: 1, band: "ear", stagger: "sawtooth" },
  { id: "mosaico", label: "Mosaico Rítmico", group: "Ritmo", desc: "Três fileiras em tijolo — textura densa e sofisticada.", surfaces: L, rows: 3, band: "full", stagger: "brick" },

  // ── D. Bandas horizontais ──
  { id: "faixa-superior", label: "Faixa Superior", group: "Bandas", desc: "Banda alta contínua — libera a parede na altura dos móveis.", surfaces: LB, rows: 1, band: "upper", stagger: "none" },
  { id: "faixa-inferior", label: "Faixa Inferior", group: "Bandas", desc: "Banda baixa, como um rodapé acústico.", surfaces: L, rows: 1, band: "lower", stagger: "none" },
  { id: "bandas-alternadas", label: "Bandas Alternadas", group: "Bandas", desc: "Duas alturas alternadas, ritmo horizontal marcado.", surfaces: L, rows: 2, band: "ear", stagger: "sawtooth" },
  { id: "torres", label: "Torres Verticais", group: "Bandas", desc: "Colunas de três peças empilhadas em pontos-chave.", surfaces: L, rows: 3, band: "full", stagger: "none" },

  // ── E. Inclinados / dinâmicos ──
  { id: "inclinado", label: "Inclinado Suave", group: "Dinâmicos", desc: "Leve inclinação uniforme — profundidade sem exagero.", surfaces: L, rows: 1, band: "ear", stagger: "none", tilt: 0.09 },
  { id: "leque", label: "Leque", group: "Dinâmicos", desc: "Inclinação que abre em leque a partir do centro.", surfaces: L, rows: 1, band: "ear", stagger: "peak", tilt: 0.12, mirrorStagger: true },
  { id: "ascendente-3d", label: "Ascendente 3D", group: "Dinâmicos", desc: "Sobe e inclina — o mais escultural do conjunto.", surfaces: L, rows: 1, band: "ear", stagger: "stairUp", tilt: 0.1, mirrorStagger: true },

  // ── F. Densidade ──
  { id: "denso-total", label: "Cobertura Total", group: "Densidade", desc: "Três fileiras em todas as paredes — tratamento máximo.", surfaces: LBF, rows: 3, band: "full", stagger: "none" },
  { id: "minimalista", label: "Minimalista", group: "Densidade", desc: "Poucas peças nos pontos que mais rendem.", surfaces: L, rows: 1, band: "ear", stagger: "none", special: "reflexao" },
  { id: "quadro-central", label: "Quadro Central", group: "Densidade", desc: "Bloco compacto e centralizado em cada parede.", surfaces: LB, rows: 2, band: "ear", stagger: "none" },

  // ── G. Editoriais ──
  { id: "editorial", label: "Escalonado Editorial", group: "Editoriais", desc: "Duas fileiras com deslocamento editorial, ar entre blocos.", surfaces: L, rows: 2, band: "ear", stagger: "brick" },
  { id: "galeria", label: "Galeria", group: "Editoriais", desc: "Ritmo de galeria de arte: peças alinhadas com respiro largo.", surfaces: LBF, rows: 1, band: "ear", stagger: "none" },

  // ── H. Peças grandes e em pé ──
  // Menos unidades, mais presença. Em sala pequena, uma peça de 2 m lê melhor que
  // três de 1,2 m encostadas — e a área de absorção é equivalente.
  { id: "grande-lateral", label: "Painel Grande Lateral", group: "Peças Grandes", desc: "Peças de 2 m nas laterais — menos unidades, leitura mais limpa.", surfaces: L, rows: 1, band: "ear", stagger: "none", peca: "grande" },
  { id: "grande-duplo", label: "Grande Duplo", group: "Peças Grandes", desc: "Duas fileiras de peças largas, cobertura ampla com poucas emendas.", surfaces: L, rows: 2, band: "ear", stagger: "none", peca: "grande" },
  { id: "grande-fundo", label: "Grande no Fundo", group: "Peças Grandes", desc: "Peça larga na parede traseira, laterais em tamanho padrão.", surfaces: LB, rows: 1, band: "ear", stagger: "none", peca: "grande" },
  { id: "retrato-vertical", label: "Painéis em Pé", group: "Verticais", desc: "Peças na vertical (600×1200) — cobrem altura com menos unidades.", surfaces: L, rows: 1, band: "full", stagger: "none", orient: "retrato" },
  { id: "retrato-ritmo", label: "Verticais Ritmadas", group: "Verticais", desc: "Peças em pé com escada suave — movimento sem perder alinhamento.", surfaces: L, rows: 1, band: "full", stagger: "stairUp", orient: "retrato", mirrorStagger: true },
  { id: "retrato-perimetral", label: "Verticais Perimetrais", group: "Verticais", desc: "Peças em pé contornando laterais e fundo, como pilastras acústicas.", surfaces: LB, rows: 1, band: "full", stagger: "none", orient: "retrato" },
  { id: "misto-escala", label: "Escala Mista", group: "Verticais", desc: "Peças em pé nas laterais e larga no fundo — hierarquia visual clara.", surfaces: LB, rows: 1, band: "full", stagger: "none", orient: "retrato", peca: "padrao" },
  { id: "compacto-denso", label: "Compacto Denso", group: "Peças Grandes", desc: "Peças 600×600 em grade fechada — textura fina e regular.", surfaces: L, rows: 2, band: "ear", stagger: "brick", peca: "compacta" },
];

const PATTERN_BY_ID = new Map(PANEL_PATTERNS.map((p) => [p.id, p]));

/** Lista para a interface, com id/rótulo/grupo/descrição. */
export const LAYOUT_PATTERN_OPTIONS = PANEL_PATTERNS.map(({ id, label, group, desc }) => ({
  value: id,
  label,
  group,
  desc,
}));

// ── Posicionador genérico de painéis ────────────────────────
// Emite as peças de UM padrão sobre as superfícies escolhidas, atravessando a grade
// centrada. O stagger vertical é aplicado por coluna e SEMPRE clampado dentro da
// parede, então nenhuma peça ultrapassa piso ou teto.

interface SurfaceAxis {
  /** largura útil ao longo do eixo horizontal da superfície */
  spanW: number;
  /** monta a posição 3D a partir de (offset horizontal, cota vertical) */
  toPos: (u: number, y: number) => [number, number, number];
}

function surfaceAxis(surface: PanelSurface, room: Room, depth: number): SurfaceAxis {
  const { w, l } = room;
  switch (surface) {
    case "left":
      return { spanW: l, toPos: (u, y) => [-w / 2 + depth / 2, y, u] };
    case "right":
      return { spanW: l, toPos: (u, y) => [w / 2 - depth / 2, y, u] };
    case "back":
      return { spanW: w, toPos: (u, y) => [u, y, -l / 2 + depth / 2] };
    case "front":
      return { spanW: w, toPos: (u, y) => [u, y, l / 2 - depth / 2] };
  }
}

/** Cota vertical de cada coluna, em torno da linha de base. Determinístico. */
function staggerDelta(kind: Stagger, i: number, n: number, amp: number, invert: boolean): number {
  const mid = (n - 1) / 2;
  const s = invert ? -1 : 1;
  switch (kind) {
    case "stairUp":
      return s * (n > 1 ? ((i - mid) / mid) * amp : 0);
    case "stairDown":
      return -s * (n > 1 ? ((i - mid) / mid) * amp : 0);
    case "valley":
      return (Math.abs(i - mid) / (mid || 1)) * amp - amp / 2;
    case "peak":
      return (-Math.abs(i - mid) / (mid || 1)) * amp + amp / 2;
    case "sawtooth":
      return (i % 2 === 0 ? 1 : -1) * (amp / 2);
    default:
      return 0;
  }
}

interface PanelPlacer {
  push: (p: Placement) => void;
  earH: number;
  room: Room;
  idPrefix: string;
}

/** Distribui `count` painéis sobre as superfícies do padrão. Retorna quantos coube. */
function placePanels(pattern: PanelPattern, count: number, pl: PanelPlacer): number {
  // Dimensões derivadas do padrão. Base do catálogo: 1200x600 mm.
  const escala = pattern.peca === "grande" ? 2.0 / 1.2 : pattern.peca === "compacta" ? 0.6 / 1.2 : 1;
  const baseW = GEO.panel.w * escala;
  const baseH = GEO.panel.h;
  // Em retrato a peça gira: a largura vira altura.
  const pw = pattern.orient === "retrato" ? baseH : baseW;
  const ph = pattern.orient === "retrato" ? baseW : baseH;
  const pd = GEO.panel.d;
  const { room, earH } = pl;
  const surfaces = pattern.surfaces;
  if (count <= 0 || surfaces.length === 0) return 0;

  // Linha de base vertical conforme a banda e o nº de fileiras (pilha centrada).
  const stackH = (pattern.rows - 1) * (ph + MIN_GAP);
  let baseline: number;
  switch (pattern.band) {
    case "upper":
      baseline = room.h - EDGE_MARGIN - ph / 2 - stackH;
      break;
    case "lower":
      baseline = EDGE_MARGIN + ph / 2;
      break;
    case "full":
      baseline = Math.max(EDGE_MARGIN + ph / 2, earH - stackH / 2);
      break;
    default: // ear
      baseline = earH - stackH / 2;
  }
  baseline = Math.max(EDGE_MARGIN + ph / 2, Math.min(baseline, room.h - EDGE_MARGIN - ph / 2 - stackH));

  // Amplitude do stagger, limitada ao espaço livre acima/abaixo da pilha.
  const headroom = Math.min(baseline - (EDGE_MARGIN + ph / 2), room.h - EDGE_MARGIN - ph / 2 - (baseline + stackH));
  const amp = Math.max(0, Math.min(0.32, headroom * 1.8));

  // Reparte a quantidade entre as superfícies; laterais recebem peso maior.
  const weightOf = (s: PanelSurface) => (s === "left" || s === "right" ? 1.4 : 1);
  const totalW = surfaces.reduce((a, s) => a + weightOf(s), 0);

  let placed = 0;
  for (const surface of surfaces) {
    const share = Math.round((count * weightOf(surface)) / totalW);
    if (share <= 0) continue;

    const ax = surfaceAxis(surface, room, pd);
    const grid = buildGrid(ax.spanW, room.h, pw, ph, Math.ceil(share / pattern.rows), {
      baseline,
      maxRows: pattern.rows,
    });
    const nCols = grid.cols.length;
    if (nCols === 0) continue;

    // Espelha o stagger da parede direita, para dar simetria dinâmica.
    const invert = pattern.mirrorStagger === true && surface === "right";

    let k = 0;
    for (let r = 0; r < grid.rows.length && k < share; r++) {
      for (let c = 0; c < nCols && k < share; c++) {
        // Brick: fileira ímpar desloca meia-célula na horizontal.
        const brick = pattern.stagger === "brick" && r % 2 === 1 ? (pw + MIN_GAP) / 2 : 0;
        const u = grid.cols[c] + brick;
        // fora do vão após o deslocamento? pula a peça (não força borda).
        if (Math.abs(u) > ax.spanW / 2 - EDGE_MARGIN - pw / 2) continue;

        const dv = pattern.stagger === "brick" ? 0 : staggerDelta(pattern.stagger, c, nCols, amp, invert);
        let y = grid.rows[r] + dv;
        y = Math.max(EDGE_MARGIN + ph / 2, Math.min(y, room.h - EDGE_MARGIN - ph / 2));

        pl.push({
          id: `${pl.idPrefix}-${surface}-${r}-${c}`,
          kind: "panel",
          surface,
          position: ax.toPos(u, y),
          size: [pw, ph],
          depth: pd,
          tilt: pattern.tilt,
          color: r % 2 === 0 ? COLOR.panelSecondary : COLOR.panelPrimary,
        });
        placed++;
        k++;
      }
    }
  }
  return placed;
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

  // Registra o aproveitamento por tipo, SEM gerar aviso na cena.
  // O contador segue disponivel em `fitted` para auditoria; a mensagem
  // "X cabem fisicamente" foi removida por poluir o visual do ambiente.
  const record = (kind: string, requested: number, placed: number) => {
    fitted[kind] = { requested, placed };
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

  // ── PAINÉIS DE PAREDE (dirigido pelo catálogo de 30 padrões) ──
  const panel = byKind.get("panel");
  if (panel) {
    const requested = panel.qty;
    const pattern = PATTERN_BY_ID.get(preset) ?? PATTERN_BY_ID.get("simetrico")!;
    const { w: pw, h: ph, d: pd } = GEO.panel;
    let placed = 0;

    if (pattern.special === "reflexao") {
      // Par de primeira reflexão — cálculo acústico, sempre espelhado (Kuttruff cap. 4).
      const listenerZ = -l / 2 + l * 0.38; // ouvinte a ~38% (Bolt)
      const speakerZ = -l / 2 + l * 0.15;
      const speakerX = Math.min(w * 0.25, 1.1);
      const zL = firstReflectionZ(-w / 2, -speakerX, speakerZ, 0, listenerZ);
      const zR = firstReflectionZ(w / 2, speakerX, speakerZ, 0, listenerZ);
      const clampZ = (z: number) =>
        Math.max(-l / 2 + EDGE_MARGIN + pw / 2, Math.min(l / 2 - EDGE_MARGIN - pw / 2, z));

      for (const [side, z] of [[-1, clampZ(zL)], [1, clampZ(zR)]] as const) {
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

      // Restante em grade espelhada nas laterais atrás do ouvinte.
      const remaining = Math.max(0, requested - placed - (pattern.reflexaoBack ? 2 : 0));
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

      if (pattern.reflexaoBack) {
        const backGrid = buildGrid(w, h, pw, ph, 2, { baseline: earH, maxRows: 1 });
        let b = 0;
        for (const col of backGrid.cols) {
          if (b >= 2) break;
          placements.push({
            id: `panel-back-${b}`,
            kind: "panel",
            surface: "back",
            position: [col, earH, -l / 2 + pd / 2],
            size: [pw, ph],
            depth: pd,
            color: COLOR.panelPrimary,
          });
          placed++;
          b++;
        }
      }
    } else {
      placed = placePanels(pattern, requested, {
        push: (p) => placements.push(p),
        earH,
        room,
        idPrefix: "panel",
      });
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
