import { Link } from 'react-router-dom';
import exactHero from '@/assets/hero-reference/hero-exato-gold.png';
import HeroProductMotion from './HeroProductMotion';

function ResponsiveAcousticHero() {
  return <>
    <section className="relative hidden overflow-hidden bg-[#edf4f8] md:block" aria-label="Sonar Acústicos — soluções integradas">
      <h1 className="sr-only">Cada ambiente merece ser ouvido com clareza</h1>
      <img
        src="/media/hero-home-master.png"
        width={1672}
        height={941}
        fetchPriority="high"
        decoding="sync"
        alt="Cada ambiente merece ser ouvido com clareza — soluções acústicas Sonar integradas à arquitetura"
        className="block h-auto w-full"
      />
    </section>
    <section className="relative isolate min-h-[calc(100svh-7.25rem)] overflow-hidden bg-[#edf4f8] font-display text-[#0b2144] md:hidden">
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#f9fcff_0%,rgba(249,252,255,.96)_28%,rgba(249,252,255,.18)_56%,rgba(249,252,255,.04)_100%)]" />
    <div className="relative mx-auto grid min-h-[inherit] max-w-[1920px] grid-rows-[auto_1fr] px-5 pb-7 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[minmax(300px,.82fr)_minmax(620px,1.7fr)] lg:grid-rows-1 lg:px-[clamp(2.5rem,4vw,4.5rem)] lg:py-[clamp(3rem,6vw,7rem)]">
      <div className="relative z-10 flex max-w-[520px] flex-col justify-center lg:pb-[8%]">
        <p className="text-[10px] font-semibold tracking-[.18em] text-[#536986] sm:text-xs">FABRICAÇÃO PRÓPRIA</p>
        <h1 className="mt-4 max-w-[10ch] text-[clamp(2.8rem,5.1vw,6.6rem)] font-semibold leading-[.92] tracking-[-.065em] text-[#0c356c]">Cada ambiente merece ser ouvido com <span className="text-[#ae741a]">clareza</span></h1>
        <p className="mt-6 max-w-[32ch] text-[clamp(1rem,1.55vw,1.55rem)] font-normal leading-[1.28] tracking-[-.025em] text-[#385f9c]">Soluções acústicas que unem ciência, design e integração arquitetônica para transformar ambientes em experiências sonoras superiores.</p>
      </div>
      <HeroProductMotion />
    </div>
    </section>
  </>;
}

export default function AcousticHeroExperience() {
  return (
    <div className="relative z-10 order-1 isolate bg-white">
      <ResponsiveAcousticHero />
      <section className="hidden" aria-hidden="true">
        <div className="absolute inset-0 overflow-hidden bg-[#eef0f5]">
          <img
            loading="lazy"
            decoding="async"
            src={exactHero}
            alt="Sonar Acústicos — soluções de absorção, difusão, atenuação e bloqueio"
            className="absolute left-0 top-[-11.30435%] h-auto w-full select-none"
            draggable={false}
          />
          <div className="absolute left-[3.45%] top-[31px] z-20 h-[52px] w-[255px] bg-[#edebee]" aria-hidden="true" />
          <p className="absolute left-[3.5%] top-[44px] z-30 font-display text-[15px] font-medium tracking-[.14em] text-[#50617f]">FABRICAÇÃO PRÓPRIA</p>
          <Link to="/produtos" aria-label="Encontre a solução ideal" className="absolute left-[3.5%] top-[55%] z-40 h-[5.6%] w-[18.5%] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#3767f4]" />
          <Link to="/contato" aria-label="Fale com um especialista" className="absolute left-[3.5%] top-[61.8%] z-40 h-[5.6%] w-[18.5%] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#3767f4]" />
        </div>
      </section>
      <div aria-hidden="true" className="relative z-10 h-14 sm:h-16 xl:h-20" style={{ background: "linear-gradient(180deg,#eef0f5 0%,#dfe5ee 48%,#020d1d 100%)" }} />
    </div>
  );
}
