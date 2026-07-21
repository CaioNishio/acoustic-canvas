import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "./primitives";
import painel from "@/assets/products/painel-acustico-snr3250/image00017.png";
import bassTrap from "@/assets/products/bass-trap-corner-3s-snr6430/bass-trap-01-black-side - Copia.jpg";
import difusor from "@/assets/products/difusor-qrd/QRD_Difusor_EA - Copia.jpg";
import nuvem from "@/assets/products/nuvem-acustica-snr3250/image00024.png";
import cortina from "@/assets/gallery/sala-tratamento-acustico.jpeg";
import corporativo from "@/assets/gallery/forro-corporativo.webp";

const categories = [
  { name: "Painéis acústicos", note: "Absorção de médias e altas", image: painel, to: "/produtos" },
  { name: "Bass traps", note: "Controle modal de graves", image: bassTrap, to: "/produtos" },
  { name: "Difusores", note: "Espalhamento sem perder energia", image: difusor, to: "/produtos" },
  { name: "Nuvens acústicas", note: "Tratamento suspenso para tetos altos", image: nuvem, to: "/produtos" },
  { name: "Cortinas acústicas", note: "Vedação sem obra", image: cortina, to: "/produtos" },
  { name: "Soluções corporativas", note: "Forros e divisórias em escala", image: corporativo, to: "/solucoes" },
];

export default function CategoryShowcase() {
  return (
    <Section>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Catálogo</Eyebrow>
          <SectionTitle className="mt-3 max-w-lg">Comece pela categoria certa</SectionTitle>
        </div>
        <Lead className="lg:max-w-sm lg:text-right">
          Seis famílias de produto que resolvem problemas acústicos distintos.
        </Lead>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <Reveal key={category.name} delay={i * 70}>
            <Link
              to={category.to}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-snr-paper transition-shadow duration-ui ease-snr hover:shadow-[0_18px_44px_-20px_hsl(var(--snr-graphite)/0.35)]"
            >
              {/* imagem ocupa ~74% do cartão */}
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/2]">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="snr-zoom-media absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex items-end justify-between gap-4 p-6">
                <div className="transition-transform duration-ui ease-snr group-hover:-translate-y-1">
                  <h3 className="snr-card-title text-snr-graphite">{category.name}</h3>
                  <p className="mt-1 text-[13px] text-snr-mineral-700">{category.note}</p>
                </div>
                <ArrowRight
                  className="mb-1 h-5 w-5 shrink-0 text-snr-ocean transition-transform duration-ui ease-snr group-hover:translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
