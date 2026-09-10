import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "./primitives";
import painel from "@/assets/curated/home/catalogo-2026/paineis-acusticos.jpeg";
import bassTrap from "@/assets/curated/home/catalogo-2026/bass-trap-corner.webp";
import difusor from "@/assets/curated/home/catalogo-2026/difusor-skyline.webp";
import nuvem from "@/assets/curated/home/revisao-2026/nuvens-acusticas.jpg";
import cortina from "@/assets/curated/home/catalogo-2026/cortina-acustica.webp";
import corporativo from "@/assets/curated/home/catalogo-2026/biombo-corporativo.png";

const categories = [
  { name: "Painel acústico", note: "Absorção de médias e altas", image: painel, to: "/produtos", layout: "sm:col-span-2 lg:col-span-7", media: "min-h-[300px] lg:min-h-[390px]" },
  { name: "Bass trap", note: "Controle modal de graves", image: bassTrap, to: "/produtos", layout: "lg:col-span-5", media: "min-h-[300px] lg:min-h-[390px]" },
  { name: "Difusor", note: "Espalhamento sem perder energia", image: difusor, to: "/produtos", layout: "lg:col-span-4", media: "min-h-[320px] lg:min-h-[440px]" },
  { name: "Nuvem acústica", note: "Tratamento suspenso para tetos altos", image: nuvem, to: "/produtos", layout: "lg:col-span-8", media: "min-h-[320px] lg:min-h-[440px]" },
  { name: "Cortina acústica", note: "Vedação sem obra", image: cortina, to: "/produtos", layout: "lg:col-span-5", media: "min-h-[300px] lg:min-h-[370px]" },
  { name: "Solução corporativa", note: "Forros e divisórias em escala", image: corporativo, to: "/solucoes", layout: "lg:col-span-7", media: "min-h-[300px] lg:min-h-[370px]" },
];

export default function CategoryShowcase() {
  return (
    <Section>
      <div className="relative isolate overflow-hidden rounded-none border-y border-white/10 bg-[#071a31] px-5 py-10 text-white sm:px-8 sm:py-14">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow className="text-[#d9a85f]">Materiais que moldam o som</Eyebrow>
          <SectionTitle className="mt-3 max-w-lg text-white">Materiais que moldam o som</SectionTitle>
        </div>
        <Lead className="lg:max-w-sm lg:text-right">
          Cada material tem um propósito, uma textura e uma resposta acústica.
        </Lead>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {categories.map((category, i) => (
          <Reveal key={category.name} delay={i * 70} className={category.layout}>
            <Link
              to={category.to}
              className="group relative block h-full overflow-hidden rounded-2xl bg-snr-graphite transition-[transform,box-shadow] duration-ui ease-snr hover:-translate-y-1 hover:shadow-[0_22px_48px_-20px_hsl(var(--snr-graphite)/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-snr-ocean"
            >
              <div className={`relative overflow-hidden ${category.media}`}>
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="snr-zoom-media absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-snr-graphite-deep/85 via-snr-graphite-deep/10 to-transparent transition-colors duration-ui group-hover:from-snr-graphite-deep/90" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 lg:p-7">
                <div className="transition-transform duration-ui ease-snr group-hover:-translate-y-1">
                  <h3 className="snr-card-title text-snr-white">{category.name}</h3>
                  <p className="mt-1 text-[13px] text-snr-mineral-200">{category.note}</p>
                </div>
                <ArrowRight
                  className="mb-1 h-5 w-5 shrink-0 text-snr-ocean-light transition-transform duration-ui ease-snr group-hover:translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      </div>
    </Section>
  );
}
