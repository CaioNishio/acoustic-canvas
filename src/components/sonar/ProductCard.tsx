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
      className="group relative flex flex-col rounded-2xl border border-snr-mineral-100 bg-snr-paper p-4 transition-all duration-ui ease-snr before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:border before:border-transparent before:transition-all before:duration-ui hover:-translate-y-0.5 hover:border-snr-graphite/35 hover:shadow-[4px_5px_0_0_hsl(var(--snr-graphite)/0.10)] hover:before:-inset-1 hover:before:border-snr-graphite/15"
    >
      <div className="snr-product-cover relative overflow-hidden rounded-xl">
        {badge && (
          <span className="snr-caption absolute left-3 top-3 z-10 rounded-full bg-snr-petrol px-3 py-1 text-[10px] tracking-[0.12em] text-snr-white">
            {badge}
          </span>
        )}
        <img
          src={imageOverride || product.image}
          alt={product.name}
          loading="lazy"
          className="snr-zoom-media aspect-square w-full object-contain p-5"
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-2 pb-2 pt-5 text-center">
        <h3 className="font-display text-[15px] font-semibold leading-snug text-snr-graphite">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-snr-mineral-700">
          {product.shortDescription}
        </p>
        <p className="mt-auto pt-4 text-[13px] font-medium text-snr-petrol">
          {product.price ? `A partir de ${product.price}` : "Sob consulta"}
        </p>
      </div>
    </Link>
  );
}
