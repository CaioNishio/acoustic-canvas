import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import lookStudio from "@/assets/products/painel-acustico-snr3250/panneaux_acoustiques_noir_gris_podcast - Copia.jpg";
import lookCeiling from "@/assets/products/nuvem-acustica-snr3250/image00024.png";

interface Hotspot {
  slug: string;
  x: number; // %
  y: number; // %
}

interface Look {
  image: string;
  alt: string;
  hotspots: Hotspot[];
}

const looks: Look[] = [
  {
    image: lookStudio,
    alt: "Estúdio de podcast com tratamento acústico Sonar",
    hotspots: [
      { slug: "bass-trap-corner-3s-snr6430", x: 20, y: 41 },
      { slug: "painel-acustico-snr3250", x: 50, y: 30 },
      { slug: "difusor-skyline", x: 90, y: 50 },
    ],
  },
  {
    image: lookCeiling,
    alt: "Ambiente com nuvens acústicas suspensas Sonar",
    hotspots: [
      { slug: "nuvem-acustica-snr3250", x: 45, y: 25 },
      { slug: "painel-acustico-snr6450", x: 75, y: 55 },
    ],
  },
];

const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export default function GikShopTheLook() {
  const [lookIndex, setLookIndex] = useState(0);
  const [activeSlug, setActiveSlug] = useState(looks[0].hotspots[0].slug);
  const [fading, setFading] = useState(false);

  const look = looks[lookIndex];
  const active = useMemo(() => bySlug(activeSlug) ?? bySlug(look.hotspots[0].slug)!, [activeSlug, look]);

  const switchLook = (i: number) => {
    if (i === lookIndex) return;
    setFading(true);
    window.setTimeout(() => {
      setLookIndex(i);
      setActiveSlug(looks[i].hotspots[0].slug);
      setFading(false);
    }, 300);
  };

  return (
    <section className="bg-[#FDFEFE] py-[72px] font-['Lexend'] text-[#0B0E11]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <p className="text-[13px] text-[#193139]">Ambientes Inspiradores</p>
        <h2 className="mt-1 font-['Lexend_Giga'] text-3xl font-bold">Monte o Visual</h2>

        <div className={`mt-8 grid gap-6 transition-opacity duration-300 lg:grid-cols-3 ${fading ? "opacity-0" : "opacity-100"}`}>
          {/* Look image with hotspots */}
          <div className="relative overflow-hidden rounded-2xl lg:col-span-2">
            <div className="relative w-full" style={{ paddingBottom: "66.67%" }}>
              <img src={look.image} alt={look.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[#0B0E11]/40" />
              {look.hotspots.map((h) => {
                const p = bySlug(h.slug);
                if (!p) return null;
                const isActive = h.slug === activeSlug;
                return (
                  <button
                    key={h.slug}
                    type="button"
                    aria-label={p.name}
                    aria-pressed={isActive}
                    onClick={() => setActiveSlug(h.slug)}
                    className="absolute z-10 flex h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-110"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-light text-[#0B0E11] shadow-lg ring-4 transition-all duration-200 ${isActive ? "ring-white/60" : "ring-white/25"}`}>
                      +
                    </span>
                    {isActive && (
                      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] hidden w-[296px] -translate-x-1/2 items-center gap-2 rounded-lg bg-[#FDFEFE] p-2 text-left shadow-xl md:flex">
                        <img src={p.image} alt="" className="h-[100px] w-[100px] shrink-0 rounded object-cover" />
                        <span>
                          <span className="block text-sm font-semibold leading-snug">{p.name}</span>
                          <span className="mt-1 block text-[13px] text-[#0B0E11]/70">
                            {p.price ? `A partir de ${p.price}` : "Sob consulta"}
                          </span>
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured product card */}
          <Link
            to={`/produtos/${active.slug}`}
            className="group flex flex-col justify-center rounded-2xl bg-[#F5F5F5] p-8 transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={active.image}
                alt={active.name}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-5 text-center text-base font-semibold leading-snug">{active.name}</h3>
            <p className="mt-2 text-center text-sm text-[#0B0E11]/70">
              {active.price ? `A partir de ${active.price}` : "Sob consulta"}
            </p>
          </Link>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {looks.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ambiente ${i + 1}`}
              aria-pressed={i === lookIndex}
              onClick={() => switchLook(i)}
              className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-colors duration-200 ${i === lookIndex ? "bg-[#0B0E11]" : "bg-[#0B0E11]/25 hover:bg-[#0B0E11]/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
