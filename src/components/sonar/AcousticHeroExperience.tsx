function ResponsiveAcousticHero() {
  return (
    <section
      className="relative isolate h-[clamp(640px,calc(100svh-7.25rem),840px)] overflow-hidden bg-[#eef5f9] font-display text-[#0b2144] md:h-auto md:aspect-[16/9]"
      aria-label="Sonar Acústicos — soluções integradas"
    >
      <picture className="absolute inset-0 block size-full max-md:translate-y-7 max-md:scale-[1.025]">
        <source media="(max-width: 767px)" srcSet="/media/hero-home-mobile-4k.webp" />
        <img
          src="/media/hero-home-4k.webp"
          width={3840}
          height={2160}
          fetchpriority="high"
          decoding="async"
          alt="Soluções Sonar de absorção, difusão, atenuação e isolamento acústico integradas à arquitetura"
          className="size-full select-none object-cover object-[52%_center] max-md:object-[52%_center] md:object-center"
          draggable={false}
        />
      </picture>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,251,254,.98)_0%,rgba(247,251,254,.93)_23%,rgba(247,251,254,.72)_34%,rgba(247,251,254,.30)_45%,rgba(247,251,254,0)_54%)] md:bg-[linear-gradient(90deg,rgba(247,251,254,.98)_0%,rgba(247,251,254,.92)_24%,rgba(247,251,254,.33)_39%,rgba(247,251,254,0)_52%)]"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1920px] items-start px-5 pt-[clamp(1rem,3.4vh,1.75rem)] sm:px-8 md:items-center md:px-[clamp(2.5rem,4vw,4.5rem)] md:pt-0 md:max-lg:mt-[25px] md:max-lg:px-[18px] md:max-lg:pb-[88px]">
        <div className="max-w-[32rem] md:w-[34%] md:max-w-none md:-translate-y-[2%]">
          <p className="text-[10px] font-semibold tracking-[.18em] text-[#536986] sm:text-xs">FABRICAÇÃO PRÓPRIA</p>
          <h1 className="mt-3 max-w-[10ch] text-[clamp(2.65rem,11vw,4.25rem)] font-semibold leading-[.92] tracking-[-.065em] text-[#0c356c] md:mt-4 md:text-[41.6px] lg:text-[clamp(3.1rem,4.5vw,5.45rem)]">
            Cada ambiente merece ser ouvido com <span className="text-[#ae741a]">clareza</span>
          </h1>
          <p className="mt-5 max-w-[31ch] text-[clamp(.98rem,4vw,1.2rem)] font-normal leading-[1.3] tracking-[-.025em] text-[#385f9c] md:mt-7 md:text-[clamp(1rem,1.45vw,1.45rem)]">
            Soluções acústicas que unem ciência, design e integração arquitetônica para transformar ambientes em experiências sonoras superiores.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AcousticHeroExperience() {
  return (
    <div className="relative z-10 order-1 isolate bg-white">
      <ResponsiveAcousticHero />
      <div
        aria-hidden="true"
        className="relative z-10 h-10 sm:h-12 xl:h-14"
        style={{ background: "linear-gradient(180deg,#eef5f9 0%,#f7fafc 55%,#fbfaf7 100%)" }}
      />
    </div>
  );
}
