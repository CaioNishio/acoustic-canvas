import { access, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const dist = path.join(root, "dist");
const manifest = JSON.parse(await readFile(path.join(dist, "seo-manifest.json"), "utf8"));
const failures = [];
const hero = await sharp(path.join(dist, "media/hero-products-mobile.webp"), { animated: true }).metadata();
if (hero.pages !== 48 || !hero.hasAlpha || hero.loop !== 0) {
  failures.push("hero mobile: animação de 48 quadros, transparência ou loop perdidos no build");
}
const titles = new Map();
const canonicals = new Set();

function capture(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || "";
}

for (const route of manifest) {
  const relative = route.route.replace(/^\//, "");
  const file = path.join(dist, relative, "index.html");
  try {
    await access(file);
  } catch {
    failures.push(`${route.route}: HTML não gerado`);
    continue;
  }

  const html = await readFile(file, "utf8");
  const title = capture(html, /<title>(.*?)<\/title>/s);
  const description = capture(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const robots = capture(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const canonical = capture(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const expectedCanonical = `https://sonaracusticos.com${route.route === "/" ? "/" : `${route.route}/`}`;

  if (!title) failures.push(`${route.route}: title ausente`);
  if (!description) failures.push(`${route.route}: description ausente`);
  if (robots !== "index, follow") failures.push(`${route.route}: robots inesperado (${robots || "ausente"})`);
  if (canonical !== expectedCanonical) failures.push(`${route.route}: canonical ${canonical || "ausente"} != ${expectedCanonical}`);
  if (canonicals.has(canonical)) failures.push(`${route.route}: canonical duplicado ${canonical}`);
  canonicals.add(canonical);

  const previousTitleRoute = titles.get(title);
  if (previousTitleRoute) failures.push(`${route.route}: title duplicado com ${previousTitleRoute}`);
  titles.set(title, route.route);

  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      for (const entry of entries) {
        if (entry["@type"] === "Product" && (!entry.offers?.price || entry.offers.priceCurrency !== "BRL")) {
          failures.push(`${route.route}: Product sem Offer com preço em BRL`);
        }
      }
    } catch {
      failures.push(`${route.route}: JSON-LD inválido`);
    }
  }
}

const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length !== manifest.length) {
  failures.push(`sitemap: ${sitemapUrls.length} URLs para ${manifest.length} rotas`);
}
for (const route of manifest) {
  const expected = `https://sonaracusticos.com${route.route === "/" ? "/" : `${route.route}/`}`;
  if (!sitemapUrls.includes(expected)) failures.push(`sitemap: URL ausente ${expected}`);
}

const robotsTxt = await readFile(path.join(dist, "robots.txt"), "utf8");
if (!robotsTxt.includes("Sitemap: https://sonaracusticos.com/sitemap.xml")) {
  failures.push("robots.txt: referência ao sitemap ausente");
}

const notFound = await readFile(path.join(dist, "404.html"), "utf8");
if (!/name="robots"\s+content="noindex, follow"/i.test(notFound)) failures.push("404.html: noindex ausente");
if (/rel="canonical"/i.test(notFound)) failures.push("404.html: canonical não deve existir");

const home = await readFile(path.join(dist, "index.html"), "utf8");
if (!/property="og:site_name"\s+content="Sonar Acústicos"/i.test(home)) failures.push("home: og:site_name ausente");
const siteSchemaText = capture(home, /<script\s+id="site-structured-data"[^>]*>([\s\S]*?)<\/script>/i);
try {
  const siteSchema = JSON.parse(siteSchemaText);
  const graph = siteSchema["@graph"] || [];
  const website = graph.find((entry) => entry["@type"] === "WebSite");
  const organization = graph.find((entry) => entry["@type"] === "Organization");
  if (!website?.alternateName?.includes("Sonar")) failures.push("home: WebSite alternateName Sonar ausente");
  if (!organization?.alternateName?.includes("Sonar")) failures.push("home: Organization alternateName Sonar ausente");
  if (!organization?.logo) failures.push("home: logo da Organization ausente");
} catch {
  failures.push("home: site-structured-data inválido");
}

if (failures.length) {
  console.error(`SEO regression: ${failures.length} falha(s)\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`SEO regression: ${manifest.length} rotas indexáveis, canonicals únicos, metadata e JSON-LD válidos.`);
