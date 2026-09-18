import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";

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
  const drag = useRef({ x: 0, left: 0 });
  const categoryCards = categories.map((category) => ({ category, product: products.find((item) => item.category === category) })).filter((item): item is { category: string; product: Product } => Boolean(item.product));
  const go = (next: number) => {
    const index = (next + categoryCards.length) % categoryCards.length;
    const target = rail.current?.children[index] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
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

  return <section className="relative isolate overflow-hidden bg-[#061c38] pb-12 pt-8 text-white sm:pb-16">
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(89,151,220,.42),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(208,230,255,.28),transparent_22%),linear-gradient(120deg,#051932_0%,#234e7b_48%,#0a2340_100%)]" />
    <div className="relative mx-auto max-w-[1680px] px-4 sm:px-8 lg:px-12">
      <div className="mb-7 max-w-xl sm:mb-10"><p className="text-[10px] font-semibold tracking-[.22em] text-[#b7dfff]">SOLUÇÕES SONAR</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.055em] sm:text-6xl">Encontre a solução certa para o seu espaço.</h1><p className="mt-4 max-w-[55ch] text-sm leading-6 text-white/72 sm:text-base">Explore as famílias reais do nosso catálogo e siga para uma seleção técnica, completa e sob medida.</p></div>
      <div className="relative">
        <button type="button" onClick={() => go(active - 1)} aria-label="Categoria anterior" className="absolute left-0 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-[#0e4f93]/80 shadow-lg backdrop-blur-md transition hover:bg-white hover:text-[#07326a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowLeft size={22}/></button>
        <div ref={rail} role="region" aria-label="Famílias de produtos" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight") go(active + 1); if (event.key === "ArrowLeft") go(active - 1); }} onPointerDown={(event) => { const host = rail.current; if (!host) return; drag.current = { x: event.clientX, left: host.scrollLeft }; setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { const host = rail.current; if (!dragging || !host) return; host.scrollLeft = drag.current.left - (event.clientX - drag.current.x); }} onPointerUp={() => setDragging(false)} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[13vw] pb-4 pt-2 [scrollbar-width:none] sm:px-[18vw] lg:px-[24vw]">
          {categoryCards.map(({ category, product }, index) => <article key={category} className={`group relative flex h-[420px] w-[min(72vw,430px)] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-[24px] border border-white/45 bg-[#234b77]/55 p-6 shadow-[0_24px_58px_rgba(0,9,28,.38),inset_0_1px_0_rgba(255,255,255,.42)] backdrop-blur-md transition duration-500 sm:h-[500px] sm:w-[min(54vw,500px)] ${index === active ? "scale-100 opacity-100" : "scale-[.92] opacity-70"}`}>
            <img src={product.image} alt="" draggable={false} className="absolute inset-0 h-full w-full object-contain p-6 transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,20,44,.03),rgba(4,19,40,.2)_40%,rgba(2,14,33,.94)_100%)]" />
            <div className="relative"><p className="text-[10px] font-semibold tracking-[.18em] text-[#b8dcff]">{String(index + 1).padStart(2, "0")}</p><h2 className="mt-2 font-display text-2xl font-semibold leading-[1.02] tracking-[-.04em] sm:text-3xl">{category}</h2><p className="mt-3 max-w-[30ch] text-sm leading-5 text-white/78">{description(category)}</p><button type="button" onClick={() => onSelect(category)} className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-[#08346e] transition hover:bg-[#bce2ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Explorar soluções <ArrowRight size={18}/></button></div>
          </article>)}
        </div>
        <button type="button" onClick={() => go(active + 1)} aria-label="Próxima categoria" className="absolute right-0 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-[#0e4f93]/80 shadow-lg backdrop-blur-md transition hover:bg-white hover:text-[#07326a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowRight size={22}/></button>
      </div>
      <div className="mt-3 flex justify-center gap-2" aria-label={`Categoria ${active + 1} de ${categoryCards.length}`}>{categoryCards.map((item, index) => <button key={item.category} type="button" onClick={() => go(index)} aria-label={`Ir para ${item.category}`} aria-current={active === index} className={`h-2.5 rounded-full transition-all ${active === index ? "w-7 bg-[#8ed1ff]" : "w-2.5 bg-white/50 hover:bg-white"}`} />)}</div>
      <p className="mt-5 text-center text-xs text-white/70">Arraste para explorar ou use as setas do teclado.</p>
    </div>
  </section>;
}
