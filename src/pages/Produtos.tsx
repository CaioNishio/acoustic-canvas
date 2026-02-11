import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { products, categories, applications, materialsFilter, thicknesses } from "@/data/products";

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
      className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
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
      <section className="section-padding relative">
        <div className="absolute top-10 right-10 w-40 h-40 border border-primary/10 rotate-12 rounded-lg" />
        <div className="absolute bottom-20 left-5 w-24 h-24 border border-accent/10 rounded-full" />

        <div className="container mx-auto">
          <SectionHeading tag="Catálogo" title="Nossos Produtos" description="Encontre a solução acústica ideal para o seu projeto." />

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <button
              onClick={() => setCat("")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                !cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                    cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {c} <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all w-48"
            />
            <FilterSelect label="Aplicação" value={app} onChange={setApp} options={applications} />
            <FilterSelect label="Material" value={mat} onChange={setMat} options={materialsFilter} />
            <FilterSelect label="Espessura" value={thick} onChange={setThick} options={thicknesses} />
            {hasFilters && (
              <button
                onClick={() => { setCat(""); setApp(""); setMat(""); setThick(""); setSearch(""); }}
                className="text-sm text-primary font-semibold hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground text-center mb-6">
            {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
