import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { gerarPdfProposta } from "@/lib/proposal/generatePdf";
import type { Proposta, ItemProposta } from "@/lib/proposal/types";

function propostaBase(itens: ItemProposta[]): Proposta {
  const subtotal = itens.reduce((s, i) => s + i.quantidade * i.valorUnitario, 0);
  return {
    numero: 3215,
    emissao: "2026-07-22",
    validade: "2026-08-01",
    cliente: {
      nome: "Cliente de Teste LTDA",
      documento: "12.345.678/0001-90",
      cidade: "Bragança Paulista",
      uf: "SP",
    },
    itens,
    subtotal,
    desconto: 0,
    baseCalculo: subtotal,
    impostos: 0,
    total: subtotal,
  };
}

const umItem: ItemProposta = {
  descricao: "Difusor Acústico Skyline SNRD50 - 120 mm",
  detalhe: "SKU: SNRD50 | Natural • 52,43 x 46,67 cm, envernizado e selado",
  unidade: "un.",
  quantidade: 21,
  valorUnitario: 254.22,
};

async function paginas(bytes: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

describe("geração do PDF da proposta", () => {
  it("produz um PDF válido", async () => {
    const bytes = await gerarPdfProposta(propostaBase([umItem]));
    expect(bytes.length).toBeGreaterThan(1000);
    // Assinatura do formato, nos primeiros bytes.
    expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe("%PDF-");
  });

  it("cabe em uma página quando há poucos itens", async () => {
    const bytes = await gerarPdfProposta(propostaBase([umItem, umItem]));
    expect(await paginas(bytes)).toBe(1);
  });

  it("cria página adicional quando os itens excedem a página", async () => {
    // PROPOSAL_ENGINE §8: transbordo gera página nova, não corta nem encolhe
    // a fonte abaixo do legível.
    const muitos = Array.from({ length: 40 }, () => umItem);
    const bytes = await gerarPdfProposta(propostaBase(muitos));
    expect(await paginas(bytes)).toBeGreaterThan(1);
  });

  it("não quebra com lista de itens vazia", async () => {
    const bytes = await gerarPdfProposta(propostaBase([]));
    expect(await paginas(bytes)).toBe(1);
  });

  it("aceita acentuação e o marcador do documento sem estourar", async () => {
    // A Helvetica usa WinAnsi; um caractere fora da tabela derrubaria a
    // geração. Um orçamento que não abre é pior que um caractere trocado.
    const bytes = await gerarPdfProposta(
      propostaBase([
        {
          ...umItem,
          descricao: "Instalação, manutenção e inspeção — ação técnica “especial”",
          detalhe: "Ângulo 45°, isolação acústica • preço sob consulta",
        },
      ]),
    );
    expect(bytes.length).toBeGreaterThan(1000);
  });

  it("calcula o total da linha quando não é informado", async () => {
    const { totalDoItem } = await import("@/lib/proposal/types");
    expect(totalDoItem({ ...umItem, total: undefined })).toBeCloseTo(21 * 254.22, 2);
    expect(totalDoItem({ ...umItem, total: 9999 })).toBe(9999);
  });

  it("não embute dados de nenhum cliente além do informado", async () => {
    // Guarda de LGPD. O template oficial é um raster com os dados da M20
    // Arquitetura dentro; usá-lo como fundo vazaria esses dados em todo
    // orçamento. Este teste falha se alguém reintroduzir aquele caminho.
    const bytes = await gerarPdfProposta(propostaBase([umItem]));
    const conteudo = Buffer.from(bytes).toString("latin1");
    for (const vazado of ["M20 Arquitetura", "06.892.438", "Guianazes", "91566-2080"]) {
      expect(conteudo).not.toContain(vazado);
    }
  });
});
