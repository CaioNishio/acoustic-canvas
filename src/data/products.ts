import bafflesColoridos from "@/assets/gallery/baffles-coloridos.jpg";
import forroCorporativo from "@/assets/gallery/forro-corporativo.jpg";
import hexagonaisTeto from "@/assets/gallery/hexagonais-teto.png";
import escritorioPaineis from "@/assets/gallery/escritorio-paineis.png";
import nuvemAcustica from "@/assets/gallery/nuvem-acustica.webp";
import forroIndustrial from "@/assets/gallery/forro-industrial.jpg";
import paineisAzuis from "@/assets/gallery/paineis-azuis.png";
import paineisColoridosTeto from "@/assets/gallery/paineis-coloridos-teto.png";
import paineisEscritorioRustico from "@/assets/gallery/paineis-escritorio-rustico.png";
import paineisSalaReuniao from "@/assets/gallery/paineis-sala-reuniao.png";
import estudioPaineis from "@/assets/gallery/estudio-paineis.jpeg";
import escritorioPaineisAzuis from "@/assets/gallery/escritorio-paineis-azuis.jpeg";
import painelImagemDigital from "@/assets/gallery/painel-imagem-digital.jpg";
import paineisSeminario from "@/assets/gallery/paineis-seminario.jpg";

export interface Product {
  slug: string;
  name: string;
  category: string;
  application: string[];
  material: string;
  thickness: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  specs: { label: string; value: string }[];
  materials: string[];
  price?: string;
}

export const categories = ["Painéis Acústicos", "Bass Traps", "Difusores", "Forros Acústicos", "Revestimentos"];
export const applications = ["Estúdio", "Igreja", "Auditório", "Corporativo", "Residencial"];
export const materialsFilter = ["Lã de Rocha", "Espuma", "Madeira", "Tecido", "Fibra de Vidro"];
export const thicknesses = ["25mm", "50mm", "75mm", "100mm"];

export const products: Product[] = [
  {
    slug: "painel-absorvedor-premium",
    name: "Painel Absorvedor Premium",
    category: "Painéis Acústicos",
    application: ["Estúdio", "Corporativo", "Residencial"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Absorção sonora de alta performance para ambientes profissionais.",
    description: "O Painel Absorvedor Premium é projetado para oferecer máxima absorção sonora em médias e altas frequências. Ideal para estúdios de gravação, salas de reunião e home theaters. Revestido em tecido acústico de alta qualidade, disponível em diversas cores.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao, paineisAzuis, paineisEscritorioRustico, paineisSeminario],
    specs: [
      { label: "NRC", value: "0.95" },
      { label: "Espessura", value: "50mm" },
      { label: "Dimensões", value: "600x1200mm" },
      { label: "Peso", value: "3.2kg" },
      { label: "Classe de Fogo", value: "A2" },
    ],
    materials: ["Lã de Rocha 48kg/m³", "Tecido Acústico 100% Poliéster", "Moldura em Alumínio"],
  },
  {
    slug: "bass-trap-corner",
    name: "Bass Trap Corner",
    category: "Bass Traps",
    application: ["Estúdio", "Igreja"],
    material: "Lã de Rocha",
    thickness: "100mm",
    shortDescription: "Controle de graves em cantos e junções de paredes.",
    description: "Bass Trap Corner projetado para absorção eficiente de baixas frequências. Instalação em cantos verticais para máximo aproveitamento do espaço e controle modal.",
    image: estudioPaineis,
    gallery: [estudioPaineis, hexagonaisTeto],
    specs: [
      { label: "NRC", value: "0.85" },
      { label: "Espessura", value: "100mm" },
      { label: "Dimensões", value: "300x300x1200mm" },
      { label: "Peso", value: "4.8kg" },
      { label: "Classe de Fogo", value: "A2" },
    ],
    materials: ["Lã de Rocha 64kg/m³", "Tecido Acústico", "Estrutura Metálica"],
  },
  {
    slug: "difusor-skyline",
    name: "Difusor Skyline",
    category: "Difusores",
    application: ["Estúdio", "Auditório", "Corporativo"],
    material: "Madeira",
    thickness: "75mm",
    shortDescription: "Difusão sonora para ambientes que exigem clareza acústica.",
    description: "O Difusor Skyline oferece difusão bidimensional de alta qualidade. Fabricado em madeira maciça com acabamento premium. Ideal para salas de controle, auditórios e salas de concerto.",
    image: paineisColoridosTeto,
    gallery: [paineisColoridosTeto, nuvemAcustica],
    specs: [
      { label: "Faixa de Difusão", value: "800Hz - 8kHz" },
      { label: "Profundidade", value: "75mm" },
      { label: "Dimensões", value: "600x600mm" },
      { label: "Peso", value: "5.5kg" },
      { label: "Material", value: "MDF Premium" },
    ],
    materials: ["MDF 18mm", "Acabamento Laqueado", "Fixação Oculta"],
  },
  {
    slug: "forro-acustico-modular",
    name: "Forro Acústico Modular",
    category: "Forros Acústicos",
    application: ["Corporativo", "Igreja", "Auditório"],
    material: "Fibra de Vidro",
    thickness: "25mm",
    shortDescription: "Sistema de forro com absorção integrada.",
    description: "Forro acústico modular com design clean e alta absorção. Sistema de fixação rápida com grid metálico. Ideal para escritórios, igrejas e ambientes de grande porte.",
    image: forroCorporativo,
    gallery: [forroCorporativo, forroIndustrial],
    specs: [
      { label: "NRC", value: "0.80" },
      { label: "Espessura", value: "25mm" },
      { label: "Dimensões", value: "625x625mm" },
      { label: "Peso", value: "1.8kg" },
      { label: "Classe de Fogo", value: "A1" },
    ],
    materials: ["Fibra de Vidro", "Véu de Vidro", "Grid em Aço Galvanizado"],
  },
  {
    slug: "revestimento-ripado",
    name: "Revestimento Ripado Acústico",
    category: "Revestimentos",
    application: ["Residencial", "Corporativo", "Auditório"],
    material: "Madeira",
    thickness: "50mm",
    shortDescription: "Revestimento de parede com estética premium e absorção.",
    description: "Revestimento ripado que combina estética sofisticada com performance acústica. As ripas em madeira natural criam um visual premium enquanto o núcleo absorvente trata a acústica do ambiente.",
    image: escritorioPaineis,
    gallery: [escritorioPaineis, paineisSeminario],
    specs: [
      { label: "NRC", value: "0.70" },
      { label: "Espessura Total", value: "50mm" },
      { label: "Dimensões", value: "300x2400mm" },
      { label: "Peso", value: "6.2kg/m²" },
      { label: "Acabamento", value: "Natural / Carvalho / Nogueira" },
    ],
    materials: ["Ripas de Madeira Natural", "Feltro Acústico 12mm", "MDF Estrutural"],
  },
  {
    slug: "painel-tecido-slim",
    name: "Painel Tecido Slim",
    category: "Painéis Acústicos",
    application: ["Residencial", "Corporativo"],
    material: "Espuma",
    thickness: "25mm",
    shortDescription: "Painel ultrafino para tratamento acústico discreto.",
    description: "Painel acústico slim com apenas 25mm de espessura. Ideal para ambientes onde o espaço é limitado. Revestido em tecido premium com mais de 30 opções de cores.",
    image: paineisAzuis,
    gallery: [paineisAzuis, escritorioPaineisAzuis, painelImagemDigital],
    specs: [
      { label: "NRC", value: "0.65" },
      { label: "Espessura", value: "25mm" },
      { label: "Dimensões", value: "600x600mm" },
      { label: "Peso", value: "1.2kg" },
      { label: "Cores", value: "30+ opções" },
    ],
    materials: ["Espuma Acústica 28kg/m³", "Tecido 100% Poliéster", "Base em MDF 3mm"],
  },
];
