import { Link } from "react-router-dom";
import { products } from "@/data/products";

/**
 * GikProductSpotlight — seção escura 638px destacando o Difusor Skyline.
 * Clone da seção "video with text overlay" (Q11D Diffuser) da GIK Acoustics.
 */
const skyline = products.find((p) => p.slug === "difusor-skyline");

const GikProductSpotlight = () => {
  if (!skyline) return null;

  return (
    <section className="relative h-[638px] w-full overflow-hidden bg-[#0B0E11]">
      {/* Foto do produto à direita */}
      <img
        src={skyline.image}
        alt={skyline.name}
        className="absolute inset-y-0 right-0 h-full w-full object-cover object-right opacity-60 md:w-[60%]"
      />
      {/* Overlay escurecendo para a esquerda */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11] via-[#0B0E11]/85 to-[#0B0E11]/20" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-6 md:px-12">
        <div className="max-w-2xl text-white">
          <p className="mb-5 font-['Lexend'] text-[13px] font-medium uppercase tracking-[0.35em] text-white/70">
            O Novo
          </p>
          <h2 className="mb-6 font-['Lexend_Giga'] text-4xl font-bold leading-[1.1] text-white md:text-[64px]">
            Difusor Skyline
          </h2>
          <p className="mb-10 max-w-xl font-['Lexend'] text-base leading-relaxed text-white/80">
            {skyline.description}
          </p>
          <Link
            to="/produtos/difusor-skyline"
            className="inline-flex items-center rounded-full bg-white px-8 py-4 font-['Lexend'] text-sm font-semibold uppercase tracking-widest text-[#0B0E11] transition-colors hover:bg-white/85"
          >
            Comprar Agora
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GikProductSpotlight;
