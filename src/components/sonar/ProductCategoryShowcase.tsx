import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import showroomBackground from "@/assets/category-showcase/showroom-reference-clean.png";
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
  const [activeRail, setActiveRail] = useState(0);
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
  const cardCount = categoryCards.length;
  const carouselCards = [...categoryCards, ...categoryCards, ...categoryCards];
  const go = (next: number) => {
    const index = (next + carouselCards.length) % carouselCards.length;
    const target = rail.current?.children[index] as HTMLElement | undefined;
    const host = rail.current;
    if (target && host) host.scrollTo({
      left: target.offsetLeft + target.offsetWidth / 2 - host.clientWidth / 2,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? "auto" : "smooth",
    });
    setActiveRail(index);
    setActive(index % categoryCards.length);
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
      setActiveRail(closest);
      setActive(closest % cardCount);
    };
    host.addEventListener("scroll", onScroll, { passive: true });
    const frame = requestAnimationFrame(() => {
      const target = host.children[cardCount] as HTMLElement | undefined;
      if (target) host.scrollLeft = target.offsetLeft + target.offsetWidth / 2 - host.clientWidth / 2;
      setActiveRail(cardCount);
      setActive(0);
    });
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("scroll", onScroll);
    };
  }, [cardCount]);

  return <section className="relative isolate min-h-[610px] overflow-hidden bg-[#dcecf8] py-5 text-white sm:min-h-[650px] sm:py-7">
    <img src={showroomBackground} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover object-center" />
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(225,238,249,.2),transparent_38%,rgba(219,233,245,.1)),linear-gradient(0deg,rgba(15,31,50,.16),transparent_54%)]" />
    <div className="relative mx-auto flex min-h-[570px] max-w-[1680px] flex-col justify-center px-3 sm:min-h-[596px] sm:px-6 lg:px-8">
      <h1 className="sr-only">Soluções acústicas por família de produtos</h1>
      <div className="relative">
        <button type="button" onClick={() => go(activeRail - 1)} aria-label="Categoria anterior" className="absolute left-1 top-1/2 z-30 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-[#0e4f93]/88 shadow-[0_8px_0_rgba(0,18,45,.72)] backdrop-blur-md transition hover:bg-white hover:text-[#07326a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-3"><ArrowLeft size={22}/></button>
        <div ref={rail} role="region" aria-label="Famílias de produtos" tabIndex={0}
          onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); go(activeRail + (event.key === "ArrowRight" ? 1 : -1)); } }}
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
          className={`relative flex snap-x snap-mandatory gap-0 overflow-x-auto px-[calc(50%-min(41vw,163px))] py-4 [scrollbar-width:none] sm:px-[calc(50%-175px)] ${dragging ? "cursor-grabbing select-none snap-none" : "cursor-grab"}`}>
          {carouselCards.map(({ category, label, image, copy }, index) => <article key={`${index}-${category}-${label}`} onClick={(event) => { if (!drag.current.moved && !(event.target as HTMLElement).closest("button,a")) onSelect(category); }} className={`group relative flex h-[430px] w-[min(82vw,326px)] shrink-0 cursor-pointer snap-center flex-col justify-end overflow-hidden rounded-[22px] border border-white/85 bg-[linear-gradient(145deg,rgba(236,245,251,.28),rgba(194,213,228,.14)_52%,rgba(100,126,151,.2))] p-5 shadow-[0_20px_46px_rgba(29,43,57,.17),inset_0_1px_0_rgba(255,255,255,.88),inset_0_-1px_0_rgba(255,255,255,.3)] backdrop-blur-[18px] transition-[transform,opacity,filter] duration-500 sm:h-[470px] sm:w-[350px] sm:p-6 ${index === activeRail ? "z-20 scale-100 opacity-100" : "z-10 scale-[.82] opacity-80 saturate-[.9]"}`}>
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,.30),transparent_25%,transparent_63%,rgba(109,191,255,.2))]" />
            <img src={image} alt="" draggable={false} className="pointer-events-none absolute inset-x-4 top-3 h-[59%] w-[calc(100%-2rem)] object-contain drop-shadow-[0_18px_22px_rgba(5,24,45,.18)] transition duration-700 group-hover:scale-105 sm:inset-x-6 sm:top-4 sm:w-[calc(100%-3rem)]" />
            <div className="absolute inset-x-0 bottom-0 h-[49%] bg-[linear-gradient(180deg,transparent,rgba(33,48,63,.44)_35%,rgba(26,40,55,.68))]" />
            <div className="relative min-h-[168px]"><p className="text-[10px] font-semibold tracking-[.18em] text-[#d9efff]">{String((index % categoryCards.length) + 1).padStart(2, "0")}</p><h2 className="mt-1.5 font-display text-[1.65rem] font-medium leading-[1.02] tracking-[-.035em] sm:text-[1.8rem]">{label}</h2><p className="mt-2.5 line-clamp-2 max-w-[30ch] text-[13px] leading-[1.35] text-white/82">{copy}</p><button type="button" onClick={() => onSelect(category)} className="mt-4 inline-flex min-h-10 items-center gap-3 rounded-lg border border-white/45 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white hover:text-[#08346e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Explorar solução <ArrowRight size={17}/></button></div>
          </article>)}
        </div>
        <button type="button" onClick={() => go(activeRail + 1)} aria-label="Próxima categoria" className="absolute right-1 top-1/2 z-30 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-[#0e4f93]/88 shadow-[0_8px_0_rgba(0,18,45,.72)] backdrop-blur-md transition hover:bg-white hover:text-[#07326a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-3"><ArrowRight size={22}/></button>
      </div>
      <div className="mt-2 flex justify-center gap-2" aria-label={`Categoria ${active + 1} de ${categoryCards.length}`}>{categoryCards.map((item, index) => <button key={`${item.category}-${item.label}`} type="button" onClick={() => go(categoryCards.length + index)} aria-label={`Ir para ${item.label}`} aria-current={active === index} className={`size-2.5 rounded-full border border-white/70 transition-all ${active === index ? "bg-[#78b4d9] ring-2 ring-white/70" : "bg-white/20 hover:bg-white/70"}`} />)}</div>
      <p className="mt-5 text-center text-xs text-[#173b5d]">Arraste para explorar</p>
    </div>
  </section>;
}
