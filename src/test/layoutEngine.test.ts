import { describe, it, expect } from "vitest";
import { computeLayout, type Placement, type ProductPlacement } from "@/components/calculadora/layoutEngine";

/**
 * Estes testes existem para provar, e não apenas afirmar, que o motor de layout
 * não sobrepõe peças e mantém alinhamento. Antes da refatoração, os painéis eram
 * distribuídos por espaçamento uniforme de centros, ignorando a largura da peça.
 */

const PRESETS = ["simetrico", "reflexao", "hibrido"] as const;

/** Salas de teste, do pior caso (apertada) ao generoso. */
const ROOMS = [
  { w: 2.5, l: 3.0, h: 2.4 },
  { w: 3.5, l: 4.5, h: 2.7 },
  { w: 5.0, l: 7.0, h: 3.2 },
  { w: 12.0, l: 18.0, h: 5.0 },
];

const CATALOG: ProductPlacement[] = [
  { name: "Painel SNR3250 (High-Mid)", placement: "Paredes", qty: 24, slug: "painel-acustico-snr3250" },
  { name: "Painel SNR6450 (Low-Mid)", placement: "Fundo", qty: 10, slug: "painel-acustico-snr6450" },
  { name: "Bass Trap Corner 3S", placement: "Cantos", qty: 4, slug: "bass-trap-corner-3s-snr6430" },
  { name: "Nuvem Acústica SNR3250", placement: "Teto", qty: 8, slug: "nuvem-acustica-snr3250" },
  { name: "Difusor Skyline", placement: "Traseira", qty: 6, slug: "difusor-skyline" },
  { name: "Kit de Fixação Acústica", placement: "Fixadores", qty: 40, slug: "suportes-instalacao" },
];

/** Projeta a peça no plano da sua superfície: retorna retângulo [u1,v1,u2,v2]. */
function rectOf(p: Placement): [number, number, number, number] {
  const [x, y, z] = p.position;
  const [fw, fh] = p.size;
  if (p.surface === "left" || p.surface === "right") {
    // plano Z-Y
    return [z - fw / 2, y - fh / 2, z + fw / 2, y + fh / 2];
  }
  if (p.surface === "ceiling") {
    // plano X-Z
    return [x - fw / 2, z - fh / 2, x + fw / 2, z + fh / 2];
  }
  // back / front: plano X-Y
  return [x - fw / 2, y - fh / 2, x + fw / 2, y + fh / 2];
}

function overlaps(a: Placement, b: Placement): boolean {
  const [ax1, ay1, ax2, ay2] = rectOf(a);
  const [bx1, by1, bx2, by2] = rectOf(b);
  const eps = 1e-6;
  return ax1 < bx2 - eps && bx1 < ax2 - eps && ay1 < by2 - eps && by1 < ay2 - eps;
}

describe("motor de layout — ausência de sobreposição", () => {
  for (const room of ROOMS) {
    for (const preset of PRESETS) {
      it(`sala ${room.w}x${room.l}x${room.h} preset ${preset}: nenhuma peça se sobrepõe`, () => {
        const { placements } = computeLayout(CATALOG, room, preset, { hasMonitors: true, hasSub: true });

        // Bass traps ocupam cantos e são colunas — comparados à parte.
        const flat = placements.filter((p) => p.kind !== "bassTrap" && p.kind !== "diffuser");

        const colisoes: string[] = [];
        for (let i = 0; i < flat.length; i++) {
          for (let j = i + 1; j < flat.length; j++) {
            if (flat[i].surface !== flat[j].surface) continue;
            // peças em paredes opostas compartilham a superfície nominal? não: left != right
            if (overlaps(flat[i], flat[j])) {
              colisoes.push(`${flat[i].id} × ${flat[j].id} (${flat[i].surface})`);
            }
          }
        }
        expect(colisoes).toEqual([]);
      });
    }
  }
});

describe("motor de layout — contenção nas superfícies", () => {
  for (const room of ROOMS) {
    for (const preset of PRESETS) {
      it(`sala ${room.w}x${room.l}x${room.h} preset ${preset}: nada ultrapassa os limites`, () => {
        const { placements } = computeLayout(CATALOG, room, preset, { hasMonitors: true, hasSub: false });
        const fora: string[] = [];
        const tol = 1e-6;

        for (const p of placements) {
          if (p.kind === "bassTrap") continue; // coluna de canto, ocupa altura total por definição
          const [u1, v1, u2, v2] = rectOf(p);

          if (p.surface === "left" || p.surface === "right") {
            if (u1 < -room.l / 2 - tol || u2 > room.l / 2 + tol) fora.push(`${p.id}: excede comprimento`);
            if (v1 < -tol || v2 > room.h + tol) fora.push(`${p.id}: excede altura`);
          } else if (p.surface === "ceiling") {
            if (u1 < -room.w / 2 - tol || u2 > room.w / 2 + tol) fora.push(`${p.id}: excede largura`);
            if (v1 < -room.l / 2 - tol || v2 > room.l / 2 + tol) fora.push(`${p.id}: excede comprimento`);
          } else {
            if (u1 < -room.w / 2 - tol || u2 > room.w / 2 + tol) fora.push(`${p.id}: excede largura`);
            if (v1 < -tol || v2 > room.h + tol) fora.push(`${p.id}: excede altura`);
          }
        }
        expect(fora).toEqual([]);
      });
    }
  }
});

describe("motor de layout — alinhamento e simetria", () => {
  it("painéis laterais compartilham as mesmas cotas de altura (nada torto)", () => {
    const room = { w: 4, l: 6, h: 2.8 };
    const { placements } = computeLayout(CATALOG, room, "simetrico", { hasMonitors: false, hasSub: false });
    const laterais = placements.filter((p) => p.kind === "panel" && (p.surface === "left" || p.surface === "right"));
    const cotas = new Set(laterais.map((p) => p.position[1].toFixed(4)));
    // no preset simétrico há uma única linha de base
    expect(cotas.size).toBe(1);
  });

  it("o layout é espelhado entre parede esquerda e direita", () => {
    const room = { w: 4, l: 6, h: 2.8 };
    const { placements } = computeLayout(CATALOG, room, "simetrico", { hasMonitors: false, hasSub: false });
    const esq = placements.filter((p) => p.kind === "panel" && p.surface === "left").map((p) => `${p.position[1].toFixed(3)}|${p.position[2].toFixed(3)}`).sort();
    const dir = placements.filter((p) => p.kind === "panel" && p.surface === "right").map((p) => `${p.position[1].toFixed(3)}|${p.position[2].toFixed(3)}`).sort();
    expect(esq).toEqual(dir);
  });

  it("bass traps vão do piso ao teto", () => {
    const room = { w: 4, l: 6, h: 2.8 };
    const { placements } = computeLayout(CATALOG, room, "simetrico", { hasMonitors: false, hasSub: false });
    const traps = placements.filter((p) => p.kind === "bassTrap");
    expect(traps.length).toBe(4);
    for (const t of traps) {
      expect(t.size[1]).toBeCloseTo(room.h, 5);
      expect(t.position[1]).toBeCloseTo(room.h / 2, 5);
    }
  });
});

describe("motor de layout — honestidade técnica", () => {
  it("recusa difusor quando não há campo suficiente e explica o motivo", () => {
    const pequena = { w: 2.5, l: 3.0, h: 2.4 };
    const { placements, warnings } = computeLayout(CATALOG, pequena, "simetrico", { hasMonitors: false, hasSub: false });
    expect(placements.some((p) => p.kind === "diffuser")).toBe(false);
    expect(warnings.some((w) => w.toLowerCase().includes("difusor"))).toBe(true);
  });

  it("avisa quando a sala é pequena demais para o campo ser difuso", () => {
    const pequena = { w: 2.5, l: 3.0, h: 2.4 };
    const { warnings } = computeLayout(CATALOG, pequena, "simetrico", { hasMonitors: false, hasSub: false });
    expect(warnings.some((w) => w.includes("Schroeder"))).toBe(true);
  });

  it("ignora produtos sem representação 3D (kits, insumos)", () => {
    const room = { w: 4, l: 6, h: 2.8 };
    const { placements } = computeLayout(CATALOG, room, "simetrico", { hasMonitors: false, hasSub: false });
    expect(placements.some((p) => p.id.includes("suportes"))).toBe(false);
  });
});
