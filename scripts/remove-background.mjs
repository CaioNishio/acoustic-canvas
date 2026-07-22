/**
 * Remove o fundo das imagens de capa de produto.
 *
 * Faz flood-fill a partir das bordas removendo tudo que for claro e
 * pouco saturado — o que cobre tanto fundo branco sólido quanto o padrão
 * xadrez que algumas imagens trazem "queimado" nos pixels. Só remove o
 * que está conectado à borda, então áreas claras dentro do produto
 * (madeira clara, por exemplo) são preservadas.
 *
 * Uso: node scripts/remove-background.mjs [--apply] [arquivo...]
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const REPO = path.resolve(import.meta.dirname, '..');
const argv = globalThis.process?.argv ?? [];
const APPLY = argv.includes('--apply');

/** capas de produto: o campo `image` de cada item em products.ts */
function coverPaths() {
  const src = fs.readFileSync(path.join(REPO, 'src/data/products.ts'), 'utf8');
  const imports = new Map();
  for (const m of src.matchAll(/import\s+(\w+)\s+from\s+"([^"]+)"/g)) imports.set(m[1], m[2]);
  const out = [];
  for (const m of src.matchAll(/slug:\s*"([^"]+)"[\s\S]*?image:\s*(\w+),/g)) {
    const p = imports.get(m[2]);
    if (p) out.push('src/' + p.replace('@/', ''));
  }
  return [...new Set(out)];
}

const explicit = argv.slice(2).filter((a) => !a.startsWith('--'));
const targets = explicit.length ? explicit : coverPaths();

/** claro e acinzentado = fundo */
const isBackground = (r, g, b) => {
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  return lum > 178 && sat < 26;
};

async function process(file) {
  const input = sharp(file);
  const meta = await input.metadata();
  const { data, info } = await input.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Só faz sentido recortar quando o objeto está sobre um fundo liso.
  // Numa foto de ambiente a borda é heterogênea e o recorte destruiria a imagem.
  let borderBg = 0;
  let borderTotal = 0;
  const sampleBorder = (x, y) => {
    const i = (y * width + x) * channels;
    borderTotal++;
    if (isBackground(data[i], data[i + 1], data[i + 2])) borderBg++;
  };
  for (let x = 0; x < width; x += 2) { sampleBorder(x, 0); sampleBorder(x, height - 1); }
  for (let y = 0; y < height; y += 2) { sampleBorder(0, y); sampleBorder(width - 1, y); }
  const borderRatio = borderBg / borderTotal;

  const visited = new Uint8Array(width * height);
  const stack = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * channels;
    if (!isBackground(data[i], data[i + 1], data[i + 2])) return;
    visited[idx] = 1;
    stack.push(x, y);
  };

  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }

  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }

  let removed = 0;
  for (let idx = 0; idx < width * height; idx++) {
    if (!visited[idx]) continue;
    data[idx * channels + 3] = 0;
    removed++;
  }

  const pct = +((removed / (width * height)) * 100).toFixed(1);
  const out = path.join(path.dirname(file), path.basename(file, path.extname(file)) + '.png');

  // exige fundo liso na borda (produto isolado) e recorte plausível
  const eligible = borderRatio > 0.82 && pct > 3 && pct < 92;

  if (APPLY && eligible) {
    await sharp(data, { raw: { width, height, channels } })
      .png({ compressionLevel: 9 })
      .toFile(out + '.tmp');
    fs.renameSync(out + '.tmp', out);
    if (out !== file) fs.unlinkSync(file);
  }

  return {
    file: path.relative(REPO, file).replace(/\\/g, '/'),
    saida: path.relative(REPO, out).replace(/\\/g, '/'),
    formato: meta.format,
    bordaLisa: +(borderRatio * 100).toFixed(0) + '%',
    removido: pct + '%',
    elegivel: eligible,
    aplicado: APPLY && eligible,
  };
}

const results = [];
for (const t of targets) {
  const full = path.isAbsolute(t) ? t : path.join(REPO, t);
  if (!fs.existsSync(full)) { results.push({ file: t, erro: 'nao encontrado' }); continue; }
  try { results.push(await process(full)); } catch (e) { results.push({ file: t, erro: e.message }); }
}

console.log(JSON.stringify({ modo: APPLY ? 'APLICADO' : 'simulacao', results }, null, 1));
