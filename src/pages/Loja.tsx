import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export default function Loja() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    (async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 50 });
        setProducts(data?.data?.products?.edges ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
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
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">Loja</span>
            <h1 className="text-3xl md:text-5xl font-display font-normal mt-3 text-foreground">Nossos Produtos</h1>
            <p className="mt-3 max-w-lg mx-auto text-muted-foreground">Adquira soluções acústicas diretamente.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Nenhum produto encontrado</h2>
              <p className="text-muted-foreground">Em breve teremos produtos disponíveis na loja.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const img = product.node.images.edges[0]?.node;
                const price = product.node.priceRange.minVariantPrice;
                return (
                  <div key={product.node.id} className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
                    <Link to={`/loja/${product.node.handle}`} className="block aspect-square overflow-hidden bg-muted">
                      {img ? (
                        <img src={img.url} alt={img.altText || product.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link to={`/loja/${product.node.handle}`}>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{product.node.title}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.node.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-foreground">
                          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAdd(product)}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Comprar"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
