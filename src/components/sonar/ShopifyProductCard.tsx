import { Link } from "react-router-dom";
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/formatCurrency";
import { isPurchasable, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

type Props = {
  product: ShopifyProduct;
  localSlug?: string;
  coverImage?: string;
};

export default function ShopifyProductCard({ product, localSlug, coverImage }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const purchasable = isPurchasable(
    price.amount,
    variant?.availableForSale ?? false,
    product.node.sobConsulta,
  );
  const shopifyImage = product.node.images.edges[0]?.node;
  const detailUrl = localSlug
    ? `/produtos/${localSlug}`
    : `/produtos/shopify/${product.node.handle}`;

  const handleAdd = async () => {
    if (!variant || !purchasable) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Adicionado ao carrinho!", { position: "top-center" });
  };

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-snr-mineral-100 bg-snr-paper transition-all duration-ui ease-snr hover:-translate-y-0.5 hover:border-snr-graphite/35 hover:shadow-[0_12px_30px_rgba(7,28,61,.12)] sm:rounded-2xl">
      <Link to={detailUrl} className="snr-product-cover block aspect-square overflow-hidden rounded-t-xl p-1.5 sm:rounded-t-2xl sm:p-4">
        {coverImage || shopifyImage ? (
          <img
            src={coverImage || shopifyImage?.url}
            alt={shopifyImage?.altText || product.node.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-snr-mineral-500">
            <ShoppingBag size={44} aria-hidden="true" />
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-2 text-left sm:p-5 sm:text-center">
        <Link to={detailUrl}>
          <h3 className="line-clamp-3 font-display text-[10px] font-semibold leading-[1.13] text-snr-graphite transition-colors group-hover:text-snr-ocean sm:line-clamp-2 sm:text-[15px] sm:leading-snug">
            {product.node.title}
          </h3>
        </Link>
        <p className="mt-2 hidden line-clamp-2 text-[13px] leading-snug text-snr-mineral-700 sm:block">
          {product.node.description}
        </p>
        <p className="mt-auto pt-2 text-[10px] font-semibold text-snr-petrol sm:pt-4 sm:text-[15px]">
          {purchasable ? formatMoney(price) : "Sob consulta"}
        </p>
        {purchasable ? (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isLoading}
            className="mt-4 hidden min-h-11 items-center justify-center rounded-full bg-snr-petrol px-5 text-sm font-semibold text-white transition-colors hover:bg-snr-ocean disabled:opacity-50 sm:inline-flex"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar ao carrinho"}
          </button>
        ) : (
          <Link
            to="/orcamento"
            className="mt-4 hidden min-h-11 items-center justify-center gap-2 rounded-full border border-snr-petrol px-5 text-sm font-semibold text-snr-petrol transition-colors hover:bg-snr-petrol hover:text-white sm:inline-flex"
          >
            Solicitar orçamento <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </article>
  );
}
