import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Volume2, Shield, Ruler, Headphones } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/data/products";

// Gallery images
import imgEstudio from "@/assets/gallery/estudio-paineis.jpeg";
import imgSalaReuniao from "@/assets/gallery/paineis-sala-reuniao.png";
import imgBaffles from "@/assets/gallery/baffles-coloridos.jpg";
import imgNuvem from "@/assets/gallery/nuvem-acustica.webp";
import imgForro from "@/assets/gallery/forro-corporativo.jpg";
import imgAcademiaBaffles from "@/assets/gallery/academia-baffles.jpeg";
import imgEscritorioAzuis from "@/assets/gallery/escritorio-paineis-azuis.jpeg";
import imgEscritorio from "@/assets/gallery/escritorio-paineis.png";

const spaces = [
  { label: "Estúdios", path: "/solucoes/estudios", image: imgEstudio },
  { label: "Igrejas", path: "/solucoes/igrejas", image: imgNuvem },
  { label: "Auditórios", path: "/solucoes/auditorios", image: imgSalaReuniao },
  { label: "Corporativo", path: "/solucoes/corporativo", image: imgEscritorio },
  { label: "Todos os Espaços", path: "/solucoes", image: imgAcademiaBaffles },
];

const features = [
  { icon: Volume2, title: "Alta Absorção", desc: "NRC até 0.95 para controle sonoro profissional" },
  { icon: Shield, title: "Certificação A2", desc: "Materiais com classificação de resistência ao fogo" },
  { icon: Ruler, title: "Sob Medida", desc: "Projetos personalizados para cada ambiente" },
  { icon: Headphones, title: "Consultoria", desc: "Análise acústica profissional inclusa" },
];

const HomePage = () => {
  return (
    <Layout>
      {/* Spaces Navigation Cards — GIK style */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {spaces.map((space, i) => (
              <Link
                key={space.path}
                to={space.path}
                className="group relative overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={space.image}
                  alt={space.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.55] group-hover:brightness-[0.45]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <h3 className="text-white font-display font-bold text-base md:text-lg leading-tight drop-shadow-lg">
                    {space.label}
                  </h3>
                  <ArrowRight
                    size={16}
                    className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hero — full width image with overlay text */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={imgBaffles} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-secondary/30" />
        </div>
        {/* Subtle geometric lines */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-primary/30 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-4">
              Projetado por Especialistas. Aprovado por Profissionais.
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white">
              A Referência em Tratamento Acústico
            </h1>
            <div className="mt-8">
              <Link
                to="/produtos"
                className="inline-flex items-center gap-3 px-7 py-4 bg-card text-foreground font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm"
              >
                Descubra Todos os Produtos <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Thin accent line */}
      <div className="h-1 bg-primary" />

      {/* Best Sellers */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight">MAIS VENDIDOS</h2>
            <p className="text-muted-foreground mt-3 text-lg">Os favoritos de arquitetos e engenheiros acústicos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-foreground text-foreground font-semibold rounded-full hover:bg-foreground hover:text-background transition-colors text-sm"
            >
              Ver todos os produtos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full border-2 border-primary/40 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-display font-semibold text-base">{f.title}</h3>
                <p className="text-sm text-secondary-foreground/60 mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width gallery strip */}
      <section className="bg-background py-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {[imgEstudio, imgEscritorioAzuis, imgForro, imgSalaReuniao].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group overflow-hidden aspect-[4/3]"
            >
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <SectionHeading
            tag="Catálogo"
            title="Soluções Acústicas de Alta Performance"
            description="Materiais certificados com tecnologia de ponta para cada necessidade."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
            >
              Ver catálogo completo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={imgSalaReuniao} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-secondary/90" />
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Pronto para transformar seu espaço?
            </h2>
            <p className="text-white/60 mt-4 max-w-lg mx-auto text-lg">
              Solicite um orçamento gratuito e receba uma proposta personalizada.
            </p>
            <Link
              to="/orcamento"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-xl shadow-primary/30 text-lg"
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
