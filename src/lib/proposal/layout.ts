/**
 * Constantes de layout do orcamento, MEDIDAS do documento oficial nº 3215 —
 * nao estimadas a olho.
 *
 * Como foram obtidas (reproduzivel):
 *
 *   pdftoppm -r 150 -png referencia.pdf saida
 *   # varre as linhas procurando faixas escuras e amostra a cor dominante
 *
 * O render a 150 DPI da 1241x1754 px para uma pagina A4 de 595,32 x 841,92 pt,
 * entao a conversao e px * 72/150.
 *
 * As coordenadas aqui sao "a partir do topo", que e como se le uma pagina.
 * O pdf-lib tem origem no canto inferior esquerdo — a conversao acontece no
 * gerador, em um unico lugar (`doTopo`), para nao espalhar subtracao de altura
 * pelo codigo todo.
 */

/** A4 retrato, em pontos. */
export const PAGINA = { largura: 595.32, altura: 841.92 } as const;

/** Margens medidas: ~19,2 pt à esquerda e ~17,4 pt à direita. */
export const MARGEM = { esquerda: 19.2, direita: 577.9 } as const;

/** Cores amostradas do documento original. */
export const COR = {
  /** Faixas de seção e cabeçalho de tabela. */
  petroleo: "#062535",
  /** Logo e fio sob o título. */
  ouro: "#C28A25",
  /** Valor do TOTAL GERAL. */
  laranja: "#F97316",
  /** Fundo dos cartões. */
  cartao: "#F9FAFB",
  /** Texto principal. */
  texto: "#1F2937",
  /** Texto secundário e rótulos de coluna. */
  suave: "#4B5563",
  /** Linhas divisórias finas. */
  linha: "#E5E7EB",
  branco: "#FFFFFF",
} as const;

/**
 * Faixas escuras, em pt a partir do topo. Detectadas por varredura de linhas
 * com mais de 25% de pixels escuros.
 */
export const FAIXA = {
  altura: 19.2,
  dadosCliente: 140.2,
  tabelaItens: 299.5,
  impostosTotais: 400.8,
  pagamentoInfo: 536.6,
} as const;

/**
 * Colunas dos dois pares de cartões. O par de baixo é assimétrico no original
 * — o cartão de meios de pagamento é mais estreito que o de informações.
 */
export const CARTAO = {
  impostos: { x: 19.2, fim: 290.9 },
  totais: { x: 307.2, fim: 577.9 },
  pagamento: { x: 19.2, fim: 236.2 },
  informacoes: { x: 252.5, fim: 577.9 },
} as const;

/**
 * Colunas da tabela de itens, em pt. `x` é onde o texto começa; colunas
 * numéricas são alinhadas à direita em `fim`.
 */
export const COLUNA = {
  indice: { x: 26 },
  descricao: { x: 46 },
  unidade: { x: 340, fim: 372 },
  quantidade: { fim: 424 },
  valorUnitario: { fim: 500 },
  valorTotal: { fim: 570 },
} as const;

/**
 * Cabeçalho, medido no original.
 *
 * `logoConteudo` são as frações do PNG ocupadas pela marca visível — o arquivo
 * tem 500×500 com padding transparente em volta (conteúdo em 118,93→382,415).
 * Sem descontar esse padding, a marca sai pequena e deslocada. Se o logo for
 * trocado, re-medir com `Image.getbbox()` e atualizar aqui.
 */
export const CABECALHO = {
  logoVisivel: { x: 28.8, yTopo: 49.0, altura: 54.2 },
  logoConteudo: { x: 118 / 500, y: 93 / 500, largura: 264 / 500, altura: 322 / 500 },
  divisor: { x: 95.5, yTopo: 34.6, yBase: 95.5 },
  infoX: 115.2,
  infoYTopo: 47,
  tituloBase: 53.3,
  fioLargura: 95,
} as const;

export const FONTE = {
  titulo: 15.2,
  rotuloFaixa: 8,
  corpo: 8.5,
  itemTitulo: 8.5,
  itemSub: 6.5,
  totalGeral: 14,
  rodape: 6.5,
  cabecalhoTabela: 7,
} as const;

/** Dados institucionais fixos, transcritos do documento oficial. */
export const EMPRESA = {
  nome: "SONAR ACÚSTICOS",
  cnpj: "CNPJ: 50.208.185/0001-00",
  pix: "Chave PIX (CNPJ): 50.208.185/0001-00",
  endereco: "Avenida Lindóia, 388 - Centro",
  cidade: "Bragança Paulista - SP - CEP 12900-000",
  telefone: "Telefone: (11) 96748-4000",
  email: "contato@sonaracusticos.com.br",
  site: "www.sonaracusticos.com.br",
} as const;

/** Blocos fixos que o documento sempre traz. */
export const MEIOS_PAGAMENTO = [
  { titulo: "PIX", linhas: ["Chave (CNPJ): 50.208.185/0001-00"] },
  { titulo: "TRANSFERÊNCIA BANCÁRIA", linhas: ["Solicite os dados bancários."] },
  {
    titulo: "CARTÃO DE CRÉDITO",
    linhas: ["Parcelas em até 12x", "Taxa cobrada de acordo com a quantidade de parcelas."],
  },
] as const;

export const OBS_IMPOSTOS = "OBS.: Empresa optante pelo Simples Nacional.";
export const AVISO_VALORES = "Os valores podem sofrer alterações sem aviso prévio.";
export const AGRADECIMENTO = "Agradecemos a confiança!";
export const ASSINATURA = "S O N A R   A C Ú S T I C O S";
