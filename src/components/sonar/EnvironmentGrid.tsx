import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "./primitives";
import restaurante from "@/assets/curated/home/ambiente-restaurante.png";
import igreja from "@/assets/gallery/igreja-templo-paineis.png";
import escritorio from "@/assets/curated/home/revisao-2026/escritorio-com-paineis.jpeg";
import estudio from "@/assets/curated/home/revisao-2026/estudio-com-paineis.webp";
import auditorio from "@/assets/curated/home/ambiente-auditorio.png";
import escola from "@/assets/curated/home/ambiente-escola.jpg";
import ImageBandOverlay from "./ImageBandOverlay";

interface Environment {
  name: string;
  problem: string;
  solution: string;
  image: string;
  to: string;
  /** colunas ocupadas no grid de 12 */
  span: string;
  height: string;
}

const environments: Environment[] = [
  {
    name: "Restaurante",
    problem: "Ruído de fundo que sobe junto com a lotação",
    solution: "Forros e nuvens absorventes",
    image: restaurante,
    to: "/solucoes",
    span: "lg:col-span-7",
    height: "min-h-[320px] lg:min-h-[430px]",
  },
  {
    name: "Templo",
    problem: "Palavra pouco inteligível em nave alta",
    solution: "Absorção seletiva sem matar a nave",
    image: igreja,
    to: "/solucoes/igrejas",
    span: "lg:col-span-5",
    height: "min-h-[360px] lg:min-h-[520px]",
  },
  {
    name: "Escritório",
    problem: "Conversas cruzadas em planta aberta",
    solution: "Divisórias e absorção entre estações",
    image: escritorio,
    to: "/solucoes/corporativo",
    span: "lg:col-span-4",
    height: "min-h-[340px] lg:min-h-[390px]",
  },
  {
    name: "Estúdio",
    problem: "Reflexões primárias borrando a mixagem",
    solution: "Painéis nos pontos de reflexão e bass traps",
    image: estudio,
    to: "/solucoes/estudios",
    span: "lg:col-span-4",
    height: "min-h-[340px] lg:min-h-[460px]",
  },
  {
    name: "Auditório",
    problem: "Eco no fundo da plateia",
    solution: "Difusão ao fundo e absorção lateral",
    image: auditorio,
    to: "/solucoes/auditorios",
    span: "lg:col-span-4",
    height: "min-h-[340px] lg:min-h-[390px]",
  },
  {
    name: "Escola",
    problem: "Esforço de escuta derrubando a atenção",
    solution: "Baffles suspensos em sala de aula",
    image: escola,
    to: "/solucoes",
    span: "lg:col-span-12",
    height: "min-h-[300px] lg:min-h-[380px]",
  },
];

export default function EnvironmentGrid() {
  return (
    <Section tone="paper" id="ambientes">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Aplicações</Eyebrow>
          <SectionTitle className="mt-3 max-w-lg">Você reconhece o seu ambiente antes de escolher o produto</SectionTitle>
        </div>
        <Lead className="lg:max-w-sm lg:text-right">
          Cada tipo de espaço falha de um jeito diferente. Comece pelo seu.
        </Lead>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {environments.map((env, i) => (
          <Reveal key={env.name} delay={i * 60} className={env.span}>
            <Link
              to={env.to}
              className={`group relative block h-full overflow-hidden rounded-2xl bg-snr-graphite transition-[transform,box-shadow] duration-ui ease-snr hover:-translate-y-1 hover:shadow-[0_24px_50px_-22px_hsl(var(--snr-graphite)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-snr-ocean ${env.height}`}
            >
              <img
                src={env.image}
                alt={`Tratamento acústico para ${env.name.toLowerCase()}`}
                loading="lazy"
                className="snr-zoom-media absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-snr-graphite-deep/90 via-snr-graphite-deep/25 to-transparent" />
              <ImageBandOverlay />

              <div className="absolute inset-x-0 bottom-0 z-[3] p-6">
                <h3 className="snr-card-title text-snr-white">{env.name}</h3>

                {/* revelado no hover — problema, solução e ação */}
                <div className="mt-2 grid grid-rows-[0fr] transition-[grid-template-rows] duration-ui ease-snr group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="text-[13px] leading-snug text-snr-mineral-300">{env.problem}</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-snr-white">{env.solution}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-snr-ocean-light">
                      Explorar <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
