/** Confronta os specs dos produtos com a tabela oficial ROCKFIBRAS/SOPREMA. */
import fs from 'fs';
import path from 'path';

const REPO = path.resolve(import.meta.dirname, '..');
const src = fs.readFileSync(path.join(REPO, 'src/data/products.ts'), 'utf8');

/** NRC oficial por densidade (ISO/R 354 e ASTM C 423, espessura 51 mm) */
const NRC_OFICIAL = { 32: 0.80, 48: 0.89, 64: 0.93, 96: 1.07, 128: 1.00, 144: 0.93, 160: 1.00 };

const blocks = src.split(/\n  \{\n/).slice(1);
const rows = [];

for (const b of blocks) {
  const slug = b.match(/slug:\s*"([^"]+)"/)?.[1];
  if (!slug) continue;
  const nrc = b.match(/label:\s*"NRC",\s*value:\s*"([^"]+)"/)?.[1];
  const dens = b.match(/label:\s*"Densidade",\s*value:\s*"(\d+)/)?.[1];
  const fogo = b.match(/label:\s*"Classe de Fogo",\s*value:\s*"([^"]+)"/)?.[1];
  const esp = b.match(/label:\s*"Espessura",\s*value:\s*"([^"]+)"/)?.[1];
  if (!nrc && !dens && !fogo) continue;

  const oficial = dens ? NRC_OFICIAL[+dens] : undefined;
  // aceita vírgula decimal e sufixos como "(estimado)"
  const nrcNum = nrc ? parseFloat(nrc.replace(',', '.')) : undefined;
  const estimado = Boolean(nrc?.includes('estimado'));
  rows.push({
    slug,
    densidade: dens ? +dens : null,
    espessura: esp ?? null,
    nrcSite: nrc ?? null,
    nrcOficial: oficial ?? null,
    estimado,
    // valores marcados como estimados são deliberados (espessura fora do ensaio)
    divergente: !estimado && oficial !== undefined && nrcNum !== undefined
      && Math.abs(nrcNum - oficial) > 0.005,
    classeFogo: fogo ?? null,
  });
}

const OK_FOGO = new Set(['Incombustível (ISO 1182)', 'Núcleo incombustível (ISO 1182)']);
const divergentes = rows.filter((r) => r.divergente);
const fogoA2 = rows.filter((r) => r.classeFogo && !OK_FOGO.has(r.classeFogo));

console.log(JSON.stringify({
  totalComSpecs: rows.length,
  nrcDivergente: divergentes.length,
  divergentes,
  classeFogoAAjustar: fogoA2.map((r) => ({ slug: r.slug, atual: r.classeFogo })),
}, null, 1));
