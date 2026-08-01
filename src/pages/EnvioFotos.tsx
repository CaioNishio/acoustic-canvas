import { useMemo } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import { products, categories } from "@/data/products";
import { Camera, Loader2, LogOut } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function EnvioFotos() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof products>();
    categories.forEach((cat) => map.set(cat, []));
    products.forEach((p) => {
      const list = map.get(p.category);
      if (list) list.push(p);
    });
    return map;
  }, []);

  if (loading) return <Layout><div className="py-24 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div></Layout>;
  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  return (
    <Layout>
      <section className="py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="container mx-auto">
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orcamentos">Gerador de orçamentos</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => { await supabase.auth.signOut(); navigate("/admin-login"); }}
            >
              <LogOut size={14} className="mr-1.5" /> Sair
            </Button>
          </div>
          <SectionHeading
            tag="Gestão de Mídia"
            title="Envio de Fotos por Produto"
            description="Selecione um produto para enviar fotos organizadas por categoria."
          />

          <div className="space-y-12">
            {Array.from(grouped.entries()).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                  {category}
                  <span className="text-muted-foreground text-sm font-normal ml-2">
                    ({items.length})
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {items.map((product) => (
                    <Link
                      key={product.slug}
                      to={`/envio-fotos/${product.slug}`}
                      className="group block rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all"
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {product.gallery.length} foto{product.gallery.length !== 1 ? "s" : ""} na galeria
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
