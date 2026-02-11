import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Volume2, Shield, Ruler, Headphones } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/data/products";
import { solutions } from "@/data/solutions";

// Gallery images - best quality full photos
import imgEstudio from "@/assets/gallery/estudio-paineis.jpeg";
import imgSalaReuniao from "@/assets/gallery/paineis-sala-reuniao.png";
import imgBaffles from "@/assets/gallery/baffles-coloridos.jpg";
import imgNuvem from "@/assets/gallery/nuvem-acustica.webp";
import imgForro from "@/assets/gallery/forro-corporativo.jpg";
import imgSeminario from "@/assets/gallery/paineis-seminario.jpg";
import imgAcademiaBaffles from "@/assets/gallery/academia-baffles.jpeg";
import imgAcademiaTeto from "@/assets/gallery/academia-teto.jpeg";
import imgSalaAula from "@/assets/gallery/sala-aula-baffles.jpeg";
import imgEscritorioAzuis from "@/assets/gallery/escritorio-paineis-azuis.jpeg";
import imgForroIndustrial from "@/assets/gallery/forro-industrial.jpg";
import imgPaineisAzuis from "@/assets/gallery/paineis-azuis.png";

const features = [
  { icon: Volume2, title: "Alta Absorção", desc: "NRC até 0.95 para controle sonoro profissional" },
  { icon: Shield, title: "Certificação A2", desc: "Materiais com classificação de resistência ao fogo" },
  { icon: Ruler, title: "Sob Medida", desc: "Projetos personalizados para cada ambiente" },
  { icon: Headphones, title: "Consultoria", desc: "Análise acústica profissional inclusa" },
];

const galleryImages = [
  { src: imgEstudio, alt: "Estúdio com painéis acústicos" },
  { src: imgSalaReuniao, alt: "Sala de reunião com tratamento acústico" },
  { src: imgBaffles, alt: "Baffles acústicos coloridos" },
  { src: imgNuvem, alt: "Nuvem acústica suspensa" },
  { src: imgAcademiaBaffles, alt: "Academia com baffles" },
  { src: imgSeminario, alt: "Seminário com painéis acústicos" },
  { src: imgAcademiaTeto, alt: "Tratamento acústico no teto" },
  { src: imgSalaAula, alt: "Sala de aula com baffles" },
  { src: imgEscritorioAzuis, alt: "Escritório com painéis azuis" },
  { src: imgForro, alt: "Forro acústico corporativo" },
  { src: imgForroIndustrial, alt: "Forro industrial acústico" },
  { src: imgPaineisAzuis, alt: "Painéis acústicos azuis" },
];

const HomePage = () => {
  return (
    <Layout>
      {/* Hero with image */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={imgEstudio} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/95 via-accent/80 to-accent/40" />
        </div>

        {/* Geometric overlays */}
        <div className="absolute top-16 right-16 w-80 h-80 border-2 border-primary/20 rounded-full" />
        <div className="absolute top-28 right-28 w-56 h-56 border border-primary/10 rounded-full" />
        <div className="absolute bottom-16 left-8 w-64 h-px bg-gradient-to-r from-primary/40 to-transparent" />
        <div className="absolute bottom-24 left-8 w-40 h-px bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-primary rounded-full opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary rounded-full opacity-30" />
        {/* Corner lines */}
        <div className="absolute top-0 left-0 w-32 h-px bg-primary/30" />
        <div className="absolute top-0 left-0 w-px h-32 bg-primary/30" />
        <div className="absolute bottom-0 right-0 w-32 h-px bg-primary/30" />
        <div className="absolute bottom-0 right-0 w-px h-32 bg-primary/30" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">
              Tratamento Acústico Profissional
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-6 leading-[1.1] text-accent-foreground">
              O som perfeito começa com a{" "}
              <span className="text-primary">acústica certa</span>
            </h1>
            <p className="text-lg mt-6 max-w-xl text-accent-foreground/80">
              Painéis acústicos, bass traps, difusores e soluções completas para estúdios,
              igrejas, auditórios e ambientes corporativos.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/produtos"
                className="px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-primary/30 hover:bg-primary/90"
              >
                Ver Produtos <ArrowRight size={16} />
              </Link>
              <Link
                to="/orcamento"
                className="px-7 py-3.5 border-2 border-accent-foreground/30 text-accent-foreground font-semibold rounded-lg hover:bg-accent-foreground/10 transition-colors backdrop-blur-sm"
              >
                Solicitar Orçamento
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Decorative divider with geometric elements */}
      <div className="relative h-16 bg-background overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-primary/30 rotate-45" />
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary/20 rounded-full" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary/20 rounded-full" />
      </div>

      {/* Features */}
      <section className="section-padding relative bg-background">
        {/* Side geometric lines */}
        <div className="absolute top-10 left-0 w-24 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        <div className="absolute top-14 left-0 w-16 h-px bg-gradient-to-r from-accent/20 to-transparent" />
        <div className="absolute bottom-10 right-0 w-24 h-px bg-gradient-to-l from-primary/30 to-transparent" />
        <div className="absolute bottom-14 right-0 w-16 h-px bg-gradient-to-l from-accent/20 to-transparent" />

        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center rounded-xl border-t-2 border-t-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="text-primary" size={26} />
                </div>
                <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Photo Gallery */}
      <section className="section-padding relative bg-background overflow-hidden">
        <div className="absolute top-0 left-0 right-0 section-divider" />
        {/* Large geometric decoration */}
        <div className="absolute -top-20 -right-20 w-96 h-96 border border-primary/5 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] border border-accent/5 rounded-full" />

        <div className="container mx-auto relative">
          <SectionHeading
            tag="Portfólio"
            title="Nossos Projetos em Destaque"
            description="Ambientes transformados com tratamento acústico profissional."
          />

          {/* Masonry-like grid with full photos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {galleryImages.map((img, i) => {
              // Vary sizes for visual interest
              const isLarge = i === 0 || i === 5 || i === 8;
              const isTall = i === 2 || i === 7;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className={`relative group overflow-hidden rounded-xl ${
                    isLarge ? "col-span-2 row-span-2" : isTall ? "row-span-2" : ""
                  }`}
                >
                  <div className="relative w-full h-full min-h-[200px]">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Hover overlay with border accent */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/40 rounded-xl transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-sm font-medium text-accent-foreground drop-shadow-lg">{img.alt}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Geometric divider */}
      <div className="relative h-20 bg-background">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full flex items-center gap-4 px-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-primary/40" />
            <div className="flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
              <div className="w-2.5 h-2.5 bg-primary/50 rounded-full" />
              <div className="w-6 h-6 border-2 border-primary/30 rotate-45" />
              <div className="w-2.5 h-2.5 bg-primary/50 rounded-full" />
              <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/20 to-primary/40" />
          </div>
        </div>
      </div>

      {/* Products Preview */}
      <section className="section-padding bg-muted/20 relative">
        {/* Corner decorations */}
        <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-primary/15" />
        <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-primary/15" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-primary/15" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-primary/15" />
        {/* Floating shapes */}
        <div className="absolute top-1/3 left-6 w-20 h-20 border border-accent/10 rotate-12 rounded-lg" />
        <div className="absolute bottom-1/4 right-10 w-14 h-14 border border-primary/10 rounded-full" />

        <div className="container mx-auto relative">
          <SectionHeading
            tag="Produtos"
            title="Soluções Acústicas de Alta Performance"
            description="Materiais certificados com tecnologia de ponta para cada necessidade acústica."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Ver todos os produtos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section className="section-padding relative bg-background">
        <div className="absolute top-0 left-0 right-0 section-divider" />
        {/* Vertical accent lines */}
        <div className="absolute top-20 left-1/4 w-px h-40 bg-gradient-to-b from-primary/15 to-transparent" />
        <div className="absolute top-32 right-1/3 w-px h-28 bg-gradient-to-b from-accent/10 to-transparent" />
        <div className="container mx-auto">
          <SectionHeading
            tag="Soluções"
            title="Para Cada Ambiente, Uma Solução"
            description="Soluções acústicas especializadas para diferentes tipos de espaço."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.slice(0, 3).map((s) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link to={`/solucoes/${s.slug}`} className="glass-card-hover block group overflow-hidden rounded-xl">
                  <div className="aspect-video overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{s.shortDescription}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with full-width image background */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={imgSalaReuniao} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-accent/90" />
        </div>
        {/* Geometric accents */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/40 via-transparent to-primary/40" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary/40 via-transparent to-primary/40" />
        <div className="absolute top-8 right-12 w-24 h-24 border border-primary/20 rounded-full" />
        <div className="absolute bottom-8 left-12 w-16 h-16 border border-primary/15 rotate-45" />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-accent-foreground">
              Pronto para transformar seu espaço?
            </h2>
            <p className="text-accent-foreground/70 mt-4 max-w-lg mx-auto text-lg">
              Solicite um orçamento gratuito e receba uma proposta personalizada para o seu projeto acústico.
            </p>
            <Link
              to="/orcamento"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30 text-lg"
            >
              Solicitar Orçamento <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
