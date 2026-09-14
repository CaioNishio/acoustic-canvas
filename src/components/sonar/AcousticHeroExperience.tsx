import { Link } from 'react-router-dom';
import exactHero from '@/assets/hero-reference/hero-exato-gold.png';
import HeroProductMotion from './HeroProductMotion';

function ResponsiveAcousticHero() {
  return <section className="relative overflow-hidden bg-white pb-7 pt-7 font-display text-[#0b2144]">
    <div className="mx-auto max-w-[1180px] bg-white px-5 sm:px-8">
      <div className="hero-lead-layout grid grid-cols-1 items-center gap-7 bg-white sm:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] sm:gap-5 md:min-h-[332.5px] lg:gap-10">
        <div className="hero-copy-block relative z-30 min-w-0">
          <p className="font-display text-[12px] font-semibold tracking-[.08em] text-[#50617f] sm:text-[13px] sm:tracking-[.03em] lg:text-[15px]">FABRICAÇÃO PRÓPRIA</p>
          <h1 className="mt-3 max-w-[12ch] text-[clamp(38px,11vw,52px)] font-semibold leading-[.94] tracking-[-.055em] text-[#10254a] sm:mt-4 sm:text-[clamp(34px,5.7vw,58px)]">Cada ambiente merece ser ouvido com <span className="text-[#ad7420]">clareza</span></h1>
          <p style={{ fontFamily: 'Georgia, "Times New Roman", serif' }} className="mt-4 max-w-[42ch] text-[14px] font-normal leading-[1.55] tracking-[-.02em] text-[#53627d] sm:text-[14px] sm:leading-6 lg:text-[16px]">Soluções acústicas que unem ciência, design e integração arquitetônica para transformar ambientes em experiências sonoras superiores.</p>
        </div>

        <HeroProductMotion />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/55 bg-[#58616c]/80 p-1 shadow-[0_15px_40px_rgba(27,39,55,.18),inset_0_1px_0_rgba(255,255,255,.3)] backdrop-blur-xl sm:grid-cols-4">
        {[["PRECISÃO ACÚSTICA", "Desempenho comprovado"], ["TECNOLOGIA E DESIGN", "Materiais premium"], ["SOLUÇÕES PERSONALIZADAS", "Para cada projeto"], ["SUSTENTABILIDADE", "Baixo impacto"]].map(([title, text]) => <div key={title} className="border-white/15 px-3 py-2.5 text-white even:border-l sm:border-l sm:first:border-l-0"><strong className="block text-[10px] leading-3">{title}</strong><span className="mt-1.5 block text-[10px] leading-3 text-white/70">{text}</span></div>)}
      </div>
    </div>
  </section>;
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
