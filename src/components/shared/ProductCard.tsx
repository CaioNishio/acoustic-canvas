import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { productPrices, formatPrice, unitLabel } from "@/data/productPrices";
import { isPurchasable } from "@/lib/shopifyCatalog";

export default function ProductCard({ product }: { product: Product }) {
  /* Mapa estático, sem request por card — ver nota em sonar/ProductCard.tsx. */
  const comprable = isPurchasable(product.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/produtos/${product.slug}`} className="block group bg-background rounded-2xl overflow-hidden border border-border/60 hover:border-[hsl(var(--snr-ocean))]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(var(--snr-graphite))]/[0.08] hover:-translate-y-0.5">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[hsl(var(--snr-petrol))]/10 text-[hsl(var(--snr-petrol))]">
            {product.category}
          </span>
          <h3 className="text-xl font-semibold mt-2.5 text-foreground group-hover:text-[hsl(var(--snr-petrol))] transition-colors">{product.name}</h3>
          <p className="text-base text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
          {/* Mini NRC badge */}
          {(() => {
            const nrcSpec = product.specs.find((s) => s.label === "NRC" || s.label === "NRC (Absorção)");
            const diffSpec = product.specs.find((s) => s.label === "Faixa de Difusão");
            return (nrcSpec || diffSpec) ? (
              <div className="flex gap-2 mt-3">
                {nrcSpec && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--snr-ocean))]/10 text-xs font-semibold text-[hsl(var(--snr-ocean))]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--snr-ocean))]" />
                    NRC 0,85
                  </span>
                )}
                {diffSpec && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--snr-wood))]/10 text-xs font-semibold text-[hsl(var(--snr-wood))]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--snr-wood))]" />
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
          {(() => {
            const pricing = productPrices[product.slug];
            if (!pricing || pricing.basePrice <= 0) return null;
            return (
              <div className="flex items-baseline gap-1.5 mt-3">
                {pricing.sizes && pricing.sizes.length > 1 && (
                  <span className="text-[10px] text-muted-foreground uppercase">a partir de</span>
                )}
                <span className="text-lg font-bold text-[hsl(var(--snr-petrol))]">{formatPrice(pricing.basePrice)}</span>
                <span className="text-xs text-muted-foreground">{unitLabel(pricing.unit)}</span>
              </div>
            );
          })()}
          <div className="flex items-center justify-between gap-2 mt-3">
            <span className="flex items-center gap-1.5 text-[hsl(var(--snr-ocean))] text-base font-semibold group-hover:gap-2.5 transition-all">
              Ver detalhes <ArrowRight size={14} />
            </span>
            {comprable && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--snr-orange))]/10 px-2.5 py-1 text-xs font-semibold text-[hsl(var(--snr-orange))]">
                <ShoppingBag size={12} /> Comprar
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
