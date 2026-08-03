/**
 * Contrato de dados da proposta.
 *
 * Espelha `docs/proposal-engine/FIELD-MAPPING.md`. Os nomes seguem o formulario
 * e o painel, nao o PDF — quem traduz para as posicoes do documento e o
 * gerador.
 */

export interface ClienteProposta {
  nome: string;
  documento?: string | null;
  endereco?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  cep?: string | null;
  telefone?: string | null;
  email?: string | null;
  inscricaoEstadual?: string | null;
}

export interface ItemProposta {
  descricao: string;
  /** Linha cinza menor abaixo da descricao: SKU, acabamento, medida, prazo. */
  detalhe?: string | null;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  /** Calculado a partir de quantidade x valorUnitario quando ausente. */
  total?: number;
}

export interface LinhaImposto {
  tipo: string;
  aliquota?: string | null;
  baseCalculo?: string | null;
  valor?: string | null;
}

export interface Proposta {
  numero: number;
  /** `yyyy-MM-dd`. */
  emissao: string;
  /** `yyyy-MM-dd`. */
  validade: string;
  cliente: ClienteProposta;
  itens: ItemProposta[];
  subtotal: number;
  desconto: number;
  baseCalculo: number;
  impostos: number;
  total: number;
  /** Linhas do quadro IMPOSTOS. Vazio usa ISS/PIS/COFINS com travessao. */
  linhasImposto?: LinhaImposto[];
  /** Marcadores do bloco INFORMAÇÕES ADICIONAIS. */
  informacoesAdicionais?: string[];
  /**
   * Proposta preliminar (`PROPOSAL_ENGINE §6`): falta medida, diagnostico ou
   * ha preco sob consulta. Marca o documento como sujeito a revisao em vez de
   * inventar valores.
   */
  preliminar?: boolean;
}

/** Condicoes padrao do documento oficial, quando nada for informado. */
export const INFORMACOES_PADRAO = [
  "Esta proposta é válida até a data informada no cabeçalho.",
  "Prazo de entrega: a combinar conforme escopo do projeto.",
  "Condições de pagamento: a combinar.",
  "Garantia dos produtos: conforme especificações dos fabricantes.",
  "Instalação realizada por equipe especializada da SONAR ACÚSTICOS.",
];

export const IMPOSTOS_PADRAO: LinhaImposto[] = [
  { tipo: "ISS" },
  { tipo: "PIS" },
  { tipo: "COFINS" },
];

/** Total da linha, calculado quando o chamador nao informa. */
export function totalDoItem(item: ItemProposta): number {
  if (typeof item.total === "number" && Number.isFinite(item.total)) return item.total;
  const q = Number.isFinite(item.quantidade) ? item.quantidade : 0;
  const v = Number.isFinite(item.valorUnitario) ? item.valorUnitario : 0;
  return q * v;
}
