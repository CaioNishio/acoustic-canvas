/**
 * Alinha os specs dos produtos aos laudos oficiais:
 *  - NRC conforme a densidade (ISO/R 354 e ASTM C 423, 51 mm)
 *  - Classe de fogo conforme o ensaio ISO 1182 do IPT
 *  - Condutividade térmica conforme ASTM C 518
 */
import fs from 'fs';
import path from 'path';

const REPO = path.resolve(import.meta.dirname, '..');
const FILE = path.join(REPO, 'src/data/products.ts');
let src = fs.readFileSync(FILE, 'utf8');

const NRC = { 32: '0,80', 48: '0,89', 64: '0,93', 96: '1,07', 128: '1,00', 144: '0,93', 160: '1,00' };
const COND = {
  32: '0,039 W/m·K', 48: '0,036 W/m·K', 64: '0,035 W/m·K', 96: '0,040 W/m·K',
  128: '0,042 W/m·K', 144: '0,050 W/m·K', 160: '0,048 W/m·K',
};

/** produtos com frente em MDF/madeira: só o núcleo é incombustível */
const NUCLEO_APENAS = new Set([
  'painel-mdf-vazado', 'painel-moldura-madeira', 'difusor-qrd', 'difusor-skyline',
  'difusor-bidimensional', 'reflexive-panels', 'revestimento-ripado',
  'bass-trap-membrana-snr6420', 'porta-acustica-dupla', 'porta-acustica-anti-panico',
]);

const changes = [];

// separa os blocos de produto preservando o texto
const parts = src.split(/(?=\n  \{\n    slug:)/);

const fixed = parts.map((block) => {
  const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
  if (!slug) return block;

  const dens = block.match(/label:\s*"Densidade",\s*value:\s*"(\d+)/)?.[1];
  let out = block;

  // 1. NRC conforme densidade
  if (dens && NRC[+dens]) {
    out = out.replace(/(label:\s*"NRC",\s*value:\s*")([^"]+)(")/, (m, a, atual, c) => {
      const alvo = NRC[+dens];
      if (atual.replace('.', ',') === alvo) return m;
      changes.push({ slug, campo: 'NRC', de: atual, para: alvo, base: `D${dens} @51mm` });
      return a + alvo + c;
    });
  }

  // 2. Classe de fogo conforme o laudo
  out = out.replace(/(label:\s*"Classe de Fogo",\s*value:\s*")([^"]+)(")/, (m, a, atual, c) => {
    const alvo = NUCLEO_APENAS.has(slug) ? 'Núcleo incombustível (ISO 1182)' : 'Incombustível (ISO 1182)';
    if (atual === alvo) return m;
    changes.push({ slug, campo: 'Classe de Fogo', de: atual, para: alvo });
    return a + alvo + c;
  });

  // 3. Condutividade térmica — acrescenta logo após a densidade quando ausente
  if (dens && COND[+dens] && !/label:\s*"Condutividade/.test(out)) {
    out = out.replace(/(\{ label: "Densidade", value: "[^"]+" \},)/, (m) => {
      changes.push({ slug, campo: 'Condutividade Térmica', de: '(ausente)', para: COND[+dens] });
      return `${m}\n      { label: "Condutividade Térmica", value: "${COND[+dens]}" },`;
    });
  }

  return out;
});

src = fixed.join('');
fs.writeFileSync(FILE, src);

console.log(JSON.stringify({ alteracoes: changes.length, changes }, null, 1));
