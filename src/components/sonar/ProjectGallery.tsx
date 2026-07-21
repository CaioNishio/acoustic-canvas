import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Lead, Reveal, Rule, Section, SectionTitle } from "./primitives";
import { SonarButton } from "./Button";
import { projects } from "@/data/projects";

/**
 * Galeria editorial de projetos — portfólio arquitetônico com estudo de caso.
 * Imagem ocupa 60%, informação 40%, alternando lados a cada projeto.
 */
export default function ProjectGallery() {
  const featured = projects.slice(0, 3);

  return (
    <Section id="projetos">
      <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Projetos realizados</Eyebrow>
          <SectionTitle className="mt-3 max-w-lg">Ambientes que já soam diferente</SectionTitle>
        </div>
        <Lead className="lg:max-w-sm lg:text-right">
          Desafio acústico, solução aplicada e o resultado percebido em cada entrega.
        </Lead>
      </div>

      <div className="flex flex-col">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={i * 60}>
            <article>
              {i > 0 && <div className="py-10 lg:py-14"><Rule /></div>}

              <div className="grid items-center gap-8 lg:grid-cols-10 lg:gap-14">
                <Link
                  to={`/projetos/${project.slug}`}
                  aria-label={`Ver o projeto ${project.title}`}
                  className={`group relative block aspect-[16/10] overflow-hidden rounded-2xl bg-snr-graphite lg:col-span-6 ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="snr-zoom-media absolute inset-0 h-full w-full object-cover"
                  />
                </Link>

                <div className={`lg:col-span-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className="snr-caption text-snr-ocean">{project.category}</span>
                    <span className="text-[13px] text-snr-mineral-500">{project.location}</span>
                  </div>

                  <h3 className="snr-card-title mt-3 text-snr-graphite">{project.title}</h3>

                  <p className="mt-4 line-clamp-4 text-[15px] leading-relaxed text-snr-mineral-700">
                    {project.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.materials.slice(0, 3).map((material) => (
                      <li
                        key={material}
                        className="rounded-full border border-snr-mineral-100 px-3 py-1 text-[12px] text-snr-mineral-700"
                      >
                        {material}
                      </li>
                    ))}
                  </ul>

                  {project.testimonial && (
                    <p className="mt-5 border-l-2 border-snr-ocean pl-4 text-[14px] italic leading-relaxed text-snr-graphite">
                      “{project.testimonial.text}”
                      <span className="mt-1.5 block not-italic text-[12px] text-snr-mineral-500">
                        {project.testimonial.author} — {project.testimonial.role}
                      </span>
                    </p>
                  )}

                  <Link
                    to={`/projetos/${project.slug}`}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-snr-petrol transition-colors duration-micro ease-snr hover:text-snr-ocean"
                  >
                    Ver o projeto
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-14">
        <SonarButton to="/projetos" variant="secondary">
          Ver todos os projetos
        </SonarButton>
      </div>
    </Section>
  );
}
