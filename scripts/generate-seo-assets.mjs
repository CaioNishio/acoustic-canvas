import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://sonaracusticos.com";
const root = process.cwd();
const dist = path.join(root, "dist");

const staticRoutes = [
  ["/", "Sonar Acústicos — Tratamento Acústico Profissional", "Painéis, difusores, bass traps e projetos de tratamento acústico para estúdios, igrejas, auditórios e empresas."],
  ["/produtos", "Produtos acústicos | Sonar Acústicos", "Conheça painéis acústicos, difusores, bass traps, nuvens, biombos e acessórios para controlar o som do seu ambiente."],
  ["/solucoes", "Soluções de acústica por ambiente | Sonar Acústicos", "Soluções de tratamento e isolamento acústico para estúdios, igrejas, escritórios, restaurantes, auditórios e residências."],
  ["/projetos", "Projetos realizados | Sonar Acústicos", "Veja projetos e aplicações de tratamento acústico realizados pela Sonar Acústicos."],
  ["/calculadora", "Calculadora acústica | Sonar Acústicos", "Faça uma estimativa inicial da quantidade de tratamento acústico indicada para seu ambiente."],
  ["/orcamento", "Solicite um orçamento acústico | Sonar Acústicos", "Envie os dados do seu ambiente e receba uma análise da equipe técnica da Sonar Acústicos."],
  ["/contato", "Contato | Sonar Acústicos", "Fale com a Sonar Acústicos sobre produtos, projetos e tratamento acústico."],
  ["/conhecimento", "Conteúdo sobre acústica | Sonar Acústicos", "Guias e informações práticas sobre tratamento acústico, isolamento, absorção e difusão sonora."],
];

const internalRoutes = [
  ["/admin-login", "Acesso administrativo | Sonar Acústicos", "Área restrita da Sonar Acústicos."],
  ["/envio-fotos", "Envio de fotos | Sonar Acústicos", "Área de envio de imagens para avaliação técnica."],
  ["/gik-home", "Demonstração interna | Sonar Acústicos", "Área interna de demonstração."],
];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function extract(source, pattern, label, minimum = 1) {
  const records = [...source.matchAll(pattern)].map((match) => ({
    slug: match[1],
    name: match[2],
    description: match[3],
  }));
  if (records.length < minimum) {
    throw new Error(`Extração de ${label} incompleta: somente ${records.length} registro(s) encontrado(s).`);
  }
  return records;
}

function breadcrumb(route, name, parentRoute, parentName) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: parentName, item: `${SITE_URL}${parentRoute}/` },
      { "@type": "ListItem", position: 3, name, item: `${SITE_URL}${route}/` },
    ],
  };
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fallbackHeading(route) {
  if (route.route === "/") return "Tratamento acústico, painel acústico e isolamento acústico";
  if (route.route === "/produtos") return "Produtos acústicos para tratamento e controle do som";
  if (route.route === "/solucoes") return "Soluções de tratamento acústico por ambiente";
  if (route.route === "/projetos") return "Projetos de tratamento acústico e isolamento acústico";
  if (route.route === "/conhecimento") return "Conhecimento sobre tratamento acústico e isolamento acústico";
  if (route.route === "/orcamento") return "Solicite um orçamento de tratamento acústico";
  if (route.route === "/contato") return "Fale com a Sonar Acústicos";
  return route.title.split(" | ")[0];
}

function fallbackLinks(route) {
  const links = [
    ["/produtos/", "Ver produtos acústicos"],
    ["/solucoes/", "Encontrar uma solução por ambiente"],
    ["/conhecimento/", "Ler guias de acústica"],
    ["/orcamento/", "Solicitar análise e orçamento"],
  ];
  if (route.route.startsWith("/produtos/")) links.unshift(["/produtos/", "Voltar aos produtos acústicos"]);
  if (route.route.startsWith("/aprender/")) links.unshift(["/calculadora/", "Calcular uma estimativa para o ambiente"]);
  return links;
}

function fallbackCopy(route) {
  if (route.route.startsWith("/produtos/")) {
    return `Conheça ${route.title.split(" | ")[0]} para controlar reflexões, reverberação e conforto sonoro. A escolha do produto depende do ambiente, da faixa de frequência e do objetivo do projeto. Consulte as especificações, veja aplicações relacionadas e solicite orientação da Sonar Acústicos antes de definir quantidade e posicionamento.`;
  }
  if (route.route.startsWith("/aprender/")) {
    return `Este guia da Sonar Acústicos explica ${route.title.split(" | ")[0].toLowerCase()} com linguagem prática e critérios técnicos. Use o conteúdo para entender tratamento acústico, isolamento acústico, painéis, difusão e absorção; depois compare a recomendação com as características reais do seu ambiente.`;
  }
  if (route.route === "/produtos") {
    return "Encontre painéis acústicos, nuvens acústicas, bass traps, baffles, difusores, biombos e materiais para projetos residenciais, corporativos, comerciais e profissionais. Navegue por categoria e peça uma recomendação para o seu ambiente.";
  }
  if (route.route === "/solucoes") {
    return "Escolha a solução de tratamento acústico ou isolamento acústico de acordo com o uso do espaço. A Sonar atende estúdios, salas de reunião, igrejas, auditórios, restaurantes, escritórios e residências com orientação técnica.";
  }
  if (route.route === "/projetos") {
    return "Veja referências de ambientes com tratamento acústico, painéis, baffles, nuvens e difusores. Cada projeto deve considerar geometria, superfícies, uso do espaço, ruído e objetivo de conforto ou desempenho sonoro.";
  }
  if (route.route === "/conhecimento") {
    return "Aprenda a diferenciar tratamento acústico de isolamento acústico, posicionar painéis, controlar graves com bass traps e avaliar reverberação. Os guias ajudam a preparar um diagnóstico antes de comprar materiais.";
  }
  return "A Sonar Acústicos combina orientação técnica, produtos e soluções personalizadas para melhorar a qualidade sonora de ambientes. Envie as dimensões, fotos e objetivo do espaço para receber um próximo passo adequado ao seu projeto.";
}

function fallbackHtml(route) {
  const heading = fallbackHeading(route);
  const links = fallbackLinks(route)
    .map(([href, label]) => `<a href="${href}">${escapeText(label)}</a>`)
    .join(" ");
  return `<section id="seo-fallback" aria-labelledby="seo-fallback-title"><h1 id="seo-fallback-title">${escapeText(heading)}</h1><p>${escapeText(route.description)}</p><p>${escapeText(fallbackCopy(route))}</p><nav aria-label="Links relacionados">${links}</nav></section>`;
}

function replaceMeta(html, { route, title, description, robots = "index, follow", type = "website", structuredData = [] }) {
  const canonical = `${SITE_URL}${route === "/" ? "/" : `${route}/`}`;
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  let output = html
    .replace(/<title>.*?<\/title>/s, `<title>${safeTitle}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/, `$1${safeDescription}$2`)
    .replace(/(<meta\s+name="robots"\s+content=")[^"]*("\s*\/?>)/, `$1${robots}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/?>)/, `$1${safeTitle}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/?>)/, `$1${safeDescription}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*("\s*\/?>)/, `$1${canonical}$2`)
    .replace(/(<meta\s+property="og:type"\s+content=")[^"]*("\s*\/?>)/, `$1${type}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*("\s*\/?>)/, `$1${safeTitle}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*("\s*\/?>)/, `$1${safeDescription}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*("\s*\/?>)/, `$1${canonical}$2`);

  if (structuredData.length) {
    const json = JSON.stringify(structuredData).replaceAll("<", "\\u003c");
    output = output.replace("</head>", `<script id="route-structured-data" type="application/ld+json">${json}</script>\n  </head>`);
  }
  output = output.replace('<div id="root"></div>', `<div id="root"></div>${fallbackHtml({ route, title, description })}`);
  return output;
}

async function writeRoute(template, route) {
  const relative = route.route.replace(/^\//, "");
  const directory = relative ? path.join(dist, relative) : dist;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), replaceMeta(template, route), "utf8");
}

const [template, productsSource, pricesSource, solutionsSource, projectsSource, articlesSource] = await Promise.all([
  readFile(path.join(dist, "index.html"), "utf8"),
  readFile(path.join(root, "src", "data", "products.ts"), "utf8"),
  readFile(path.join(root, "src", "data", "productPrices.ts"), "utf8"),
  readFile(path.join(root, "src", "data", "solutions.ts"), "utf8"),
  readFile(path.join(root, "src", "data", "projects.ts"), "utf8"),
  readFile(path.join(root, "src", "data", "educationalArticles.ts"), "utf8"),
]);

const products = extract(productsSource, /slug:\s*"([^"]+)"[\s\S]{0,700}?name:\s*"([^"]+)"[\s\S]{0,700}?shortDescription:\s*"([^"]+)"/g, "produtos", 10);
const productPrices = new Map(
  [...pricesSource.matchAll(/"([^"]+)":\s*\{\s*basePrice:\s*([0-9]+(?:\.[0-9]+)?)/g)]
    .map((match) => [match[1], Number(match[2])]),
);
const solutions = extract(solutionsSource, /slug:\s*"([^"]+)"[\s\S]{0,500}?title:\s*"([^"]+)"[\s\S]{0,500}?shortDescription:\s*"([^"]+)"/g, "soluções");
const projects = extract(projectsSource, /slug:\s*"([^"]+)"[\s\S]{0,500}?title:\s*"([^"]+)"[\s\S]{0,500}?description:\s*"([^"]+)"/g, "projetos");
const articles = extract(articlesSource, /slug:\s*"([^"]+)"[\s\S]{0,500}?title:\s*"([^"]+)"[\s\S]{0,500}?desc:\s*"([^"]+)"/g, "artigos");

const routes = [
  ...staticRoutes.map(([route, title, description]) => ({ route, title, description })),
  ...products.map((item) => {
    const route = `/produtos/${item.slug}`;
    const price = productPrices.get(item.slug) || 0;
    return {
      route,
      title: `${item.name} | Sonar Acústicos`,
      description: item.description,
      type: "product",
      structuredData: [
        ...(price > 0 ? [{
          "@context": "https://schema.org",
          "@type": "Product",
          name: item.name,
          description: item.description,
          image: `${SITE_URL}/media/hero-products-mobile.webp`,
          url: `${SITE_URL}${route}/`,
          brand: { "@type": "Brand", name: "Sonar Acústicos" },
          offers: { "@type": "Offer", url: `${SITE_URL}${route}/`, priceCurrency: "BRL", price: price.toFixed(2) },
        }] : []),
        breadcrumb(route, item.name, "/produtos", "Produtos acústicos"),
      ],
    };
  }),
  ...solutions.map((item) => {
    const route = `/solucoes/${item.slug}`;
    return { route, title: `${item.name} | Soluções acústicas Sonar`, description: item.description, structuredData: [breadcrumb(route, item.name, "/solucoes", "Soluções acústicas")] };
  }),
  ...projects.map((item) => {
    const route = `/projetos/${item.slug}`;
    return { route, title: `${item.name} | Projetos Sonar Acústicos`, description: item.description, structuredData: [breadcrumb(route, item.name, "/projetos", "Projetos")] };
  }),
  ...articles.map((item) => {
    const route = `/aprender/${item.slug}`;
    return {
      route,
      title: `${item.name} | Sonar Acústicos`,
      description: item.description,
      type: "article",
      structuredData: [
        { "@context": "https://schema.org", "@type": "Article", headline: item.name, description: item.description, image: `${SITE_URL}/media/hero-products-mobile.webp`, datePublished: "2026-09-10", dateModified: "2026-09-10", mainEntityOfPage: `${SITE_URL}${route}/`, author: { "@type": "Organization", name: "Sonar Acústicos", url: SITE_URL }, publisher: { "@type": "Organization", name: "Sonar Acústicos", url: SITE_URL, logo: { "@type": "ImageObject", url: "https://sonaracusticos.com/lovable-uploads/3ca143a0-e798-45d3-b9c3-9499e7d7d501.png" } } },
        breadcrumb(route, item.name, "/conhecimento", "Conteúdo sobre acústica"),
      ],
    };
  }),
];

await Promise.all([
  ...routes.map((route) => writeRoute(template, route)),
  ...internalRoutes.map(([route, title, description]) =>
    writeRoute(template, { route, title, description, robots: "noindex, nofollow" })),
]);

const notFound = replaceMeta(template, {
  route: "/404",
  title: "Página não encontrada | Sonar Acústicos",
  description: "A página solicitada não foi encontrada.",
  robots: "noindex, follow",
}).replace(/<link\s+rel="canonical"[^>]*>\s*/i, "");
await writeFile(path.join(dist, "404.html"), notFound, "utf8");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map(({ route }) => `  <url><loc>${SITE_URL}${route === "/" ? "/" : `${route}/`}</loc></url>`)
  .join("\n")}\n</urlset>\n`;
await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
await writeFile(path.join(dist, "seo-manifest.json"), JSON.stringify(routes, null, 2), "utf8");

console.log(`SEO: ${routes.length} páginas indexáveis geradas (${products.length} produtos, ${solutions.length} soluções, ${projects.length} projetos e ${articles.length} artigos).`);
