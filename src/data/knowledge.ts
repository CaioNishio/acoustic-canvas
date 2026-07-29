/**
 * Arquitetura da área Conhecimento.
 *
 * REGRA DE PROCEDÊNCIA: todo número técnico exibido aqui precisa apontar para
 * uma fonte em `KNOWLEDGE_REFERENCES`. Nada de coeficiente sem origem. Quando o
 * valor for derivado (transformação declarada) e não medido, isso é dito ao
 * leitor — a mesma disciplina que o `acousticsEngine` já aplica com `estimated`.
 *
 * Os coeficientes citados nesta área são os MESMOS de `acousticsEngine.ts`
 * (PRODUCT_ALPHA), para que conteúdo e calculadora nunca divirjam.
 */

import {
  Waves, Volume2, Layers, Ruler, AlertTriangle, Compass,
  BookOpen, HelpCircle, type LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TRILHAS — a espinha dorsal pedagógica
// ─────────────────────────────────────────────────────────────
//
// A ordem não é temática, é a ordem em que um projetista raciocina:
// entender o fenômeno → diagnosticar a sala → escolher a solução.

export interface KnowledgeTrack {
  id: string;
  title: string;
  goal: string;
  icon: LucideIcon;
  level: "Introdutório" | "Intermediário" | "Aplicado";
  /** slugs de `educationalArticles` que compõem a trilha */
  articles: string[];
}

export const KNOWLEDGE_TRACKS: KnowledgeTrack[] = [
  {
    id: "fundamentos",
    title: "Fundamentos",
    goal: "Entender como o som se comporta dentro de um ambiente antes de tentar corrigi-lo.",
    icon: Waves,
    level: "Introdutório",
    articles: ["tratamento-vs-isolamento"],
  },
  {
    id: "diagnostico",
    title: "Diagnóstico",
    goal: "Identificar o que está errado na sua sala — e por quê — antes de comprar qualquer material.",
    icon: Compass,
    level: "Intermediário",
    articles: ["erros-comuns", "como-melhorar-acustica"],
  },
  {
    id: "aplicacao",
    title: "Aplicação",
    goal: "Escolher e posicionar o material certo para o problema que você diagnosticou.",
    icon: Ruler,
    level: "Aplicado",
    articles: ["posicionamento-de-paineis"],
  },
];

// ─────────────────────────────────────────────────────────────
// GUIA DE DECISÃO — painel, bass trap ou difusor
// ─────────────────────────────────────────────────────────────
//
// O produto aparece como CONSEQUÊNCIA do critério físico, nunca antes dele.
// Cada entrada responde: que fenômeno resolve, em que faixa, e quando NÃO usar.

export interface SolutionGuide {
  id: string;
  title: string;
  icon: LucideIcon;
  /** o fenômeno físico que esta família resolve */
  principle: string;
  /** faixa de frequência onde atua bem */
  range: string;
  whenToUse: string[];
  whenNotToUse: string;
  /** slugs reais de `products.ts` — sem aproximação por categoria */
  products: { slug: string; label: string }[];
  sourceId: string;
}

export const SOLUTION_GUIDES: SolutionGuide[] = [
  {
    id: "absorvedor",
    title: "Painéis absorvedores",
    icon: Layers,
    principle:
      "Material poroso converte energia sonora em calor por atrito viscoso. A absorção depende da resistividade ao fluxo do material e, principalmente, da espessura em relação ao comprimento de onda.",
    range: "Médios e agudos (250 Hz a 4 kHz) com 50 mm. Para graves, é preciso mais espessura ou afastamento da parede.",
    whenToUse: [
      "A sala tem eco perceptível ao bater palmas",
      "A fala fica embolada em reuniões ou cultos",
      "Você ouve a mesma nota 'sobrando' ao falar alto",
      "Precisa de precisão para gravar ou mixar",
    ],
    whenNotToUse:
      "Quando o problema é ruído vindo de fora. Absorvedor não isola — som que atravessa parede exige massa e desacoplamento, não painel.",
    products: [
      { slug: "painel-acustico-snr3250", label: "Painel SNR3250 (D32, 50 mm)" },
      { slug: "painel-acustico-snr6450", label: "Painel SNR6450 (D64, 50 mm)" },
      { slug: "painel-acustico-snr3225-slim", label: "Painel Slim (25 mm)" },
    ],
    sourceId: "everest",
  },
  {
    id: "bass-trap",
    title: "Bass traps",
    icon: Volume2,
    principle:
      "Nos cantos, as ondas de baixa frequência somam pressão de duas ou três superfícies ao mesmo tempo. É onde há mais energia modal disponível para dissipar — por isso o canto rende mais que a parede para graves.",
    range: "Graves (abaixo de 250 Hz), justamente a faixa onde painel fino não atua.",
    whenToUse: [
      "O grave 'some' em um ponto da sala e estoura em outro",
      "Há subwoofer no ambiente",
      "A sala é pequena — quanto menor, mais graves os modos e mais crítico o canto",
      "O baixo da música soa arrastado, sem definição",
    ],
    whenNotToUse:
      "Quando o problema é só brilho excessivo ou sibilância. Isso é faixa de agudos, resolvida com absorvedor em superfície, não com canto.",
    products: [
      { slug: "bass-trap-corner-3s-snr6430", label: "Bass Trap Corner 3S (D64, 100 mm)" },
      { slug: "bass-trap-membrana-snr6420", label: "Bass Trap de Membrana" },
    ],
    sourceId: "everest",
  },
  {
    id: "difusor",
    title: "Difusores",
    icon: Waves,
    principle:
      "Em vez de remover energia, o difusor espalha a reflexão no tempo e no espaço. Preserva a vivacidade da sala enquanto elimina o eco direcionado — o oposto de deixar o ambiente surdo.",
    range: "Médios e agudos. A frequência mínima de atuação depende da profundidade dos poços do difusor.",
    whenToUse: [
      "A sala já tem absorção suficiente e ficou 'morta'",
      "Há flutter echo entre paredes paralelas",
      "Parede traseira de estúdio, atrás da posição de escuta",
      "Ambiente onde se quer naturalidade, não silêncio",
    ],
    whenNotToUse:
      "Em sala pequena. O difusor precisa de campo livre para formar o padrão de espalhamento — cerca de 3× a maior dimensão da estrutura. Perto demais, ele não difunde: reflete.",
    products: [
      { slug: "difusor-qrd", label: "Difusor QRD" },
      { slug: "difusor-skyline", label: "Difusor Skyline" },
      { slug: "difusor-bidimensional", label: "Difusor Bidimensional" },
    ],
    sourceId: "cox",
  },
];

// ─────────────────────────────────────────────────────────────
// GLOSSÁRIO
// ─────────────────────────────────────────────────────────────

export interface GlossaryTerm {
  term: string;
  short: string;
  detail: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "RT60",
    short: "Tempo de reverberação",
    detail:
      "Tempo, em segundos, para o som cair 60 dB após a fonte parar. É a medida mais usada para descrever o quanto uma sala 'ecoa'. Estúdios pedem valores baixos (0,2 a 0,4 s); auditórios de música pedem mais.",
  },
  {
    term: "Coeficiente α",
    short: "Quanto o material absorve",
    detail:
      "Vai de 0 (reflete tudo) a 1 (absorve tudo), medido por banda de frequência. Um mesmo painel pode ter α 0,16 em 125 Hz e 1,00 em 1 kHz — por isso não existe 'material bom' em geral, e sim material adequado a uma faixa.",
  },
  {
    term: "Modos da sala",
    short: "Ressonâncias de baixa frequência",
    detail:
      "Quando meio comprimento de onda cabe exatamente entre duas paredes, forma-se uma onda estacionária: o grave acumula em alguns pontos e some em outros. Quanto menor a sala, mais alta a frequência afetada e mais audível o problema.",
  },
  {
    term: "Frequência de Schroeder",
    short: "A fronteira do cálculo estatístico",
    detail:
      "Abaixo dela o campo sonoro não é difuso e o RT60 deixa de descrever a sala — o comportamento passa a ser dominado por modos individuais. É por isso que, em sala pequena, controlar os cantos importa mais que somar área de absorção.",
  },
  {
    term: "Resistividade ao fluxo",
    short: "O que realmente define a absorção",
    detail:
      "Mede a dificuldade do ar atravessar o material. É o parâmetro físico que governa a absorção — densidade é apenas um indicador indireto dele. Resistividade baixa demais deixa o som passar; alta demais faz o material refletir.",
  },
  {
    term: "Air gap",
    short: "Afastamento da parede",
    detail:
      "Painel colado na parede fica onde a velocidade das partículas de ar é zero — e sem movimento não há atrito para dissipar. Afastá-lo o aproxima do ponto de velocidade máxima, melhorando a absorção em graves sem aumentar material.",
  },
  {
    term: "Primeira reflexão",
    short: "O ponto mais crítico da escuta",
    detail:
      "O primeiro som refletido que chega ao ouvinte, poucos milissegundos após o direto. Interfere com ele e distorce a percepção de imagem estéreo e timbre. É o alvo prioritário em salas de escuta crítica.",
  },
  {
    term: "Flutter echo",
    short: "Eco metálico entre paralelas",
    detail:
      "Som ricocheteando rapidamente entre duas superfícies rígidas e paralelas, produzindo um 'ping' característico. Basta tratar ou inclinar uma das duas faces para eliminá-lo.",
  },
];

// ─────────────────────────────────────────────────────────────
// PERGUNTAS FREQUENTES
// ─────────────────────────────────────────────────────────────

export interface FaqItem {
  q: string;
  a: string;
}

export const KNOWLEDGE_FAQ: FaqItem[] = [
  {
    q: "Painel acústico abafa o som que sai do meu apartamento?",
    a: "Não. Painel absorve o som dentro do ambiente; ele não bloqueia a passagem para fora. Isolamento depende de massa, desacoplamento e vedação de frestas — é obra, não revestimento. É a confusão mais cara em acústica, e vale entender a diferença antes de comprar.",
  },
  {
    q: "Espuma de embalagem serve como tratamento?",
    a: "Não de forma confiável. Espumas comuns têm espessura e resistividade ao fluxo inadequadas: absorvem agudos e quase nada de médios e graves, deixando a sala com timbre escuro e o problema principal intacto. Além disso, boa parte não tem classificação de reação ao fogo — um risco sério em ambiente fechado.",
  },
  {
    q: "Quanto mais denso o material, melhor?",
    a: "Só até certo ponto. Nos nossos ensaios, subir de 32 para 64 kg/m³ melhora de forma clara em 250 e 500 Hz. Acima de 64 kg/m³ os coeficientes ficam estáveis: densidades maiores se justificam por resistência mecânica ou reação ao fogo, não por absorção. Densidade excessiva chega a reduzir o desempenho, porque a resistividade ao fluxo fica alta demais e o material passa a refletir.",
  },
  {
    q: "Preciso cobrir todas as paredes?",
    a: "Não, e não deveria. Absorção em excesso deixa a sala surda e desconfortável, além de desequilibrar o timbre — o excesso costuma remover agudos e médios muito antes dos graves. Nosso dimensionamento limita a cobertura e prioriza os pontos de maior retorno: primeira reflexão e cantos.",
  },
  {
    q: "Difusor ou absorvedor?",
    a: "Depende do que falta. Absorvedor remove energia e reduz o RT60; difusor espalha a reflexão e preserva a vivacidade. Sala que já está 'morta' não precisa de mais absorção — precisa de difusão. E difusor exige distância para funcionar: em sala pequena, ele reflete em vez de difundir.",
  },
  {
    q: "Dá para calcular sem medir a sala com microfone?",
    a: "Dá para estimar com boa margem a partir das dimensões e do acabamento, que é o que nossa calculadora faz usando Sabine e Eyring. É estimativa declarada, não medição: os coeficientes da sala nua são valores típicos de literatura, não ensaio do seu ambiente. Para projeto crítico, a medição continua sendo o padrão.",
  },
];

// ─────────────────────────────────────────────────────────────
// REFERÊNCIAS — a base de procedência
// ─────────────────────────────────────────────────────────────

export interface KnowledgeReference {
  id: string;
  title: string;
  author: string;
  kind: "Livro" | "Ensaio" | "Norma" | "Fabricante";
  /** o que exatamente sustentamos com esta fonte */
  usedFor: string;
}

export const KNOWLEDGE_REFERENCES: KnowledgeReference[] = [
  {
    id: "everest",
    title: "Master Handbook of Acoustics, 6ª ed.",
    author: "F. Alton Everest & Ken Pohlmann",
    kind: "Livro",
    usedFor: "Absorvedores porosos, comportamento modal e tratamento de cantos (cap. 7 e 12).",
  },
  {
    id: "kuttruff",
    title: "Room Acoustics",
    author: "Heinrich Kuttruff",
    kind: "Livro",
    usedFor: "Frequência de Schroeder e método das fontes-imagem para primeira reflexão (cap. 3 e 4).",
  },
  {
    id: "cox",
    title: "Acoustic Absorbers and Diffusers, 3ª ed.",
    author: "Trevor Cox & Peter D'Antonio",
    kind: "Livro",
    usedFor: "Campo mínimo de difusão e critérios de aplicação de difusores (cap. 9).",
  },
  {
    id: "toole",
    title: "Sound Reproduction, 3ª ed.",
    author: "Floyd Toole",
    kind: "Livro",
    usedFor: "Limite de absorção e por que sala superamortecida é indesejável (cap. 9).",
  },
  {
    id: "rockfibras",
    title: "Especificação Técnica PSL, PSE e PSR — Fev/26 v1.5",
    author: "ROCKFIBRAS / SOPREMA",
    kind: "Fabricante",
    usedFor: "Coeficientes de absorção por banda das lãs de rocha D32, D64, D96 e D144 usadas nos painéis Sonar.",
  },
  {
    id: "iso354",
    title: "ISO/R 354 e ASTM C 423",
    author: "ISO / ASTM",
    kind: "Norma",
    usedFor: "Método de ensaio em câmara reverberante que originou os coeficientes dos nossos produtos (corpos de prova de 51 mm).",
  },
];

/** Fontes já mapeadas para incorporação, ainda pendentes de análise. */
export const REFERENCES_ROADMAP = [
  "Ensaios laboratoriais dos conjuntos montados com afastamento (air gap)",
  "ABNT NBR 12179 — tratamento acústico de recintos fechados",
  "Documentação técnica complementar de fabricantes de difusores",
  "Estudos de caso instrumentados com medição antes e depois",
];

export const KNOWLEDGE_SECTION_ICONS = { BookOpen, HelpCircle, AlertTriangle };
