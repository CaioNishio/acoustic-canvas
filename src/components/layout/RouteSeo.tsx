import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://sonaracusticos.com";
const DEFAULT_TITLE = "Sonar Acústicos — Tratamento Acústico Profissional";
const DEFAULT_DESCRIPTION = "Painéis, difusores, bass traps e projetos de tratamento acústico para estúdios, igrejas, auditórios e empresas.";

const pages: Record<string, { title: string; description: string }> = {
  "/": { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  "/produtos": { title: "Produtos acústicos | Sonar Acústicos", description: "Conheça painéis acústicos, difusores, bass traps, nuvens, biombos e acessórios para controlar o som do seu ambiente." },
  "/solucoes": { title: "Soluções de acústica por ambiente | Sonar Acústicos", description: "Soluções de tratamento e isolamento acústico para estúdios, igrejas, escritórios, restaurantes, auditórios e residências." },
  "/projetos": { title: "Projetos realizados | Sonar Acústicos", description: "Veja projetos e aplicações de tratamento acústico realizados pela Sonar Acústicos." },
  "/calculadora": { title: "Calculadora acústica | Sonar Acústicos", description: "Faça uma estimativa inicial da quantidade de tratamento acústico indicada para seu ambiente." },
  "/orcamento": { title: "Solicite um orçamento acústico | Sonar Acústicos", description: "Envie os dados do seu ambiente e receba uma análise da equipe técnica da Sonar Acústicos." },
  "/contato": { title: "Contato | Sonar Acústicos", description: "Fale com a Sonar Acústicos sobre produtos, projetos e tratamento acústico." },
  "/loja": { title: "Loja de produtos acústicos | Sonar Acústicos", description: "Compre produtos acústicos Sonar com catálogo e checkout seguro pela Shopify." },
  "/conhecimento": { title: "Conteúdo sobre acústica | Sonar Acústicos", description: "Guias e informações práticas sobre tratamento acústico, isolamento, absorção e difusão sonora." },
};

function setMeta(selector: string, value: string) {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = value;
}

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const exact = pages[pathname];
    const section = pathname.startsWith("/produtos/")
      ? pages["/produtos"]
      : pathname.startsWith("/solucoes/")
        ? pages["/solucoes"]
        : pathname.startsWith("/projetos/")
          ? pages["/projetos"]
          : pathname.startsWith("/loja/")
            ? pages["/loja"]
            : pathname.startsWith("/aprender/")
              ? pages["/conhecimento"]
              : undefined;
    const seo = exact || section || { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

    document.title = seo.title;
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[name="twitter:title"]', seo.title);
    setMeta('meta[name="twitter:description"]', seo.description);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = canonicalUrl;
  }, [pathname]);

  return null;
}
