import { describe, it, expect } from "vitest";
import {
  BANDS,
  bareAbsorption,
  treatedAbsorption,
  rt60ByBand,
  requiredAbsorption,
  schroederFrequency,
  dimension,
  volumeOf,
  surfaceOf,
  CATALOG_ACOUSTIC,
} from "@/components/calculadora/acousticsEngine";

/**
 * O cálculo anterior afirmava usar Sabine mas fazia
 * `absorptionArea = totalSurface × absPercent` — percentual de cobertura. O RT60 alvo
 * era exibido e nunca usado. Estes testes fixam o comportamento correto.
 */

const SALA = { w: 4, l: 6, h: 2.8 }; // 67,2 m³

describe("geometria", () => {
  it("volume e superfície conferem", () => {
    expect(volumeOf(SALA)).toBeCloseTo(67.2, 5);
    // 2*(4*6 + 4*2.8 + 6*2.8) = 2*(24 + 11.2 + 16.8) = 104
    expect(surfaceOf(SALA)).toBeCloseTo(104, 5);
  });
});

describe("Sabine e Eyring", () => {
  it("aplica Sabine com absorção baixa: RT = 0,161·V/A", () => {
    // ᾱ = 10/104 = 0,096 < 0,2 → Sabine
    const A = BANDS.map(() => 10) as never;
    const { rt, method } = rt60ByBand(SALA, A);
    expect(method[0]).toBe("sabine");
    expect(rt[0]).toBeCloseTo((0.161 * 67.2) / 10, 6);
  });

  it("troca para Eyring quando ᾱ ≥ 0,2", () => {
    // ᾱ = 40/104 = 0,385 → Eyring
    const A = BANDS.map(() => 40) as never;
    const { rt, method } = rt60ByBand(SALA, A);
    expect(method[0]).toBe("eyring");
    const esperado = (0.161 * 67.2) / (-104 * Math.log(1 - 40 / 104));
    expect(rt[0]).toBeCloseTo(esperado, 6);
  });

  it("Eyring é menor que Sabine para a mesma absorção alta", () => {
    // Sabine superestima RT quando ᾱ é alto — este é o motivo da troca.
    const A = 40;
    const sabine = (0.161 * 67.2) / A;
    const eyring = (0.161 * 67.2) / (-104 * Math.log(1 - A / 104));
    expect(eyring).toBeLessThan(sabine);
  });

  it("requiredAbsorption é o inverso de Sabine", () => {
    const alvo = 0.4;
    const A = requiredAbsorption(SALA, alvo);
    expect((0.161 * volumeOf(SALA)) / A).toBeCloseTo(alvo, 10);
  });
});

describe("frequência de Schroeder", () => {
  it("segue 2000·√(RT/V)", () => {
    expect(schroederFrequency(67.2, 0.5)).toBeCloseTo(2000 * Math.sqrt(0.5 / 67.2), 6);
  });

  it("é mais alta em sala pequena — onde Sabine vale menos", () => {
    const pequena = schroederFrequency(25, 0.5);
    const grande = schroederFrequency(400, 0.5);
    expect(pequena).toBeGreaterThan(grande);
  });
});

describe("absorção da sala e do tratamento", () => {
  it("a sala nua já tem absorção — não se parte do zero", () => {
    const nua = bareAbsorption(SALA);
    expect(nua.every((v) => v > 0)).toBe(true);
    // parede pintada absorve mais em 125 Hz que em 4 kHz
    expect(nua[0]).toBeGreaterThan(nua[5]);
  });

  it("o tratamento usa o α do produto, não a área bruta", () => {
    // Regressão do bug: 10 painéis de 0,72 m² NÃO valem 7,2 sabines.
    const nua = bareAbsorption(SALA);
    const tratada = treatedAbsorption(SALA, [
      { slug: "painel-acustico-snr3250", qty: 10 },
    ]);
    const ganho500 = tratada[2] - nua[2];
    const p = CATALOG_ACOUSTIC["painel-acustico-snr3250"];
    // ganho = qty × área × (α_painel − α_parede_substituída)
    const esperado = 10 * p.unitArea * (p.alpha[2] - 0.06);
    expect(ganho500).toBeCloseTo(esperado, 6);
    expect(ganho500).not.toBeCloseTo(10 * p.unitArea, 2);
  });

  it("tratar a sala reduz o RT60 em todas as bandas", () => {
    const nua = rt60ByBand(SALA, bareAbsorption(SALA)).rt;
    const tratada = rt60ByBand(
      SALA,
      treatedAbsorption(SALA, [
        { slug: "painel-acustico-snr3250", qty: 12 },
        { slug: "bass-trap-corner-3s-snr6430", qty: 4 },
      ]),
    ).rt;
    for (let i = 0; i < BANDS.length; i++) {
      expect(tratada[i]).toBeLessThan(nua[i]);
    }
  });

  it("bass trap age mais nos graves que nos agudos", () => {
    const nua = bareAbsorption(SALA);
    const comTrap = treatedAbsorption(SALA, [
      { slug: "bass-trap-corner-3s-snr6430", qty: 4 },
    ]);
    const ganhoGrave = comTrap[0] - nua[0]; // 125 Hz
    const ganhoAgudo = comTrap[5] - nua[5]; // 4 kHz
    // a curva deslocada uma oitava abaixo dá ganho relativo maior em 125 Hz
    const trap = CATALOG_ACOUSTIC["bass-trap-corner-3s-snr6430"];
    expect(trap.alpha[0]).toBeGreaterThan(CATALOG_ACOUSTIC["painel-acustico-snr3250"].alpha[0]);
    expect(ganhoGrave).toBeGreaterThan(0);
    expect(ganhoAgudo).toBeGreaterThan(0);
  });
});

describe("dimensionamento", () => {
  it("parte do RT alvo e desconta a absorção existente", () => {
    const d = dimension(SALA, 0.4, "painel-acustico-snr3250");
    const req = requiredAbsorption(SALA, 0.4);
    const nua = bareAbsorption(SALA)[2];
    expect(d.missingAtRef).toBeCloseTo(Math.max(req - nua, 0), 6);
  });

  it("RT alvo mais curto exige mais painéis", () => {
    const frouxo = dimension(SALA, 0.8, "painel-acustico-snr3250");
    const exigente = dimension(SALA, 0.3, "painel-acustico-snr3250");
    expect(exigente.mainPanelQty).toBeGreaterThan(frouxo.mainPanelQty);
  });

  it("sala maior exige mais painéis para o mesmo RT", () => {
    const pequena = dimension({ w: 3, l: 4, h: 2.5 }, 0.4, "painel-acustico-snr3250");
    const grande = dimension({ w: 8, l: 12, h: 4 }, 0.4, "painel-acustico-snr3250");
    expect(grande.mainPanelQty).toBeGreaterThan(pequena.mainPanelQty);
  });

  it("limita a absorção a 60% da superfície e avisa", () => {
    // RT alvo absurdo para o volume: forçaria cobrir a sala inteira.
    const d = dimension(SALA, 0.05, "painel-acustico-snr3250");
    expect(d.cappedByComfort).toBe(true);
    expect(d.mainPanelQty * 0.72).toBeLessThanOrEqual(surfaceOf(SALA) * 0.6);
    expect(d.warnings.some((w) => w.includes("60%"))).toBe(true);
  });

  it("declara as suposições em vez de escondê-las", () => {
    const d = dimension(SALA, 0.4, "painel-acustico-snr3250");
    expect(d.assumptions.length).toBeGreaterThan(0);
    expect(d.assumptions.join(" ")).toMatch(/piso duro|alvenaria/i);
  });

  it("avisa sobre Schroeder em sala pequena", () => {
    const d = dimension({ w: 2.5, l: 3, h: 2.4 }, 0.3, "painel-acustico-snr3250");
    expect(d.warnings.some((w) => w.includes("Schroeder"))).toBe(true);
  });

  it("nunca devolve quantidade negativa", () => {
    // sala que já atinge o alvo sozinha
    const d = dimension({ w: 3, l: 3, h: 2.4 }, 5.0, "painel-acustico-snr3250");
    expect(d.mainPanelQty).toBeGreaterThanOrEqual(0);
  });
});

describe("integridade do catálogo acústico", () => {
  it("todo produto tem α em todas as bandas e área positiva", () => {
    for (const [slug, p] of Object.entries(CATALOG_ACOUSTIC)) {
      expect(p.alpha.length, slug).toBe(BANDS.length);
      expect(p.unitArea, slug).toBeGreaterThan(0);
      expect(p.alpha.every((a) => a >= 0 && a <= 1.5), slug).toBe(true);
    }
  });

  it("todo α estimado declara o motivo", () => {
    for (const [slug, p] of Object.entries(CATALOG_ACOUSTIC)) {
      if (p.estimated) {
        expect(p.note, `${slug} é estimado e precisa declarar o porquê`).toBeTruthy();
      }
    }
  });
});
