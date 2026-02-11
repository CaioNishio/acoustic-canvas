import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Volume2, Shield, Ruler, Headphones, Star, CheckCircle, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/data/products";
import { solutions } from "@/data/solutions";

// Hero images
import heroMdf from "@/assets/gallery/hero-mdf-vazado.jpg";
import heroDifusores from "@/assets/gallery/hero-difusores-madeira.jpg";
import heroNuvens from "@/assets/gallery/hero-nuvens-acusticas.jpg";
import heroEstudioDark from "@/assets/gallery/hero-estudio-dark.jpeg";
import heroForro from "@/assets/gallery/hero-forro-industrial.jpg";
import heroBafflesColor from "@/assets/gallery/hero-baffles-coloridos.jpeg";
import heroEstudioAzul from "@/assets/gallery/hero-estudio-azul.png";
import heroHomeStudio from "@/assets/gallery/hero-home-studio.jpeg";
import heroBafflesAzuis from "@/assets/gallery/hero-baffles-azuis.jpg";
import heroForroCorp from "@/assets/gallery/hero-forro-corporativo.jpg";

// Existing gallery images
import imgEstudio from "@/assets/gallery/estudio-paineis.jpeg";
import imgSalaReuniao from "@/assets/gallery/paineis-sala-reuniao.png";
import imgNuvem from "@/assets/gallery/nuvem-acustica.webp";
import imgEscritorio from "@/assets/gallery/escritorio-paineis.png";
import imgAcademiaBaffles from "@/assets/gallery/academia-baffles.jpeg";
import imgEscritorioAzuis from "@/assets/gallery/escritorio-paineis-azuis.jpeg";

const spaces = [
  { label: "Estúdios", path: "/solucoes/estudios", image: heroEstudioAzul },
  { label: "Igrejas", path: "/solucoes/igrejas", image: imgNuvem },
  { label: "Auditórios", path: "/solucoes/auditorios", image: heroMdf },
  { label: "Corporativo", path: "/solucoes/corporativo", image: heroForroCorp },
  { label: "Todos os Espaços", path: "/solucoes", image: heroBafflesColor },
];

const features = [
  { icon: Volume2, title: "Alta Absorção", desc: "NRC até 0.95 para controle sonoro profissional" },
  { icon: Shield, title: "Certificação A2", desc: "Materiais com classificação de resistência ao fogo" },
  { icon: Ruler, title: "Sob Medida", desc: "Projetos personalizados para cada ambiente" },
  { icon: Headphones, title: "Consultoria", desc: "Análise acústica profissional inclusa" },
];

const stats = [
  { value: "500+", label: "Projetos Realizados" },
  { value: "98%", label: "Clientes Satisfeitos" },
  { value: "12", label: "Anos de Experiência" },
  { value: "40+", label: "Cores Disponíveis" },
];

const testimonials = [
  { name: "Ricardo Almeida", role: "Engenheiro de Som", text: "Os painéis da Sonar transformaram completamente a acústica do meu estúdio. A qualidade do monitoramento melhorou drasticamente." },
  { name: "Arq. Marina Santos", role: "Arquiteta", text: "Trabalho com a Sonar há 3 anos. A qualidade dos materiais e o suporte técnico são incomparáveis no mercado brasileiro." },
  { name: "Pe. João Silva", role: "Paróquia N.S. Aparecida", text: "Após o tratamento acústico, a inteligibilidade da palavra na igreja melhorou enormemente. Os fiéis agradecem." },
];

const showcaseImages = [
  { img: heroEstudioAzul, label: "Estúdio Musical" },
  { img: heroBafflesAzuis, label: "Baffles Suspensos" },
  { img: heroDifusores, label: "Difusores Skyline" },
  { img: heroForroCorp, label: "Forro Corporativo" },
];

const HomePage = () => {
  return (
    <Layout>
      {/* ===== HERO — Full-width horizontal image ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroEstudioAzul} alt="Tratamento acústico profissional" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(205,78%,12%)]/90 via-[hsl(205,78%,12%)]/60 to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-secondary text-sm font-bold tracking-[0.3em] uppercase mb-5">
              Projetado por Especialistas
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white">
              A Referência em<br />Tratamento Acústico
            </h1>
            <p className="text-white/60 mt-6 text-lg max-w-lg leading-relaxed">
              Painéis, difusores e bass traps de alta performance para transformar qualquer ambiente.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/produtos" className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-secondary/90 transition-all text-sm shadow-lg shadow-secondary/30">
                Ver Produtos <ArrowRight size={16} />
              </Link>
              <Link to="/orcamento" className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all text-sm">
                Solicitar Orçamento
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Spaces navigation — horizontal cards ===== */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {spaces.map((space) => (
              <Link key={space.path} to={space.path} className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
                <img src={space.image} alt={space.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.5] group-hover:brightness-[0.4]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(205,78%,12%)]/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="text-white font-bold text-base md:text-lg drop-shadow-lg">{space.label}</h3>
                  <ArrowRight size={16} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Stats bar ===== */}
      <section className="bg-primary py-14">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary-foreground">{s.value}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Showcase — large horizontal images ===== */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-6">
          <SectionHeading tag="Galeria" title="Ambientes Transformados" description="Veja como nossos produtos transformam espaços reais." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {showcaseImages.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group overflow-hidden rounded-2xl aspect-[16/9]"
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(205,78%,12%)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-5 left-5">
                  <span className="text-white font-bold text-lg drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Best Sellers ===== */}
      <section className="py-20 px-6 bg-[hsl(210,15%,97%)]">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="text-secondary text-sm font-bold tracking-[0.3em] uppercase">Destaques</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 tracking-tight">Mais Vendidos</h2>
            <p className="text-muted-foreground mt-3 text-lg">Os favoritos de arquitetos e engenheiros acústicos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/produtos" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm">
              Ver todos os produtos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Features strip — dark blue glass ===== */}
      <section className="bg-[hsl(205,78%,12%)] text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 border border-white/10">
                  <f.icon className="text-secondary" size={26} />
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-sm text-white/50 mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Full-width gallery strip ===== */}
      <section className="bg-background py-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {[heroMdf, heroNuvens, heroForro, heroHomeStudio].map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative group overflow-hidden aspect-[4/3]">
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-[hsl(205,78%,12%)]/0 group-hover:bg-[hsl(205,78%,12%)]/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Solutions by space ===== */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <SectionHeading tag="Soluções" title="Para Cada Ambiente, Uma Solução" description="Soluções acústicas especializadas para diferentes tipos de espaço." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {solutions.slice(0, 3).map((s) => (
              <motion.div key={s.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Link to={`/solucoes/${s.slug}`} className="block group bg-background rounded-2xl overflow-hidden border border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/[0.06]">
                  <div className="aspect-video overflow-hidden rounded-t-2xl">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.shortDescription}</p>
                    <span className="inline-flex items-center gap-1.5 text-secondary text-sm font-semibold mt-4 group-hover:gap-2.5 transition-all">
                      Saiba mais <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Full catalog ===== */}
      <section className="py-20 px-6 bg-[hsl(210,15%,97%)]">
        <div className="container mx-auto">
          <SectionHeading tag="Catálogo" title="Soluções Acústicas de Alta Performance" description="Materiais certificados com tecnologia de ponta para cada necessidade." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {products.slice(0, 9).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/produtos" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm">
              Ver catálogo completo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="text-secondary text-sm font-bold tracking-[0.3em] uppercase">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">O Que Nossos Clientes Dizem</h2>
            <p className="text-muted-foreground mt-3">Feedback de profissionais que confiam na Sonar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-background rounded-2xl p-7 border border-border/60 hover:border-primary/20 transition-all hover:shadow-lg">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.text}"</p>
                <div className="mt-5 pt-5 border-t border-border/60">
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Why choose us ===== */}
      <section className="py-20 px-6 bg-[hsl(210,15%,97%)]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-secondary text-sm font-bold tracking-[0.3em] uppercase">Diferenciais</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Por Que Escolher a Sonar?</h2>
              <p className="text-muted-foreground mt-5 leading-relaxed">
                Com mais de uma década de experiência em tratamento acústico, a Sonar Acústicos se consolidou como referência no mercado brasileiro. Combinamos engenharia acústica de ponta com design contemporâneo.
              </p>
              <ul className="mt-7 space-y-3">
                {["Materiais certificados com classe de fogo A2", "Mais de 40 opções de cores e acabamentos", "Projetos personalizados com consultoria técnica", "Fabricação própria com controle de qualidade", "Entrega e instalação em todo o Brasil"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contato" className="inline-flex items-center gap-2 mt-9 px-7 py-3.5 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors text-sm">
                Fale com um Especialista <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={heroBafflesColor} alt="Baffles acústicos" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4] mt-10">
                <img src={imgEscritorioAzuis} alt="Escritório com painéis" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Partners strip ===== */}
      <section className="bg-[hsl(205,78%,12%)] text-white py-14">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users size={20} className="text-secondary" />
            <p className="text-sm font-bold tracking-wider uppercase">Clientes que confiam na Sonar</p>
          </div>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Arquitetos, engenheiros, estúdios de gravação, igrejas, teatros e empresas de todo o Brasil escolhem a Sonar para seus projetos acústicos.
          </p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroMdf} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[hsl(205,78%,12%)]/85" />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Pronto para transformar seu espaço?</h2>
            <p className="text-white/50 mt-5 max-w-lg mx-auto text-lg">Solicite um orçamento gratuito e receba uma proposta personalizada.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link to="/orcamento" className="inline-flex items-center gap-2 px-9 py-4 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-secondary/90 transition-colors shadow-xl shadow-secondary/30 text-lg">
                Solicitar Orçamento <ArrowRight size={18} />
              </Link>
              <Link to="/contato" className="inline-flex items-center gap-2 px-9 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-lg">
                Falar com Especialista
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
