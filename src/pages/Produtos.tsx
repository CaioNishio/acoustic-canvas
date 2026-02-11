import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { products, categories, applications, materialsFilter, thicknesses } from "@/data/products";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function ProdutosPage() {
  const [cat, setCat] = useState("");
  const [app, setApp] = useState("");
  const [mat, setMat] = useState("");
  const [thick, setThick] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (app && !p.application.includes(app)) return false;
      if (mat && p.material !== mat) return false;
      if (thick && p.thickness !== thick) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.shortDescription.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q) &&
          !(p.subcategory?.toLowerCase().includes(q))
        ) return false;
      }
      return true;
    });
  }, [cat, app, mat, thick, search]);

  const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-background border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:border-primary/40"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );

  const hasFilters = cat || app || mat || thick || search;

  return (
    <Layout>
      <section className="py-16 md:py-24 px-4 md:px-8 bg-background relative overflow-hidden">
        {/* Subtle decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/[0.04] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="container mx-auto relative">
          <SectionHeading tag="Catálogo" title="Nossos Produtos" description="Encontre a solução acústica ideal para o seu projeto." />

          {/* Category chips */}
          <div className="flex flex-wrap gap-2.5 mb-8 justify-center">
            <button
              onClick={() => setCat("")}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                !cat 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "bg-background border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              Todos
            </button>
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setCat(cat === c ? "" : c)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    cat === c 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "bg-background border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {c} <span className="opacity-50">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produto..."
                className="bg-background border border-border rounded-2xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-56 hover:border-primary/40"
              />
            </div>
            <FilterSelect label="Aplicação" value={app} onChange={setApp} options={applications} />
            <FilterSelect label="Material" value={mat} onChange={setMat} options={materialsFilter} />
            <FilterSelect label="Espessura" value={thick} onChange={setThick} options={thicknesses} />
            {hasFilters && (
              <button
                onClick={() => { setCat(""); setApp(""); setMat(""); setThick(""); setSearch(""); }}
                className="inline-flex items-center gap-1.5 text-sm text-secondary font-semibold hover:text-secondary/80 transition-colors"
              >
                <X size={14} /> Limpar
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground text-center mb-8">
            {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16 text-lg">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
