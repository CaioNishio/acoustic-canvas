import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Volume2, Shield, Ruler, Headphones } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/data/products";
import { solutions } from "@/data/solutions";

const features = [
  { icon: Volume2, title: "Alta Absorção", desc: "NRC até 0.95 para controle sonoro profissional" },
  { icon: Shield, title: "Certificação A2", desc: "Materiais com classificação de resistência ao fogo" },
  { icon: Ruler, title: "Sob Medida", desc: "Projetos personalizados para cada ambiente" },
  { icon: Headphones, title: "Consultoria", desc: "Análise acústica profissional inclusa" },
];

const HomePage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-accent">
        {/* Geometric elements */}
        <div className="absolute top-20 right-20 w-96 h-96 border border-primary/20 rounded-full" />
        <div className="absolute top-40 right-40 w-64 h-64 border border-primary/10 rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-px bg-primary/30" />
        <div className="absolute bottom-28 left-10 w-32 h-px bg-primary/20" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary/40 rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-primary/30 rounded-full" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
              Tratamento Acústico Profissional
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-6 leading-[1.1] text-accent-foreground">
              O som perfeito começa com a{" "}
              <span className="text-primary">acústica certa</span>
            </h1>
            <p className="text-lg mt-6 max-w-xl text-accent-foreground/70">
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
                className="px-7 py-3.5 border-2 border-accent-foreground/30 text-accent-foreground font-semibold rounded-lg hover:bg-accent-foreground/10 transition-colors"
              >
                Solicitar Orçamento
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center rounded-xl border-t-2 border-t-primary/30"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="section-padding bg-muted/30 relative">
        <div className="absolute top-0 left-0 right-0 section-divider" />
        <div className="absolute top-20 left-10 w-20 h-20 border border-primary/10 rotate-45" />
        <div className="absolute bottom-10 right-20 w-16 h-16 border border-accent/10 rounded-full" />
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
      <section className="section-padding relative">
        <div className="absolute top-0 left-0 right-0 section-divider" />
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

      {/* CTA */}
      <section className="section-padding relative">
        <div className="absolute top-0 left-0 right-0 section-divider" />
        <div className="container mx-auto">
          <div className="bg-accent rounded-2xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 border border-primary/20 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border border-primary/10 rounded-full -translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary/30 rounded-full" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground">
                Pronto para transformar seu espaço?
              </h2>
              <p className="text-accent-foreground/70 mt-3 max-w-lg mx-auto">
                Solicite um orçamento gratuito e receba uma proposta personalizada para o seu projeto acústico.
              </p>
              <Link
                to="/orcamento"
                className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
              >
                Solicitar Orçamento <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
