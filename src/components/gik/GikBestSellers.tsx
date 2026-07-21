import { useState } from "react";
import { Link } from "react-router-dom";
import { products, type Product } from "@/data/products";

interface Tab {
  label: string;
  categories: string[];
}

const tabs: Tab[] = [
  { label: "Painéis Acústicos", categories: ["Absorção Acústica"] },
  { label: "Bass Traps", categories: ["Controle de Graves"] },
  { label: "Difusores", categories: ["Difusão Sonora"] },
  { label: "Nuvens & Baffles", categories: ["Absorção Suspensa", "Tratamento Aéreo"] },
  { label: "Kits", categories: ["Kits de Tratamento"] },
];

function productsFor(tab: Tab): Product[] {
  return products.filter((p) => tab.categories.includes(p.category)).slice(0, 4);
}

export default function GikBestSellers() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  const switchTab = (i: number) => {
    if (i === active) return;
    setVisible(false);
    window.setTimeout(() => {
      setActive(i);
      setVisible(true);
    }, 200);
  };

  const items = productsFor(tabs[active]);

  return (
    <section className="bg-[rgb(253,254,254)] py-[72px] font-['Lexend'] text-[rgb(11,14,17)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Title */}
        <div className="text-center">
          <h2 className="font-['Lexend_Giga'] text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Mais Vendidos
          </h2>
          <p className="mt-3 text-base text-[rgb(11,14,17)]/70">
            A escolha dos profissionais brasileiros
          </p>
        </div>

        {/* Pills */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => switchTab(i)}
              aria-pressed={i === active}
              className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(25,49,57)] focus-visible:ring-offset-2 ${
                i === active
                  ? "border-[rgb(25,49,57)] bg-[rgb(25,49,57)] text-[rgb(253,254,254)]"
                  : "border-[rgb(11,14,17)]/20 bg-transparent text-[rgb(11,14,17)] hover:border-[rgb(11,14,17)]/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div
          className={`mt-8 grid grid-cols-1 gap-5 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-4 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {items.map((p) => (
            <Link
              key={p.slug}
              to={`/produtos/${p.slug}`}
              className="group flex flex-col rounded-lg bg-[#F5F5F5] p-4 transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="overflow-hidden rounded-md">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 line-clamp-2 text-center text-base font-semibold leading-snug">
                {p.name}
              </h3>
              <p className="mt-2 pb-2 text-center text-sm text-[rgb(11,14,17)]/70">
                {p.price ? `A partir de ${p.price}` : "Sob consulta"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
