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

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (app && !p.application.includes(app)) return false;
      if (mat && p.material !== mat) return false;
      if (thick && p.thickness !== thick) return false;
      return true;
    });
  }, [cat, app, mat, thick]);

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

  return (
    <Layout>
      <section className="section-padding relative">
        {/* Geometric decoration */}
        <div className="absolute top-10 right-10 w-40 h-40 border border-primary/10 rotate-12 rounded-lg" />
        <div className="absolute bottom-20 left-5 w-24 h-24 border border-accent/10 rounded-full" />

        <div className="container mx-auto">
          <SectionHeading tag="Catálogo" title="Nossos Produtos" description="Encontre a solução acústica ideal para o seu projeto." />

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            <FilterSelect label="Categoria" value={cat} onChange={setCat} options={categories} />
            <FilterSelect label="Aplicação" value={app} onChange={setApp} options={applications} />
            <FilterSelect label="Material" value={mat} onChange={setMat} options={materialsFilter} />
            <FilterSelect label="Espessura" value={thick} onChange={setThick} options={thicknesses} />
            {(cat || app || mat || thick) && (
              <button
                onClick={() => { setCat(""); setApp(""); setMat(""); setThick(""); }}
                className="text-sm text-primary font-semibold hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
