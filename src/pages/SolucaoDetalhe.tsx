import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shared/ProductCard";
import { solutions } from "@/data/solutions";
import { products } from "@/data/products";

export default function SolucaoDetalhePage() {
  const { slug } = useParams();
  const solution = solutions.find((s) => s.slug === slug);

  if (!solution) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <p className="text-muted-foreground">Solução não encontrada.</p>
          <Link to="/solucoes" className="text-primary mt-4 inline-block">Voltar</Link>
        </div>
      </Layout>
    );
  }

  const recommended = products.filter((p) => solution.recommendedProducts.includes(p.slug));

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] flex items-end overflow-hidden">
        <img src={solution.image} alt={solution.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="container mx-auto px-4 pb-12 relative z-10">
          <Link to="/solucoes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={14} /> Voltar
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold">
            {solution.title}
          </motion.h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold mb-3">O Problema</h2>
              <p className="text-muted-foreground leading-relaxed">{solution.problem}</p>
            </div>
            <div className="glow-line" />
            <div>
              <h2 className="font-display text-2xl font-bold mb-3">Nossa Abordagem</h2>
              <p className="text-muted-foreground leading-relaxed">{solution.approach}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      {recommended.length > 0 && (
        <section className="section-padding bg-secondary/20">
          <div className="container mx-auto">
            <h2 className="font-display text-2xl font-bold mb-8 text-center">Produtos Recomendados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-2xl font-bold">Precisa de um projeto para {solution.title.toLowerCase()}?</h2>
          <p className="text-muted-foreground mt-2">Solicite um orçamento e nossa equipe técnica irá dimensionar a melhor solução.</p>
          <Link to="/orcamento" className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors">
            Solicitar Orçamento <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
