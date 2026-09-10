import { useEffect, useRef, useState } from "react";
import beforeTreatment from "@/assets/home-reference/acoustic-before-clean.png";
import afterTreatment from "@/assets/home-reference/acoustic-after-clean.png";

export default function AcousticScrollTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const next = Math.min(1, Math.max(0, (viewport * 0.82 - rect.top) / (viewport * 0.82 + rect.height * 0.58)));
      setProgress((current) => Math.abs(current - next) > 0.001 ? next : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const eased = reduceMotion ? 1 : progress * progress * (3 - 2 * progress);

  return (
    <section ref={sectionRef} aria-label="Comparação interativa do ambiente antes e depois do tratamento acústico" className="relative order-3 bg-[#e9ebef] py-7 sm:py-9">
      <div className="relative mx-auto h-[clamp(340px,52vw,560px)] w-[94%] max-w-[1500px] overflow-hidden rounded-[24px] border border-white/70 bg-[#e9ebef] shadow-[0_24px_70px_rgba(9,32,63,.14)] [perspective:1400px]">
        <div
          className="absolute inset-0 origin-center will-change-transform"
          style={{ transform: reduceMotion ? "none" : `translate3d(0,${(0.5 - eased) * 4}px,0) scale(${1.015 - eased * 0.01}) rotateX(${(0.5 - eased) * 0.35}deg)` }}
        >
          <img src={beforeTreatment} loading="lazy" decoding="async" alt="Ambiente sem painéis com reflexões e reverberação intensas" className="absolute inset-0 h-full w-full object-cover object-[58%_52%] sm:object-[52%_52%]" />
          <img src={afterTreatment} loading="lazy" decoding="async" alt="Ambiente tratado com painéis absorvendo reflexões e aumentando a clareza" className="absolute inset-0 h-full w-full object-cover object-[58%_52%] sm:object-[52%_52%]" style={{ opacity: eased }} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_51%_49%,transparent_0%,rgba(1,13,32,.03)_68%,rgba(1,13,32,.16)_100%)]" />
          <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-35" style={{ background: `radial-gradient(circle at ${35 + eased * 30}% ${48 - eased * 8}%, rgba(88,159,255,.2), transparent 32%)` }} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#020d1d]/35 via-[#071b3d]/10 to-transparent" />
        <div className="absolute bottom-5 left-4 max-w-[250px] rounded-xl border border-white/55 bg-[#dfe3e8]/70 px-4 py-3 text-[#092754] shadow-[0_14px_36px_rgba(2,13,29,.14)] backdrop-blur-xl sm:bottom-[6%] sm:left-[4%] sm:max-w-[280px] sm:px-5 sm:py-4">
          <p className="text-[10px] font-semibold tracking-[.16em] text-[#a75e35]">EXPERIÊNCIA INTERATIVA</p>
          <h2 className="mt-1.5 font-display text-lg leading-tight sm:text-xl">Do eco à clareza.</h2>
          <p className="mt-1.5 text-[11px] leading-[1.55] text-[#304968] sm:text-xs">Role para acompanhar o tratamento acústico transformar o ambiente.</p>
        </div>
      </div>
    </section>
  );
}
