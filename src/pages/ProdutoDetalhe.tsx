import { useState, lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download, Check, Volume2, Ruler, Palette, Wrench, LayoutGrid, Target, Shield, Award, Leaf, ChevronDown, CheckCircle, Flame, Droplets, FlaskConical, Bug, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shared/ProductCard";
import AcousticInfoGraphic from "@/components/shared/AcousticInfoGraphic";
import AbsorptionChart from "@/components/shared/AbsorptionChart";
import { products, type ProductColor } from "@/data/products";
import { productPrices, formatPrice, unitLabel } from "@/data/productPrices";
import { useQuoteCart } from "@/contexts/QuoteCartContext";

const Product3DViewer = lazy(() => import("@/components/shared/Product3DViewer"));

const highlightIcons: Record<string, React.ElementType> = {
  waveform: Volume2,
  ruler: Ruler,
  palette: Palette,
  tool: Wrench,
  layout: LayoutGrid,
  target: Target
};

const propertyIcons: Record<string, React.ElementType> = {
  "Térmicas": Flame,
  "Acústicas": Volume2,
  "Comportamento à Água": Droplets,
  "Inércia Química": FlaskConical
};

export default function ProdutoDetalhePage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [mainImage, setMainImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useQuoteCart();

  if (!product) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <p className="text-muted-foreground">Produto não encontrado.</p>
          <Link to="/produtos" className="text-primary mt-4 inline-block">Voltar aos produtos</Link>
        </div>
      </Layout>);

  }

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  return (
    <Layout>
      {/* Highlights strip — GIK style */}
      {product.highlights && product.highlights.length > 0 &&
      <section className="border-b border-border bg-[#ced7f7] px-[28px] py-[70px] mb-0 mr-0">
          <div className="container mx-auto px-4 py-[79px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {product.highlights.map((h) => {
              const Icon = highlightIcons[h.icon] || Volume2;
              return (
                <div key={h.title} className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-tight">{h.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{h.desc}</p>
                    </div>
                  </div>);

            })}
            </div>
          </div>
        </section>
      }

      <section className="section-padding relative">
        <div className="container mx-auto">
          <Link to="/produtos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft size={14} /> Voltar aos produtos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card overflow-hidden rounded-xl">
                <img src={product.gallery[mainImage] || product.image} alt={product.name} className="w-full aspect-square object-cover" />
              </div>
              {product.gallery.length > 1 &&
              <div className="grid grid-cols-4 gap-3 mt-3">
                  {product.gallery.map((img, i) =>
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`glass-card overflow-hidden rounded-lg transition-all ${mainImage === i ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"}`}>

                      <img src={img} alt="" className="w-full aspect-square object-cover" loading="lazy" />
                    </button>
                )}
                </div>
              }
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {product.category}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-3 text-foreground">{product.name}</h1>

              {/* Preço */}
              {(() => {
                const pricing = productPrices[product.slug];
                if (!pricing || pricing.basePrice <= 0) return null;
                return (
                  <div className="mt-4 flex items-baseline gap-2">
                    {pricing.sizes && pricing.sizes.length > 1 ? (
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">A partir de</span>
                    ) : null}
                    <span className="text-3xl font-bold text-primary">{formatPrice(pricing.basePrice)}</span>
                    <span className="text-sm text-muted-foreground">{unitLabel(pricing.unit)}</span>
                  </div>
                );
              })()}

              <p className="text-muted-foreground mt-4 leading-relaxed text-lg">{product.description}</p>

              {/* Size Selector — GIK style */}
              {product.sizes && product.sizes.length > 0 &&
              <div className="mt-6">
                  <h3 className="font-display font-semibold text-sm mb-3">Tamanhos Disponíveis</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const pricing = productPrices[product.slug];
                      const dimNumbers = size.dimensions.match(/\d+/g) || [];
                      const firstDim = dimNumbers[0] || "";
                      const sizePrice = pricing?.sizes?.find((sp) => {
                        const spNums = sp.dimensions.match(/\d+/g) || [];
                        return spNums[0] === firstDim;
                      });
                      return (
                        <button
                          key={size.label}
                          onClick={() => setSelectedSize(selectedSize === size.label ? null : size.label)}
                          className={`px-4 py-2.5 border-2 rounded-lg text-center transition-colors ${selectedSize === size.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                          <p className="text-xs font-bold text-foreground">{size.label}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{size.dimensions}</p>
                          {sizePrice && <p className="text-xs font-bold text-primary mt-1">{formatPrice(sizePrice.price)}</p>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              }

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 &&
              <div className="mt-8">
                  <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                    Cores Disponíveis
                    {selectedColor &&
                  <span className="text-sm font-normal text-muted-foreground">— {selectedColor.name}</span>
                  }
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) =>
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(selectedColor?.name === color.name ? null : color)}
                    className="relative group/color"
                    title={`${color.code ? color.code + ' — ' : ''}${color.name}`}>

                        <span
                      className="block w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: color.hex,
                        borderColor: selectedColor?.name === color.name ? "hsl(var(--primary))" : "hsl(var(--border))"
                      }} />

                        {selectedColor?.name === color.name &&
                    <Check size={16} className="absolute inset-0 m-auto" style={{ color: ["Branco", "Cinza Claro", "Natural", "Carvalho Claro", "Cinza Pérola", "Bege Claro", "Rosa Claro", "Pêssego"].includes(color.name) ? "#333" : "#fff" }} />
                    }
                        {color.code &&
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-mono opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap">
                            {color.code}
                          </span>
                    }
                      </button>
                  )}
                  </div>
                </div>
              }

              {/* Specs */}
              <div className="mt-8">
                <h3 className="font-display font-semibold text-lg mb-3">Especificações Técnicas</h3>
                <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
                  {product.specs.map((s) =>
                  <div key={s.label} className="flex justify-between px-5 py-3.5 text-sm">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-semibold text-foreground">{s.value}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  onClick={() => {
                    const pricing = productPrices[product.slug];
                    const selectedSizeData = product.sizes?.find((s) => s.label === selectedSize);
                    const dimNumbers = selectedSizeData?.dimensions.match(/\d+/g) || [];
                    const firstDim = dimNumbers[0] || "";
                    const sizePrice = pricing?.sizes?.find((sp) => {
                      const spNums = sp.dimensions.match(/\d+/g) || [];
                      return spNums[0] === firstDim;
                    });
                    const price = sizePrice?.price ?? pricing?.basePrice ?? 0;
                    addItem({
                      slug: product.slug,
                      name: product.name,
                      image: product.image,
                      size: selectedSizeData?.dimensions || undefined,
                      color: selectedColor?.name || undefined,
                      colorHex: selectedColor?.hex || undefined,
                      unitPrice: price,
                      unit: pricing?.unit || "un",
                    });
                  }}
                  className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-lg shadow-primary/20">
                  <ShoppingBag size={16} /> Adicionar ao Orçamento
                </button>
                <Link
                  to="/orcamento"
                  className="px-6 py-3.5 border-2 border-border text-foreground rounded-lg text-sm font-semibold hover:bg-muted transition-colors inline-flex items-center gap-2">
                  Solicitar Orçamento <ArrowRight size={16} />
                </Link>
                <button className="px-6 py-3.5 border-2 border-border text-foreground rounded-lg text-sm font-semibold hover:bg-muted transition-colors inline-flex items-center gap-2">
                  <Download size={16} /> Ficha Técnica
                </button>
              </div>

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 &&
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
                  {product.certifications.map((cert) =>
                <span key={cert} className="px-3 py-1.5 bg-card border border-border rounded-md text-[10px] font-mono font-semibold text-muted-foreground">
                      {cert}
                    </span>
                )}
                </div>
              }
            </motion.div>
          </div>

          {/* Trust badges — GIK style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
            { icon: Award, label: "Design Sonar Comprovado" },
            { icon: FlaskConical, label: "Performance Verificada em Lab" },
            { icon: Leaf, label: "Materiais Eco-Friendly" },
            { icon: Shield, label: "Garantia de 2 Anos" }].
            map((b) =>
            <div key={b.label} className="flex items-center gap-3 glass-card rounded-xl px-4 py-3">
                <b.icon size={20} className="text-primary flex-shrink-0" />
                <span className="text-xs font-semibold text-foreground">{b.label}</span>
              </div>
            )}
          </div>

          {/* 3D Viewer Section */}
          <div className="mt-16">
            <Suspense fallback={null}>
              <Product3DViewer product={product} selectedColor={selectedColor} />
            </Suspense>
          </div>

          {/* Performance Section — GIK style */}
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Performance em que Você Pode <em className="text-primary not-italic">Confiar</em>
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm">
                Todos os produtos Sonar são testados seguindo normas ISO/R 354 e ASTM C 423. Essa abordagem científica garante total transparência sobre como nossos produtos performam e impulsiona nosso processo de P&D.
              </p>
            </div>

            {/* Absorption chart & table */}
            {product.absorptionTable && product.absorptionTable.length > 0 &&
            <AbsorptionChart data={product.absorptionTable} />
            }

            {/* Acoustic Infographic (NRC gauge, spectrum) */}
            <AcousticInfoGraphic specs={product.specs} />
          </div>

          {/* Long Description — GIK editorial style */}
          {product.longDescription &&
          <div className="mt-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Painel Compacto. <em className="text-primary not-italic">Grande Impacto.</em>
                  </h2>
                  {product.longDescription.split("\n\n").map((p, i) =>
                <p key={i} className="text-muted-foreground mt-4 leading-relaxed">{p}</p>
                )}
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-xl overflow-hidden">
                  <img src={product.gallery[1] || product.image} alt="" className="w-full aspect-[4/3] object-cover" loading="lazy" />
                </motion.div>
              </div>
            </div>
          }

          {/* Advantages & Properties */}
          {(product.advantages || product.properties) &&
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Advantages */}
              {product.advantages &&
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <CheckCircle size={22} className="text-primary" /> Vantagens
                  </h3>
                  <div className="space-y-3">
                    {product.advantages.map((adv) =>
                <div key={adv} className="flex items-start gap-3 glass-card rounded-lg px-4 py-3">
                        <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{adv}</span>
                      </div>
                )}
                  </div>
                </motion.div>
            }

              {/* Properties */}
              {product.properties &&
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h3 className="font-display text-xl font-bold text-foreground mb-6">Propriedades Típicas</h3>
                  <div className="space-y-4">
                    {product.properties.map((prop) => {
                  const Icon = propertyIcons[prop.title] || Shield;
                  return (
                    <div key={prop.title} className="glass-card rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon size={16} className="text-primary" />
                            </div>
                            <h4 className="font-display font-semibold text-foreground">{prop.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{prop.text}</p>
                        </div>);

                })}
                  </div>
                </motion.div>
            }
            </div>
          }

          {/* Materials */}
          <div className="mt-20">
            <h3 className="font-display text-xl font-bold text-foreground mb-6">Composição & Materiais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {product.materials.map((m) =>
              <div key={m} className="flex items-center gap-3 text-sm text-foreground glass-card rounded-lg px-5 py-4">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" /> {m}
                </div>
              )}
            </div>
          </div>

          {/* Gallery mosaic — GIK style */}
          {product.gallery.length > 2 &&
          <div className="mt-20">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">Galeria de Aplicações</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.gallery.map((img, i) =>
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => setMainImage(i)}>

                    <img src={img} alt="" className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </motion.div>
              )}
              </div>
            </div>
          }

          {/* FAQ — GIK style */}
          {product.faq && product.faq.length > 0 &&
          <div className="mt-20 max-w-3xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
                Perguntas Frequentes
              </h2>
              <div className="space-y-3">
                {product.faq.map((item, i) =>
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                    <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">

                      <span className="font-semibold text-foreground text-sm pr-4">{item.question}</span>
                      <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />

                    </button>
                    <AnimatePresence>
                      {openFaq === i &&
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden">

                          <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                        </motion.div>
                  }
                    </AnimatePresence>
                  </div>
              )}
              </div>
            </div>
          }

          {/* CTA — Free consultation */}
          <div className="mt-20 glass-card rounded-2xl p-8 md:p-12 text-center bg-secondary text-secondary-foreground">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Inicie sua Consultoria Acústica Gratuita</h2>
            <p className="mt-3 text-secondary-foreground/70 max-w-xl mx-auto text-sm">
              Seu espaço merece mais do que apenas mobília e equipamentos — merece acústica que torna cada momento mais claro. Nossa equipe está aqui para ajudar.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Link
                to="/orcamento"
                className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2">

                Solicitar Consultoria Gratuita <ArrowRight size={16} />
              </Link>
              <Link
                to="/calculadora"
                className="px-6 py-3.5 border-2 border-secondary-foreground/30 text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-secondary-foreground/10 transition-colors">

                Calculadora Acústica
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="section-divider mt-20 mb-16" />

          {/* Related */}
          {related.length > 0 &&
          <div>
              <h2 className="font-display text-2xl font-bold mb-8">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) =>
              <ProductCard key={p.slug} product={p} />
              )}
              </div>
            </div>
          }
        </div>
      </section>
    </Layout>);

}