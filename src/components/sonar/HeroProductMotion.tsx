import { useEffect, useRef, useState } from 'react';
import heroAcousticComposition from '@/assets/hero-reference/hero-acoustic-composition.jpg';
import HeroAcousticWaveField from './HeroAcousticWaveField';

/** The hero animates automatically when visible; reduced-motion keeps a lightweight still image. */
export default function HeroProductMotion() {
  const host = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotion(!reduced.matches && !document.hidden);
    sync();
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => { observer.disconnect(); reduced.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); };
  }, []);

  return <div ref={host} className="hero-products-visual relative aspect-[4/3] min-w-0 bg-transparent md:h-[332.5px] md:aspect-auto md:overflow-hidden">
    <img src={heroAcousticComposition} width={1280} height={960} fetchPriority="high" alt="Soluções Sonar em absorção, difusão, atenuação e isolamento acústico" className="hero-products-image pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-contain mix-blend-multiply" />
    <HeroAcousticWaveField active={motion && visible} />
  </div>;
}
