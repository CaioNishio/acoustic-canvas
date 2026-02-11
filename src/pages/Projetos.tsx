import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import { projects } from "@/data/projects";

export default function ProjetosPage() {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading tag="Portfólio" title="Nossos Projetos" description="Conheça alguns dos projetos realizados pela Sonar Acústicos." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/projetos/${p.slug}`} className="glass-card-hover block group overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider">{p.category}</span>
                    <h3 className="font-display text-lg font-semibold mt-1">{p.title}</h3>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin size={12} /> {p.location}
                    </div>
                    <span className="inline-flex items-center gap-1 mt-3 text-primary text-sm font-medium">
                      Ver projeto <ArrowRight size={14} />
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
