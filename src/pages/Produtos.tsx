import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/sonar/ProductCard";
import ProductCategoryShowcase from "@/components/sonar/ProductCategoryShowcase";
import ShopifyProductCard from "@/components/sonar/ShopifyProductCard";
import { useShopifyCatalogMedia } from "@/hooks/useShopifyCatalogMedia";
import { PRODUCTS_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { SHOPIFY_CATALOG_MAP } from "@/lib/shopifyCatalog";
import { SonarButton } from "@/components/sonar/Button";
import {
  products,
  categories,
  applications,
  materialsFilter,
  thicknesses,
} from "@/data/products";
import "@/components/gik/gik.css";

type SortKey = "destaque" | "nome" | "categoria";

export default function ProdutosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cat, setCat] = useState(searchParams.get("categoria") ?? "");
  const [app, setApp] = useState("");
  const [mat, setMat] = useState("");
  const [thick, setThick] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("destaque");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [shopifyLoading, setShopifyLoading] = useState(true);
  const { contentFor, imagesFor } = useShopifyCatalogMedia();

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100 });
        if (active) setShopifyProducts(response?.data?.products?.edges ?? []);
      } catch (error) {
        console.warn("[shopify] Falha ao atualizar os produtos compráveis.", error);
      } finally {
        if (active) setShopifyLoading(false);
      }
    };
    void refresh();
    const interval = window.setInterval(refresh, 120_000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const localSlugByHandle = useMemo(() => {
    const entries = Object.entries(SHOPIFY_CATALOG_MAP)
      .filter((entry): entry is [string, { handle: string; sku: string | null }] => Boolean(entry[1]))
      .map(([slug, link]) => [link.handle, slug] as const);
    return new Map(entries);
  }, []);

  const shopifyByHandle = useMemo(
    () => new Map(shopifyProducts.map((product) => [product.node.handle, product])),
    [shopifyProducts],
  );

  const unmatchedShopifyProducts = useMemo(() => {
    if (cat || app || mat || thick) return [];
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return shopifyProducts.filter((product) => {
      if (localSlugByHandle.has(product.node.handle)) return false;
      if (!query) return true;
      return `${product.node.title} ${product.node.description}`.toLocaleLowerCase("pt-BR").includes(query);
    });
  }, [app, cat, localSlugByHandle, mat, search, shopifyProducts, thick]);

  const visibleShopifyProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    const list = shopifyProducts.filter((product) => {
      const searchable = `${product.node.title} ${product.node.description} ${product.node.productType} ${product.node.vendor} ${product.node.tags.join(" ")}`.toLocaleLowerCase("pt-BR");
      if (cat && product.node.productType !== cat && !product.node.tags.includes(cat)) return false;
      if (app && !searchable.includes(app.toLocaleLowerCase("pt-BR"))) return false;
      if (mat && !searchable.includes(mat.toLocaleLowerCase("pt-BR"))) return false;
      if (thick && !searchable.includes(thick.toLocaleLowerCase("pt-BR"))) return false;
      return !query || searchable.includes(query);
    });
    if (sort === "nome") {
      return [...list].sort((a, b) => a.node.title.localeCompare(b.node.title, "pt-BR"));
    }
    if (sort === "categoria") {
      return [...list].sort((a, b) =>
        a.node.productType.localeCompare(b.node.productType, "pt-BR") ||
        a.node.title.localeCompare(b.node.title, "pt-BR"),
      );
    }
    return list;
  }, [app, cat, mat, search, shopifyProducts, sort, thick]);

  const shopifyCategories = useMemo(
    () => [...new Set(shopifyProducts.map((product) => product.node.productType).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [shopifyProducts],
  );

  // a categoria vive na URL: links do menu chegam já filtrados e o
  // endereço continua compartilhável quando o filtro muda aqui
  const paramCat = searchParams.get("categoria") ?? "";
  useEffect(() => {
    setCat(paramCat);
  }, [paramCat]);

  const selectCategory = (next: string) => {
    setCat(next);
    const params = new URLSearchParams(searchParams);
    if (next) params.set("categoria", next);
    else params.delete("categoria");
    params.set("catalogo", "1");
    setSearchParams(params);
  };

  const filtered = useMemo(() => {
    const synchronizedProducts = products.map((product) => {
      const shopify = contentFor(product.slug);
      return {
        ...product,
        name: shopify?.title || product.name,
        shortDescription: shopify?.description || product.shortDescription,
      };
    });

    const list = synchronizedProducts.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (app && !p.application.includes(app)) return false;
      if (mat && p.material !== mat) return false;
      if (thick && p.thickness !== thick) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          Boolean(p.subcategory?.toLowerCase().includes(q))
        );
      }
      return true;
    });

    if (sort === "nome") return [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (sort === "categoria")
      return [...list].sort(
        (a, b) => a.category.localeCompare(b.category, "pt-BR") || a.name.localeCompare(b.name, "pt-BR"),
      );
    return list;
  }, [cat, app, mat, thick, search, sort, contentFor]);

  const hasFilters = Boolean(cat || app || mat || thick || search);
  const clearAll = () => {
    selectCategory("");
    setApp("");
    setMat("");
    setThick("");
    setSearch("");
  };

  const selectClass =
    "min-h-11 cursor-pointer appearance-none rounded-full border border-snr-mineral-100 bg-snr-white px-5 pr-9 text-sm text-snr-graphite transition-colors duration-micro ease-snr hover:border-snr-mineral-300";

  return (
    <Layout>
      {!cat && searchParams.get("catalogo") !== "1" ? <ProductCategoryShowcase categories={categories} products={products} onSelect={selectCategory} /> : <div className="snr-home bg-snr-white text-snr-graphite">
        {/* Cabeçalho da coleção */}
        <section className="bg-snr-paper pb-4 pt-6 sm:pt-8">
          <div className="snr-container flex flex-wrap items-end justify-between gap-5">
            <div><p className="snr-caption snr-rule-editorial text-snr-mineral-700">Catálogo</p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-4xl">{cat || "Todos os produtos"}</h1></div>
            <p className="snr-body text-snr-mineral-700">{filtered.length} {filtered.length === 1 ? "produto" : "produtos"}</p>
          </div>
        </section>

        {/* Barra de filtros */}
        <section className="border-b border-snr-mineral-100 bg-snr-white py-4">
          <div className="snr-container">
            <div className="flex items-center justify-between gap-3 md:hidden">
              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                aria-expanded={filtersOpen}
                aria-controls="mobile-product-filters"
                className="inline-flex min-h-11 flex-1 items-center justify-between rounded-full border border-snr-mineral-100 bg-snr-white px-5 text-sm font-semibold text-snr-graphite"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  Filtros {hasFilters ? "ativos" : ""}
                </span>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                />
              </button>
              <span className="shrink-0 text-sm text-snr-mineral-700">{filtered.length} produtos</span>
            </div>

            <div id="mobile-product-filters" className="mt-4 md:mt-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Pills de categoria */}
              <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
                <button
                  type="button"
                  onClick={() => selectCategory("")}
                  aria-pressed={!cat}
                  className={`min-h-11 shrink-0 cursor-pointer rounded-full border px-4 text-xs font-medium transition-colors duration-micro ease-snr ${
                    !cat
                      ? "border-snr-petrol bg-snr-petrol text-snr-white"
                      : "border-snr-mineral-100 text-snr-graphite hover:border-snr-mineral-300"
                  }`}
                >
                  Todos
                </button>
                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c).length;
                  if (!count) return null;
                  const active = cat === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => selectCategory(c)}
                      aria-pressed={active}
                      className={`min-h-11 shrink-0 cursor-pointer rounded-full border px-4 text-xs font-medium transition-colors duration-micro ease-snr ${
                        active
                          ? "border-snr-petrol bg-snr-petrol text-snr-white"
                          : "border-snr-mineral-100 text-snr-graphite hover:border-snr-mineral-300"
                      }`}
                    >
                      {c} <span className="font-medium text-foreground">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Ordenação */}
              <label className="flex items-center gap-2 text-sm text-snr-mineral-700">
                <span className="whitespace-nowrap">Ordenar por</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className={selectClass}
                >
                  <option value="destaque">Destaque</option>
                  <option value="nome">Nome</option>
                  <option value="categoria">Categoria</option>
                </select>
              </label>
            </div>

            {/* Busca e filtros secundários */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-auto sm:flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-snr-mineral-500"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar produto"
                  aria-label="Buscar produto"
                  className="min-h-11 w-full rounded-full border border-snr-mineral-100 bg-snr-white pl-11 pr-4 text-sm text-snr-graphite placeholder:text-snr-mineral-500 transition-colors duration-micro ease-snr hover:border-snr-mineral-300"
                />
              </div>

              <select value={app} onChange={(e) => setApp(e.target.value)} aria-label="Aplicação" className={`${selectClass} ${filtersOpen ? "" : "hidden md:block"}`}>
                <option value="">Aplicação</option>
                {applications.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <select value={mat} onChange={(e) => setMat(e.target.value)} aria-label="Material" className={`${selectClass} ${filtersOpen ? "" : "hidden md:block"}`}>
                <option value="">Material</option>
                {materialsFilter.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <select value={thick} onChange={(e) => setThick(e.target.value)} aria-label="Espessura" className={`${selectClass} ${filtersOpen ? "" : "hidden md:block"}`}>
                <option value="">Espessura</option>
                {thicknesses.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm font-medium text-snr-ocean transition-colors duration-micro ease-snr hover:text-snr-petrol"
                >
                  <X size={14} aria-hidden="true" /> Limpar filtros
                </button>
              )}

              <span className="ml-auto text-sm text-snr-mineral-700">
                {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
              </span>
            </div>
            </div>
          </div>
        </section>

        {/* Grade */}
        <section className="py-5 sm:py-6">
          <div className="snr-container">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filtered.map((product, i) => (
                  <Fragment key={product.slug}>
                    {(() => {
                      const link = SHOPIFY_CATALOG_MAP[product.slug as keyof typeof SHOPIFY_CATALOG_MAP];
                      const liveProduct = link ? shopifyByHandle.get(link.handle) : undefined;
                      return liveProduct ? (
                        <ShopifyProductCard
                          product={liveProduct}
                          localSlug={product.slug}
                          coverImage={product.curatedCover ? product.image : undefined}
                        />
                      ) : (
                        <ProductCard
                          product={product}
                          imageOverride={product.curatedCover ? undefined : imagesFor(product.slug)[0]}
                        />
                      );
                    })()}
                    {/* cartão de consultoria intercalado, como na referência */}
                    {i === 6 && (
                      <div className="hidden flex-col justify-end rounded-2xl bg-snr-graphite p-7 text-snr-white sm:flex">
                        <h3 className="snr-card-title text-snr-white">
                          Não sabe por onde começar?
                        </h3>
                        <p className="mt-3 text-[13px] leading-relaxed text-snr-mineral-300">
                          Receba uma recomendação gratuita e personalizada dos nossos especialistas
                          em acústica.
                        </p>
                        <div className="snr-on-dark mt-6">
                          <SonarButton to="/orcamento" variant="onDark">
                            Consultoria gratuita
                          </SonarButton>
                        </div>
                      </div>
                    )}
                  </Fragment>
                ))}
                {unmatchedShopifyProducts.map((product) => (
                  <ShopifyProductCard key={product.node.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="snr-body text-snr-mineral-700">
                  Nenhum produto encontrado com esses filtros.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-4 inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-snr-ocean hover:text-snr-petrol"
                >
                  Limpar filtros
                </button>
              </div>
            )}
            {shopifyLoading && (
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-snr-mineral-700">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Atualizando dados da Shopify
              </div>
            )}
          </div>
        </section>
      </div>}
    </Layout>
  );
}
