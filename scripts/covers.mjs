/** Lista os caminhos das imagens de capa (campo `image`) de cada produto. */
import fs from 'fs';
import path from 'path';

const REPO = path.resolve(import.meta.dirname, '..');
const src = fs.readFileSync(path.join(REPO, 'src/data/products.ts'), 'utf8');

const imports = new Map();
for (const m of src.matchAll(/import\s+(\w+)\s+from\s+"([^"]+)"/g)) imports.set(m[1], m[2]);

const covers = [];
for (const m of src.matchAll(/slug:\s*"([^"]+)"[\s\S]*?image:\s*(\w+),/g)) {
  const p = imports.get(m[2]);
  if (!p) continue;
  covers.push({ slug: m[1], varName: m[2], alias: p, file: 'src/' + p.replace('@/', '') });
}

if (process.argv.includes('--paths')) {
  console.log(covers.map((c) => c.file).join('\n'));
} else {
  console.log(JSON.stringify({ total: covers.length, covers }, null, 1));
}
