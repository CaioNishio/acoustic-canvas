import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import {
  PAGINA,
  MARGEM,
  COR,
  FAIXA,
  CABECALHO,
  CARTAO,
  COLUNA,
  FONTE,
  EMPRESA,
  MEIOS_PAGAMENTO,
  OBS_IMPOSTOS,
  AVISO_VALORES,
  AGRADECIMENTO,
  ASSINATURA,
} from "./layout";
import {
  brl,
  brlDesconto,
  quantidade as fmtQtd,
  dataBr,
  numeroDocumento,
  ouVazio,
  cidadeUf,
  VAZIO,
} from "./format";
import {
  type Proposta,
  type ItemProposta,
  INFORMACOES_PADRAO,
  IMPOSTOS_PADRAO,
  totalDoItem,
} from "./types";

/**
 * Gera o PDF do orcamento reproduzindo o documento oficial nº 3215.
 *
 * POR QUE VETOR E NAO O PDF ORIGINAL COMO FUNDO
 * A especificacao sugeria usar o PDF oficial como camada base. Nao da: aquele
 * arquivo e uma imagem raster de 300 DPI com os dados pessoais do cliente M20
 * Arquitetura dentro (CNPJ, endereco, telefone). Usa-lo como fundo embutiria
 * esses dados em todo orcamento de todos os outros clientes — mascara branca
 * esconde a vista, mas o dado continua extraivel do arquivo. Alem disso, fundo
 * raster fixo nao reflui para pagina adicional. Ver DECISIONS.md#D1.
 *
 * TIPOGRAFIA
 * O documento original usa Helvetica e NimbusSans (confirmado por `pdffonts`),
 * e NimbusSans e o clone metrico da Helvetica. Usar a Helvetica padrao do PDF
 * aqui NAO e substituir a tipografia — e usar a mesma, sem embutir arquivo de
 * fonte e sem engordar o documento.
 */

/** `#RRGGBB` para o rgb 0..1 do pdf-lib. */
function cor(hex: string): RGB {
  const n = parseInt(hex.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

interface Fontes {
  regular: PDFFont;
  bold: PDFFont;
}

/** Converte "a partir do topo" para a origem inferior-esquerda do pdf-lib. */
const doTopo = (y: number) => PAGINA.altura - y;

interface OpcoesTexto {
  size?: number;
  font?: PDFFont;
  color?: RGB;
  /** Alinha o fim do texto nesta coordenada, em vez de comecar em `x`. */
  alinharDireitaEm?: number;
}

function escrever(
  page: PDFPage,
  fontes: Fontes,
  texto: string,
  x: number,
  yTopo: number,
  opcoes: OpcoesTexto = {},
) {
  const size = opcoes.size ?? FONTE.corpo;
  const font = opcoes.font ?? fontes.regular;
  const color = opcoes.color ?? cor(COR.texto);
  const limpo = sanitizar(texto);
  const px =
    opcoes.alinharDireitaEm !== undefined
      ? opcoes.alinharDireitaEm - font.widthOfTextAtSize(limpo, size)
      : x;
  page.drawText(limpo, { x: px, y: doTopo(yTopo), size, font, color });
}

/**
 * A Helvetica padrao usa WinAnsi, que cobre o portugues inteiro mas nao
 * qualquer caractere Unicode. Um simbolo fora da tabela derruba a geracao com
 * excecao — e um orcamento que nao abre e pior que um orcamento com um
 * caractere trocado. Troca os casos comuns e remove o resto.
 */
function sanitizar(texto: string): string {
  return (
    texto
      // aspas tipograficas -> retas
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      // sinal de menos matematico -> hifen
      .replace(/\u2212/g, "-")
      // espacos especiais (nao-quebravel, de figura, estreito) -> espaco comum
      .replace(/[\u00A0\u2007\u202F]/g, " ")
      // mantem ASCII imprimivel, Latin-1 (acentuacao do portugues) e os
      // simbolos que o documento usa: en dash, em dash, bullet, euro
      .replace(/[^\x20-\x7E\u00A0-\u00FF\u2013\u2014\u2022\u20AC]/g, "")
  );
}

/** Quebra o texto em linhas que cabem em `largura`. */
function quebrar(texto: string, font: PDFFont, size: number, largura: number): string[] {
  const palavras = sanitizar(texto).split(/\s+/).filter(Boolean);
  if (palavras.length === 0) return [];
  const linhas: string[] = [];
  let atual = palavras[0];
  for (const palavra of palavras.slice(1)) {
    const tentativa = `${atual} ${palavra}`;
    if (font.widthOfTextAtSize(tentativa, size) <= largura) atual = tentativa;
    else {
      linhas.push(atual);
      atual = palavra;
    }
  }
  linhas.push(atual);
  return linhas;
}

/** Faixa escura de seção, com o rótulo em caixa alta. */
function faixa(page: PDFPage, fontes: Fontes, rotulo: string, yTopo: number, x: number, fim: number) {
  page.drawRectangle({
    x,
    y: doTopo(yTopo + FAIXA.altura),
    width: fim - x,
    height: FAIXA.altura,
    color: cor(COR.petroleo),
  });
  escrever(page, fontes, rotulo, x + 10, yTopo + 13, {
    size: FONTE.rotuloFaixa,
    font: fontes.bold,
    color: cor(COR.branco),
  });
}

function cabecalho(page: PDFPage, fontes: Fontes, proposta: Proposta, logo?: unknown) {
  if (logo) {
    // O PNG tem padding transparente em volta da marca. Desenhar a imagem
    // inteira "crua" deixa o logo pequeno e deslocado — as frações em
    // CABECALHO.logoConteudo descontam esse padding para a marca cair
    // exatamente onde cai no documento original.
    const { logoVisivel: v, logoConteudo: c } = CABECALHO;
    const alturaTotal = v.altura / c.altura;
    const img = logo as { width: number; height: number };
    const larguraTotal = alturaTotal * (img.width / img.height);
    page.drawImage(logo as Parameters<PDFPage["drawImage"]>[0], {
      x: v.x - c.x * larguraTotal,
      y: doTopo(v.yTopo - c.y * alturaTotal + alturaTotal),
      width: larguraTotal,
      height: alturaTotal,
    });
  }

  // Fio vertical entre o logo e o bloco institucional
  page.drawRectangle({
    x: CABECALHO.divisor.x,
    y: doTopo(CABECALHO.divisor.yBase),
    width: 0.7,
    height: CABECALHO.divisor.yBase - CABECALHO.divisor.yTopo,
    color: cor(COR.linha),
  });

  // Bloco institucional
  let y = CABECALHO.infoYTopo;
  escrever(page, fontes, EMPRESA.nome, CABECALHO.infoX, y, { size: 7.6, font: fontes.bold });
  y += 8.6;
  for (const linha of [
    EMPRESA.cnpj,
    EMPRESA.pix,
    EMPRESA.endereco,
    EMPRESA.cidade,
    EMPRESA.telefone,
    EMPRESA.email,
    EMPRESA.site,
  ]) {
    escrever(page, fontes, linha, CABECALHO.infoX, y, { size: 5.4, color: cor(COR.suave) });
    y += 6.9;
  }

  // Título e fio dourado
  escrever(page, fontes, "ORÇAMENTO", 0, CABECALHO.tituloBase, {
    size: FONTE.titulo,
    font: fontes.bold,
    color: cor(COR.petroleo),
    alinharDireitaEm: MARGEM.direita,
  });
  page.drawRectangle({
    x: MARGEM.direita - CABECALHO.fioLargura,
    y: doTopo(CABECALHO.tituloBase + 6),
    width: CABECALHO.fioLargura,
    height: 1.4,
    color: cor(COR.ouro),
  });

  // Metadados do documento
  const linhas: Array<[string, string]> = [
    ["Nº DO DOCUMENTO:", numeroDocumento(proposta.numero)],
    ["DATA DE EMISSÃO:", dataBr(proposta.emissao)],
    ["VALIDADE DA PROPOSTA:", dataBr(proposta.validade)],
  ];
  let ym = 88;
  for (const [rotulo, valor] of linhas) {
    escrever(page, fontes, rotulo, 372, ym, { size: 8, font: fontes.bold });
    escrever(page, fontes, valor, 0, ym, { size: 8, alinharDireitaEm: MARGEM.direita });
    ym += 13;
  }
}

function blocoCliente(page: PDFPage, fontes: Fontes, proposta: Proposta) {
  faixa(page, fontes, "DADOS DO CLIENTE", FAIXA.dadosCliente, MARGEM.esquerda, MARGEM.direita);

  const c = proposta.cliente;
  const campos: Array<[string, string]> = [
    ["Razão Social / Nome:", ouVazio(c.nome)],
    ["CNPJ / CPF:", ouVazio(c.documento)],
    ["Endereço:", ouVazio(c.endereco)],
    ["Bairro:", ouVazio(c.bairro)],
    ["Cidade / UF:", cidadeUf(c.cidade, c.uf)],
    ["CEP:", ouVazio(c.cep)],
    ["Telefone:", ouVazio(c.telefone)],
    ["E-mail:", ouVazio(c.email)],
    ["Inscrição Estadual:", ouVazio(c.inscricaoEstadual)],
  ];

  const yInicio = FAIXA.dadosCliente + FAIXA.altura;
  const altura = campos.length * 13 + 16;
  page.drawRectangle({
    x: MARGEM.esquerda,
    y: doTopo(yInicio + altura),
    width: MARGEM.direita - MARGEM.esquerda,
    height: altura,
    color: cor(COR.cartao),
  });

  let y = yInicio + 17;
  for (const [rotulo, valor] of campos) {
    escrever(page, fontes, rotulo, MARGEM.esquerda + 12, y, {
      size: FONTE.corpo,
      font: fontes.bold,
    });
    const largura = fontes.bold.widthOfTextAtSize(sanitizar(rotulo), FONTE.corpo);
    escrever(page, fontes, valor, MARGEM.esquerda + 16 + largura, y, {
      size: FONTE.corpo,
      color: cor(COR.suave),
    });
    y += 13;
  }
}

/** Cabeçalho da tabela de itens — repetido em toda página que tiver itens. */
function cabecalhoTabela(page: PDFPage, fontes: Fontes, yTopo: number) {
  page.drawRectangle({
    x: MARGEM.esquerda,
    y: doTopo(yTopo + FAIXA.altura),
    width: MARGEM.direita - MARGEM.esquerda,
    height: FAIXA.altura,
    color: cor(COR.petroleo),
  });
  const y = yTopo + 13;
  const branco = cor(COR.branco);
  const op = { size: FONTE.cabecalhoTabela, font: fontes.bold, color: branco };
  escrever(page, fontes, "#", COLUNA.indice.x, y, op);
  escrever(page, fontes, "DESCRIÇÃO", COLUNA.descricao.x, y, op);
  escrever(page, fontes, "UN.", COLUNA.unidade.x, y, op);
  escrever(page, fontes, "QTD.", 0, y, { ...op, alinharDireitaEm: COLUNA.quantidade.fim });
  escrever(page, fontes, "VALOR UNITÁRIO", 0, y, { ...op, alinharDireitaEm: COLUNA.valorUnitario.fim });
  escrever(page, fontes, "VALOR TOTAL", 0, y, { ...op, alinharDireitaEm: COLUNA.valorTotal.fim });
}

/** Altura que um item vai ocupar, para decidir a quebra de página. */
function alturaItem(item: ItemProposta, fontes: Fontes): number {
  const larguraDesc = COLUNA.unidade.x - COLUNA.descricao.x - 10;
  const linhasTitulo = quebrar(item.descricao, fontes.bold, FONTE.itemTitulo, larguraDesc).length;
  const linhasDetalhe = item.detalhe
    ? quebrar(item.detalhe, fontes.regular, FONTE.itemSub, larguraDesc).length
    : 0;
  return 12 + linhasTitulo * 10 + linhasDetalhe * 8;
}

function desenharItem(
  page: PDFPage,
  fontes: Fontes,
  item: ItemProposta,
  indice: number,
  yTopo: number,
): number {
  const larguraDesc = COLUNA.unidade.x - COLUNA.descricao.x - 10;
  const titulo = quebrar(item.descricao, fontes.bold, FONTE.itemTitulo, larguraDesc);
  const detalhe = item.detalhe
    ? quebrar(item.detalhe, fontes.regular, FONTE.itemSub, larguraDesc)
    : [];

  const yPrimeira = yTopo + 11;
  escrever(page, fontes, String(indice), COLUNA.indice.x, yPrimeira, { size: FONTE.corpo });

  let y = yPrimeira;
  for (const linha of titulo) {
    escrever(page, fontes, linha, COLUNA.descricao.x, y, {
      size: FONTE.itemTitulo,
      font: fontes.bold,
    });
    y += 10;
  }
  for (const linha of detalhe) {
    escrever(page, fontes, linha, COLUNA.descricao.x, y, {
      size: FONTE.itemSub,
      color: cor(COR.suave),
    });
    y += 8;
  }

  const total = totalDoItem(item);
  escrever(page, fontes, item.unidade, COLUNA.unidade.x, yPrimeira, { size: FONTE.corpo });
  escrever(page, fontes, fmtQtd(item.quantidade), 0, yPrimeira, {
    size: FONTE.corpo,
    alinharDireitaEm: COLUNA.quantidade.fim,
  });
  escrever(page, fontes, brl(item.valorUnitario), 0, yPrimeira, {
    size: FONTE.corpo,
    alinharDireitaEm: COLUNA.valorUnitario.fim,
  });
  escrever(page, fontes, brl(total), 0, yPrimeira, {
    size: FONTE.corpo,
    font: fontes.bold,
    alinharDireitaEm: COLUNA.valorTotal.fim,
  });

  const altura = alturaItem(item, fontes);
  page.drawRectangle({
    x: MARGEM.esquerda,
    y: doTopo(yTopo + altura),
    width: MARGEM.direita - MARGEM.esquerda,
    height: 0.5,
    color: cor(COR.linha),
  });
  return altura;
}

function quadroImpostos(page: PDFPage, fontes: Fontes, proposta: Proposta) {
  const { x, fim } = CARTAO.impostos;
  faixa(page, fontes, "IMPOSTOS", FAIXA.impostosTotais, x, fim);

  const yBase = FAIXA.impostosTotais + FAIXA.altura;
  const linhas = proposta.linhasImposto?.length ? proposta.linhasImposto : IMPOSTOS_PADRAO;
  const altura = 22 + linhas.length * 17 + 20;
  page.drawRectangle({
    x,
    y: doTopo(yBase + altura),
    width: fim - x,
    height: altura,
    color: cor(COR.cartao),
  });

  const colunas = [x + 10, x + 96, x + 160, fim - 10];
  escrever(page, fontes, "TIPO DE IMPOSTO", colunas[0], yBase + 14, {
    size: 6,
    font: fontes.bold,
    color: cor(COR.suave),
  });
  escrever(page, fontes, "ALÍQUOTA (%)", colunas[1], yBase + 14, {
    size: 6,
    font: fontes.bold,
    color: cor(COR.suave),
  });
  escrever(page, fontes, "BASE DE CÁLCULO", colunas[2], yBase + 14, {
    size: 6,
    font: fontes.bold,
    color: cor(COR.suave),
  });
  escrever(page, fontes, "VALOR", 0, yBase + 14, {
    size: 6,
    font: fontes.bold,
    color: cor(COR.suave),
    alinharDireitaEm: colunas[3],
  });

  let y = yBase + 32;
  for (const linha of linhas) {
    escrever(page, fontes, linha.tipo, colunas[0], y, { size: 7.5 });
    escrever(page, fontes, ouVazio(linha.aliquota), colunas[1] + 14, y, {
      size: 7.5,
      color: cor(COR.suave),
    });
    escrever(page, fontes, ouVazio(linha.baseCalculo), colunas[2] + 22, y, {
      size: 7.5,
      color: cor(COR.suave),
    });
    escrever(page, fontes, ouVazio(linha.valor), 0, y, {
      size: 7.5,
      color: cor(COR.suave),
      alinharDireitaEm: colunas[3],
    });
    y += 17;
  }
  escrever(page, fontes, OBS_IMPOSTOS, colunas[0], yBase + altura - 6, {
    size: 5.6,
    color: cor(COR.suave),
  });
}

function quadroTotais(page: PDFPage, fontes: Fontes, proposta: Proposta) {
  const { x, fim } = CARTAO.totais;
  faixa(page, fontes, "TOTAIS", FAIXA.impostosTotais, x, fim);

  const yBase = FAIXA.impostosTotais + FAIXA.altura;
  const altura = 22 + 4 * 17 + 32;
  page.drawRectangle({
    x,
    y: doTopo(yBase + altura),
    width: fim - x,
    height: altura,
    color: cor(COR.branco),
    borderColor: cor(COR.linha),
    borderWidth: 0.6,
  });

  const linhas: Array<[string, string]> = [
    ["SUBTOTAL", brl(proposta.subtotal)],
    ["DESCONTOS", brlDesconto(proposta.desconto)],
    ["BASE DE CÁLCULO", brl(proposta.baseCalculo)],
    ["TOTAL DE IMPOSTOS", brl(proposta.impostos)],
  ];
  let y = yBase + 18;
  for (const [rotulo, valor] of linhas) {
    escrever(page, fontes, rotulo, x + 12, y, { size: 7.5, font: fontes.bold });
    escrever(page, fontes, valor, 0, y, { size: 7.5, alinharDireitaEm: fim - 12 });
    y += 17;
  }

  page.drawRectangle({
    x: x + 12,
    y: doTopo(y - 4),
    width: fim - x - 24,
    height: 0.6,
    color: cor(COR.linha),
  });

  escrever(page, fontes, "TOTAL GERAL", x + 12, y + 16, { size: 9, font: fontes.bold });
  escrever(page, fontes, brl(proposta.total), 0, y + 17, {
    size: FONTE.totalGeral,
    font: fontes.bold,
    color: cor(COR.laranja),
    alinharDireitaEm: fim - 12,
  });
}

function quadroPagamento(page: PDFPage, fontes: Fontes) {
  const { x, fim } = CARTAO.pagamento;
  faixa(page, fontes, "MEIOS DE PAGAMENTO", FAIXA.pagamentoInfo, x, fim);

  const yBase = FAIXA.pagamentoInfo + FAIXA.altura;
  const altura = 118;
  page.drawRectangle({
    x,
    y: doTopo(yBase + altura),
    width: fim - x,
    height: altura,
    color: cor(COR.cartao),
  });

  let y = yBase + 20;
  for (const meio of MEIOS_PAGAMENTO) {
    escrever(page, fontes, meio.titulo, x + 30, y, { size: 7, font: fontes.bold });
    let yl = y + 9;
    for (const linha of meio.linhas) {
      escrever(page, fontes, linha, x + 30, yl, { size: 5.8, color: cor(COR.suave) });
      yl += 7.5;
    }
    y = yl + 8;
  }
}

function quadroInformacoes(page: PDFPage, fontes: Fontes, proposta: Proposta) {
  const { x, fim } = CARTAO.informacoes;
  faixa(page, fontes, "INFORMAÇÕES ADICIONAIS", FAIXA.pagamentoInfo, x, fim);

  const yBase = FAIXA.pagamentoInfo + FAIXA.altura;
  const altura = 174;
  page.drawRectangle({
    x,
    y: doTopo(yBase + altura),
    width: fim - x,
    height: altura,
    color: cor(COR.branco),
    borderColor: cor(COR.linha),
    borderWidth: 0.6,
  });

  const itens = proposta.informacoesAdicionais?.length
    ? proposta.informacoesAdicionais
    : INFORMACOES_PADRAO;

  let y = yBase + 18;
  for (const item of itens) {
    for (const [i, linha] of quebrar(item, fontes.regular, 6.6, fim - x - 40).entries()) {
      if (i === 0) escrever(page, fontes, "•", x + 14, y, { size: 6.6, color: cor(COR.suave) });
      escrever(page, fontes, linha, x + 24, y, { size: 6.6 });
      y += 9;
    }
    y += 4;
  }

  escrever(page, fontes, AGRADECIMENTO, 0, yBase + altura - 34, {
    size: 7.5,
    font: fontes.bold,
    alinharDireitaEm: fim - (fim - x) / 2 + 40,
  });
  escrever(page, fontes, ASSINATURA, 0, yBase + altura - 21, {
    size: 8.5,
    font: fontes.bold,
    alinharDireitaEm: fim - (fim - x) / 2 + 52,
  });
}

function rodape(page: PDFPage, fontes: Fontes) {
  const y = 800;
  page.drawRectangle({
    x: MARGEM.esquerda,
    y: doTopo(y - 12),
    width: MARGEM.direita - MARGEM.esquerda,
    height: 0.6,
    color: cor(COR.linha),
  });
  escrever(page, fontes, "Avenida Lindóia, 388, Centro", MARGEM.esquerda + 14, y, {
    size: FONTE.rodape,
    font: fontes.bold,
  });
  escrever(page, fontes, "Bragança Paulista - SP", MARGEM.esquerda + 14, y + 8, {
    size: FONTE.rodape,
    font: fontes.bold,
  });
  escrever(page, fontes, "(11) 96748-4000", 250, y, { size: FONTE.rodape, font: fontes.bold });
  escrever(page, fontes, EMPRESA.email, 0, y, {
    size: FONTE.rodape,
    font: fontes.bold,
    alinharDireitaEm: MARGEM.direita,
  });
}

export interface OpcoesGeracao {
  /** PNG do logo. Opcional: sem ele o documento sai sem a marca gráfica. */
  logoPng?: ArrayBuffer | Uint8Array;
}

/** Gera o PDF e devolve os bytes. */
export async function gerarPdfProposta(
  proposta: Proposta,
  opcoes: OpcoesGeracao = {},
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Orcamento ${numeroDocumento(proposta.numero)} - Sonar Acusticos`);
  doc.setProducer("Sonar Acusticos");
  doc.setCreationDate(new Date());

  const fontes: Fontes = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };

  let logo: unknown;
  if (opcoes.logoPng) {
    try {
      logo = await doc.embedPng(opcoes.logoPng);
    } catch {
      // Logo ilegivel nao pode impedir a emissao do orcamento.
      logo = undefined;
    }
  }

  const page = doc.addPage([PAGINA.largura, PAGINA.altura]);
  cabecalho(page, fontes, proposta, logo);
  blocoCliente(page, fontes, proposta);
  cabecalhoTabela(page, fontes, FAIXA.tabelaItens);

  // Itens, com quebra de página quando não couberem (PROPOSAL_ENGINE §8).
  const limiteY = FAIXA.impostosTotais - 22;
  let y = FAIXA.tabelaItens + FAIXA.altura;
  let paginaAtual = page;
  let primeiraPagina = true;
  let indice = 1;

  for (const item of proposta.itens) {
    const altura = alturaItem(item, fontes);
    const limite = primeiraPagina ? limiteY : PAGINA.altura - 60;
    if (y + altura > limite) {
      paginaAtual = doc.addPage([PAGINA.largura, PAGINA.altura]);
      primeiraPagina = false;
      cabecalhoTabela(paginaAtual, fontes, 40);
      y = 40 + FAIXA.altura;
      rodape(paginaAtual, fontes);
    }
    y += desenharItem(paginaAtual, fontes, item, indice, y);
    indice += 1;
  }

  escrever(page, fontes, AVISO_VALORES, MARGEM.esquerda + 14, FAIXA.impostosTotais - 8, {
    size: 6,
    color: cor(COR.suave),
  });

  // Blocos de fechamento vão sempre na primeira página, como no original.
  quadroImpostos(page, fontes, proposta);
  quadroTotais(page, fontes, proposta);
  quadroPagamento(page, fontes);
  quadroInformacoes(page, fontes, proposta);
  rodape(page, fontes);

  if (proposta.preliminar) {
    escrever(page, fontes, "PROPOSTA PRELIMINAR — SUJEITA A REVISÃO TÉCNICA", 0, 30, {
      size: 7,
      font: fontes.bold,
      color: cor(COR.laranja),
      alinharDireitaEm: MARGEM.direita,
    });
  }

  return doc.save();
}
