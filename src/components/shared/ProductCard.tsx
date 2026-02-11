import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/produtos/${product.slug}`} className="block group bg-background rounded-2xl overflow-hidden border border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/[0.06]">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary">
            {product.category}
          </span>
          <h3 className="text-lg font-semibold mt-2.5 text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
          {/* Mini NRC badge */}
          {(() => {
            const nrcSpec = product.specs.find((s) => s.label === "NRC" || s.label === "NRC (Absorção)");
            const diffSpec = product.specs.find((s) => s.label === "Faixa de Difusão");
            return (nrcSpec || diffSpec) ? (
              <div className="flex gap-2 mt-3">
                {nrcSpec && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    NRC {nrcSpec.value}
                  </span>
                )}
                {diffSpec && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Difusão
                  </span>
                )}
              </div>
            ) : null;
          })()}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 mt-3">
              {product.colors.slice(0, 8).map((c) => (
                <span key={c.name} className="w-4 h-4 rounded-full border border-border/50 shadow-sm" style={{ backgroundColor: c.hex }} title={c.code ? `${c.code} — ${c.name}` : c.name} />
              ))}
              {product.colors.length > 8 && (
                <span className="text-xs text-muted-foreground ml-1 self-center">+{product.colors.length - 8}</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-4 text-secondary text-sm font-semibold group-hover:gap-2.5 transition-all">
            Ver detalhes <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
