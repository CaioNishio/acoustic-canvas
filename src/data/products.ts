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
import bassTrapCorner from "@/assets/gallery/bass-trap-corner-1.jpg";
import bassTrapStudio from "@/assets/gallery/bass-trap-studio.jpg";
import bassTrapPair from "@/assets/gallery/bass-trap-pair.jpg";
import difusorSkyline from "@/assets/gallery/difusor-skyline-produto.jpg";
import difusorSkyline1 from "@/assets/gallery/difusor-skyline-1.jpg";
import difusorSkyline2 from "@/assets/gallery/difusor-skyline-2.jpg";
import difusorSkyline3 from "@/assets/gallery/difusor-skyline-3.jpg";
import difusorSkyline4 from "@/assets/gallery/difusor-skyline-4.png";
import difusorSkyline5 from "@/assets/gallery/difusor-skyline-5.png";
import difusorSkyline6 from "@/assets/gallery/difusor-skyline-6.jpg";
import difusorSkyline7 from "@/assets/gallery/difusor-skyline-7.jpg";
import difusorSkyline8 from "@/assets/gallery/difusor-skyline-8.jpg";
import difusorSkyline9 from "@/assets/gallery/difusor-skyline-9.jpg";
import mdfVazadoAbsorvedor from "@/assets/gallery/mdf-vazado-absorvedor.jpg";
import mdfVazadoDifusor from "@/assets/gallery/mdf-vazado-difusor.jpg";
import wavefuserHibrido from "@/assets/gallery/wavefuser-hibrido.jpg";
import salaAulaBaffles from "@/assets/gallery/sala-aula-baffles.jpeg";
import academiaBaffles from "@/assets/gallery/academia-baffles.jpeg";
import academiaTeto from "@/assets/gallery/academia-teto.jpeg";
import salaTratamento from "@/assets/gallery/sala-tratamento-acustico.jpeg";
import paineisSuspensos from "@/assets/gallery/paineis-suspensos.webp";

import fixadorDetalhe from "@/assets/gallery/fixador-detalhe.jpg";
import fixadorKitPrata from "@/assets/gallery/fixador-kit-prata.jpg";
import fixadorBuchaParafuso from "@/assets/gallery/fixador-bucha-parafuso.webp";
import fixadorKitPreto from "@/assets/gallery/fixador-kit-preto.webp";

import { fabricColors, woodColors, type ProductColor } from "./productColors";
export type { ProductColor };

export interface AbsorptionData {
  density: number;
  thickness: number;
  coefficients: { freq: number; value: number }[];
  nrc: number;
}

export interface ProductHighlight {
  icon: string;
  title: string;
  desc: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  application: string[];
  material: string;
  thickness: string;
  shortDescription: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery: string[];
  specs: { label: string; value: string }[];
  materials: string[];
  price?: string;
  colors?: ProductColor[];
  absorptionTable?: AbsorptionData[];
  highlights?: ProductHighlight[];
  advantages?: string[];
  properties?: { title: string; text: string }[];
  faq?: { question: string; answer: string }[];
  certifications?: string[];
  sizes?: { label: string; dimensions: string }[];
}

export const productColors = fabricColors;

export const categories = [
  "Absorção Acústica",
  "Absorção Suspensa",
  "Controle de Graves",
  "Difusão Sonora",
  "Soluções Especiais",
  "Isolamento Móvel",
  "Tratamento Aéreo",
  "Isolamento Acústico",
  "Insumos Técnicos",
  "Fixação & Suportes",
  "Kits de Tratamento",
  "Consultoria & Projetos",
];

export const applications = ["Estúdio", "Igreja", "Auditório", "Corporativo", "Residencial", "Home Theater", "Podcast", "Restaurante"];
export const materialsFilter = ["Lã de Rocha", "Lã de PET", "Espuma", "Madeira", "Tecido", "Fibra de Vidro", "MDF", "Borracha", "Carpete"];
export const thicknesses = ["25mm", "50mm", "75mm", "100mm", "Variável"];

// ─── SHARED DATA ──────────────────────────────────────────────
const defaultHighlights: ProductHighlight[] = [
  { icon: "waveform", title: "Reduz Eco e Reverberação", desc: "Som mais limpo e definido" },
  { icon: "ruler", title: "Tamanhos Sob Medida", desc: "Fabricado para seu espaço" },
  { icon: "palette", title: "34+ Cores Disponíveis", desc: "Combine com qualquer estilo" },
  { icon: "tool", title: "Instalação Rápida", desc: "Sem ferramentas pesadas" },
  { icon: "layout", title: "Parede e Teto", desc: "Tratamento onde importa" },
  { icon: "target", title: "Controle de Reflexões", desc: "Imagem estéreo mais precisa" },
];

const defaultAdvantages = [
  "Redução da transmissão de ruídos entre ambientes",
  "Aumento do conforto térmico",
  "Redução do gasto de energia elétrica em ambientes climatizados",
  "Facilidade no corte (com lâmina ou faca afiada)",
  "Fácil adaptação a projetos curvos e irregulares",
  "Desempenho uniforme em toda área isolada",
  "Contribui na segurança contrafogo",
];

const defaultProperties = [
  { title: "Térmicas", text: "Apresenta baixa condutividade térmica, conservando energia e garantindo o conforto térmico." },
  { title: "Acústicas", text: "Devido à sua estrutura fibrosa, possui elevados índices de absorção acústica, tornando possível a redução do ruído na fonte e a diminuição da transmissão de som entre ambientes." },
  { title: "Comportamento à Água", text: "A lã de rocha é repelente à água devido aos aglomerantes adicionados ao produto, preservando as características originais depois de seca." },
  { title: "Inércia Química", text: "Não ataca as superfícies com as quais mantém contato. Não há proliferação de fungos e bactérias." },
];

const defaultCertifications = ["ABNT – NBR 11364", "Petrobrás N-1618", "ISO/R 354", "ASTM C 423"];

const absorptionTableD32_50: AbsorptionData[] = [
  { density: 32, thickness: 51, nrc: 0.80, coefficients: [{ freq: 125, value: 0.16 }, { freq: 250, value: 0.52 }, { freq: 500, value: 0.82 }, { freq: 1000, value: 0.92 }, { freq: 2000, value: 0.94 }, { freq: 4000, value: 0.96 }] },
  { density: 48, thickness: 51, nrc: 0.89, coefficients: [{ freq: 125, value: 0.26 }, { freq: 250, value: 0.70 }, { freq: 500, value: 1.08 }, { freq: 1000, value: 1.02 }, { freq: 2000, value: 0.76 }, { freq: 4000, value: 0.96 }] },
  { density: 64, thickness: 51, nrc: 0.93, coefficients: [{ freq: 125, value: 0.16 }, { freq: 250, value: 0.66 }, { freq: 500, value: 1.00 }, { freq: 1000, value: 1.05 }, { freq: 2000, value: 1.02 }, { freq: 4000, value: 1.04 }] },
  { density: 96, thickness: 51, nrc: 1.07, coefficients: [{ freq: 125, value: 0.13 }, { freq: 250, value: 0.66 }, { freq: 500, value: 1.13 }, { freq: 1000, value: 1.28 }, { freq: 2000, value: 1.23 }, { freq: 4000, value: 1.26 }] },
  { density: 128, thickness: 51, nrc: 1.00, coefficients: [{ freq: 125, value: 0.32 }, { freq: 250, value: 0.90 }, { freq: 500, value: 1.11 }, { freq: 1000, value: 1.01 }, { freq: 2000, value: 1.01 }, { freq: 4000, value: 1.05 }] },
  { density: 144, thickness: 51, nrc: 0.93, coefficients: [{ freq: 125, value: 0.16 }, { freq: 250, value: 0.66 }, { freq: 500, value: 1.00 }, { freq: 1000, value: 1.05 }, { freq: 2000, value: 1.02 }, { freq: 4000, value: 1.04 }] },
  { density: 160, thickness: 51, nrc: 1.00, coefficients: [{ freq: 125, value: 0.43 }, { freq: 250, value: 0.89 }, { freq: 500, value: 1.00 }, { freq: 1000, value: 0.99 }, { freq: 2000, value: 0.98 }, { freq: 4000, value: 0.99 }] },
];

// ─── PRODUCTS ─────────────────────────────────────────────────
export const products: Product[] = [
  // ── PAINÉIS ACÚSTICOS ───────────────────────────────────────
  {
    slug: "painel-acustico-snr3250",
    name: "Painel Acústico SNR3250: Absorção High-Mid",
    category: "Absorção Acústica",
    subcategory: "Absorção High-Mid",
    application: ["Estúdio", "Corporativo", "Residencial", "Podcast", "Home Theater"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Absorção de alta performance em médias e altas frequências. Medidas de 60x60 até 200x60 cm — sob medida.",
    description: "O Painel Acústico SNR3250 é o absorvedor broadband mais versátil da linha Sonar, projetado para controle sonoro profissional em qualquer espaço que exija um perfil visual elegante e fino. Fino, estiloso e altamente eficaz, reduz reflexões e reverberação em uma ampla faixa de frequência.",
    longDescription: "O Painel SNR3250 é projetado para resolver uma das questões mais comuns em ambientes sonoros: reverberação excessiva e baixa inteligibilidade causadas por superfícies rígidas e paredes sem tratamento. Estes painéis são especialmente eficazes na eliminação de eco, controle de flutter echoes e reflexões primárias.\n\nEmbora compacto e visualmente elegante, este painel oferece uma quantidade impressionante de performance. Construído com núcleo de lã de rocha D32, oferece mais absorção em baixas frequências do que painéis de espuma típicos da mesma espessura. Com mais de 34 opções de cores de tecido acústico, adapta-se perfeitamente a qualquer ambiente.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao, paineisAzuis, paineisEscritorioRustico, paineisSeminario, escritorioPaineisAzuis, estudioPaineis],
    sizes: [
      { label: "Quadrado", dimensions: "600 × 600 mm" },
      { label: "Médio", dimensions: "1000 × 600 mm" },
      { label: "Retrato", dimensions: "1200 × 600 mm" },
      { label: "Grande", dimensions: "1500 × 600 mm" },
      { label: "Extra", dimensions: "1800 × 600 mm" },
      { label: "Sob Medida", dimensions: "Até 2000 × 600 mm" },
    ],
    specs: [
      { label: "NRC", value: "0.95" },
      { label: "Código", value: "SNR3250" },
      { label: "Espessura", value: "50mm" },
      { label: "Densidade", value: "32 kg/m³" },
      { label: "Faixa", value: "High-Mid (250Hz – 4kHz)" },
      { label: "Dimensões", value: "600×600 até 2000×600mm" },
      { label: "Peso", value: "2.5 – 5.8 kg" },
      { label: "Classe de Fogo", value: "A2" },
    ],
    materials: ["Lã de Rocha D32 (50mm)", "Tecido Acústico 100% Poliéster", "Moldura em Alumínio", "Manta Acústica TNT"],
    colors: fabricColors,
    absorptionTable: absorptionTableD32_50,
    highlights: defaultHighlights,
    advantages: defaultAdvantages,
    properties: defaultProperties,
    certifications: defaultCertifications,
    faq: [
      { question: "Quais frequências este painel mais afeta?", answer: "O SNR3250 é mais eficaz em frequências médias a altas (250Hz a 4kHz), melhorando a clareza e reduzindo eco. Para graves, recomendamos os Bass Traps SNR6430." },
      { question: "O que está incluso e como instalar?", answer: "Cada painel vem com hardware de montagem (suportes dentados), tecido acústico certificado e documentação técnica. Instale em paredes ou tetos, em drywall ou alvenaria." },
      { question: "Posso personalizar o visual?", answer: "Sim. 34+ cores de tecido, 6 tamanhos padrão e tamanhos sob medida. Opcionais: moldura em madeira, tecido com imagem plotada, ou frontal em MDF vazado." },
      { question: "Qual a diferença entre SNR3250 e SNR6450?", answer: "O SNR3250 (D32) é otimizado para High-Mid (250Hz–4kHz). O SNR6450 (D64) tem maior densidade, atuando em Low-Mid (125Hz–2kHz) com maior absorção em graves." },
    ],
  },

  {
    slug: "painel-acustico-snr6450",
    name: "Painel Acústico SNR6450: Absorção Low-Mid",
    category: "Absorção Acústica",
    subcategory: "Absorção Low-Mid",
    application: ["Estúdio", "Igreja", "Auditório", "Home Theater"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Absorção em baixas e médias frequências com densidade 64 kg/m³. Controle modal avançado.",
    description: "O Painel Acústico SNR6450 utiliza lã de rocha de alta densidade (64 kg/m³) para absorção eficiente em baixas e médias frequências. Ideal para ambientes onde o controle de graves é essencial, como estúdios de gravação, igrejas e salas de home theater.",
    image: estudioPaineis,
    gallery: [estudioPaineis, paineisSalaReuniao, paineisAzuis, escritorioPaineisAzuis],
    sizes: [
      { label: "Quadrado", dimensions: "600 × 600 mm" },
      { label: "Médio", dimensions: "1000 × 600 mm" },
      { label: "Retrato", dimensions: "1200 × 600 mm" },
      { label: "Grande", dimensions: "1500 × 600 mm" },
      { label: "Extra", dimensions: "1800 × 600 mm" },
    ],
    specs: [
      { label: "NRC", value: "0.93" },
      { label: "Código", value: "SNR6450" },
      { label: "Espessura", value: "50mm" },
      { label: "Densidade", value: "64 kg/m³" },
      { label: "Faixa", value: "Low-Mid (125Hz – 2kHz)" },
      { label: "Dimensões", value: "600×600 até 1800×600mm" },
      { label: "Peso", value: "3.8 – 8.2 kg" },
      { label: "Classe de Fogo", value: "A2" },
    ],
    materials: ["Lã de Rocha D64 (50mm)", "Tecido Acústico 100% Poliéster", "Moldura em Alumínio"],
    colors: fabricColors,
    highlights: defaultHighlights,
    advantages: defaultAdvantages,
    certifications: defaultCertifications,
  },

  {
    slug: "painel-acustico-snr3225-slim",
    name: "Painel Slim SNR3225: Absorção Compacta",
    category: "Absorção Acústica",
    subcategory: "Absorção High-Mid",
    application: ["Residencial", "Corporativo", "Podcast"],
    material: "Lã de Rocha",
    thickness: "25mm",
    shortDescription: "Painel ultrafino de 25mm para tratamento acústico discreto em ambientes com espaço limitado.",
    description: "O Painel SNR3225 Slim possui apenas 25mm de espessura, ideal para ambientes onde o espaço é limitado. Seu perfil fino permite instalação em qualquer superfície, incluindo divisórias e paredes de drywall, sem comprometer o espaço útil.",
    image: paineisAzuis,
    gallery: [paineisAzuis, escritorioPaineisAzuis, painelImagemDigital],
    specs: [
      { label: "NRC", value: "0.65" },
      { label: "Código", value: "SNR3225" },
      { label: "Espessura", value: "25mm" },
      { label: "Densidade", value: "32 kg/m³" },
      { label: "Faixa", value: "High-Mid (500Hz – 4kHz)" },
      { label: "Dimensões", value: "600×600mm" },
      { label: "Peso", value: "1.2 kg" },
      { label: "Cores", value: "34+ opções" },
    ],
    materials: ["Lã de Rocha D32 (25mm)", "Tecido 100% Poliéster", "Base em MDF 3mm"],
    colors: fabricColors,
  },

  {
    slug: "painel-moldura-madeira",
    name: "Painel Acústico: Moldura em Madeira Premium",
    category: "Absorção Acústica",
    subcategory: "Premium",
    application: ["Residencial", "Corporativo", "Restaurante"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Painel SNR3250 com moldura externa em madeira natural para acabamento premium.",
    description: "Combinando a performance acústica do SNR3250 com uma moldura externa em madeira natural, este painel oferece uma estética sofisticada para ambientes que exigem tratamento acústico com visual de alto padrão.",
    image: paineisEscritorioRustico,
    gallery: [paineisEscritorioRustico, escritorioPaineis, paineisSeminario],
    specs: [
      { label: "NRC", value: "0.95" },
      { label: "Espessura Total", value: "65mm" },
      { label: "Moldura", value: "Madeira Natural" },
      { label: "Dimensões", value: "600×600 até 1200×600mm" },
      { label: "Peso", value: "3.5 – 7.0 kg" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico", "Moldura em Madeira Maciça", "Acabamento Natural ou Laqueado"],
    colors: fabricColors,
  },

  {
    slug: "painel-imagem-plotada",
    name: "Painel Acústico: Imagem Plotada em Alta Definição",
    category: "Absorção Acústica",
    subcategory: "Decorativo",
    application: ["Residencial", "Corporativo", "Restaurante"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Painel acústico revestido com tecido personalizado com impressão de imagem em alta definição.",
    description: "Transforme seu tratamento acústico em arte. O painel com imagem plotada combina a absorção do SNR3250 com um tecido personalizado impresso em alta definição. Envie sua arte, foto ou design e nós produzimos o painel.",
    image: painelImagemDigital,
    gallery: [painelImagemDigital, paineisAzuis, paineisSalaReuniao],
    specs: [
      { label: "NRC", value: "0.95" },
      { label: "Impressão", value: "Alta Definição (Sublimação)" },
      { label: "Espessura", value: "50mm" },
      { label: "Dimensões", value: "Sob medida" },
    ],
    materials: ["Lã de Rocha D32", "Tecido com Impressão em Sublimação", "Moldura em Alumínio"],
  },

  {
    slug: "painel-mdf-vazado",
    name: "Painel Acústico: MDF Vazado Frontal",
    category: "Absorção Acústica",
    subcategory: "MDF Vazado",
    application: ["Estúdio", "Corporativo", "Residencial", "Auditório"],
    material: "MDF",
    thickness: "50mm",
    shortDescription: "Absorção acústica com estética de madeira vazada e fendas verticais — design sofisticado.",
    description: "O Painel com MDF Vazado combina design sofisticado com performance acústica. As fendas verticais no painel frontal em MDF permitem a passagem do som até o núcleo absorvente de lã de rocha, proporcionando absorção eficiente em médias e altas frequências.",
    image: mdfVazadoAbsorvedor,
    gallery: [mdfVazadoAbsorvedor, mdfVazadoDifusor, paineisSeminario, escritorioPaineisAzuis],
    specs: [
      { label: "NRC", value: "0.85" },
      { label: "Espessura Total", value: "50mm" },
      { label: "Espessura MDF", value: "6mm" },
      { label: "Dimensões", value: "600×600mm" },
      { label: "Peso", value: "4.2 kg" },
      { label: "Classe de Fogo", value: "B1" },
      { label: "Faixa de Absorção", value: "250Hz – 4kHz" },
    ],
    materials: ["MDF Vazado 6mm", "Lã de Rocha 48kg/m³", "Manta Acústica TNT", "Moldura em MDF 18mm"],
    colors: fabricColors,
  },

  // ── PAINÉIS ESPECIAIS ───────────────────────────────────────
  {
    slug: "painel-hexagonal",
    name: "Painel Hexagonal: Absorção Geométrica",
    category: "Soluções Especiais",
    application: ["Corporativo", "Residencial", "Restaurante"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Painel acústico hexagonal para composições criativas em paredes e tetos.",
    description: "O Painel Hexagonal Acústico permite composições geométricas únicas. Combine diferentes cores para criar mosaicos personalizados que tratam a acústica e decoram o ambiente simultaneamente.",
    image: hexagonaisTeto,
    gallery: [hexagonaisTeto, paineisColoridosTeto, academiaTeto],
    specs: [
      { label: "NRC", value: "0.90" },
      { label: "Formato", value: "Hexagonal" },
      { label: "Espessura", value: "50mm" },
      { label: "Dimensão", value: "Ø 400mm" },
      { label: "Peso", value: "1.4 kg" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico", "Base estrutural"],
    colors: fabricColors,
  },

  {
    slug: "painel-circle-360",
    name: "Painel Circle 360°: Absorção Omnidirecional",
    category: "Soluções Especiais",
    application: ["Corporativo", "Residencial", "Restaurante"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Painel acústico circular de 360° para composições diferenciadas. Absorção High-Mid.",
    description: "O Circle 360 traz um formato circular que quebra a linearidade dos ambientes, criando pontos focais visuais enquanto oferece absorção acústica na faixa High-Mid.",
    image: paineisColoridosTeto,
    gallery: [paineisColoridosTeto, hexagonaisTeto, paineisSalaReuniao],
    specs: [
      { label: "NRC", value: "0.90" },
      { label: "Código", value: "SNR3250" },
      { label: "Formato", value: "Circular 360°" },
      { label: "Espessura", value: "50mm" },
      { label: "Dimensão", value: "Ø 500mm / Ø 600mm" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico", "Estrutura circular"],
    colors: fabricColors,
  },

  {
    slug: "painel-triangular-3s",
    name: "Painel Triangular 3S: Composição Modular",
    category: "Soluções Especiais",
    application: ["Estúdio", "Corporativo"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Painel acústico triangular para composições geométricas modernas. Absorção High-Mid.",
    description: "O Painel 3S Triangular permite criar composições geométricas ousadas, combinando absorção acústica com design contemporâneo. Ideal para paredes de destaque.",
    image: paineisColoridosTeto,
    gallery: [paineisColoridosTeto, paineisAzuis],
    specs: [
      { label: "NRC", value: "0.90" },
      { label: "Código", value: "SNR3250" },
      { label: "Formato", value: "Triangular" },
      { label: "Espessura", value: "50mm" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico"],
    colors: fabricColors,
  },

  {
    slug: "painel-led-rgb",
    name: "Painel Acústico: LED RGB Integrado",
    category: "Soluções Especiais",
    subcategory: "LED",
    application: ["Estúdio", "Home Theater", "Podcast", "Residencial"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Painel acústico com iluminação LED RGB integrada — crie ambientes imersivos.",
    description: "Combinando tratamento acústico com iluminação decorativa LED RGB. Controle remoto para milhões de combinações de cores, efeitos de transição e sincronização musical.",
    image: estudioPaineis,
    gallery: [estudioPaineis, salaTratamento],
    specs: [
      { label: "NRC", value: "0.90" },
      { label: "LED", value: "RGB (16 milhões de cores)" },
      { label: "Controle", value: "Remoto / App" },
      { label: "Espessura", value: "50mm" },
      { label: "Alimentação", value: "12V DC" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico", "Fita LED RGB", "Driver 12V"],
    colors: fabricColors,
  },

  {
    slug: "painel-led-fosco",
    name: "Painel Acústico: LED Fosco Integrado",
    category: "Soluções Especiais",
    subcategory: "LED",
    application: ["Corporativo", "Residencial", "Restaurante"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Painel acústico com iluminação LED fosca para ambientação suave e elegante.",
    description: "Iluminação LED fosca integrada ao painel acústico para criar uma ambientação suave, sem brilho direto. Ideal para escritórios, restaurantes e salas de estar.",
    image: escritorioPaineisAzuis,
    gallery: [escritorioPaineisAzuis, escritorioPaineis],
    specs: [
      { label: "NRC", value: "0.90" },
      { label: "LED", value: "Fosco (Branco Quente/Frio)" },
      { label: "Espessura", value: "50mm" },
      { label: "Alimentação", value: "12V DC" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico", "Fita LED Fosca", "Difusor Acrílico"],
    colors: fabricColors,
  },

  {
    slug: "hexagono-led-decorativo",
    name: "Hexágono LED: Módulo Decorativo Suspenso",
    category: "Soluções Especiais",
    subcategory: "LED",
    application: ["Estúdio", "Podcast", "Residencial"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Módulo hexagonal com LED integrado para composições luminosas suspensas.",
    description: "Hexágonos decorativos com LED que podem ser suspensos do teto, criando composições luminosas e acústicas. Sistema modular de encaixe para infinitas possibilidades.",
    image: hexagonaisTeto,
    gallery: [hexagonaisTeto, paineisColoridosTeto],
    specs: [
      { label: "Formato", value: "Hexagonal" },
      { label: "LED", value: "RGB / Branco" },
      { label: "Instalação", value: "Suspensa (Colar)" },
    ],
    materials: ["Lã de Rocha D32", "Estrutura em Alumínio", "LED RGB", "Cabos de Aço"],
  },

  {
    slug: "reflexive-panels",
    name: "Painel Reflexivo: Direcionamento Sonoro Controlado",
    category: "Soluções Especiais",
    application: ["Estúdio", "Auditório"],
    material: "Madeira",
    thickness: "Variável",
    shortDescription: "Painéis reflexivos para preservar a energia sonora e direcionar o som de forma controlada.",
    description: "Os Reflexive Panels são projetados para ambientes onde a reflexão controlada do som é desejada, como salas de concerto e auditórios. Preservam a energia sonora enquanto direcionam as reflexões de forma precisa.",
    image: paineisSeminario,
    gallery: [paineisSeminario, escritorioPaineis],
    specs: [
      { label: "Tipo", value: "Reflexão Controlada" },
      { label: "Material", value: "Madeira / MDF" },
      { label: "Acabamento", value: "Natural / Laqueado" },
    ],
    materials: ["Madeira Maciça", "MDF Premium", "Acabamento Laqueado"],
    colors: woodColors,
  },

  // ── NUVENS ACÚSTICAS ────────────────────────────────────────
  {
    slug: "nuvem-acustica-snr3250",
    name: "Nuvem Acústica SNR3250: Absorção Suspensa",
    category: "Absorção Suspensa",
    application: ["Estúdio", "Igreja", "Auditório", "Corporativo", "Restaurante"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Nuvem acústica suspensa para absorção High-Mid — ideal para tetos altos e reverberantes.",
    description: "A Nuvem Acústica SNR3250 é suspensa do teto por cabos de aço, oferecendo absorção em ambas as faces. Ideal para ambientes com tetos altos onde o tratamento de parede não é suficiente. Reduz drasticamente a reverberação e melhora a inteligibilidade da fala.",
    image: nuvemAcustica,
    gallery: [nuvemAcustica, paineisSuspensos, academiaTeto, forroCorporativo],
    specs: [
      { label: "NRC", value: "0.95 (dupla face)" },
      { label: "Código", value: "SNR3250" },
      { label: "Espessura", value: "50mm" },
      { label: "Dimensões", value: "1200×600 / 1200×1200mm" },
      { label: "Peso", value: "3.8 – 6.5 kg" },
      { label: "Instalação", value: "Suspensa (Cabos de Aço)" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico (ambas faces)", "Cabos de Aço", "Suportes de Teto"],
    colors: fabricColors,
    highlights: defaultHighlights,
  },

  // ── BASS TRAPS ──────────────────────────────────────────────
  {
    slug: "bass-trap-corner-3s-snr6430",
    name: "Bass Trap Corner 3S: Controle Modal de Graves",
    category: "Controle de Graves",
    application: ["Estúdio", "Home Theater", "Igreja"],
    material: "Lã de Rocha",
    thickness: "100mm",
    shortDescription: "Bass Trap triangular para cantos — controle de graves e modos de sala.",
    description: "O Bass Trap Corner 3S SNR6430 é projetado para instalação em cantos verticais, onde os modos de sala são mais intensos. Com lã de rocha D64, oferece absorção broadband desde 60Hz até 500Hz, essencial para qualquer sala de controle ou estúdio profissional.",
    image: bassTrapCorner,
    gallery: [bassTrapCorner, bassTrapPair, bassTrapStudio],
    specs: [
      { label: "NRC", value: "0.85" },
      { label: "Código", value: "SNR6430" },
      { label: "Espessura", value: "100mm" },
      { label: "Densidade", value: "64 kg/m³" },
      { label: "Dimensões", value: "300×300×1200mm (triangular)" },
      { label: "Peso", value: "4.8 kg" },
      { label: "Classe de Fogo", value: "A2" },
      { label: "Faixa de Absorção", value: "60Hz – 500Hz" },
    ],
    materials: ["Lã de Rocha D64 (100mm)", "Tecido Acústico", "Estrutura Metálica"],
    colors: fabricColors,
    highlights: defaultHighlights,
    advantages: defaultAdvantages,
    certifications: defaultCertifications,
  },

  {
    slug: "bass-trap-membrana-snr6420",
    name: "Bass Trap Membrana: Absorção Ressonante de Graves",
    category: "Controle de Graves",
    application: ["Estúdio", "Home Theater"],
    material: "Lã de Rocha",
    thickness: "100mm",
    shortDescription: "Bass trap com membrana ressonante para absorção precisa de frequências graves específicas.",
    description: "O Bass Trap Membrana SNR6420 utiliza o princípio de ressonância de membrana para absorção cirúrgica em frequências graves específicas. A membrana frontal em borracha/MDF vibra em frequências calculadas, dissipando a energia sonora no núcleo de lã de rocha D64.",
    image: bassTrapStudio,
    gallery: [bassTrapStudio, bassTrapCorner, bassTrapPair],
    specs: [
      { label: "NRC", value: "0.75" },
      { label: "Código", value: "SNR6420" },
      { label: "Tipo", value: "Membrana Ressonante" },
      { label: "Espessura", value: "100mm" },
      { label: "Densidade", value: "64 kg/m³" },
      { label: "Faixa de Absorção", value: "40Hz – 300Hz" },
      { label: "Dimensões", value: "600×600×100mm" },
    ],
    materials: ["Lã de Rocha D64", "Membrana de Borracha", "Caixa em MDF 18mm", "Tecido Acústico"],
    colors: fabricColors,
  },

  // ── DIFUSORES ───────────────────────────────────────────────
  {
    slug: "difusor-qrd",
    name: "Difusor QRD: Espalhamento Unidimensional",
    category: "Difusão Sonora",
    application: ["Estúdio", "Auditório", "Corporativo"],
    material: "Madeira",
    thickness: "75mm",
    shortDescription: "Difusor unidimensional baseado em sequência de resíduos quadráticos (QRD).",
    description: "O Difusor QRD utiliza fendas de profundidade variável calculadas por sequência de resíduos quadráticos para criar difusão unidimensional uniforme. Cada fenda é posicionada seguindo cálculos matemáticos que garantem espalhamento sonoro controlado.",
    image: difusorSkyline,
    gallery: [difusorSkyline, wavefuserHibrido, mdfVazadoDifusor],
    specs: [
      { label: "Faixa de Difusão", value: "800Hz – 8kHz" },
      { label: "Tipo", value: "QRD (Unidimensional)" },
      { label: "Profundidade", value: "75mm" },
      { label: "Dimensões", value: "600×600mm" },
      { label: "Peso", value: "5.5 kg" },
      { label: "Sequência", value: "QRD N=7" },
    ],
    materials: ["Madeira Maciça (Pinus)", "Base em MDF 18mm", "Acabamento Natural ou Laqueado"],
    colors: woodColors,
  },

  {
    slug: "difusor-skyline",
    name: "Difusor Skyline: Difusão Bidimensional 3D",
    category: "Difusão Sonora",
    application: ["Estúdio", "Auditório"],
    material: "Madeira",
    thickness: "75mm",
    shortDescription: "Difusão bidimensional com blocos 3D de alturas variáveis — visual impactante.",
    description: "O Difusor Skyline utiliza blocos de madeira maciça em alturas calculadas para criar difusão bidimensional uniforme. Cada bloco é posicionado seguindo uma sequência de resíduos quadráticos que garante espalhamento sonoro em todas as direções.",
    image: difusorSkyline4,
    gallery: [difusorSkyline4, difusorSkyline6, difusorSkyline7, difusorSkyline3, difusorSkyline1, difusorSkyline2, difusorSkyline5, difusorSkyline8, difusorSkyline9],
    specs: [
      { label: "Faixa de Difusão", value: "800Hz – 8kHz" },
      { label: "Tipo", value: "Skyline (Bidimensional)" },
      { label: "Profundidade Máx.", value: "75mm" },
      { label: "Dimensões", value: "600×600mm" },
      { label: "Peso", value: "5.5 kg" },
      { label: "Material", value: "Pinus Maciço / MDF Premium" },
    ],
    materials: ["Blocos de Pinus Maciço", "Base em MDF 18mm", "Acabamento Natural ou Laqueado", "Fixação Oculta em Aço"],
    colors: woodColors,
  },

  {
    slug: "difusor-bidimensional",
    name: "Difusor Bidimensional: Espalhamento Completo",
    category: "Difusão Sonora",
    application: ["Estúdio", "Auditório", "Corporativo"],
    material: "Madeira",
    thickness: "75mm",
    shortDescription: "Difusão em dois eixos para espalhamento sonoro completo — ideal para paredes traseiras.",
    description: "O Difusor Bidimensional espalha o som em ambos os eixos (horizontal e vertical), garantindo a eliminação total de reflexões especulares sem perder energia sonora. Ideal para paredes traseiras de estúdios e salas de concerto.",
    image: wavefuserHibrido,
    gallery: [wavefuserHibrido, difusorSkyline, mdfVazadoDifusor],
    specs: [
      { label: "Faixa de Difusão", value: "500Hz – 6kHz" },
      { label: "Tipo", value: "Bidimensional" },
      { label: "Profundidade", value: "75mm" },
      { label: "Dimensões", value: "600×600mm" },
      { label: "Peso", value: "6.0 kg" },
    ],
    materials: ["Madeira Maciça", "MDF Estrutural", "Acabamento Natural ou Tingido"],
    colors: woodColors,
  },

  // ── BAFFLES & FORROS ────────────────────────────────────────
  {
    slug: "baffles-acusticos",
    name: "Baffle Acústico: Absorção Vertical Suspensa",
    category: "Tratamento Aéreo",
    application: ["Corporativo", "Igreja", "Auditório", "Restaurante"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Painéis suspensos verticalmente para absorção em ambientes com tetos altos ou expostos.",
    description: "Os Baffles Acústicos são painéis suspensos verticalmente do teto, proporcionando absorção em ambas as faces. Ideais para ambientes industriais, academias, restaurantes e igrejas com tetos expostos onde nuvens horizontais não são viáveis.",
    image: bafflesColoridos,
    gallery: [bafflesColoridos, salaAulaBaffles, academiaBaffles, academiaTeto],
    specs: [
      { label: "NRC", value: "0.90 (dupla face)" },
      { label: "Espessura", value: "50mm" },
      { label: "Dimensões", value: "1200×600 / 1200×300mm" },
      { label: "Instalação", value: "Suspensa Vertical" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico (ambas faces)", "Cabos de Aço", "Suportes Metálicos"],
    colors: fabricColors,
  },

  {
    slug: "forro-acustico-modular",
    name: "Forro Acústico Modular: Sistema de Teto Integrado",
    category: "Tratamento Aéreo",
    application: ["Corporativo", "Igreja", "Auditório"],
    material: "Fibra de Vidro",
    thickness: "25mm",
    shortDescription: "Sistema de forro modular com absorção integrada e grid metálico.",
    description: "Forro acústico modular com design clean e alta absorção. Sistema de fixação rápida com grid metálico. A modularidade permite fácil manutenção e acesso ao plenum.",
    image: forroCorporativo,
    gallery: [forroCorporativo, forroIndustrial],
    specs: [
      { label: "NRC", value: "0.80" },
      { label: "Espessura", value: "25mm" },
      { label: "Dimensões", value: "625×625mm" },
      { label: "Peso", value: "1.8 kg" },
      { label: "Classe de Fogo", value: "A1" },
    ],
    materials: ["Fibra de Vidro", "Véu de Vidro", "Grid em Aço Galvanizado"],
    colors: fabricColors.slice(0, 10),
  },

  // ── BIOMBOS ACÚSTICOS ───────────────────────────────────────
  {
    slug: "biombo-acustico-retratil",
    name: "Biombo Acústico Retrátil: Divisória Portátil 3 Folhas",
    category: "Isolamento Móvel",
    application: ["Corporativo", "Estúdio", "Podcast"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Biombo retrátil de 3 folhas para divisão acústica portátil. 3 tamanhos disponíveis.",
    description: "O Biombo Acústico Retrátil permite criar divisões acústicas temporárias sem obras. Com 3 folhas articuladas, pode ser posicionado em configurações diversas e recolhido quando não necessário.",
    image: escritorioPaineis,
    gallery: [escritorioPaineis, paineisSalaReuniao],
    sizes: [
      { label: "Alto", dimensions: "180 × 60 × 5 cm (cada folha)" },
      { label: "Médio", dimensions: "150 × 60 × 5 cm (cada folha)" },
      { label: "Compacto", dimensions: "120 × 60 × 5 cm (cada folha)" },
    ],
    specs: [
      { label: "NRC", value: "0.85" },
      { label: "Configuração", value: "3 Folhas Articuladas" },
      { label: "Espessura/Folha", value: "50mm" },
      { label: "Portátil", value: "Sim — Retrátil" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico (dupla face)", "Dobradiças em Aço", "Estrutura em Alumínio"],
    colors: fabricColors,
  },

  {
    slug: "biombo-acustico-cavalete",
    name: "Biombo Acústico Cavalete: Divisória Independente",
    category: "Isolamento Móvel",
    application: ["Corporativo", "Estúdio", "Podcast"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Biombo acústico de 1 folha com base tipo cavalete — divisão rápida e estável.",
    description: "Biombo acústico independente com base tipo cavalete para estabilidade sem fixação. Ideal para escritórios open-plan, estúdios de podcast e espaços de coworking.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao, escritorioPaineis],
    specs: [
      { label: "NRC", value: "0.85" },
      { label: "Configuração", value: "1 Folha + Cavalete" },
      { label: "Espessura", value: "50mm" },
      { label: "Base", value: "Cavalete em Madeira/Aço" },
    ],
    materials: ["Lã de Rocha D32", "Tecido Acústico (dupla face)", "Base Cavalete"],
    colors: fabricColors,
  },

  // ── PORTAS & CORTINAS ───────────────────────────────────────
  {
    slug: "cortina-acustica-snr96c",
    name: "Cortina Acústica SNR96C: Vedação e Isolamento",
    category: "Isolamento Acústico",
    application: ["Estúdio", "Igreja", "Auditório", "Home Theater"],
    material: "Tecido",
    thickness: "Variável",
    shortDescription: "Cortina acústica com vedação completa para isolamento e absorção máxima.",
    description: "A Cortina Acústica SNR96C oferece vedação completa com camadas múltiplas de tecido acústico de alta massa. Ideal para cobrir janelas, divisórias e aberturas onde o isolamento acústico é necessário sem obras permanentes.",
    image: salaTratamento,
    gallery: [salaTratamento, estudioPaineis],
    specs: [
      { label: "Código", value: "SNR96C" },
      { label: "Tipo", value: "Vedação Completa" },
      { label: "Camadas", value: "Múltiplas" },
      { label: "STC", value: "25–30" },
      { label: "Dimensões", value: "Sob medida" },
    ],
    materials: ["Tecido Acústico Multicamada", "Massa Vinílica", "Trilho em Alumínio", "Ilhoses em Aço"],
    colors: fabricColors.slice(0, 12),
  },

  {
    slug: "porta-acustica-dupla",
    name: "Porta Acústica Dupla: Isolamento de Alta Performance",
    category: "Isolamento Acústico",
    application: ["Estúdio", "Auditório"],
    material: "Madeira",
    thickness: "Variável",
    shortDescription: "Porta acústica com sistema duplo para máximo isolamento sonoro.",
    description: "Porta acústica com câmara dupla para isolamento superior. Sistema de vedação com gaxetas perimetrais e soleira automática. Ideal para estúdios profissionais e salas de ensaio.",
    image: salaTratamento,
    gallery: [salaTratamento],
    specs: [
      { label: "STC", value: "45–55" },
      { label: "Tipo", value: "Dupla (Câmara de Ar)" },
      { label: "Vedação", value: "Gaxetas Perimetrais" },
      { label: "Soleira", value: "Automática Retrátil" },
    ],
    materials: ["MDF Estrutural", "Massa Vinílica", "Gaxetas EPDM", "Fechadura Acústica"],
  },

  {
    slug: "porta-acustica-anti-panico",
    name: "Porta Acústica: Barra Anti-Pânico Certificada",
    category: "Isolamento Acústico",
    application: ["Auditório", "Igreja", "Corporativo"],
    material: "Madeira",
    thickness: "Variável",
    shortDescription: "Porta acústica com barra anti-pânico para conformidade com normas de segurança.",
    description: "Combina isolamento acústico com conformidade às normas de segurança contra incêndio. Barra anti-pânico certificada, ideal para auditórios, igrejas e espaços públicos.",
    image: salaTratamento,
    gallery: [salaTratamento],
    specs: [
      { label: "STC", value: "40–50" },
      { label: "Barra", value: "Anti-Pânico Certificada" },
      { label: "Norma", value: "NBR 11785" },
    ],
    materials: ["MDF Estrutural", "Barra Anti-Pânico em Aço", "Vedação EPDM"],
  },

  {
    slug: "painel-isolamento-d96",
    name: "Painel Isolante D96: Sistema Massa-Mola-Massa",
    category: "Isolamento Acústico",
    application: ["Estúdio", "Home Theater"],
    material: "Lã de Rocha",
    thickness: "100mm",
    shortDescription: "Sistema de isolamento acústico com lã D96, câmara de ar (GAP) e MDF estrutural.",
    description: "Sistema completo de isolamento acústico que combina lã de rocha de alta densidade (D96), câmara de ar (GAP) e painéis de MDF para máxima redução de transmissão sonora entre ambientes.",
    image: salaTratamento,
    gallery: [salaTratamento, estudioPaineis],
    specs: [
      { label: "Tipo", value: "Isolamento (Massa-Mola-Massa)" },
      { label: "Densidade", value: "96 kg/m³" },
      { label: "Sistema", value: "D96 + GAP + MDF" },
      { label: "STC", value: "55–65" },
    ],
    materials: ["Lã de Rocha D96", "MDF Estrutural 18mm", "Câmara de Ar", "Perfis Metálicos"],
  },

  // ── MATÉRIA-PRIMA ───────────────────────────────────────────
  {
    slug: "la-de-rocha-d32",
    name: "Lã de Rocha D32: Absorção High-Mid",
    category: "Insumos Técnicos",
    application: ["Estúdio", "Corporativo", "Residencial"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Lã de rocha D32 para fabricação de painéis e tratamento acústico High-Mid.",
    description: "Lã de rocha com densidade de 32 kg/m³, ideal para absorção em médias e altas frequências. Material base para fabricação de painéis acústicos, nuvens e baffles.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao],
    specs: [
      { label: "Densidade", value: "32 kg/m³" },
      { label: "Espessura", value: "50mm" },
      { label: "Classe de Fogo", value: "A1" },
      { label: "Faixa", value: "High-Mid" },
    ],
    materials: ["Lã de Rocha Mineral"],
    certifications: defaultCertifications,
    absorptionTable: absorptionTableD32_50,
  },

  {
    slug: "la-de-rocha-d64",
    name: "Lã de Rocha D64: Absorção Low-Mid",
    category: "Insumos Técnicos",
    application: ["Estúdio", "Home Theater", "Igreja"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Lã de rocha D64 para absorção em baixas e médias frequências.",
    description: "Lã de rocha com densidade de 64 kg/m³, proporcionando maior absorção em frequências graves. Ideal para bass traps e painéis Low-Mid.",
    image: bassTrapStudio,
    gallery: [bassTrapStudio],
    specs: [
      { label: "Densidade", value: "64 kg/m³" },
      { label: "Espessura", value: "50mm" },
      { label: "Classe de Fogo", value: "A1" },
      { label: "Faixa", value: "Low-Mid" },
    ],
    materials: ["Lã de Rocha Mineral"],
    certifications: defaultCertifications,
  },

  {
    slug: "la-de-rocha-d96",
    name: "Lã de Rocha D96: Isolamento Broadband",
    category: "Insumos Técnicos",
    application: ["Estúdio", "Home Theater"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "Lã de rocha D96 para isolamento e absorção broadband de alta performance.",
    description: "Lã de rocha com densidade de 96 kg/m³, a mais densa da linha. Para aplicações que exigem máximo isolamento e absorção broadband.",
    image: bassTrapStudio,
    gallery: [bassTrapStudio],
    specs: [
      { label: "Densidade", value: "96 kg/m³" },
      { label: "Espessura", value: "50mm" },
      { label: "Classe de Fogo", value: "A1" },
      { label: "Faixa", value: "Broadband" },
    ],
    materials: ["Lã de Rocha Mineral"],
    certifications: defaultCertifications,
  },

  {
    slug: "la-de-pet",
    name: "Lã de PET: Absorção Sustentável",
    category: "Insumos Técnicos",
    application: ["Corporativo", "Residencial"],
    material: "Lã de PET",
    thickness: "50mm",
    shortDescription: "Lã de PET reciclada — alternativa ecológica para absorção acústica.",
    description: "Fabricada a partir de garrafas PET recicladas, a Lã de PET é uma alternativa sustentável para tratamento acústico. Não causa irritação na pele, é livre de formaldeído e segura para manipulação.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao],
    specs: [
      { label: "Material", value: "PET Reciclado" },
      { label: "Espessura", value: "50mm" },
      { label: "Sustentável", value: "100% Reciclável" },
      { label: "Formaldeído", value: "Zero" },
    ],
    materials: ["Fibra de PET Reciclada"],
  },

  {
    slug: "membrana-borracha",
    name: "Membrana de Borracha: Isolamento de Alta Massa",
    category: "Insumos Técnicos",
    application: ["Estúdio", "Home Theater"],
    material: "Borracha",
    thickness: "Variável",
    shortDescription: "Membrana de borracha de alta massa para isolamento acústico e bass traps de membrana.",
    description: "Membrana de borracha de alta massa para uso em sistemas de isolamento acústico e como componente de bass traps de membrana ressonante.",
    image: bassTrapStudio,
    gallery: [bassTrapStudio],
    specs: [
      { label: "Material", value: "Borracha de Alta Massa" },
      { label: "Densidade", value: "Alta" },
      { label: "Uso", value: "Isolamento / Bass Traps" },
    ],
    materials: ["Borracha Sintética de Alta Massa"],
  },

  {
    slug: "tecidos-acusticos",
    name: "Tecido Acústico: Revestimento Transparente ao Som",
    category: "Insumos Técnicos",
    application: ["Estúdio", "Corporativo", "Residencial"],
    material: "Tecido",
    thickness: "Variável",
    shortDescription: "Tecidos acústicos transparentes ao som em 34+ cores para revestimento de painéis.",
    description: "Linha completa de tecidos acústicos 100% poliéster, transparentes ao som e resistentes ao fogo. Disponíveis em mais de 34 cores para personalizar seus painéis.",
    image: paineisAzuis,
    gallery: [paineisAzuis, paineisColoridosTeto],
    specs: [
      { label: "Material", value: "100% Poliéster" },
      { label: "Cores", value: "34+ opções" },
      { label: "Transparência Sonora", value: "Alta" },
      { label: "Classe de Fogo", value: "M1" },
    ],
    materials: ["Poliéster Acústico"],
    colors: fabricColors,
  },

  {
    slug: "carpete-acustico",
    name: "Carpete Acústico: Atenuação de Impacto",
    category: "Insumos Técnicos",
    application: ["Estúdio", "Corporativo", "Home Theater"],
    material: "Carpete",
    thickness: "Variável",
    shortDescription: "Carpete para tratamento acústico de pisos — redução de impacto e reverberação.",
    description: "Carpete acústico para redução de ruído de impacto e absorção complementar em pisos. Ideal para estúdios, salas de reunião e home theaters.",
    image: salaTratamento,
    gallery: [salaTratamento],
    specs: [
      { label: "Tipo", value: "Carpete Acústico" },
      { label: "Uso", value: "Piso" },
    ],
    materials: ["Fibra de Carpete", "Base Acústica"],
  },

  {
    slug: "piso-emborrachado",
    name: "Piso Emborrachado: Isolamento de Vibração",
    category: "Insumos Técnicos",
    application: ["Estúdio", "Home Theater"],
    material: "Borracha",
    thickness: "Variável",
    shortDescription: "Piso emborrachado para isolamento de impacto e vibração em estúdios e academias.",
    description: "Piso emborrachado de alta densidade para isolamento de ruído de impacto e vibrações. Ideal para estúdios de gravação, salas de bateria e academias.",
    image: salaTratamento,
    gallery: [salaTratamento],
    specs: [
      { label: "Material", value: "Borracha Reciclada" },
      { label: "Uso", value: "Piso — Isolamento de Impacto" },
    ],
    materials: ["Borracha Reciclada de Alta Densidade"],
  },

  {
    slug: "drywall",
    name: "Drywall Acústico: Placa para Isolamento",
    category: "Insumos Técnicos",
    application: ["Estúdio", "Corporativo"],
    material: "Fibra de Vidro",
    thickness: "Variável",
    shortDescription: "Placas de drywall para sistemas de isolamento massa-mola-massa.",
    description: "Placas de drywall para uso em sistemas de isolamento acústico. Componente essencial do sistema massa-mola-massa para paredes e tetos acústicos.",
    image: salaTratamento,
    gallery: [salaTratamento],
    specs: [
      { label: "Tipo", value: "Placa de Gesso" },
      { label: "Uso", value: "Isolamento — Massa-Mola-Massa" },
    ],
    materials: ["Gesso Acartonado"],
  },

  {
    slug: "espuma-expansiva",
    name: "Espuma Expansiva: Vedação de Frestas Acústica",
    category: "Insumos Técnicos",
    application: ["Estúdio"],
    material: "Espuma",
    thickness: "Variável",
    shortDescription: "Espuma expansiva para vedação de frestas e junções em projetos de isolamento.",
    description: "Espuma expansiva PU para vedação de frestas, juntas e passagens em projetos de isolamento acústico. Garante a estanqueidade do sistema.",
    image: salaTratamento,
    gallery: [salaTratamento],
    specs: [
      { label: "Tipo", value: "PU Expansiva" },
      { label: "Uso", value: "Vedação de Frestas" },
    ],
    materials: ["Poliuretano Expansivo"],
  },

  // ── ACESSÓRIOS & SUPORTES ───────────────────────────────────
  {
    slug: "suportes-instalacao",
    name: "Kit de Suporte: Fixação Universal",
    category: "Fixação & Suportes",
    application: ["Estúdio", "Corporativo", "Residencial"],
    material: "Lã de Rocha",
    thickness: "Variável",
    shortDescription: "Kit completo com 3 tipos de parafusos, buchas, cabos de aço, ganchos e suportes dentados.",
    description: "Kit completo de fixação para todos os produtos Sonar. Inclui 3 tipos de parafusos (alvenaria, drywall, madeira), 3 tipos de buchas, cabos de aço para suspensão, ganchos abertos e suportes dentados.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao],
    specs: [
      { label: "Parafusos", value: "3 tipos (Alvenaria/Drywall/Madeira)" },
      { label: "Buchas", value: "3 tipos" },
      { label: "Suspensão", value: "Cabos de Aço" },
      { label: "Fixação", value: "Ganchos Abertos + Dentados" },
    ],
    materials: ["Parafusos em Aço", "Buchas Plásticas/Metálicas", "Cabos de Aço Galvanizado", "Suportes Dentados"],
  },

  {
    slug: "velcro-50mm",
    name: "Velcro 50mm: Fixação Removível para Painéis",
    category: "Fixação & Suportes",
    application: ["Estúdio", "Corporativo", "Residencial"],
    material: "Tecido",
    thickness: "Variável",
    shortDescription: "Velcro adesivo de 50mm para fixação removível de painéis acústicos.",
    description: "Velcro industrial de 50mm com adesivo de alta aderência para fixação removível de painéis acústicos. Permite reposicionamento sem danificar paredes.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao],
    specs: [
      { label: "Largura", value: "50mm" },
      { label: "Tipo", value: "Adesivo Industrial" },
      { label: "Removível", value: "Sim" },
    ],
    materials: ["Velcro Industrial", "Adesivo de Alta Aderência"],
  },

  {
    slug: "microfone-medicao",
    name: "Microfone de Medição: Análise Acústica RT60",
    category: "Fixação & Suportes",
    application: ["Estúdio", "Corporativo"],
    material: "Lã de Rocha",
    thickness: "Variável",
    shortDescription: "Microfone de medição omnidirecional para análise acústica de ambientes (RT60, frequência).",
    description: "Microfone de medição com resposta omnidirecional e curva plana para análise acústica profissional. Compatível com softwares de medição como REW, Smaart e Room EQ Wizard.",
    image: estudioPaineis,
    gallery: [estudioPaineis],
    specs: [
      { label: "Padrão Polar", value: "Omnidirecional" },
      { label: "Resposta", value: "20Hz – 20kHz (±1dB)" },
      { label: "Compatível", value: "REW / Smaart / Room EQ" },
    ],
    materials: ["Cápsula Condensadora", "Corpo em Alumínio"],
  },

  {
    slug: "cadeiras-estudio",
    name: "Mobiliário de Estúdio: Mesa e Cadeira Ergonômica",
    category: "Fixação & Suportes",
    application: ["Estúdio", "Corporativo", "Podcast"],
    material: "Madeira",
    thickness: "Variável",
    shortDescription: "Mobiliário especializado para estúdios de gravação e escritórios de produção.",
    description: "Linha de mobiliário projetado para estúdios: cadeiras ergonômicas para longas sessões, mesas de produção com gerenciamento de cabos e racks integrados.",
    image: estudioPaineis,
    gallery: [estudioPaineis],
    specs: [
      { label: "Tipo", value: "Mobiliário de Estúdio" },
      { label: "Ergonomia", value: "Profissional" },
    ],
    materials: ["Madeira MDF/MDP", "Aço Estrutural", "Espuma Ergonômica"],
  },

  {
    slug: "tapetes-acusticos",
    name: "Tapete Acústico: Absorção Complementar de Piso",
    category: "Fixação & Suportes",
    application: ["Estúdio", "Residencial", "Home Theater"],
    material: "Tecido",
    thickness: "Variável",
    shortDescription: "Tapetes de alta densidade para absorção complementar e redução de ruído de impacto.",
    description: "Tapetes acústicos de alta densidade para complementar o tratamento de pisos. Reduzem ruído de impacto e contribuem para absorção de médias-altas frequências.",
    image: salaTratamento,
    gallery: [salaTratamento],
    specs: [
      { label: "Tipo", value: "Tapete Acústico" },
      { label: "Uso", value: "Piso — Absorção Complementar" },
    ],
    materials: ["Fibra de Alta Densidade", "Base Antiderrapante"],
  },

  // ── KITS COMPLETOS ──────────────────────────────────────────
  {
    slug: "kit-estudio-classic",
    name: "Kit Classic: Tratamento Acústico Essencial",
    category: "Kits Completos",
    application: ["Estúdio", "Podcast", "Home Theater"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "2 Bass Traps + 4 Painéis + 2 Nuvens — o essencial para começar seu tratamento.",
    description: "O Kit Classic é a porta de entrada para o tratamento acústico profissional. Inclui 2 Bass Traps Corner para controle de graves, 4 Painéis SNR3250 para reflexões primárias e 2 Nuvens para o teto. Ideal para salas de até 15m².",
    image: estudioPaineis,
    gallery: [estudioPaineis, bassTrapCorner, paineisSalaReuniao, nuvemAcustica],
    specs: [
      { label: "Bass Traps", value: "2× Corner 3S SNR6430" },
      { label: "Painéis", value: "4× SNR3250 (600×600mm)" },
      { label: "Nuvens", value: "2× SNR3250 (1200×600mm)" },
      { label: "Área Ideal", value: "Até 15m²" },
      { label: "Suportes", value: "Inclusos" },
    ],
    materials: ["Lã de Rocha D32 e D64", "Tecido Acústico", "Cabos de Aço", "Kit de Fixação Completo"],
    colors: fabricColors,
  },

  {
    slug: "kit-estudio-premium",
    name: "Kit Premium: Tratamento Acústico Completo",
    category: "Kits Completos",
    application: ["Estúdio", "Home Theater"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "4 Bass Traps + 8 Painéis + 3 Nuvens — tratamento completo para ambientes sérios.",
    description: "O Kit Premium oferece tratamento acústico completo para estúdios de gravação e mixagem. 4 Bass Traps para todos os cantos, 8 Painéis para reflexões primárias e paredes laterais, e 3 Nuvens para o teto. Ideal para salas de 15 a 25m².",
    image: estudioPaineis,
    gallery: [estudioPaineis, bassTrapPair, paineisSalaReuniao, nuvemAcustica],
    specs: [
      { label: "Bass Traps", value: "4× Corner 3S SNR6430" },
      { label: "Painéis", value: "8× SNR3250 (1200×600mm)" },
      { label: "Nuvens", value: "3× SNR3250 (1200×600mm)" },
      { label: "Área Ideal", value: "15 – 25m²" },
      { label: "Suportes", value: "Inclusos" },
    ],
    materials: ["Lã de Rocha D32 e D64", "Tecido Acústico", "Cabos de Aço", "Kit de Fixação Completo"],
    colors: fabricColors,
  },

  {
    slug: "kit-estudio-pro",
    name: "Kit Pro: Tratamento Acústico Definitivo",
    category: "Kits Completos",
    application: ["Estúdio"],
    material: "Lã de Rocha",
    thickness: "50mm",
    shortDescription: "8 Bass Traps + 12 Painéis + 3 Nuvens + 4 Difusores Skyline — o tratamento definitivo.",
    description: "O Kit Pro é o tratamento acústico definitivo. 8 Bass Traps para controle modal completo, 12 Painéis para todas as reflexões, 3 Nuvens para o teto e 4 Difusores Skyline para a parede traseira. Para profissionais que exigem o melhor.",
    image: estudioPaineis,
    gallery: [estudioPaineis, bassTrapPair, paineisSalaReuniao, nuvemAcustica, difusorSkyline],
    specs: [
      { label: "Bass Traps", value: "8× Corner 3S SNR6430" },
      { label: "Painéis", value: "12× SNR3250 (1200×600mm)" },
      { label: "Nuvens", value: "3× SNR3250 (1200×1200mm)" },
      { label: "Difusores", value: "4× Skyline (600×600mm)" },
      { label: "Área Ideal", value: "25m²+" },
      { label: "Suportes", value: "Inclusos" },
    ],
    materials: ["Lã de Rocha D32 e D64", "Tecido Acústico", "Madeira Maciça (Difusores)", "Cabos de Aço", "Kit de Fixação Completo"],
    colors: fabricColors,
  },

  // ── SERVIÇOS ────────────────────────────────────────────────
  {
    slug: "projeto-3d",
    name: "Projeto 3D: Modelagem Acústica do Ambiente",
    category: "Serviços",
    application: ["Estúdio", "Corporativo", "Igreja", "Auditório", "Residencial", "Home Theater"],
    material: "Lã de Rocha",
    thickness: "Variável",
    shortDescription: "Modelagem 3D do seu ambiente com posicionamento otimizado de produtos acústicos.",
    description: "Nosso serviço de Projeto 3D cria uma modelagem realista do seu ambiente com posicionamento otimizado de todos os produtos acústicos. Você recebe visualizações renderizadas antes da compra, garantindo que o resultado atenda suas expectativas.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao, estudioPaineis, escritorioPaineis],
    specs: [
      { label: "Tipo", value: "Projeto 3D" },
      { label: "Entrega", value: "Renderizações + Planta" },
      { label: "Inclui", value: "Posicionamento + Quantidades" },
    ],
    materials: [],
  },

  {
    slug: "consultoria-tecnica",
    name: "Consultoria Técnica: Análise Acústica Especializada",
    category: "Serviços",
    application: ["Estúdio", "Corporativo", "Igreja", "Auditório", "Residencial"],
    material: "Lã de Rocha",
    thickness: "Variável",
    shortDescription: "Análise acústica completa: RT60, absorção, modos de sala e recomendações.",
    description: "Serviço de consultoria acústica com medição de RT60, análise de modos de sala, cálculo de absorção necessária e recomendações de tratamento personalizadas. Realizada por engenheiros acústicos especializados.",
    image: estudioPaineis,
    gallery: [estudioPaineis],
    specs: [
      { label: "Tipo", value: "Consultoria Acústica" },
      { label: "Medições", value: "RT60, Modos de Sala, SPL" },
      { label: "Entrega", value: "Relatório Técnico + Projeto" },
    ],
    materials: [],
  },

  {
    slug: "visita-tecnica",
    name: "Visita Técnica: Levantamento e Medição In Loco",
    category: "Serviços",
    application: ["Estúdio", "Corporativo", "Igreja", "Auditório"],
    material: "Lã de Rocha",
    thickness: "Variável",
    shortDescription: "Visita técnica presencial para levantamento e medição acústica no local.",
    description: "Visita presencial de nosso engenheiro acústico ao seu ambiente para levantamento dimensional, medições acústicas in loco e definição da melhor estratégia de tratamento.",
    image: estudioPaineis,
    gallery: [estudioPaineis],
    specs: [
      { label: "Tipo", value: "Visita Presencial" },
      { label: "Inclui", value: "Medições + Levantamento" },
      { label: "Abrangência", value: "São Paulo e Região" },
    ],
    materials: [],
  },

  {
    slug: "integracao-transportadora",
    name: "Logística Integrada: Envio Nacional Seguro",
    category: "Serviços",
    application: ["Estúdio", "Corporativo", "Residencial"],
    material: "Lã de Rocha",
    thickness: "Variável",
    shortDescription: "Envio nacional com transportadoras parceiras — embalagem reforçada para segurança.",
    description: "Serviço de logística integrada com transportadoras parceiras para entrega em todo o Brasil. Embalagem reforçada com proteção contra impacto para garantir a integridade dos produtos.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao],
    specs: [
      { label: "Abrangência", value: "Todo o Brasil" },
      { label: "Embalagem", value: "Reforçada com Proteção" },
      { label: "Rastreamento", value: "Código de Rastreio" },
    ],
    materials: [],
  },

  // ── REVESTIMENTOS ───────────────────────────────────────────
  {
    slug: "revestimento-ripado",
    name: "Revestimento Ripado: Estética e Absorção Integrada",
    category: "Absorção Acústica",
    subcategory: "Revestimento",
    application: ["Residencial", "Corporativo", "Auditório"],
    material: "Madeira",
    thickness: "50mm",
    shortDescription: "Revestimento de parede com estética premium e absorção acústica integrada.",
    description: "Revestimento ripado que combina estética sofisticada com performance acústica. As ripas em madeira natural criam um visual premium enquanto o núcleo absorvente trata a acústica do ambiente.",
    image: escritorioPaineis,
    gallery: [escritorioPaineis, paineisSeminario],
    specs: [
      { label: "NRC", value: "0.70" },
      { label: "Espessura Total", value: "50mm" },
      { label: "Dimensões", value: "300×2400mm" },
      { label: "Peso", value: "6.2 kg/m²" },
      { label: "Acabamento", value: "Natural / Carvalho / Nogueira" },
    ],
    materials: ["Ripas de Madeira Natural", "Feltro Acústico 12mm", "MDF Estrutural"],
    colors: woodColors,
  },

  // ── KIT DE FIXAÇÃO ─────────────────────────────────────────
  {
    slug: "kit-fixacao-acustica",
    name: "Kit de Fixação Acústica: Instalação Profissional",
    category: "Fixação & Suportes",
    application: ["Estúdio", "Igreja", "Auditório", "Corporativo", "Residencial", "Home Theater", "Podcast", "Restaurante"],
    material: "Madeira",
    thickness: "Variável",
    shortDescription: "Kit completo com fixadores dentados, buchas e parafusos para instalação de painéis, bass traps, difusores e painéis ripados.",
    description: "O Kit de Fixação Acústica Sonar contém todos os componentes necessários para a instalação segura e profissional dos produtos acústicos. Inclui fixadores dentados (sawtooth hangers) de aço galvanizado, buchas universais S6 e parafusos panela — compatíveis com alvenaria, drywall e madeira. Ideal para painéis acústicos, bass traps, difusores skyline e revestimentos ripados.",
    longDescription: "Cada kit é dimensionado de acordo com o peso e tamanho do produto a ser instalado. Os fixadores dentados garantem um ajuste fino horizontal sem necessidade de ferramentas especiais, permitindo nivelamento perfeito do painel após fixação na parede. As buchas universais S6 são compatíveis com blocos de concreto, tijolos maciços, drywall e madeira — dispensando buchas especiais na maioria dos casos.\n\nPara painéis de até 5 kg, basta 1 fixador central. Painéis maiores (acima de 1200mm) utilizam 2 fixadores. Bass traps e difusores podem exigir parafusos adicionais conforme o peso.\n\nDisponível nas versões prata (galvanizado) e preto (fosfatizado), para combinar com o acabamento do produto.",
    image: fixadorKitPreto,
    gallery: [fixadorKitPreto, fixadorKitPrata, fixadorDetalhe, fixadorBuchaParafuso],
    sizes: [
      { label: "Kit Unitário", dimensions: "1 fixador + 2 parafusos + 2 buchas" },
      { label: "Kit Painel Grande", dimensions: "2 fixadores + 4 parafusos + 4 buchas" },
      { label: "Kit Bass Trap", dimensions: "2 fixadores + 4 parafusos + 4 buchas + 2 cantoneiras" },
      { label: "Kit Difusor", dimensions: "4 fixadores + 8 parafusos + 8 buchas" },
    ],
    specs: [
      { label: "Material Fixador", value: "Aço Galvanizado / Fosfatizado" },
      { label: "Bucha", value: "Universal S6 (Nylon)" },
      { label: "Parafuso", value: "Panela Phillips 4×40mm" },
      { label: "Capacidade", value: "Até 15 kg por fixador" },
      { label: "Compatibilidade", value: "Alvenaria, Drywall, Madeira" },
      { label: "Acabamento", value: "Prata (Galvanizado) ou Preto (Fosfatizado)" },
    ],
    materials: ["Fixador Dentado (Sawtooth Hanger) em Aço", "Bucha Universal S6 em Nylon", "Parafuso Panela Phillips 4×40mm", "Arruela Lisa (quando aplicável)"],
    highlights: [
      { icon: "tool", title: "Instalação Profissional", desc: "Tudo incluso para fixar com segurança" },
      { icon: "ruler", title: "Ajuste Fino Horizontal", desc: "Fixador dentado permite nivelamento" },
      { icon: "target", title: "Universal", desc: "Compatível com todos os produtos Sonar" },
      { icon: "waveform", title: "Suporte Até 15kg", desc: "Capacidade para painéis grandes" },
    ],
    advantages: [
      "Fixador dentado permite ajuste horizontal sem refazer furos",
      "Bucha universal compatível com diversos tipos de parede",
      "Instalação rápida — sem ferramentas especiais",
      "Acabamento discreto: fica oculto atrás do painel",
      "Kit dimensionado por tipo de produto acústico",
    ],
    faq: [
      { question: "Quantos kits preciso por painel?", answer: "Para painéis de até 1000×600mm e 5 kg, 1 kit unitário (1 fixador central). Para painéis acima de 1200mm, use o Kit Painel Grande (2 fixadores)." },
      { question: "Funciona em drywall?", answer: "Sim. A bucha universal S6 é compatível com drywall. Para cargas acima de 8 kg em drywall, recomendamos buchas tipo toggle bolt (não inclusa)." },
      { question: "O fixador fica visível após a instalação?", answer: "Não. O fixador dentado é instalado na parte traseira do painel e fica completamente oculto quando o painel está na parede." },
    ],
  },
];
