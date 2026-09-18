import { ArrowUpRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/products";

/** No máximo quatro selos no sistema. */
const badgeFor = (product: Product): string | null => {
  if (product.category === "Kits de Tratamento") return "Kit completo";
  if (product.subcategory === "LED" || product.subcategory === "Decorativo") return "Personalizado";
  if (product.slug.startsWith("painel-acustico-snr3250")) return "Mais vendido";
  if (product.category === "Consultoria & Projetos") return "Serviço";
  return null;
};

export default function ProductCard({ product, imageOverride }: { product: Product; imageOverride?: string }) {
  const badge = badgeFor(product);

  return (
    <Link
      to={`/produtos/${product.slug}`}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-snr-mineral-100 bg-snr-paper p-2 transition-all duration-ui ease-snr hover:-translate-y-0.5 hover:border-snr-graphite/35 hover:shadow-[0_12px_30px_rgba(7,28,61,.12)] sm:rounded-2xl sm:p-3"
    >
      <div className="snr-product-cover relative overflow-hidden rounded-lg sm:rounded-xl">
        <span className="absolute right-1.5 top-1.5 z-10 grid size-6 place-items-center rounded-full bg-white/80 text-snr-petrol sm:right-2 sm:top-2 sm:size-7" aria-hidden="true"><Heart size={13} /></span>
        {badge && (
          <span className="snr-caption absolute left-1.5 top-1.5 z-10 max-w-[80%] truncate rounded-full bg-snr-petrol px-2 py-0.5 text-[7px] tracking-[.06em] text-snr-white sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[10px]">
            {badge}
          </span>
        )}
        <img
          src={imageOverride || product.image}
          alt={product.name}
          loading="lazy"
          className="snr-zoom-media aspect-square w-full object-contain p-1 sm:p-3"
        />
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-2 text-left sm:px-2 sm:pb-2 sm:pt-3">
        <p className="mb-1 truncate text-[7px] font-medium text-snr-mineral-700 sm:text-[10px]">{product.category}</p>
        <h3 className="line-clamp-2 font-display text-[11px] font-semibold leading-[1.12] text-snr-graphite sm:text-[15px]">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[8px] leading-snug text-snr-mineral-700 sm:mt-2 sm:text-[12px]">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between gap-1 pt-2 sm:pt-4"><p className="text-[9px] font-semibold text-snr-petrol sm:text-[13px]">{product.price ? `A partir de ${product.price}` : "Sob consulta"}</p><span className="grid size-5 shrink-0 place-items-center rounded-full border border-snr-mineral-200 sm:size-7"><ArrowUpRight size={12}/></span></div>
      </div>
    </Link>
  );
}
