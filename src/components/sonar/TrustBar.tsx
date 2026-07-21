import { Factory, Headphones, Map, PencilRuler, ShieldCheck } from "lucide-react";

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
          {pillars.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex min-h-[7rem] flex-col justify-center gap-1.5 px-0 py-6 lg:px-6">
              <Icon className="h-5 w-5 text-snr-ocean" strokeWidth={1.5} aria-hidden="true" />
              <p className="font-display text-sm font-medium text-snr-graphite">{title}</p>
              <p className="text-[13px] leading-snug text-snr-mineral-700">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
