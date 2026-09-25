import { ArrowRight, AudioWaveform, Boxes, Gauge, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/products";

const categoryCopy: Record<string, { eyebrow: string; title: string; text: string }> = {
  "Absorção Acústica": { eyebrow: "Controle de reflexões", title: "Clareza para cada ambiente.", text: "Painéis para reduzir eco e reverberação com integração ao projeto." },
  "Absorção Suspensa": { eyebrow: "Tratamento aéreo", title: "Performance acústica acima de você.", text: "Soluções suspensas para controlar reflexões sem ocupar paredes." },
  "Controle de Graves": { eyebrow: "Baixas frequências", title: "Graves firmes. Escuta precisa.", text: "Soluções para controlar acúmulos modais em cantos e superfícies." },
  "Difusão Sonora": { eyebrow: "Distribuição sonora", title: "Energia uniforme no ambiente.", text: "Difusores que espalham reflexões e preservam a vivacidade sonora." },
  "Isolamento Acústico": { eyebrow: "Isolamento", title: "Mais privacidade entre ambientes.", text: "Soluções construtivas para reduzir a transmissão sonora." },
  "Insumos Técnicos": { eyebrow: "Materiais técnicos", title: "A base certa para cada sistema.", text: "Insumos selecionados para desempenho e aplicação profissional." },
  "Fixação & Suportes": { eyebrow: "Instalação", title: "Precisão em cada detalhe.", text: "Componentes de fixação compatíveis com as soluções Sonar." },
  "Kits de Tratamento": { eyebrow: "Soluções completas", title: "Equilíbrio acústico em conjunto.", text: "Combinações de produtos dimensionadas para diferentes ambientes." },
};

const valueFor = (product: Product, labels: string[]) =>
  product.specs.find((item) => labels.some((label) => item.label.toLocaleLowerCase("pt-BR").includes(label)))?.value;

export default function CatalogCollectionHero({ category, product }: { category: string; product?: Product }) {
  if (!product) return null;
  const copy = categoryCopy[category] ?? {
    eyebrow: category ? "Catálogo Sonar" : "Catálogo completo",
    title: category || "Precisão sonora. Design inteligente.",
    text: category ? `Soluções Sonar para ${category.toLocaleLowerCase("pt-BR")}, reunidas com critérios técnicos.` : "Soluções acústicas para diferentes frequências, aplicações e ambientes.",
  };
  const facts = [
    { icon: Gauge, label: "Desempenho", value: valueFor(product, ["nrc", "atenuação", "stc"]) || "Sob projeto" },
    { icon: Ruler, label: "Espessura", value: product.thickness || "Sob medida" },
    { icon: Boxes, label: "Material", value: product.material || "Conforme modelo" },
    { icon: AudioWaveform, label: "Aplicação", value: product.application[0] || "Multiambiente" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#071525] text-white">
      <div aria-hidden="true" className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_72%_48%,rgba(45,104,174,.35),transparent_28%),radial-gradient(circle_at_15%_70%,rgba(16,55,98,.55),transparent_35%),linear-gradient(135deg,#07111e,#091c31_55%,#06111f)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 opacity-50 [background:repeating-radial-gradient(ellipse_at_66%_100%,transparent_0_18px,rgba(90,160,224,.22)_19px_20px,transparent_21px_38px)]" />
      <div className="snr-container relative grid min-h-[34rem] items-center gap-8 py-10 md:grid-cols-[.9fr_1.1fr] md:py-14 lg:min-h-[39rem]">
        <div className="relative z-10 max-w-xl">
          <p className="snr-caption snr-rule-editorial text-[#d7b67a]">{copy.eyebrow}</p>
          <h1 className="mt-5 max-w-[11ch] font-display text-[clamp(2.35rem,5vw,4.8rem)] font-semibold leading-[.95] tracking-[-.055em]">{copy.title}</h1>
          <p className="mt-5 max-w-[39ch] text-sm leading-relaxed text-slate-300 sm:text-base">{copy.text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#catalogo-produtos" className="inline-flex min-h-11 items-center gap-3 rounded-lg bg-[#dfbd80] px-5 text-xs font-semibold uppercase tracking-[.08em] text-[#0b1b2e]">Explorar produtos <ArrowRight size={15} /></a>
            <Link to="/calculadora" className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-white/25 bg-white/5 px-5 text-xs font-semibold uppercase tracking-[.08em] text-white backdrop-blur">Ver calculadora</Link>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[43rem] items-center justify-center py-4 md:py-8">
          <div className="absolute inset-[8%] rounded-[2.4rem] border border-white/20 bg-white/[.045] shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_35px_90px_rgba(0,0,0,.38)] backdrop-blur-sm" />
          <div className="absolute bottom-[4%] h-[16%] w-[65%] rounded-[50%] border border-sky-200/20 bg-[radial-gradient(ellipse,rgba(82,145,210,.3),rgba(5,13,24,.2)_65%)] shadow-[0_0_55px_rgba(66,139,213,.3)]" />
          <img src={product.image} alt={product.name} className="relative z-10 aspect-square max-h-[31rem] w-full object-contain p-[10%] mix-blend-multiply brightness-[1.7] contrast-110 drop-shadow-[0_28px_30px_rgba(0,0,0,.48)]" />
        </div>
      </div>
      <div className="snr-container relative -mt-3 grid grid-cols-2 gap-2 pb-8 md:grid-cols-4 md:gap-3 md:pb-10">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex min-h-[4.75rem] items-center gap-3 rounded-2xl border border-white/15 bg-white/[.07] px-4 py-3 backdrop-blur-md">
            <Icon size={20} className="shrink-0 text-[#dfbd80]" aria-hidden="true" />
            <div className="min-w-0"><p className="text-[9px] uppercase tracking-[.12em] text-slate-400">{label}</p><p className="mt-1 line-clamp-2 text-xs font-semibold text-white sm:text-sm">{value}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
