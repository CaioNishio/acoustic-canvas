import studioBg from "@/assets/products/painel-acustico-snr3250/panneaux_acoustiques_noir_gris_podcast - Copia.jpg";

/**
 * GikTestimonial — depoimento centralizado sobre foto de estúdio escura.
 * Clone da seção "testimonials banner" da GIK Acoustics.
 */
const GikTestimonial = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B0E11]">
      <img
        src={studioBg}
        alt="Estúdio tratado com painéis acústicos Sonar"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-[140px] text-center text-[#FDFEFE]">
        <span
          aria-hidden="true"
          className="mb-6 block select-none font-['Lexend_Giga'] text-7xl font-bold leading-none text-[#FDFEFE]/60 md:text-8xl"
        >
          &ldquo;
        </span>
        <blockquote className="mb-8 font-['Lexend_Giga'] text-2xl font-bold leading-snug text-[#FDFEFE] md:text-[29.7px]">
          Depois do tratamento da Sonar, a diferença sonora foi realmente
          impressionante.
        </blockquote>
        <p className="font-['Lexend'] text-sm uppercase tracking-[0.25em] text-[#FDFEFE]/70">
          &mdash; Cliente Sonar, Estúdio em São Paulo
        </p>
      </div>
    </section>
  );
};

export default GikTestimonial;
