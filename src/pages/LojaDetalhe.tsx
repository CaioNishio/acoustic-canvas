import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, isPurchasable } from "@/lib/shopify";
import { formatMoney } from "@/lib/formatCurrency";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export default function LojaDetalhe() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    let active = true;
    const refreshProduct = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        const p = data?.data?.product;
        if (!active) return;
        setProduct(p);
        setSelectedImage((current) => Math.min(current, Math.max((p?.images?.edges?.length ?? 1) - 1, 0)));
        setSelectedVariant((current: any) =>
          p?.variants?.edges?.find((variant: any) => variant.node.id === current?.id)?.node
          ?? p?.variants?.edges?.[0]?.node
          ?? null,
        );
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };

    void refreshProduct();
    const interval = window.setInterval(refreshProduct, 120_000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refreshProduct();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [handle]);

  const handleAdd = async () => {
    if (!product || !selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Adicionado ao carrinho!", { position: "top-center" });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-32">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Produto não encontrado</h2>
          <Link to="/loja" className="text-primary mt-4 inline-block">Voltar à Loja</Link>
        </div>
      </Layout>
    );
  }

  const images = product.images?.edges || [];
  const purchasable = isPurchasable(
    selectedVariant?.price?.amount ?? "0",
    selectedVariant?.availableForSale ?? false,
    product.sobConsulta
  );

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-6">
          <Link to="/loja" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} /> Voltar à Loja
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                {images[selectedImage]?.node ? (
                  <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-16 h-16 text-muted-foreground" /></div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img: any, i: number) => (
                    <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}>
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-normal text-foreground">{product.title}</h1>
              <p className="text-2xl font-bold text-foreground mt-4">
                {purchasable
                  ? formatMoney(selectedVariant?.price)
                  : "Sob consulta"}
              </p>
              <p className="text-muted-foreground mt-6 leading-relaxed">{product.description}</p>

              {/* Options */}
              {product.options?.filter((o: any) => o.name !== "Title").map((option: any) => (
                <div key={option.name} className="mt-6">
                  <label className="text-sm font-semibold text-foreground mb-2 block">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value: string) => {
                      const isSelected = selectedVariant?.selectedOptions?.some((so: any) => so.name === option.name && so.value === value);
                      return (
                        <button
                          key={value}
                          onClick={() => {
                            const variant = product.variants.edges.find((v: any) =>
                              v.node.selectedOptions.some((so: any) => so.name === option.name && so.value === value)
                            );
                            if (variant) setSelectedVariant(variant.node);
                          }}
                          className={`px-4 py-2 rounded-full text-sm border transition-colors ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary'}`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {purchasable ? (
                <button
                  onClick={handleAdd}
                  disabled={isLoading}
                  className="mt-8 w-full px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Adicionar ao Carrinho"}
                </button>
              ) : (
                <Link
                  to="/orcamento"
                  className="mt-8 w-full px-8 py-4 text-lg font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Solicitar Orçamento <ArrowRight size={18} />
                </Link>
              )}
              {!purchasable && selectedVariant && !selectedVariant.availableForSale && (
                <p className="text-sm text-muted-foreground mt-2 text-center">Esta opção está indisponível no momento.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
