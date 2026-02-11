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
import mdfVazadoAbsorvedor from "@/assets/gallery/mdf-vazado-absorvedor.jpg";
import mdfVazadoDifusor from "@/assets/gallery/mdf-vazado-difusor.jpg";
import wavefuserHibrido from "@/assets/gallery/wavefuser-hibrido.jpg";

import { fabricColors, woodColors, type ProductColor } from "./productColors";
export type { ProductColor };

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
  colors?: ProductColor[];
}

export const productColors = fabricColors;

export const categories = ["Painéis Acústicos", "Bass Traps", "Difusores", "Forros Acústicos", "Revestimentos", "Painéis MDF Vazado"];
export const applications = ["Estúdio", "Igreja", "Auditório", "Corporativo", "Residencial"];
export const materialsFilter = ["Lã de Rocha", "Espuma", "Madeira", "Tecido", "Fibra de Vidro", "MDF"];
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
    description: "O Painel Absorvedor Premium é projetado para oferecer máxima absorção sonora em médias e altas frequências. Ideal para estúdios de gravação, salas de reunião e home theaters. Revestido em tecido acústico de alta qualidade, disponível em diversas cores. Sua construção com núcleo de lã de rocha de alta densidade garante performance acústica consistente e durabilidade excepcional.",
    image: paineisSalaReuniao,
    gallery: [paineisSalaReuniao, paineisAzuis, paineisEscritorioRustico, paineisSeminario],
    specs: [
      { label: "NRC", value: "0.95" },
      { label: "Espessura", value: "50mm" },
      { label: "Dimensões", value: "600x1200mm" },
      { label: "Peso", value: "3.2kg" },
      { label: "Classe de Fogo", value: "A2" },
      { label: "Densidade do Núcleo", value: "48kg/m³" },
    ],
    materials: ["Lã de Rocha 48kg/m³", "Tecido Acústico 100% Poliéster", "Moldura em Alumínio"],
    colors: fabricColors,
  },
  {
    slug: "bass-trap-corner",
    name: "Bass Trap Corner",
    category: "Bass Traps",
    application: ["Estúdio", "Igreja"],
    material: "Lã de Rocha",
    thickness: "100mm",
    shortDescription: "Controle de graves em cantos e junções de paredes.",
    description: "Bass Trap Corner projetado para absorção eficiente de baixas frequências. Instalação em cantos verticais para máximo aproveitamento do espaço e controle modal. Desenvolvido com base nos princípios de ressonância de Helmholtz, oferece absorção broadband desde 60Hz até 500Hz, sendo essencial para o tratamento acústico de qualquer sala de controle ou estúdio profissional.",
    image: bassTrapCorner,
    gallery: [bassTrapCorner, bassTrapPair, bassTrapStudio],
    specs: [
      { label: "NRC", value: "0.85" },
      { label: "Espessura", value: "100mm" },
      { label: "Dimensões", value: "300x300x1200mm" },
      { label: "Peso", value: "4.8kg" },
      { label: "Classe de Fogo", value: "A2" },
      { label: "Faixa de Absorção", value: "60Hz – 500Hz" },
    ],
    materials: ["Lã de Rocha 64kg/m³", "Tecido Acústico", "Estrutura Metálica"],
    colors: fabricColors,
  },
  {
    slug: "difusor-skyline",
    name: "Difusor Skyline",
    category: "Difusores",
    application: ["Estúdio", "Auditório", "Corporativo"],
    material: "Madeira",
    thickness: "75mm",
    shortDescription: "Difusão sonora bidimensional com blocos 3D de alturas variáveis.",
    description: "O Difusor Skyline é baseado no modelo de difusão QRD (Quadratic Residue Diffuser), utilizando blocos de madeira maciça em alturas matematicamente calculadas para criar difusão bidimensional uniforme. Cada bloco é posicionado seguindo uma sequência de resíduos quadráticos que garante espalhamento sonoro em todas as direções. Ideal para paredes traseiras de salas de controle, auditórios e salas de concerto onde a preservação da energia sonora é desejada sem reflexões especulares.",
    image: difusorSkyline,
    gallery: [difusorSkyline, paineisColoridosTeto, nuvemAcustica],
    specs: [
      { label: "Faixa de Difusão", value: "800Hz – 8kHz" },
      { label: "Profundidade Máx.", value: "75mm" },
      { label: "Dimensões", value: "600x600mm" },
      { label: "Peso", value: "5.5kg" },
      { label: "Sequência", value: "QRD N=7" },
      { label: "Material", value: "Pinus Maciço / MDF Premium" },
    ],
    materials: ["Blocos de Pinus Maciço", "Base em MDF 18mm", "Acabamento Natural ou Laqueado", "Fixação Oculta em Aço"],
    colors: woodColors,
  },
  {
    slug: "painel-mdf-vazado-absorvedor",
    name: "Painel MDF Vazado Absorvedor",
    category: "Painéis MDF Vazado",
    application: ["Estúdio", "Corporativo", "Residencial", "Auditório"],
    material: "MDF",
    thickness: "50mm",
    shortDescription: "Absorção acústica com estética de madeira vazada e fendas verticais.",
    description: "O Painel MDF Vazado Absorvedor combina design sofisticado com performance acústica de alto nível. As fendas verticais no painel frontal em MDF permitem a passagem do som até o núcleo absorvente de lã de rocha, proporcionando absorção eficiente em médias e altas frequências. O padrão de fendas segue cálculos de ressonância para maximizar a absorção em faixas críticas. Disponível em 12 acabamentos de madeira e cores, adapta-se a qualquer ambiente profissional ou residencial.",
    image: mdfVazadoAbsorvedor,
    gallery: [mdfVazadoAbsorvedor, paineisSeminario, escritorioPaineisAzuis],
    specs: [
      { label: "NRC", value: "0.85" },
      { label: "Espessura Total", value: "50mm" },
      { label: "Espessura MDF", value: "6mm" },
      { label: "Dimensões", value: "600x600mm" },
      { label: "Peso", value: "4.2kg" },
      { label: "Classe de Fogo", value: "B1" },
      { label: "Faixa de Absorção", value: "250Hz – 4kHz" },
    ],
    materials: ["MDF Vazado 6mm", "Lã de Rocha 48kg/m³", "Manta Acústica TNT", "Moldura em MDF 18mm"],
    colors: fabricColors,
  },
  {
    slug: "painel-mdf-vazado-difusor",
    name: "Painel MDF Vazado Difusor",
    category: "Painéis MDF Vazado",
    application: ["Estúdio", "Auditório", "Corporativo"],
    material: "MDF",
    thickness: "50mm",
    shortDescription: "Difusão e absorção parcial com padrão geométrico de fendas cruzadas.",
    description: "O Painel MDF Vazado Difusor utiliza um padrão geométrico de fendas horizontais e verticais alternadas que cria difusão sonora multidirecional. Diferente do modelo absorvedor, este painel é projetado para espalhar o som de forma controlada, mantendo a vivacidade acústica do ambiente enquanto elimina ecos e flutter echoes. O padrão cruzado é calculado para otimizar a difusão na faixa de 500Hz a 6kHz, tornando-o ideal para paredes laterais e traseiras de estúdios e auditórios.",
    image: mdfVazadoDifusor,
    gallery: [mdfVazadoDifusor, estudioPaineis, paineisAzuis],
    specs: [
      { label: "Faixa de Difusão", value: "500Hz – 6kHz" },
      { label: "Espessura Total", value: "50mm" },
      { label: "Espessura MDF", value: "6mm" },
      { label: "Dimensões", value: "600x600mm" },
      { label: "Peso", value: "3.8kg" },
      { label: "Padrão", value: "Cruzado Geométrico" },
    ],
    materials: ["MDF Vazado 6mm", "Câmara de Ar Interna", "Feltro Acústico 12mm", "Moldura em MDF 18mm"],
    colors: fabricColors,
  },
  {
    slug: "wavefuser",
    name: "Wavefuser Híbrido",
    category: "Difusores",
    application: ["Estúdio", "Auditório", "Residencial"],
    material: "Madeira",
    thickness: "75mm",
    shortDescription: "Painel híbrido que combina difusão e absorção com design ondulado.",
    description: "O Wavefuser Híbrido é um painel acústico inovador que combina propriedades de difusão e absorção em um único produto. A face frontal em madeira maciça apresenta fendas verticais com perfil ondulado que criam difusão controlada, enquanto o núcleo de espuma acústica de alta densidade absorve as frequências que atravessam as fendas. O resultado é um tratamento acústico completo que mantém a energia sonora do ambiente de forma equilibrada. Disponível em 3 acabamentos de madeira: Natural, Nogueira e Mogno.",
    image: wavefuserHibrido,
    gallery: [wavefuserHibrido, difusorSkyline, mdfVazadoAbsorvedor],
    specs: [
      { label: "NRC (Absorção)", value: "0.55" },
      { label: "Difusão", value: "800Hz – 6kHz" },
      { label: "Espessura Total", value: "75mm" },
      { label: "Dimensões", value: "600x600mm" },
      { label: "Peso", value: "6.0kg" },
      { label: "Tipo", value: "Híbrido Difusor/Absorvedor" },
    ],
    materials: ["Madeira Maciça (Pinus/Nogueira/Mogno)", "Espuma Acústica 32kg/m³", "Base em MDF 18mm", "Acabamento Natural ou Tingido"],
    colors: woodColors,
  },
  {
    slug: "forro-acustico-modular",
    name: "Forro Acústico Modular",
    category: "Forros Acústicos",
    application: ["Corporativo", "Igreja", "Auditório"],
    material: "Fibra de Vidro",
    thickness: "25mm",
    shortDescription: "Sistema de forro com absorção integrada.",
    description: "Forro acústico modular com design clean e alta absorção. Sistema de fixação rápida com grid metálico. Ideal para escritórios, igrejas e ambientes de grande porte. A modularidade permite fácil manutenção e acesso ao plenum, enquanto a superfície em véu de vidro proporciona acabamento uniforme e elegante.",
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
    colors: fabricColors.slice(0, 10),
  },
  {
    slug: "revestimento-ripado",
    name: "Revestimento Ripado Acústico",
    category: "Revestimentos",
    application: ["Residencial", "Corporativo", "Auditório"],
    material: "Madeira",
    thickness: "50mm",
    shortDescription: "Revestimento de parede com estética premium e absorção.",
    description: "Revestimento ripado que combina estética sofisticada com performance acústica. As ripas em madeira natural criam um visual premium enquanto o núcleo absorvente trata a acústica do ambiente. Cada módulo é fabricado com ripas de madeira selecionada, espaçadas uniformemente sobre feltro acústico de alta densidade, garantindo absorção eficiente nas frequências médias e altas.",
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
    colors: woodColors,
  },
  {
    slug: "painel-tecido-slim",
    name: "Painel Tecido Slim",
    category: "Painéis Acústicos",
    application: ["Residencial", "Corporativo"],
    material: "Espuma",
    thickness: "25mm",
    shortDescription: "Painel ultrafino para tratamento acústico discreto.",
    description: "Painel acústico slim com apenas 25mm de espessura. Ideal para ambientes onde o espaço é limitado. Revestido em tecido premium com mais de 30 opções de cores. Sua construção leve e perfil fino permitem instalação em qualquer superfície, incluindo divisórias e paredes de drywall, sem comprometer o espaço útil do ambiente.",
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
    colors: fabricColors,
  },
];
