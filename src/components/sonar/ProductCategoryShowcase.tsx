import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import showroomBackground from "@/assets/gallery/escritorio-neutros-v2.jpg";
import allProducts from "@/assets/category-showcase/todos.webp";
import absorptionPanels from "@/assets/category-showcase/paineis.webp";
import diffusion from "@/assets/category-showcase/difusao.webp";
import bassTraps from "@/assets/category-showcase/bass-traps.webp";
import isolation from "@/assets/category-showcase/isolamento.webp";
import mobileAttenuators from "@/assets/category-showcase/atenuadores.webp";
import treatmentKits from "@/assets/category-showcase/kits.webp";
import fixing from "@/assets/category-showcase/fixacao.webp";
import supplies from "@/assets/category-showcase/suprimentos.webp";
import mineralWool from "@/assets/category-showcase/la-mineral.webp";
import suspendedAbsorption from "@/assets/category-showcase/suspensa.webp";
import consulting from "@/assets/category-showcase/consultoria.webp";

type Props = { categories: string[]; products: Product[]; onSelect: (category: string) => void };

const description = (category: string) => {
  const copy: Record<string, string> = {
    "Absorção Acústica": "Painéis e revestimentos para um ambiente mais claro e confortável.",
    "Controle de Graves": "Soluções para graves definidos e uma resposta sonora equilibrada.",
    "Difusão Sonora": "Dispersão precisa para preservar vida, detalhe e naturalidade.",
    "Absorção Suspensa": "Elementos de teto que combinam leveza visual e desempenho.",
    "Tratamento Aéreo": "Tratamento de teto para projetos com grande presença arquitetônica.",
    "Isolamento Acústico": "Soluções para reduzir a passagem de ruído entre ambientes.",
  };
  return copy[category] ?? "Soluções Sonar fabricadas para integrar desempenho, arquitetura e conforto.";
};

export default function ProductCategoryShowcase({ categories, products, onSelect }: Props) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ x: 0, left: 0, moved: false });
  const categoryCards = [
    { category: "", label: "Todos os produtos", image: allProducts, copy: "Conheça o portfólio completo de soluções acústicas Sonar." },
    { category: "Absorção Acústica", label: "Painéis de absorção", image: absorptionPanels, copy: "Conforto e clareza para paredes, projetos e ambientes." },
    { category: "Difusão Sonora", label: "Difusão acústica", image: diffusion, copy: "Dispersão precisa para preservar detalhe e naturalidade." },
    { category: "Controle de Graves", label: "Ressonadores de graves", image: bassTraps, copy: "Bass traps e soluções de resposta de baixa frequência." },
    { category: "Isolamento Acústico", label: "Isolamento sonoro", image: isolation, copy: "Reduza a passagem de ruído entre ambientes." },
    { category: "Isolamento Móvel", label: "Atenuadores móveis", image: mobileAttenuators, copy: "Flexibilidade acústica para diferentes configurações." },
    { category: "Kits de Tratamento", label: "Kits completos", image: treatmentKits, copy: "Composições para equilibrar o seu ambiente." },
    { category: "Fixação & Suportes", label: "Fixação e suporte", image: fixing, copy: "Componentes para uma instalação segura e precisa." },
    { category: "Insumos Técnicos", label: "Suprimentos", image: supplies, copy: "Materiais técnicos para aplicações acústicas." },
    { category: "Insumos Técnicos", label: "Lã mineral", image: mineralWool, copy: "Base técnica para isolamento e desempenho acústico." },
    { category: "Absorção Suspensa", label: "Absorção suspensa", image: suspendedAbsorption, copy: description("Absorção Suspensa") },
    { category: "Consultoria & Projetos", label: "Consultoria e projetos", image: consulting, copy: "Orientação técnica para a solução adequada ao seu espaço." },
  ].filter((item) => !item.category || products.some((product) => product.category === item.category));
  const go = (next: number) => {
    const index = (next + categoryCards.length) % categoryCards.length;
    const target = rail.current?.children[index] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? "auto" : "smooth", block: "nearest", inline: "center" });
    setActive(index);
  };

  useEffect(() => {
    const host = rail.current;
    if (!host) return;
    const onScroll = () => {
      const middle = host.scrollLeft + host.clientWidth / 2;
      let closest = 0;
      let distance = Number.POSITIVE_INFINITY;
      Array.from(host.children).forEach((node, index) => {
        const element = node as HTMLElement;
        const current = Math.abs(element.offsetLeft + element.offsetWidth / 2 - middle);
        if (current < distance) { distance = current; closest = index; }
      });
      setActive(closest);
    };
    host.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => host.removeEventListener("scroll", onScroll);
  }, []);

  return <section className="relative isolate min-h-[700px] overflow-hidden bg-[#dcecf8] py-7 text-white sm:min-h-[760px] sm:py-10">
    <img src={showroomBackground} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover object-center opacity-95" />
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(225,243,255,.48),rgba(128,193,238,.10)_36%,rgba(216,240,255,.22)),linear-gradient(0deg,rgba(3,35,66,.34),transparent_48%)]" />
    <div className="relative mx-auto flex min-h-[646px] max-w-[1680px] flex-col px-4 sm:min-h-[680px] sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute left-5 top-7 z-10 sm:left-10 sm:top-10"><p className="text-[10px] font-semibold tracking-[.25em] text-[#12395d]">SONAR ACÚSTICOS</p><h1 className="mt-2 max-w-[18ch] font-display text-xl font-medium tracking-[-.035em] text-[#102f4d] sm:text-2xl">Soluções que transformam espaços.</h1></div>
      <div className="relative">
        <button type="button" onClick={() => go(active - 1)} aria-label="Categoria anterior" className="absolute left-0 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-[#0e4f93]/80 shadow-lg backdrop-blur-md transition hover:bg-white hover:text-[#07326a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowLeft size={22}/></button>
        <div ref={rail} role="region" aria-label="Famílias de produtos" tabIndex={0}
          onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); go(active + (event.key === "ArrowRight" ? 1 : -1)); } }}
          onPointerDown={(event) => {
            drag.current.moved = false;
            if (event.pointerType !== "mouse" || event.button !== 0 || (event.target as HTMLElement).closest("button,a")) return;
            drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
            setDragging(true);
          }}
          onPointerMove={(event) => {
            if (!dragging) return;
            const delta = event.clientX - drag.current.x;
            if (Math.abs(delta) > 8) {
              drag.current.moved = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.scrollLeft = drag.current.left - delta;
            }
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onLostPointerCapture={() => setDragging(false)}
          className="relative mt-auto flex snap-x snap-mandatory gap-4 overflow-x-auto px-[11vw] pb-4 pt-2 [scrollbar-width:none] sm:px-[17vw] lg:px-[25vw]">
          {categoryCards.map(({ category, label, image, copy }, index) => <article key={`${category}-${label}`} onClick={(event) => { if (!drag.current.moved && !(event.target as HTMLElement).closest("button,a")) onSelect(category); }} className={`group relative flex h-[410px] w-[min(78vw,440px)] shrink-0 cursor-pointer snap-center flex-col justify-end overflow-hidden rounded-[25px] border border-white/75 bg-[linear-gradient(145deg,rgba(187,225,252,.44),rgba(35,100,157,.28)_48%,rgba(16,64,113,.42))] p-6 shadow-[0_28px_70px_rgba(0,16,42,.30),inset_0_1px_0_rgba(255,255,255,.8),inset_0_-1px_0_rgba(255,255,255,.18)] backdrop-blur-2xl transition duration-500 sm:h-[535px] sm:w-[min(45vw,470px)] sm:p-8 ${index === active ? "scale-100 opacity-100" : "scale-[.89] opacity-65"}`}>
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,.30),transparent_25%,transparent_63%,rgba(109,191,255,.2))]" />
            <img src={image} alt="" draggable={false} className="absolute inset-x-4 top-4 h-[61%] w-[calc(100%-2rem)] object-contain mix-blend-multiply transition duration-700 group-hover:scale-105 sm:inset-x-7 sm:top-6 sm:w-[calc(100%-3.5rem)]" />
            <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[linear-gradient(180deg,transparent,rgba(3,25,53,.9)_44%)]" />
            <div className="relative"><p className="text-[10px] font-semibold tracking-[.18em] text-[#cdeaff]">{String(index + 1).padStart(2, "0")}</p><h2 className="mt-2 font-display text-2xl font-semibold leading-[1.02] tracking-[-.04em] sm:text-[2rem]">{label}</h2><p className="mt-3 max-w-[30ch] text-sm leading-5 text-white/82">{copy}</p><button type="button" onClick={() => onSelect(category)} className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-[#08346e] transition hover:bg-[#d7edff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Explorar soluções <ArrowRight size={18}/></button></div>
          </article>)}
        </div>
        <button type="button" onClick={() => go(active + 1)} aria-label="Próxima categoria" className="absolute right-0 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-[#0e4f93]/80 shadow-lg backdrop-blur-md transition hover:bg-white hover:text-[#07326a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowRight size={22}/></button>
      </div>
      <div className="mt-4 flex justify-center gap-2" aria-label={`Categoria ${active + 1} de ${categoryCards.length}`}>{categoryCards.map((item, index) => <button key={item.category} type="button" onClick={() => go(index)} aria-label={`Ir para ${item.category}`} aria-current={active === index} className={`h-2.5 rounded-full transition-all ${active === index ? "w-7 bg-[#8ed1ff]" : "w-2.5 bg-white/55 hover:bg-white"}`} />)}</div>
      <p className="mt-4 text-center text-xs text-white/78">Arraste para explorar ou use as setas do teclado.</p>
    </div>
  </section>;
}
