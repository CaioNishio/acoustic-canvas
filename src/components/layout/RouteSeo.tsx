import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { products } from "@/data/products";
import { productPrices } from "@/data/productPrices";
import { solutions } from "@/data/solutions";
import { projects } from "@/data/projects";
import { educationalArticles } from "@/data/educationalArticles";

const SITE_URL = "https://sonaracusticos.com";
const DEFAULT_TITLE = "Sonar Acústicos — Tratamento Acústico Profissional";
const DEFAULT_DESCRIPTION = "Painéis, difusores, bass traps e projetos de tratamento acústico para estúdios, igrejas, auditórios e empresas.";

type SeoEntry = {
  title: string;
  description: string;
  robots?: string;
  type?: "website" | "article" | "product";
  structuredData?: Record<string, unknown>[];
};

const pages: Record<string, SeoEntry> = {
  "/": { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  "/produtos": { title: "Produtos acústicos | Sonar Acústicos", description: "Conheça painéis acústicos, difusores, bass traps, nuvens, biombos e acessórios para controlar o som do seu ambiente." },
  "/solucoes": { title: "Soluções de acústica por ambiente | Sonar Acústicos", description: "Soluções de tratamento e isolamento acústico para estúdios, igrejas, escritórios, restaurantes, auditórios e residências." },
  "/projetos": { title: "Projetos realizados | Sonar Acústicos", description: "Veja projetos e aplicações de tratamento acústico realizados pela Sonar Acústicos." },
  "/calculadora": { title: "Calculadora acústica | Sonar Acústicos", description: "Faça uma estimativa inicial da quantidade de tratamento acústico indicada para seu ambiente." },
  "/orcamento": { title: "Solicite um orçamento acústico | Sonar Acústicos", description: "Envie os dados do seu ambiente e receba uma análise da equipe técnica da Sonar Acústicos." },
  "/contato": { title: "Contato | Sonar Acústicos", description: "Fale com a Sonar Acústicos sobre produtos, projetos e tratamento acústico." },
  "/conhecimento": { title: "Conteúdo sobre acústica | Sonar Acústicos", description: "Guias e informações práticas sobre tratamento acústico, isolamento, absorção e difusão sonora." },
  "/admin-login": { title: "Acesso administrativo | Sonar Acústicos", description: "Área restrita da Sonar Acústicos.", robots: "noindex, nofollow" },
  "/envio-fotos": { title: "Envio de fotos | Sonar Acústicos", description: "Área de envio de imagens para avaliação técnica.", robots: "noindex, nofollow" },
  "/gik-home": { title: "Demonstração interna | Sonar Acústicos", description: "Área interna de demonstração.", robots: "noindex, nofollow" },
};

function upsertMeta(selector: string, attributes: Record<string, string>, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([name, attributeValue]) => element?.setAttribute(name, attributeValue));
    document.head.appendChild(element);
  }
  element.content = value;
}

function breadcrumbs(pathname: string, name: string, parentPath: string, parentName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: parentName, item: `${SITE_URL}${parentPath}/` },
      { "@type": "ListItem", position: 3, name, item: `${SITE_URL}${pathname}/` },
    ],
  };
}

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
    const exact = pages[normalizedPath];
    const product = normalizedPath.startsWith("/produtos/")
      ? products.find(({ slug }) => `/produtos/${slug}` === normalizedPath)
      : undefined;
    const pricing = product ? productPrices[product.slug] : undefined;
    const productSeo = product
      ? {
          title: `${product.name} | Sonar Acústicos`,
          description: product.shortDescription,
          type: "product" as const,
          structuredData: [
            ...(pricing?.basePrice > 0 ? [{
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                description: product.shortDescription,
                image: product.image,
                url: `${SITE_URL}${normalizedPath}/`,
                brand: { "@type": "Brand", name: "Sonar Acústicos" },
                offers: {
                  "@type": "Offer",
                  url: `${SITE_URL}${normalizedPath}/`,
                  priceCurrency: "BRL",
                  price: pricing.basePrice.toFixed(2),
                },
              }] : []),
            breadcrumbs(normalizedPath, product.name, "/produtos", "Produtos acústicos"),
          ],
        }
      : undefined;
    const solution = solutions.find(({ slug }) => `/solucoes/${slug}` === normalizedPath);
    const solutionSeo = solution
      ? {
          title: `${solution.title} | Soluções acústicas Sonar`,
          description: solution.shortDescription,
          structuredData: [breadcrumbs(normalizedPath, solution.title, "/solucoes", "Soluções acústicas")],
        }
      : undefined;
    const project = projects.find(({ slug }) => `/projetos/${slug}` === normalizedPath);
    const projectSeo = project
      ? {
          title: `${project.title} | Projetos Sonar Acústicos`,
          description: project.description,
          structuredData: [breadcrumbs(normalizedPath, project.title, "/projetos", "Projetos")],
        }
      : undefined;
    const article = educationalArticles.find(({ slug }) => `/aprender/${slug}` === normalizedPath);
    const articleSeo = article
      ? {
          title: `${article.title} | Sonar Acústicos`,
          description: article.desc,
          type: "article" as const,
          structuredData: [
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.desc,
              image: `${SITE_URL}/media/hero-products-mobile.webp`,
              datePublished: "2026-09-10",
              dateModified: "2026-09-10",
              mainEntityOfPage: `${SITE_URL}${normalizedPath}/`,
              author: { "@type": "Organization", name: "Sonar Acústicos", url: SITE_URL },
              publisher: { "@type": "Organization", name: "Sonar Acústicos", url: SITE_URL, logo: { "@type": "ImageObject", url: "https://sonaracusticos.com/lovable-uploads/3ca143a0-e798-45d3-b9c3-9499e7d7d501.png" } },
            },
            breadcrumbs(normalizedPath, article.title, "/conhecimento", "Conteúdo sobre acústica"),
          ],
        }
      : undefined;
    // Remote products are resolved by Shopify, not by the local product registry.
    // An absent local slug is not evidence that a remote product is missing.
    const remoteProduct = /^\/(?:loja|produtos\/shopify)\/[^/]+$/.test(normalizedPath);
    const section: SeoEntry | undefined = remoteProduct
      ? { title: "Produto acústico | Sonar Acústicos", description: pages["/produtos"].description }
      : normalizedPath.startsWith("/envio-fotos/")
        ? pages["/envio-fotos"]
        : normalizedPath === "/loja" ? pages["/produtos"] : undefined;
    const seo: SeoEntry = exact || productSeo || solutionSeo || projectSeo || articleSeo || section || {
      title: "Página não encontrada | Sonar Acústicos",
      description: DEFAULT_DESCRIPTION,
      robots: "noindex, follow",
    };
    // Static pages are served as directories by Netlify; match its final URL.
    const canonicalUrl = `${SITE_URL}${normalizedPath === "/" ? "/" : `${normalizedPath}/`}`;

    document.title = seo.title;
    upsertMeta('meta[name="description"]', { name: "description" }, seo.description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, seo.robots || "index, follow");
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, seo.title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, seo.description);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, seo.type || "website");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, seo.title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, seo.description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let routeSchema = document.head.querySelector<HTMLScriptElement>("#route-structured-data");
    if (seo.structuredData?.length) {
      if (!routeSchema) {
        routeSchema = document.createElement("script");
        routeSchema.id = "route-structured-data";
        routeSchema.type = "application/ld+json";
        document.head.appendChild(routeSchema);
      }
      routeSchema.textContent = JSON.stringify(seo.structuredData);
    } else {
      routeSchema?.remove();
    }
  }, [pathname]);

  return null;
}
