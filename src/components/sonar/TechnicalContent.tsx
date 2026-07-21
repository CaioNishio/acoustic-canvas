import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Lead, Rule, Section, SectionTitle } from "./primitives";
import { educationalArticles } from "@/data/educationalArticles";
import heroArticle from "@/assets/gallery/auditorio-paineis-acusticos.jpeg";
import mid1 from "@/assets/gallery/paineis-sala-reuniao.webp";
import mid2 from "@/assets/gallery/estudio-paineis.webp";

/** Notas técnicas curtas — terceiro nível da hierarquia editorial. */
const notes = [
  { title: "Inteligibilidade da fala", text: "Por que clareza não é volume." },
  { title: "Tempo de reverberação", text: "O que o RT60 diz sobre o seu espaço." },
  { title: "Absorção x isolamento", text: "Dois problemas, duas soluções distintas." },
];

export default function TechnicalContent() {
  const [featured, ...rest] = educationalArticles;
  const secondary = rest.slice(0, 2);
  const midImages = [mid1, mid2];

  return (
    <Section tone="paper" id="conteudo">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>A ciência do som</Eyebrow>
          <SectionTitle className="mt-3 max-w-lg">Entenda antes de investir</SectionTitle>
        </div>
        <Lead className="lg:max-w-sm lg:text-right">
          Material técnico escrito por quem projeta e fabrica — sem jargão desnecessário.
        </Lead>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Nível 1 — artigo principal */}
        {featured && (
          <Link
            to={`/aprender/${featured.slug}`}
            className="group relative block min-h-[380px] overflow-hidden rounded-2xl bg-snr-graphite lg:col-span-7 lg:min-h-[460px]"
          >
            <img
              src={heroArticle}
              alt={featured.title}
              loading="lazy"
              className="snr-zoom-media absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-snr-graphite-deep/92 via-snr-graphite-deep/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <span className="snr-caption text-snr-ocean-light">Artigo principal</span>
              <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-snr-white lg:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-snr-mineral-300">
                {featured.subtitle}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-snr-white">
                Ler artigo
                <ArrowRight className="h-4 w-4 transition-transform duration-micro ease-snr group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
              </span>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-8 lg:col-span-5">
          {/* Nível 2 — dois artigos médios */}
          <div className="flex flex-col gap-6">
            {secondary.map((article, i) => (
              <Link key={article.slug} to={`/aprender/${article.slug}`} className="group flex gap-5">
                <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-snr-mineral-100">
                  <img
                    src={midImages[i]}
                    alt={article.title}
                    loading="lazy"
                    className="snr-zoom-media absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-base font-medium leading-snug text-snr-graphite transition-colors duration-micro ease-snr group-hover:text-snr-petrol">
                    {article.title}
                  </h4>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-snr-mineral-700">
                    {article.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Rule variant="technical" />

          {/* Nível 3 — notas técnicas */}
          <ul className="flex flex-col gap-3">
            {notes.map((note) => (
              <li key={note.title} className="flex items-baseline justify-between gap-4">
                <span className="font-display text-sm font-medium text-snr-graphite">{note.title}</span>
                <span className="text-right text-[13px] text-snr-mineral-700">{note.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
