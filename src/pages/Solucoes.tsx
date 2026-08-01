import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "@/components/sonar/primitives";
import { solutions } from "@/data/solutions";

export default function SolucoesPage() {
  return (
    <Layout>
      <div className="snr-home bg-snr-white">
        <Section tone="paper">
          <div className="max-w-2xl">
            <Eyebrow>Ambientes</Eyebrow>
            <SectionTitle className="mt-3">Soluções por ambiente</SectionTitle>
            <Lead className="mt-4">
              Cada espaço falha de um jeito diferente. Escolha o seu e veja o diagnóstico, a
              abordagem e os produtos indicados.
            </Lead>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {solutions.map((s, i) => (
              <Reveal key={s.slug} delay={i * 70}>
                <Link
                  to={`/solucoes/${s.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-snr-graphite shadow-[0_18px_44px_-24px_hsl(var(--snr-graphite)/0.4)] transition-shadow duration-ui ease-snr hover:shadow-[0_24px_56px_-20px_hsl(var(--snr-graphite)/0.5)] sm:aspect-[16/10]"
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="snr-zoom-media absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-snr-graphite-deep/90 via-snr-graphite-deep/30 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="snr-title text-snr-white">{s.title}</h3>
                    <p className="mt-2 max-w-md text-[14px] leading-snug text-snr-mineral-300">
                      {s.shortDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-snr-ocean-light">
                      Saiba mais <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
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
