/** Relatório de resolução das imagens — para escolher as de melhor qualidade. */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const REPO = path.resolve(import.meta.dirname, '..');
const argv = globalThis.process?.argv ?? [];
const patterns = argv.slice(2);

function walk(dir, out = []) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) walk(full, out);
    else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(d.name)) out.push(full);
  }
  return out;
}

const files = walk(path.join(REPO, 'src/assets')).filter((f) => {
  if (!patterns.length) return true;
  const rel = path.relative(REPO, f).replace(/\\/g, '/').toLowerCase();
  return patterns.some((p) => rel.includes(p.toLowerCase()));
});

const rows = [];
for (const f of files) {
  try {
    const m = await sharp(f).metadata();
    rows.push({
      file: path.relative(path.join(REPO, 'src/assets'), f).replace(/\\/g, '/'),
      w: m.width, h: m.height,
      mp: +((m.width * m.height) / 1e6).toFixed(2),
      kb: Math.round(fs.statSync(f).size / 1024),
    });
  } catch { /* ignora ilegíveis */ }
}

rows.sort((a, b) => b.mp - a.mp);
console.log(JSON.stringify(rows, null, 1));
