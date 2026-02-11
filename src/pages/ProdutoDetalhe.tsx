import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download, Check } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shared/ProductCard";
import { products, type ProductColor } from "@/data/products";

export default function ProdutoDetalhePage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [mainImage, setMainImage] = useState(0);

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
      <section className="section-padding relative">
        {/* Geometric decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 border border-border/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-20 left-0 w-32 h-32 border border-primary/10 rotate-45 -translate-x-1/2" />

        <div className="container mx-auto">
          <Link to="/produtos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft size={14} /> Voltar aos produtos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card overflow-hidden rounded-xl">
                <img src={product.gallery[mainImage] || product.image} alt={product.name} className="w-full aspect-square object-cover" />
              </div>
              {product.gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {product.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(i)}
                      className={`glass-card overflow-hidden rounded-lg transition-all ${mainImage === i ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="w-full aspect-square object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {product.category}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-3 text-foreground">{product.name}</h1>
              <p className="text-muted-foreground mt-4 leading-relaxed text-base">{product.description}</p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                    Cores Disponíveis
                    {selectedColor && (
                      <span className="text-sm font-normal text-muted-foreground">— {selectedColor.name}</span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(selectedColor?.name === color.name ? null : color)}
                        className="relative group/color"
                        title={`${color.code ? color.code + ' — ' : ''}${color.name}`}
                      >
                        <span
                          className="block w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                          style={{
                            backgroundColor: color.hex,
                            borderColor: selectedColor?.name === color.name ? "hsl(24, 95%, 53%)" : "hsl(210, 20%, 88%)",
                          }}
                        />
                        {selectedColor?.name === color.name && (
                          <Check size={16} className="absolute inset-0 m-auto" style={{ color: ["Branco", "Cinza Claro", "Natural", "Carvalho Claro", "Cinza Pérola", "Bege Claro", "Rosa Claro", "Pêssego"].includes(color.name) ? "#333" : "#fff" }} />
                        )}
                        {color.code && (
                          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-mono opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap">
                            {color.code}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs */}
              <div className="mt-8">
                <h3 className="font-display font-semibold text-lg mb-3">Especificações Técnicas</h3>
                <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex justify-between px-5 py-3.5 text-sm">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-semibold text-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="mt-8">
                <h3 className="font-display font-semibold text-lg mb-3">Composição</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.materials.map((m) => (
                    <div key={m} className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 border border-border/50">
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" /> {m}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-10">
                <Link
                  to="/orcamento"
                  className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  Solicitar Orçamento <ArrowRight size={16} />
                </Link>
                <button className="px-6 py-3.5 border-2 border-accent text-accent rounded-lg text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center gap-2">
                  <Download size={16} /> Ficha Técnica
                </button>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="section-divider mt-20 mb-16" />

          {/* Related */}
          {related.length > 0 && (
            <div>
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
