import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
export default function ProductCard({
  product
}: {
  product: Product;
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.4
  }}>
      <Link to={`/produtos/${product.slug}`} className="glass-card-hover block group overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </div>
        <div className="p-5 opacity-100">
          <span className="text-xs text-primary font-semibold uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="font-display text-lg font-semibold mt-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {product.shortDescription}
          </p>
          <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium">
            Ver detalhes <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>;
}