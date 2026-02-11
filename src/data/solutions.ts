import academiaBaffles from "@/assets/gallery/academia-baffles.jpeg";
import academiaTeto from "@/assets/gallery/academia-teto.jpeg";
import salaAulaBaffles from "@/assets/gallery/sala-aula-baffles.jpeg";
import escritorioPaineis from "@/assets/gallery/escritorio-paineis.png";
import paineisSuspensos from "@/assets/gallery/paineis-suspensos.webp";

import igrejaVermelho from "@/assets/gallery/igreja-paineis-vermelho.jpg";
import igrejaAuditorio from "@/assets/gallery/igreja-auditorio-azul.png";
import igrejaTemplo from "@/assets/gallery/igreja-templo-paineis.png";
import igrejaMadeira from "@/assets/gallery/igreja-templo-madeira.png";
import igrejaSalaEscura from "@/assets/gallery/igreja-sala-escura.jpeg";
import igrejaColoridos from "@/assets/gallery/igreja-paineis-coloridos.png";
import igrejaLateral from "@/assets/gallery/igreja-paineis-lateral.png";
import igrejaGrandes from "@/assets/gallery/igreja-paineis-grandes.png";
import igrejaAuditorioVermelho from "@/assets/gallery/igreja-auditorio-vermelho.jpeg";
import igrejaEscritorioBranco from "@/assets/gallery/igreja-escritorio-branco.jpg";

export interface Solution {
  slug: string;
  title: string;
  environment: string;
  icon: string;
  shortDescription: string;
  problem: string;
  approach: string;
  recommendedProducts: string[];
  image: string;
  gallery?: string[];
}

export const solutions: Solution[] = [
  {
    slug: "estudios",
    title: "Estúdios de Gravação",
    environment: "Estúdio",
    icon: "Music",
    shortDescription: "Acústica precisa para gravação e mixagem profissional.",
    problem: "Estúdios sofrem com reflexões indesejadas, flutter echo e acúmulo de graves nos cantos, comprometendo a precisão do monitoramento e a qualidade das gravações.",
    approach: "Combinamos absorvedores broadband nas primeiras reflexões, bass traps nos cantos e difusores na parede traseira para criar um campo sonoro controlado e preciso.",
    recommendedProducts: ["painel-absorvedor-premium", "bass-trap-corner", "difusor-skyline"],
    image: paineisSuspensos,
  },
  {
    slug: "igrejas",
    title: "Igrejas e Templos",
    environment: "Igreja",
    icon: "Church",
    shortDescription: "Inteligibilidade da fala e clareza musical em espaços de culto.",
    problem: "Igrejas geralmente possuem grande reverberação devido ao pé-direito alto e superfícies reflexivas, dificultando a compreensão da fala e a clareza da música.",
    approach: "Aplicamos forros acústicos para reduzir o tempo de reverberação e painéis estratégicos para melhorar a inteligibilidade sem eliminar a sensação de amplitude do espaço.",
    recommendedProducts: ["forro-acustico-modular", "painel-absorvedor-premium", "bass-trap-corner"],
    image: salaAulaBaffles,
    gallery: [
      igrejaVermelho,
      igrejaAuditorio,
      igrejaTemplo,
      igrejaMadeira,
      igrejaSalaEscura,
      igrejaColoridos,
      igrejaLateral,
      igrejaGrandes,
      igrejaAuditorioVermelho,
      igrejaEscritorioBranco,
    ],
  },
  {
    slug: "auditorios",
    title: "Auditórios e Teatros",
    environment: "Auditório",
    icon: "Theater",
    shortDescription: "Experiência sonora imersiva para plateia e performers.",
    problem: "Auditórios precisam de equilíbrio entre absorção e difusão para garantir cobertura sonora uniforme em toda a plateia, sem pontos mortos ou excesso de reverberação.",
    approach: "Projeto acústico completo com difusores nas paredes laterais, absorvedores no teto e tratamento de palco para criar uma experiência sonora envolvente.",
    recommendedProducts: ["difusor-skyline", "forro-acustico-modular", "revestimento-ripado"],
    image: academiaTeto,
  },
  {
    slug: "corporativo",
    title: "Ambientes Corporativos",
    environment: "Corporativo",
    icon: "Building2",
    shortDescription: "Conforto acústico e privacidade em escritórios.",
    problem: "Open offices sofrem com excesso de ruído, falta de privacidade em conversas e dificuldade de concentração, impactando a produtividade dos colaboradores.",
    approach: "Utilizamos forros acústicos, painéis de parede e divisórias acústicas para criar zonas de conforto sonoro sem comprometer a estética corporativa.",
    recommendedProducts: ["forro-acustico-modular", "painel-tecido-slim", "revestimento-ripado"],
    image: escritorioPaineis,
  },
  {
    slug: "residencial",
    title: "Residencial",
    environment: "Residencial",
    icon: "Home",
    shortDescription: "Home theaters, home offices e conforto acústico residencial.",
    problem: "Ambientes residenciais como home theaters e home offices sofrem com reverberação excessiva e falta de isolamento, afetando a experiência de uso.",
    approach: "Soluções discretas e elegantes que se integram à decoração, utilizando painéis revestidos em tecido e ripados de madeira para tratamento acústico sem impacto visual negativo.",
    recommendedProducts: ["painel-tecido-slim", "revestimento-ripado", "painel-absorvedor-premium"],
    image: academiaBaffles,
  },
];
