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
    <section className="relative z-20 -mt-6 overflow-hidden rounded-t-[2rem] border-y border-[#4ca7d1]/25 bg-[radial-gradient(circle_at_12%_0%,rgba(91,185,224,.24),transparent_34%),radial-gradient(circle_at_91%_100%,rgba(42,125,184,.26),transparent_35%),linear-gradient(115deg,#061d35,#0a3d68_58%,#0b5f8e)] text-white shadow-[0_-18px_44px_-30px_rgba(2,20,40,.82)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.11),transparent_32%,rgba(255,255,255,.035))]" />
      <div className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-white/65 to-transparent" />
      <div className="snr-container relative">
        <ul className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-2 lg:grid-cols-5 lg:py-6">
          {pillars.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex min-h-[8rem] flex-col justify-center gap-2 rounded-2xl border border-white/18 bg-white/[0.08] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_18px_34px_-28px_rgba(0,12,32,.9)] backdrop-blur-xl transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/28 hover:bg-white/[0.13] lg:px-6">
              <Icon className="h-5 w-5 text-[#9edfff]" strokeWidth={1.7} aria-hidden="true" />
              <p className="font-display text-sm font-medium text-white">{title}</p>
              <p className="text-[13px] leading-snug text-white/72">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
