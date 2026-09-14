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
    <article className="group relative flex flex-col rounded-2xl border border-snr-mineral-100 bg-snr-paper transition-all duration-ui ease-snr before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:border before:border-transparent before:transition-all before:duration-ui hover:-translate-y-0.5 hover:border-snr-graphite/35 hover:shadow-[4px_5px_0_0_hsl(var(--snr-graphite)/0.10)] hover:before:-inset-1 hover:before:border-snr-graphite/15">
      <Link to={detailUrl} className="snr-product-cover block aspect-square overflow-hidden rounded-t-2xl p-4">
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
      <div className="flex flex-1 flex-col p-5 text-center">
        <Link to={detailUrl}>
          <h3 className="font-display text-[15px] font-semibold leading-snug text-snr-graphite transition-colors group-hover:text-snr-ocean">
            {product.node.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-snr-mineral-700">
          {product.node.description}
        </p>
        <p className="mt-auto pt-4 text-[15px] font-semibold text-snr-petrol">
          {purchasable ? formatMoney(price) : "Sob consulta"}
        </p>
        {purchasable ? (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isLoading}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-snr-petrol px-5 text-sm font-semibold text-white transition-colors hover:bg-snr-ocean disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar ao carrinho"}
          </button>
        ) : (
          <Link
            to="/orcamento"
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-snr-petrol px-5 text-sm font-semibold text-snr-petrol transition-colors hover:bg-snr-petrol hover:text-white"
          >
            Solicitar orçamento <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </article>
  );
}
