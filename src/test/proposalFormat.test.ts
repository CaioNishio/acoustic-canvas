import { describe, it, expect } from "vitest";
import {
  brl,
  brlDesconto,
  quantidade,
  dataBr,
  numeroDocumento,
  ouVazio,
  cidadeUf,
  VAZIO,
} from "@/lib/proposal/format";

/**
 * Os valores esperados aqui foram lidos do documento oficial nº 3215, nao
 * inventados. Se o PDF gerado divergir destes formatos, ele diverge do
 * template que o cliente ja conhece.
 */

describe("moeda", () => {
  it("formata no padrão do documento oficial", () => {
    expect(brl(5338.62)).toBe("R$ 5.338,62");
    expect(brl(550)).toBe("R$ 550,00");
    expect(brl(5594.19)).toBe("R$ 5.594,19");
    expect(brl(0)).toBe("R$ 0,00");
  });

  it("usa espaço normal depois do R$, não espaço estreito", () => {
    // Se vier U+00A0 ou U+202F, a largura no PDF muda e o diff visual acusa.
    expect(brl(1).charCodeAt(2)).toBe(32);
    expect(brl(1)).toBe("R$ 1,00");
  });

  it("não quebra com valor inválido", () => {
    expect(brl(NaN)).toBe("R$ 0,00");
    expect(brl(Infinity)).toBe("R$ 0,00");
  });
});

describe("desconto", () => {
  it("imprime hífen, espaço e o valor, como no original", () => {
    expect(brlDesconto(294.43)).toBe("- R$ 294,43");
  });

  it("aceita o valor já negativo sem duplicar o sinal", () => {
    expect(brlDesconto(-294.43)).toBe("- R$ 294,43");
  });

  it("zero não ganha sinal", () => {
    // O documento mostra "R$ 0,00", nunca "- R$ 0,00".
    expect(brlDesconto(0)).toBe("R$ 0,00");
  });
});

describe("quantidade", () => {
  it("usa duas casas e vírgula decimal", () => {
    expect(quantidade(21)).toBe("21,00");
    expect(quantidade(1)).toBe("1,00");
    expect(quantidade(2.5)).toBe("2,50");
  });
});

describe("data", () => {
  it("converte ISO para dd/MM/yyyy", () => {
    expect(dataBr("2026-07-22")).toBe("22/07/2026");
    expect(dataBr("2026-08-01")).toBe("01/08/2026");
  });

  it("não volta um dia por causa de fuso", () => {
    // `new Date("2026-08-03")` é meia-noite UTC; em UTC-3 isso é 02/08 21h.
    // Uma data errada no orçamento é erro visível para o cliente.
    expect(dataBr("2026-08-03")).toBe("03/08/2026");
    expect(dataBr("2026-01-01")).toBe("01/01/2026");
  });

  it("aceita Date e usa o fuso local", () => {
    expect(dataBr(new Date(2026, 6, 22))).toBe("22/07/2026");
  });

  it("devolve travessão para entrada inválida", () => {
    expect(dataBr("qualquer coisa")).toBe(VAZIO);
  });
});

describe("número do documento", () => {
  it("preenche com zeros até quatro dígitos", () => {
    expect(numeroDocumento(3215)).toBe("3215");
    expect(numeroDocumento(31)).toBe("0031");
    expect(numeroDocumento(1)).toBe("0001");
  });

  it("não passa de quatro dígitos quando o número é maior", () => {
    expect(numeroDocumento(12345)).toBe("12345");
  });
});

describe("campos vazios", () => {
  it("viram travessão, como no original", () => {
    expect(ouVazio(null)).toBe(VAZIO);
    expect(ouVazio(undefined)).toBe(VAZIO);
    expect(ouVazio("")).toBe(VAZIO);
    expect(ouVazio("   ")).toBe(VAZIO);
  });

  it("preservam o conteúdo real, sem espaço nas pontas", () => {
    expect(ouVazio("  M20 Arquitetura  ")).toBe("M20 Arquitetura");
  });
});

describe("cidade e UF", () => {
  it("junta no formato do documento", () => {
    expect(cidadeUf("São Paulo", "sp")).toBe("São Paulo - SP");
  });

  it("não deixa hífen solto quando falta um dos dois", () => {
    expect(cidadeUf("São Paulo", "")).toBe("São Paulo");
    expect(cidadeUf("", "SP")).toBe("SP");
    expect(cidadeUf("", "")).toBe(VAZIO);
  });
});
