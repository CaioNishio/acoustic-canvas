import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/data/products";

export default function ProdutoDetalhePage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <p className="text-muted-foreground">Produto não encontrado.</p>
          <Link to="/produtos" className="text-primary mt-4 inline-block">Voltar aos produtos</Link>
        </div>
      </Layout>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto">
          <Link to="/produtos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft size={14} /> Voltar aos produtos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card overflow-hidden">
                <img src={product.gallery[0] || product.image} alt={product.name} className="w-full aspect-square object-cover" />
              </div>
              {product.gallery.length > 1 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {product.gallery.slice(1).map((img, i) => (
                    <div key={i} className="glass-card overflow-hidden">
                      <img src={img} alt="" className="w-full aspect-square object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">{product.category}</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
              <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

              {/* Specs */}
              <div className="mt-8">
                <h3 className="font-display font-semibold text-lg mb-3">Especificações Técnicas</h3>
                <div className="glass-card divide-y divide-border">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex justify-between px-4 py-3 text-sm">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="mt-8">
                <h3 className="font-display font-semibold text-lg mb-3">Materiais</h3>
                <ul className="space-y-1">
                  {product.materials.map((m) => (
                    <li key={m} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/orcamento"
                  className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  Solicitar Orçamento <ArrowRight size={16} />
                </Link>
                <button className="px-6 py-3 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors inline-flex items-center gap-2">
                  <Download size={16} /> Ficha Técnica
                </button>
              </div>
            </motion.div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-2xl font-bold mb-8">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
