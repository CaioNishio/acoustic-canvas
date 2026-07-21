import { Link } from "react-router-dom";
import { fabricColors } from "@/data/productColors";
import fabricsBg from "@/assets/gallery/paineis-coloridos-teto.png";

const GikFabrics = () => {
  const swatches = fabricColors.slice(0, 12);

  return (
    <section className="relative w-full overflow-hidden font-['Lexend']">
      <div className="relative min-h-[504px] w-full">
        <img
          src={fabricsBg}
          alt="Painéis acústicos revestidos em tecidos coloridos"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(11,14,17)]/90 via-[rgb(11,14,17)]/40 to-[rgb(11,14,17)]/10" />

        <div className="relative z-10 mx-auto flex min-h-[504px] max-w-[1440px] flex-col justify-end px-6 pb-14 pt-24 lg:px-12">
          <div className="max-w-2xl text-[rgb(253,254,254)]">
            <h2 className="font-['Lexend_Giga'] text-3xl font-bold leading-tight md:text-[40px]">
              Tecidos Acústicos Premium
            </h2>
            <p className="mt-4 max-w-xl text-base font-normal leading-relaxed text-[rgb(253,254,254)]/85">
              Mais de 34 cores de tecido 100% poliéster, transparentes ao som e
              certificados anti-chama.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {swatches.map((color) => (
                <span
                  key={color.code}
                  title={color.name}
                  className="h-7 w-7 rounded-[4px] border border-white/25 shadow-sm transition-transform duration-200 hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>

            <Link
              to="/produtos"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-[rgb(253,254,254)] px-8 py-3 text-sm font-semibold tracking-wide text-[rgb(253,254,254)] transition-colors duration-200 hover:bg-[rgb(253,254,254)] hover:text-[rgb(11,14,17)]"
            >
              Conhecer as Cores
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GikFabrics;
