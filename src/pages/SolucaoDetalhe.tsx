import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shared/ProductCard";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "@/components/sonar/primitives";
import { SonarButton } from "@/components/sonar/Button";
import { solutions } from "@/data/solutions";
import { products } from "@/data/products";

export default function SolucaoDetalhePage() {
  const { slug } = useParams();
  const solution = solutions.find((s) => s.slug === slug);

  if (!solution) {
    return (
      <Layout>
        <div className="snr-home flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-snr-white text-center">
          <p className="snr-body text-snr-mineral-700">Solução não encontrada.</p>
          <Link to="/solucoes" className="text-sm font-medium text-snr-petrol hover:text-snr-ocean">
            Voltar
          </Link>
        </div>
      </Layout>
    );
  }

  const recommended = products.filter((p) => solution.recommendedProducts.includes(p.slug));

  return (
    <Layout>
      <div className="snr-home bg-snr-white">
        {/* Hero */}
        <section className="relative flex h-[56vh] min-h-[420px] items-end overflow-hidden bg-snr-graphite">
          <img
            src={solution.image}
            alt={solution.title}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-snr-graphite-deep/95 via-snr-graphite-deep/50 to-snr-graphite-deep/10" />
          <div className="snr-container relative z-10 pb-12">
            <Link
              to="/solucoes"
              className="inline-flex items-center gap-1.5 text-sm text-snr-mineral-300 transition-colors hover:text-snr-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Voltar
            </Link>
            <p className="snr-caption snr-rule-editorial mt-5 text-snr-white/75">{solution.environment}</p>
            <h1 className="snr-display-hero mt-4 text-snr-white">{solution.title}</h1>
          </div>
        </section>

        <Section tone="paper">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2">
            <Reveal>
              <Eyebrow>O problema</Eyebrow>
              <p className="snr-body snr-measure mt-4 text-snr-mineral-700">{solution.problem}</p>
            </Reveal>
            <Reveal delay={80}>
              <Eyebrow>Nossa abordagem</Eyebrow>
              <p className="snr-body snr-measure mt-4 text-snr-mineral-700">{solution.approach}</p>
            </Reveal>
          </div>
        </Section>

        {/* Gallery */}
        {solution.gallery && solution.gallery.length > 0 && (
          <Section>
            <SectionTitle className="mb-8 text-center">Galeria de projetos</SectionTitle>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {solution.gallery.map((img, i) => (
                <Reveal key={img} delay={i * 50}>
                  <div className="group aspect-square overflow-hidden rounded-2xl bg-snr-paper">
                    <img
                      src={img}
                      alt={`${solution.title} — projeto ${i + 1}`}
                      className="snr-zoom-media h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {/* Recommended Products */}
        {recommended.length > 0 && (
          <Section tone="wash">
            <SectionTitle className="mb-8 text-center">Produtos recomendados</SectionTitle>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </Section>
        )}

        {/* CTA */}
        <Section>
          <div className="mx-auto max-w-xl text-center">
            <SectionTitle>Precisa de um projeto para {solution.title.toLowerCase()}?</SectionTitle>
            <Lead className="mx-auto mt-3">
              Solicite um orçamento e nossa equipe técnica irá dimensionar a melhor solução.
            </Lead>
            <div className="mt-8 flex justify-center">
              <SonarButton to="/orcamento" variant="primary" size="lg">
                Solicitar orçamento <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </SonarButton>
            </div>
          </div>
        </Section>
      </div>
    </Layout>
  );
}
