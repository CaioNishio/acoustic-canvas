import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import { solutions } from "@/data/solutions";

export default function SolucoesPage() {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading
            tag="Soluções"
            title="Soluções por Ambiente"
            description="Cada espaço tem suas particularidades acústicas. Conheça nossas soluções especializadas."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/solucoes/${s.slug}`} className="glass-card-hover block group overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                    <p className="text-base text-muted-foreground mt-2">{s.shortDescription}</p>
                    <span className="inline-flex items-center gap-1 mt-3 text-primary text-base font-medium">
                      Saiba mais <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
