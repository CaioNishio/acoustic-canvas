import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { projects } from "@/data/projects";

export default function ProjetoDetalhePage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <p className="text-muted-foreground">Projeto não encontrado.</p>
          <Link to="/projetos" className="text-primary mt-4 inline-block">Voltar</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative h-[50vh] flex items-end overflow-hidden">
        <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="container mx-auto px-4 pb-12 relative z-10">
          <Link to="/projetos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={14} /> Voltar
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">{project.category}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-1">{project.title}</h1>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground">
              <MapPin size={14} /> {project.location}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>

          {/* Materials */}
          <div className="mt-10">
            <h2 className="font-display text-xl font-bold mb-4">Materiais Utilizados</h2>
            <div className="flex flex-wrap gap-2">
              {project.materials.map((m) => (
                <span key={m} className="px-3 py-1 text-sm glass-card">{m}</span>
              ))}
            </div>
          </div>

          {/* Gallery */}
          {project.gallery.length > 1 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery.map((img, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <img src={img} alt="" className="w-full aspect-video object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          )}

          {/* Testimonial */}
          {project.testimonial && (
            <div className="mt-12 glass-card p-8 relative">
              <Quote className="text-primary/20 absolute top-4 left-4" size={40} />
              <blockquote className="text-lg italic text-foreground/90 pl-8">
                "{project.testimonial.text}"
              </blockquote>
              <div className="mt-4 pl-8">
                <p className="font-semibold">{project.testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{project.testimonial.role}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
