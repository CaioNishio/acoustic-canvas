const certifications = [
  { label: "ABNT NBR 11364", className: "font-serif font-bold tracking-tight text-2xl" },
  { label: "ISO/R 354", className: "font-mono font-semibold tracking-widest text-xl" },
  { label: "ASTM C 423", className: "font-serif italic font-bold text-2xl" },
  { label: "Petrobrás N-1618", className: "font-mono font-bold tracking-tight text-lg uppercase" },
  { label: "CLASSE A2", className: "font-['Lexend_Giga'] font-extrabold tracking-[0.2em] text-lg" },
  { label: "NRC 0.95+", className: "font-serif font-black text-2xl" },
];

const GikTrustedBy = () => {
  return (
    <section className="bg-[rgb(243,246,246)] py-[92px] font-['Lexend']">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-9 flex flex-col items-center gap-4 text-center lg:gap-8">
          <h2 className="font-['Lexend_Giga'] text-2xl font-bold leading-tight text-[rgb(11,14,17)] md:text-[29.7px]">
            Confiança de Quem Entende
          </h2>
          <p className="max-w-2xl text-base font-normal leading-relaxed text-[rgb(11,14,17)]/70">
            Desempenho comprovado por ensaios em laboratório e conformidade com as
            principais normas acústicas nacionais e internacionais.
          </p>
        </div>

        <div className="overflow-hidden text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 lg:gap-x-[100px]">
            {certifications.map((cert) => (
              <span
                key={cert.label}
                className={`select-none whitespace-nowrap text-[rgb(11,14,17)] opacity-60 grayscale transition-opacity duration-300 hover:opacity-100 ${cert.className}`}
              >
                {cert.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GikTrustedBy;
