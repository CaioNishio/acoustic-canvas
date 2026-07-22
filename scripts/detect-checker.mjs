import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const REPO = 'E:/Sonar - Website';
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function walk(dir, out = []) {
  let e; try { e = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const d of e) {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(d.name).toLowerCase())) out.push(full);
  }
  return out;
}

/**
 * Detecta o padrão xadrez de "transparência" desenhado nos pixels:
 * blocos alternados de dois cinzas claros muito próximos.
 */
async function analyse(file) {
  const img = sharp(file);
  const meta = await img.metadata();
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const at = (x, y) => {
    const i = (y * width + x) * channels;
    return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
  };

  // procura por blocos alternados nas bordas (onde o fundo aparece)
  const candidates = [];
  const step = 4;
  for (const size of [8, 10, 12, 16, 20, 25, 32]) {
    let matches = 0;
    let checks = 0;
    for (let y = 0; y + size * 2 < height; y += size * 2 * step) {
      for (let x = 0; x + size * 2 < width; x += size * 2 * step) {
        const a = at(x + 1, y + 1);
        const b = at(x + size + 1, y + 1);
        const c = at(x + 1, y + size + 1);
        if (a.a < 250) continue; // já é transparente
        checks++;
        const isLight = (p) => p.r > 185 && p.g > 185 && p.b > 185;
        const nearGray = (p) => Math.abs(p.r - p.g) < 8 && Math.abs(p.g - p.b) < 8;
        const diff = Math.abs(a.r - b.r);
        // xadrez: dois tons claros e acinzentados, diferentes entre si mas próximos
        if (isLight(a) && isLight(b) && nearGray(a) && nearGray(b) && diff > 10 && diff < 60) {
          const sameAsDiagonal = Math.abs(a.r - c.r) > 10;
          if (sameAsDiagonal) matches++;
        }
      }
    }
    if (checks > 4 && matches / checks > 0.35) candidates.push({ size, ratio: +(matches / checks).toFixed(2), matches, checks });
  }

  // conta cores planas nas bordas (fundo sólido) — útil para saber se dá para recortar
  const corners = [at(0, 0), at(width - 1, 0), at(0, height - 1), at(width - 1, height - 1)];
  const cornerUniform = corners.every(c => Math.abs(c.r - corners[0].r) < 12 && Math.abs(c.g - corners[0].g) < 12 && Math.abs(c.b - corners[0].b) < 12);

  return {
    file: path.relative(REPO, file).replace(/\\/g, '/'),
    format: meta.format,
    w: width, h: height,
    hasAlpha: Boolean(meta.hasAlpha),
    checker: candidates.length ? candidates : null,
    cornerColor: cornerUniform ? `rgb(${corners[0].r},${corners[0].g},${corners[0].b})` : null,
    cornerAlpha: corners[0].a,
  };
}

const files = walk(path.join(REPO, 'src/assets'));
const results = [];
for (const f of files) {
  try { results.push(await analyse(f)); } catch (e) { results.push({ file: f, erro: e.message }); }
}

const comXadrez = results.filter(r => r.checker);
const skyline = results.filter(r => r.file?.includes('skyline'));

console.log(JSON.stringify({
  total: results.length,
  comXadrez: comXadrez.length,
  listaXadrez: comXadrez.map(r => ({ file: r.file, checker: r.checker[0], hasAlpha: r.hasAlpha })),
  skyline: skyline.map(r => ({ file: r.file, hasAlpha: r.hasAlpha, canto: r.cornerColor, alpha: r.cornerAlpha, xadrez: r.checker ? r.checker[0] : null })),
}, null, 1));
