/**
 * Galeria por pasta — controle das imagens direto pelo sistema de arquivos.
 *
 * Coloque as fotos em `src/assets/produtos/<slug-do-produto>/`.
 * O Vite descobre os arquivos em tempo de build, então:
 *
 *   - adicionar um arquivo na pasta  → a foto passa a aparecer no site
 *   - apagar um arquivo da pasta     → a foto some do site
 *   - renomear                       → muda a ordem (a ordenação é alfabética)
 *
 * Nenhuma alteração de código é necessária. Em `npm run dev` a mudança
 * aparece na hora; para produção basta um novo `npm run build`.
 *
 * A primeira imagem da pasta (em ordem alfabética) vira a CAPA do produto.
 * Use um prefixo numérico para controlar: `01-capa.png`, `02-detalhe.jpg`.
 *
 * Produtos sem pasta continuam usando as imagens definidas em products.ts.
 */

const modules = import.meta.glob<string>(
  "/src/assets/produtos/*/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

/** slug do produto -> lista de URLs, em ordem alfabética de arquivo */
export const folderImages: Record<string, string[]> = {};

for (const [filePath, url] of Object.entries(modules)) {
  const match = filePath.match(/\/src\/assets\/produtos\/([^/]+)\//);
  if (!match) continue;
  const slug = match[1];
  (folderImages[slug] ??= []).push(url as string);
}

// ordena por nome de arquivo para que o prefixo numérico defina a ordem
const fileNameOf = (url: string) => url.split("/").pop() ?? url;
for (const slug of Object.keys(folderImages)) {
  folderImages[slug].sort((a, b) => fileNameOf(a).localeCompare(fileNameOf(b), "pt-BR"));
}

/** Capa vinda da pasta, se houver. */
export const coverFromFolder = (slug: string): string | undefined => folderImages[slug]?.[0];

/** Galeria vinda da pasta, se houver. */
export const galleryFromFolder = (slug: string): string[] | undefined => {
  const list = folderImages[slug];
  return list && list.length > 0 ? list : undefined;
};
