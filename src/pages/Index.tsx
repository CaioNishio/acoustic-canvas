import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Volume2, Shield, Ruler, Headphones } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/data/products";
import { solutions } from "@/data/solutions";
const features = [{
  icon: Volume2,
  title: "Alta Absorção",
  desc: "NRC até 0.95 para controle sonoro profissional"
}, {
  icon: Shield,
  title: "Certificação A2",
  desc: "Materiais com classificação de resistência ao fogo"
}, {
  icon: Ruler,
  title: "Sob Medida",
  desc: "Projetos personalizados para cada ambiente"
}, {
  icon: Headphones,
  title: "Consultoria",
  desc: "Análise acústica profissional inclusa"
}];
const HomePage = () => {
  return <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20 bg-accent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="max-w-3xl">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Tratamento Acústico Profissional
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-4 leading-[1.1]">
              O som perfeito começa com a{" "}
              <span className="text-gradient">acústica certa</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-xl">
              Painéis acústicos, bass traps, difusores e soluções completas para estúdios, 
              igrejas, auditórios e ambientes corporativos.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/produtos" className="px-6 py-3 text-primary-foreground font-semibold rounded-md transition-colors inline-flex items-center gap-2 bg-destructive-foreground border-destructive-foreground">
                Ver Produtos <ArrowRight size={16} />
              </Link>
              <Link to="/orcamento" className="px-6 py-3 border border-border text-foreground font-semibold rounded-md hover:bg-secondary transition-colors">
                Solicitar Orçamento
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => <motion.div key={f.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.1
          }} className="glass-card p-6 text-center">
                <f.icon className="mx-auto text-primary mb-3" size={28} />
                <h3 className="font-display font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto">
          <SectionHeading tag="Produtos" title="Soluções Acústicas de Alta Performance" description="Materiais certificados com tecnologia de ponta para cada necessidade acústica." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/produtos" className="text-primary font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
              Ver todos os produtos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading tag="Soluções" title="Para Cada Ambiente, Uma Solução" description="Soluções acústicas especializadas para diferentes tipos de espaço." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.slice(0, 3).map(s => <motion.div key={s.slug} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
                <Link to={`/solucoes/${s.slug}`} className="glass-card-hover block group overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{s.shortDescription}</p>
                  </div>
                </Link>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Pronto para transformar seu espaço?
              </h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                Solicite um orçamento gratuito e receba uma proposta personalizada para o seu projeto acústico.
              </p>
              <Link to="/orcamento" className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors">
                Solicitar Orçamento <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default HomePage;