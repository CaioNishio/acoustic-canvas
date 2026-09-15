import { useEffect, useRef, useState } from 'react';
import painelAcustico from '@/assets/curated-products/painel-acustico-snr3250/01.png';
import difusorSkyline from '@/assets/curated-products/difusor-skyline/01.png';
import biomboAcustico from '@/assets/curated-products/biombo-acustico-retratil/01.png';
import portaAcustica from '@/assets/curated-products/porta-acustica-dupla/01.png';
import heroAcousticComposition from '@/assets/hero-reference/hero-acoustic-composition.jpg';
import HeroAcousticWaveField from './HeroAcousticWaveField';

type AcousticEffect = 'absorb' | 'diffuse' | 'attenuate' | 'block';

const mobileProducts: Array<{ label: string; image: string; effect: AcousticEffect; className: string }> = [
  { label: 'Absorção', image: painelAcustico, effect: 'absorb', className: 'h-[57px] w-[42px]' },
  { label: 'Difusão', image: difusorSkyline, effect: 'diffuse', className: 'h-[55px] w-[60px]' },
  { label: 'Atenuação', image: biomboAcustico, effect: 'attenuate', className: 'h-[61px] w-[48px]' },
  { label: 'Isolamento', image: portaAcustica, effect: 'block', className: 'h-[57px] w-[57px]' },
];

function Wave({ effect, active }: { effect: AcousticEffect; active: boolean }) {
  const animation = active ? 'snr-wave-flow 1.9s linear infinite' : 'none';
  const shared = { fill: 'none', stroke: 'url(#snr-wave)', strokeLinecap: 'round' as const, strokeWidth: 2.3, style: { animation } };

  return <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 220 64" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="snr-wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#57a6ff" stopOpacity=".16" /><stop offset="28%" stopColor="#2f8cff" stopOpacity=".95" /><stop offset="72%" stopColor="#77bcff" stopOpacity=".82" /><stop offset="100%" stopColor="#57a6ff" stopOpacity=".12" /></linearGradient></defs>
    {effect === 'absorb' && <><path {...shared} className="snr-wave-path" d="M0 32 C16 12 31 52 47 32 S78 12 94 32 S125 52 141 32" /><path {...shared} className="snr-wave-path opacity-35" d="M157 32 C164 27 171 37 178 32 S191 28 198 32 S211 35 220 32" /></>}
    {effect === 'diffuse' && <><path {...shared} className="snr-wave-path" d="M0 32 C16 14 32 50 48 32 S80 14 96 32 S126 50 140 32" /><path {...shared} className="snr-wave-path opacity-90" d="M146 32 C162 24 177 14 220 8" /><path {...shared} className="snr-wave-path opacity-75" d="M146 32 C166 32 187 32 220 32" /><path {...shared} className="snr-wave-path opacity-90" d="M146 32 C162 40 177 50 220 56" /></>}
    {effect === 'attenuate' && <><path {...shared} className="snr-wave-path" d="M0 32 C16 10 32 54 48 32 S80 10 96 32 S126 54 141 32" /><path {...shared} className="snr-wave-path opacity-45" d="M157 32 C169 22 181 42 193 32 S211 25 220 32" /></>}
    {effect === 'block' && <><path {...shared} className="snr-wave-path" d="M0 32 C16 10 32 54 48 32 S80 10 96 32 S126 54 140 32" /><path {...shared} className="snr-wave-path opacity-50" d="M132 32 C126 21 119 20 113 25" /></>}
  </svg>;
}

function MobileAcousticSequence({ motion }: { motion: boolean }) {
  return <div className="hero-products-mobile-sequence relative flex h-full min-h-[255px] flex-col justify-between bg-transparent py-1" aria-label="Produtos Sonar e seus efeitos acústicos">
    {mobileProducts.map((product) => <div key={product.effect} className="relative flex min-h-[60px] items-center">
      <Wave effect={product.effect} active={motion} />
      <span className="absolute left-0 top-1 z-10 font-display text-[6px] font-semibold uppercase tracking-[.12em] text-[#50617f]">{product.label}</span>
      <img src={product.image} alt="" aria-hidden="true" className={`relative z-10 mx-auto object-contain mix-blend-multiply ${product.className}`} />
    </div>)}
  </div>;
}

/** The hero animates automatically when visible; reduced-motion keeps a lightweight still image. */
export default function HeroProductMotion() {
  const host = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && matchMedia('(max-width: 639px)').matches);
  const [motion, setMotion] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const size = matchMedia('(max-width: 639px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { setMobile(size.matches); setMotion(!reduced.matches && !document.hidden); };
    sync();
    size.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => { observer.disconnect(); size.removeEventListener('change', sync); reduced.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); };
  }, []);

  return <div ref={host} className="hero-products-visual relative min-w-0 bg-transparent md:h-[332.5px] md:overflow-hidden">
    {mobile ? <MobileAcousticSequence motion={motion && visible} /> : <>
      <img src={heroAcousticComposition} width={1280} height={960} fetchPriority="high" alt="Soluções Sonar em absorção, difusão, atenuação e isolamento acústico" className="hero-products-image pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-contain mix-blend-multiply" />
      <HeroAcousticWaveField active={motion && visible} />
    </>}
    <style>{`@keyframes snr-wave-flow { to { stroke-dashoffset: -48; } } .snr-wave-path { stroke-dasharray: 9 6; } @media (prefers-reduced-motion: reduce) { .snr-wave-path { animation: none !important; } }`}</style>
  </div>;
}
