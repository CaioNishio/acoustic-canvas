/**
 * Reaponta imports de imagem cuja extensão mudou em disco
 * (por exemplo, .webp convertido para .png ao remover o fundo).
 */
import fs from 'fs';
import path from 'path';

const REPO = path.resolve(import.meta.dirname, '..');
const SRC = path.join(REPO, 'src');
const CODE = /\.(ts|tsx)$/;
const IMG = /\.(jpg|jpeg|png|webp|avif)$/i;

function walk(dir, test, out = []) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) walk(full, test, out);
    else if (test.test(d.name)) out.push(full);
  }
  return out;
}

// índice: caminho sem extensão -> extensão real em disco
const onDisk = new Map();
for (const f of walk(path.join(SRC, 'assets'), IMG)) {
  const rel = path.relative(SRC, f).replace(/\\/g, '/');
  onDisk.set(rel.replace(IMG, ''), path.extname(f));
}

const changes = [];
for (const file of walk(SRC, CODE)) {
  let text = fs.readFileSync(file, 'utf8');
  let touched = false;

  text = text.replace(/(["'])@\/(assets\/[^"']+?)(\.(?:jpg|jpeg|png|webp|avif))\1/gi, (full, q, base, ext) => {
    const real = onDisk.get(base);
    if (!real || real.toLowerCase() === ext.toLowerCase()) return full;
    touched = true;
    changes.push({ arquivo: path.relative(REPO, file).replace(/\\/g, '/'), de: base + ext, para: base + real });
    return `${q}@/${base}${real}${q}`;
  });

  if (touched) fs.writeFileSync(file, text);
}

console.log(JSON.stringify({ ajustes: changes.length, changes }, null, 1));
