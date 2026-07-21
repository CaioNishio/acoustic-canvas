import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/products/painel-acustico-snr3250/image00017.png";

/**
 * GikHero — seção hero 638px, imagem escura + overlay, texto à esquerda.
 * Clone da seção "image with text overlay" da GIK Acoustics, dados Sonar.
 */
const GikHero = () => {
  return (
    <section className="relative h-[638px] w-full overflow-hidden bg-[#0B0E11]">
      <img
        src={heroBg}
        alt="Painéis acústicos Sonar em estúdio"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlay gradiente escuro */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-end px-6 pb-16 md:px-12">
        <div className="max-w-2xl text-[#FDFEFE]">
          <p className="mb-4 font-['Lexend'] text-[13px] font-medium uppercase tracking-[0.35em] text-[#FDFEFE]/80">
            Projetado por Especialistas
          </p>
          <h1 className="mb-8 font-['Lexend_Giga'] text-3xl font-bold leading-tight text-[#FDFEFE] md:text-[40px] md:leading-[1.2]">
            O Padrão Brasileiro em Tratamento Acústico
          </h1>
          <Link
            to="/produtos"
            className="inline-flex items-center gap-3 rounded-full border border-[#FDFEFE]/60 px-7 py-4 font-['Lexend'] text-sm font-semibold text-[#FDFEFE] transition-colors hover:bg-[#FDFEFE] hover:text-[#0B0E11]"
          >
            Ver Todos os Produtos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GikHero;
