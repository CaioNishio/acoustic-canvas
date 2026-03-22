import bafflesColoridos from "@/assets/gallery/baffles-coloridos.jpg";
import forroCorporativo from "@/assets/gallery/forro-corporativo.webp";
import escritorioPaineis from "@/assets/gallery/escritorio-paineis.webp";
import academiaBaffles from "@/assets/gallery/academia-baffles.webp";
import academiaTeto from "@/assets/gallery/academia-teto.jpeg";
import salaAulaBaffles from "@/assets/gallery/sala-aula-baffles.jpeg";
import nuvemAcustica from "@/assets/gallery/nuvem-acustica.webp";

export interface Project {
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  gallery: string[];
  materials: string[];
  testimonial?: { text: string; author: string; role: string };
}

export const projects: Project[] = [
  {
    slug: "estudio-wave-records",
    title: "Estúdio Wave Records",
    category: "Estúdio",
    location: "São Paulo, SP",
    description: "Tratamento acústico completo do estúdio de gravação e sala de controle. O projeto incluiu absorvedores nas primeiras reflexões, bass traps nos cantos e difusores na parede traseira da sala de controle.",
    image: bafflesColoridos,
    gallery: [bafflesColoridos, nuvemAcustica],
    materials: ["Painel Absorvedor Premium", "Bass Trap Corner", "Difusor Skyline"],
    testimonial: {
      text: "A diferença na precisão do monitoramento foi impressionante. O estúdio ficou com uma acústica de referência internacional.",
      author: "Ricardo Mendes",
      role: "Produtor Musical",
    },
  },
  {
    slug: "igreja-comunidade-viva",
    title: "Igreja Comunidade Viva",
    category: "Igreja",
    location: "Curitiba, PR",
    description: "Projeto acústico para templo com 800 lugares. Foco na inteligibilidade da fala e clareza musical, reduzindo o tempo de reverberação de 3.2s para 1.4s.",
    image: salaAulaBaffles,
    gallery: [salaAulaBaffles],
    materials: ["Forro Acústico Modular", "Painel Absorvedor Premium", "Bass Trap Corner"],
    testimonial: {
      text: "Agora os fiéis conseguem entender perfeitamente a pregação. A música também ganhou clareza sem perder a sensação de amplitude.",
      author: "Pastor André Silva",
      role: "Líder da Comunidade",
    },
  },
  {
    slug: "escritorio-techcorp",
    title: "Escritório TechCorp",
    category: "Corporativo",
    location: "Florianópolis, SC",
    description: "Open office de 500m² com tratamento para redução de ruído e criação de zonas acústicas. Integração perfeita com o design do escritório.",
    image: escritorioPaineis,
    gallery: [escritorioPaineis, forroCorporativo],
    materials: ["Forro Acústico Modular", "Painel Tecido Slim", "Revestimento Ripado Acústico"],
  },
  {
    slug: "home-theater-residencia",
    title: "Home Theater Residência Alphaville",
    category: "Residencial",
    location: "Barueri, SP",
    description: "Sala de home theater com tratamento acústico completo. Absorvedores nas primeiras reflexões, bass traps e difusores traseiros para experiência cinematográfica imersiva.",
    image: academiaTeto,
    gallery: [academiaTeto, academiaBaffles],
    materials: ["Painel Absorvedor Premium", "Bass Trap Corner", "Revestimento Ripado Acústico"],
    testimonial: {
      text: "A experiência do home theater mudou completamente. O som ficou envolvente e limpo, como um cinema de verdade.",
      author: "Carlos Eduardo",
      role: "Proprietário",
    },
  },
];
