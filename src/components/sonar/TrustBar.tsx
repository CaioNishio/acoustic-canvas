import { Factory, Headphones, Map, PencilRuler, ShieldCheck } from "lucide-react";
import { Reveal } from "./primitives";

const pillars = [
  {
    icon: PencilRuler,
    title: "Projetos personalizados",
    text: "Cada ambiente é medido e especificado individualmente.",
  },
  {
    icon: Headphones,
    title: "Atendimento especializado",
    text: "Engenheiros acústicos acompanham do briefing à instalação.",
  },
  {
    icon: Factory,
    title: "Fabricação própria",
    text: "Produção sob medida, sem intermediários e sem improviso.",
  },
  {
    icon: Map,
    title: "Entrega nacional",
    text: "Embalagem reforçada e envio para todo o Brasil.",
  },
  {
    icon: ShieldCheck,
    title: "Suporte técnico",
    text: "Orientação de instalação e acompanhamento pós-projeto.",
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-snr-mineral-100 bg-snr-paper">
      <div className="snr-container">
        <ul className="grid grid-cols-1 divide-y divide-snr-mineral-100 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex min-h-[7.5rem] flex-col justify-center px-0 py-6 lg:px-6">
              <Reveal delay={i * 60} className="flex flex-col gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-snr-ocean-wash">
                  <Icon className="h-4 w-4 text-snr-ocean" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <p className="font-display text-sm font-medium text-snr-graphite">{title}</p>
                <p className="text-[13px] leading-snug text-snr-mineral-700">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
