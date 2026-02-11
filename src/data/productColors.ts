export interface ProductColor {
  code: string;
  name: string;
  hex: string;
}

// Full Sonar catalog — 40 fabric/felt colors for panels, bass traps, clouds, baffles
export const fabricColors: ProductColor[] = [
  { code: "003", name: "Azul Marinho", hex: "#1B2A4A" },
  { code: "009", name: "Preto", hex: "#1A1A1A" },
  { code: "012", name: "Verde Escuro", hex: "#1C3B2A" },
  { code: "015", name: "Azul Petróleo", hex: "#2A5F7A" },
  { code: "018", name: "Marrom Café", hex: "#5C3A1E" },
  { code: "021", name: "Marrom Escuro", hex: "#4A2E1A" },
  { code: "024", name: "Verde Oliva", hex: "#6B7F4A" },
  { code: "027", name: "Roxo Escuro", hex: "#4A2D5C" },
  { code: "030", name: "Bordô", hex: "#6B1B2A" },
  { code: "033", name: "Azul Royal", hex: "#2E5F9A" },
  { code: "036", name: "Cinza Chumbo", hex: "#4A4A4A" },
  { code: "039", name: "Marrom Mogno", hex: "#5C3A2A" },
  { code: "042", name: "Verde Musgo", hex: "#6B7F5C" },
  { code: "045", name: "Lilás", hex: "#7A6B8A" },
  { code: "048", name: "Vinho", hex: "#6B2A3A" },
  { code: "051", name: "Cinza Médio", hex: "#8A8A8A" },
  { code: "054", name: "Marrom Claro", hex: "#8A6B4A" },
  { code: "057", name: "Verde Menta", hex: "#7A9A8A" },
  { code: "060", name: "Cinza Claro", hex: "#B0B0A8" },
  { code: "063", name: "Lavanda", hex: "#9A8AAA" },
  { code: "066", name: "Rosa Antigo", hex: "#AA8A8A" },
  { code: "069", name: "Bege Escuro", hex: "#9A8A7A" },
  { code: "072", name: "Terracota", hex: "#9A6B4A" },
  { code: "075", name: "Azul Céu", hex: "#8AADCA" },
  { code: "078", name: "Verde Sage", hex: "#8AA08A" },
  { code: "081", name: "Lilás Claro", hex: "#B0A0C0" },
  { code: "084", name: "Rosa Queimado", hex: "#BA8A8A" },
  { code: "087", name: "Areia", hex: "#B0A090" },
  { code: "090", name: "Caramelo", hex: "#A07050" },
  { code: "093", name: "Verde Água", hex: "#7AAA9A" },
  { code: "096", name: "Cinza Pérola", hex: "#C0C0B8" },
  { code: "099", name: "Bege Claro", hex: "#C8C0A8" },
  { code: "102", name: "Rosa Claro", hex: "#D0B0B0" },
  { code: "105", name: "Pêssego", hex: "#D0B098" },
];

// Wood/varnish colors for diffusers only
export const woodColors: ProductColor[] = [
  { code: "W01", name: "Natural", hex: "#D4B896" },
  { code: "W02", name: "Carvalho Claro", hex: "#C8A96E" },
  { code: "W03", name: "Carvalho Médio", hex: "#A67B4B" },
  { code: "W04", name: "Nogueira", hex: "#6B4226" },
  { code: "W05", name: "Mogno", hex: "#4A1C1C" },
];
