export interface ProductColor {
  code: string;
  name: string;
  hex: string;
  /**
   * "principal" — linha de pronta-entrega, maior giro, reposição rápida.
   * "consulta"  — disponível sob encomenda, com prazo e lote mínimo próprios.
   */
  line?: "principal" | "consulta";
}

/**
 * LINHA PRINCIPAL — 12 cores.
 *
 * Critério: cobrir o espectro de projeto real com o menor número de SKUs.
 *   - 4 neutros, do preto ao cinza claro — atendem praticamente todo projeto
 *     corporativo e de estúdio, e têm a reposição mais previsível.
 *   - 2 areias/beges — residencial, hotelaria, ambientes com madeira.
 *   - 3 azuis — a assinatura da marca, do institucional escuro ao claro.
 *   - 1 verde, 1 vinho, 1 terracota — os acentos que efetivamente saem.
 *
 * O que ficou de fora não sumiu: está em `fabricColorsSobConsulta`. Reduzir a vitrine
 * acelera a decisão do cliente sem tirar a opção de quem precisa de uma cor específica.
 *
 * Ordem: neutros primeiro, do escuro ao claro dentro de cada família. A vitrine lê como
 * uma escala, não como mostruário aleatório.
 */
export const fabricColors: ProductColor[] = [
  { code: "009", name: "Preto", hex: "#1A1A1A", line: "principal" },
  { code: "036", name: "Cinza Chumbo", hex: "#4A4A4A", line: "principal" },
  { code: "051", name: "Cinza Médio", hex: "#8A8A8A", line: "principal" },
  { code: "060", name: "Cinza Claro", hex: "#B0B0A8", line: "principal" },
  { code: "087", name: "Areia", hex: "#B0A090", line: "principal" },
  { code: "099", name: "Bege Claro", hex: "#C8C0A8", line: "principal" },
  { code: "003", name: "Azul Marinho", hex: "#1B2A4A", line: "principal" },
  { code: "015", name: "Azul Petróleo", hex: "#2A5F7A", line: "principal" },
  { code: "075", name: "Azul Céu", hex: "#8AADCA", line: "principal" },
  { code: "078", name: "Verde Sage", hex: "#8AA08A", line: "principal" },
  { code: "030", name: "Bordô", hex: "#6B1B2A", line: "principal" },
  { code: "072", name: "Terracota", hex: "#9A6B4A", line: "principal" },
];

/** Demais cores do catálogo — sob encomenda. */
export const fabricColorsSobConsulta: ProductColor[] = [
  { code: "012", name: "Verde Escuro", hex: "#1C3B2A", line: "consulta" },
  { code: "018", name: "Marrom Café", hex: "#5C3A1E", line: "consulta" },
  { code: "021", name: "Marrom Escuro", hex: "#4A2E1A", line: "consulta" },
  { code: "024", name: "Verde Oliva", hex: "#6B7F4A", line: "consulta" },
  { code: "027", name: "Roxo Escuro", hex: "#4A2D5C", line: "consulta" },
  { code: "033", name: "Azul Royal", hex: "#2E5F9A", line: "consulta" },
  { code: "039", name: "Marrom Mogno", hex: "#5C3A2A", line: "consulta" },
  { code: "042", name: "Verde Musgo", hex: "#6B7F5C", line: "consulta" },
  { code: "045", name: "Lilás", hex: "#7A6B8A", line: "consulta" },
  { code: "048", name: "Vinho", hex: "#6B2A3A", line: "consulta" },
  { code: "054", name: "Marrom Claro", hex: "#8A6B4A", line: "consulta" },
  { code: "057", name: "Verde Menta", hex: "#7A9A8A", line: "consulta" },
  { code: "063", name: "Lavanda", hex: "#9A8AAA", line: "consulta" },
  { code: "066", name: "Rosa Antigo", hex: "#AA8A8A", line: "consulta" },
  { code: "069", name: "Bege Escuro", hex: "#9A8A7A", line: "consulta" },
  { code: "081", name: "Lilás Claro", hex: "#B0A0C0", line: "consulta" },
  { code: "084", name: "Rosa Queimado", hex: "#BA8A8A", line: "consulta" },
  { code: "090", name: "Caramelo", hex: "#A07050", line: "consulta" },
  { code: "093", name: "Verde Água", hex: "#7AAA9A", line: "consulta" },
  { code: "096", name: "Cinza Pérola", hex: "#C0C0B8", line: "consulta" },
  { code: "102", name: "Rosa Claro", hex: "#D0B0B0", line: "consulta" },
  { code: "105", name: "Pêssego", hex: "#D0B098", line: "consulta" },
];

/** Catálogo completo — usar só onde a intenção for mostrar tudo. */
export const allFabricColors: ProductColor[] = [...fabricColors, ...fabricColorsSobConsulta];

/** Cores de madeira/verniz — exclusivas de difusores. */
export const woodColors: ProductColor[] = [
  { code: "W01", name: "Natural", hex: "#D4B896", line: "principal" },
  { code: "W02", name: "Carvalho Claro", hex: "#C8A96E", line: "principal" },
  { code: "W03", name: "Carvalho Médio", hex: "#A67B4B", line: "principal" },
  { code: "W04", name: "Nogueira", hex: "#6B4226", line: "principal" },
  { code: "W05", name: "Mogno", hex: "#4A1C1C", line: "principal" },
];
