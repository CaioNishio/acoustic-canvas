import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import estudioPaineis from "@/assets/gallery/estudio-paineis.webp";
import igrejaSalaEscura from "@/assets/gallery/igreja-sala-escura.webp";
import auditorioPaineis from "@/assets/gallery/auditorio-paineis-acusticos.jpeg";
import forroCorporativo from "@/assets/gallery/forro-corporativo.webp";
import hexagonaisTeto from "@/assets/gallery/hexagonais-teto.webp";
import salaTratamento from "@/assets/gallery/sala-tratamento-acustico.jpeg";
import produtorEstudio from "@/assets/gallery/produtor-musical-estudio.webp";
import forroRestaurante from "@/assets/gallery/forro-restaurante-corporativo.jpg";

interface EnvironmentCard {
  application: string;
  image: string;
}

const environments: EnvironmentCard[] = [
  { application: "Estúdio", image: estudioPaineis },
  { application: "Igreja", image: igrejaSalaEscura },
  { application: "Auditório", image: auditorioPaineis },
  { application: "Corporativo", image: forroCorporativo },
  { application: "Residencial", image: hexagonaisTeto },
  { application: "Home Theater", image: salaTratamento },
  { application: "Podcast", image: produtorEstudio },
  { application: "Restaurante", image: forroRestaurante },
];

export default function GikEnvironments() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="bg-[rgb(253,254,254)] py-[72px] font-['Lexend'] text-[rgb(11,14,17)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Title */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-base font-medium">Tratamento Acústico Profissional</p>
            <h2 className="mt-2 font-['Lexend_Giga'] text-3xl font-bold uppercase tracking-tight md:text-4xl">
              Para Cada Ambiente
            </h2>
          </div>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scroll(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[rgb(11,14,17)] transition-opacity hover:opacity-60"
            >
              <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Próximo"
              onClick={() => scroll(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[rgb(11,14,17)] transition-opacity hover:opacity-60"
            >
              <ArrowRight className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {environments.map((env) => (
            <Link
              key={env.application}
              to="/produtos"
              className="group relative block aspect-[4/5] w-[75vw] shrink-0 snap-start overflow-hidden rounded-lg bg-[rgb(11,14,17)] sm:w-[45vw] lg:w-[calc((100%-3.75rem)/4)]"
            >
              <img
                src={env.image}
                alt={`Tratamento acústico para ${env.application}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-80 grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(11,14,17)]/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-[rgb(253,254,254)]">
                <span className="text-lg font-semibold">{env.application}</span>
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
