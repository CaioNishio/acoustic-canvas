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
      <Link to={`/produtos/${product.slug}`} className="glass-card-hover block group overflow-hidden rounded-xl">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {product.category}
          </span>
          <h3 className="font-display text-lg font-semibold mt-2 text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.shortDescription}</p>
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mt-3">
              {product.colors.slice(0, 8).map((c) => (
                <span key={c.name} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} title={c.code ? `${c.code} — ${c.name}` : c.name} />
              ))}
              {product.colors.length > 8 && (
                <span className="text-xs text-muted-foreground ml-1 self-center">+{product.colors.length - 8}</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1 mt-3 text-primary text-sm font-semibold">
            Ver detalhes <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
