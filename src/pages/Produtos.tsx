import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/sonar/ProductCard";
import { useShopifyCatalogMedia } from "@/hooks/useShopifyCatalogMedia";
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
  const { imagesFor } = useShopifyCatalogMedia();

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
    setSearchParams(params, { replace: true });
  };

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (app && !p.application.includes(app)) return false;
      if (mat && p.material !== mat) return false;
      if (thick && p.thickness !== thick) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
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
  }, [cat, app, mat, thick, search, sort]);

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
      <div className="snr-home bg-snr-white text-snr-graphite">
        {/* Cabeçalho da coleção */}
        <section className="border-b border-snr-mineral-100 bg-snr-paper py-14">
          <div className="snr-container">
            <p className="snr-caption snr-rule-editorial text-snr-mineral-700">Catálogo</p>
            <h1 className="snr-display mt-4">Todos os produtos</h1>
            <p className="snr-body snr-measure mt-4 text-snr-mineral-700">
              Painéis, bass traps, difusores e soluções completas — fabricados sob medida para o seu
              ambiente.
            </p>
          </div>
        </section>

        {/* Barra de filtros */}
        <section className="sticky top-0 z-30 border-b border-snr-mineral-100 bg-snr-white/95 py-4 backdrop-blur-md">
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

            <div id="mobile-product-filters" className={`${filtersOpen ? "mt-4 block" : "hidden"} md:block`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Pills de categoria */}
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => selectCategory("")}
                  aria-pressed={!cat}
                  className={`min-h-11 cursor-pointer rounded-full border px-5 text-sm font-medium transition-colors duration-micro ease-snr ${
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
                      onClick={() => selectCategory(active ? "" : c)}
                      aria-pressed={active}
                      className={`min-h-11 cursor-pointer rounded-full border px-5 text-sm font-medium transition-colors duration-micro ease-snr ${
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
              <div className="relative">
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
                  className="min-h-11 w-60 rounded-full border border-snr-mineral-100 bg-snr-white pl-11 pr-4 text-sm text-snr-graphite placeholder:text-snr-mineral-500 transition-colors duration-micro ease-snr hover:border-snr-mineral-300"
                />
              </div>

              <select value={app} onChange={(e) => setApp(e.target.value)} aria-label="Aplicação" className={selectClass}>
                <option value="">Aplicação</option>
                {applications.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <select value={mat} onChange={(e) => setMat(e.target.value)} aria-label="Material" className={selectClass}>
                <option value="">Material</option>
                {materialsFilter.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <select value={thick} onChange={(e) => setThick(e.target.value)} aria-label="Espessura" className={selectClass}>
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
        <section className="snr-section">
          <div className="snr-container">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product, i) => (
                  <Fragment key={product.slug}>
                    <ProductCard product={product} imageOverride={imagesFor(product.slug)[0]} />
                    {/* cartão de consultoria intercalado, como na referência */}
                    {i === 6 && (
                      <div className="flex flex-col justify-end rounded-2xl bg-snr-graphite p-7 text-snr-white">
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
          </div>
        </section>
      </div>
    </Layout>
  );
}
