import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "@/components/sonar/primitives";
import { projects } from "@/data/projects";

export default function ProjetosPage() {
  return (
    <Layout>
      <div className="snr-home bg-snr-white">
        {/* Abertura em grafite: separa a página do cabeçalho e dá peso ao portfólio */}
        <Section tone="dark">
          <div className="max-w-2xl">
            <Eyebrow className="text-snr-ocean-light">Portfólio</Eyebrow>
            <SectionTitle className="mt-3 text-snr-white">Nossos projetos</SectionTitle>
            <Lead className="mt-4 text-snr-mineral-300">
              Ambientes reais entregues pela Sonar Acústicos — do diagnóstico à instalação.
            </Lead>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <Link
                  to={`/projetos/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-snr-paper transition-shadow duration-ui ease-snr hover:shadow-[0_20px_48px_-22px_hsl(var(--snr-graphite)/0.4)]"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="snr-zoom-media h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="snr-caption text-snr-ocean">{p.category}</span>
                    <h3 className="snr-card-title mt-2 text-snr-graphite">{p.title}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-[13px] text-snr-mineral-500">
                      <MapPin size={13} strokeWidth={1.5} aria-hidden="true" /> {p.location}
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium text-snr-petrol transition-colors duration-micro ease-snr group-hover:text-snr-ocean">
                      Ver projeto
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-ui ease-snr group-hover:translate-x-1"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>
    </Layout>
  );
}
