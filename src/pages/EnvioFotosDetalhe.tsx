import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { products } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export default function EnvioFotosDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  const fetchImages = useCallback(async () => {
    if (!slug) return;
    const { data } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_slug", slug)
      .order("sort_order", { ascending: true });
    if (data) setImages(data as ProductImage[]);
  }, [slug]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFiles = (files: FileList | File[]) => {
    const newPreviews = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadAll = async () => {
    if (!slug || previews.length === 0) return;
    setUploading(true);
    let count = 0;

    for (const { file } of previews) {
      const ext = file.name.split(".").pop();
      const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-photos")
        .upload(path, file);

      if (uploadError) {
        toast.error(`Erro ao enviar ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("product-photos")
        .getPublicUrl(path);

      await supabase.from("product_images").insert({
        product_slug: slug,
        image_url: urlData.publicUrl,
        alt_text: file.name,
        sort_order: images.length + count,
      });
      count++;
    }

    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    await fetchImages();
    toast.success(`${count} foto${count !== 1 ? "s" : ""} enviada${count !== 1 ? "s" : ""} com sucesso!`);
    setUploading(false);
  };

  const deleteImage = async (img: ProductImage) => {
    const pathMatch = img.image_url.match(/product-photos\/(.+)$/);
    if (pathMatch) {
      await supabase.storage.from("product-photos").remove([pathMatch[1]]);
    }
    await supabase.from("product_images").delete().eq("id", img.id);
    await fetchImages();
    toast.success("Foto removida.");
  };

  if (!product) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <p className="text-muted-foreground mb-4">Produto não encontrado.</p>
          <Link to="/envio-fotos" className="text-primary underline">Voltar</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="container mx-auto max-w-4xl">
          {/* Back link */}
          <Link to="/envio-fotos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} /> Voltar à lista de produtos
          </Link>

          {/* Product header */}
          <div className="flex items-center gap-5 mb-10">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover border border-border"
            />
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</span>
              <h1 className="text-2xl font-semibold text-foreground">{product.name}</h1>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => document.getElementById("file-input")?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors mb-8 ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            }`}
          >
            <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
            <p className="text-foreground font-medium">Arraste imagens aqui ou clique para selecionar</p>
            <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WebP — múltiplos arquivos</p>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">{previews.length} arquivo{previews.length !== 1 ? "s" : ""} selecionado{previews.length !== 1 ? "s" : ""}</p>
                <Button onClick={uploadAll} disabled={uploading} size="sm">
                  {uploading ? <><Loader2 className="animate-spin mr-2" size={14} /> Enviando...</> : "Enviar todas"}
                </Button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {previews.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-black/80"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded images */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Fotos enviadas ({images.length})
            </h2>
            {images.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">Nenhuma foto enviada ainda para este produto.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={img.image_url} alt={img.alt_text || ""} className="w-full h-full object-cover" />
                    <button
                      onClick={() => deleteImage(img)}
                      className="absolute top-1 right-1 bg-destructive/80 rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing gallery */}
          {product.gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Galeria atual do catálogo ({product.gallery.length})
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {product.gallery.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border opacity-70">
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
