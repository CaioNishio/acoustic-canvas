import { useEffect, useRef, useState } from 'react';

const poster = '/media/hero-products-poster.webp';

/** Mobile uses alpha WebP: no native player, codec fallback background or play overlay. */
export default function HeroProductMotion() {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mobile, setMobile] = useState<boolean | null>(null);
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
    return () => {
      observer.disconnect();
      size.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    if (motion && visible) void player.play().catch(() => { /* poster remains; never require a play button */ });
    else player.pause();
  }, [motion, visible, mobile]);

  return <div ref={host} className="hero-products-visual relative isolate aspect-[900/470] min-w-0 overflow-hidden md:h-[332.5px] md:aspect-auto">
    {mobile === false && motion ? <video ref={video} autoPlay loop muted playsInline controls={false} disablePictureInPicture preload="auto" poster={poster} aria-label="Produtos Sonar e propagação de ondas sonoras" className="hero-products-video pointer-events-none absolute inset-0 h-full w-full select-none object-contain">
      <source src="/media/hero-products-transparent.webm" type="video/webm" />
      <source src="/media/hero-products-cropped.mp4" type="video/mp4" />
    </video> : <img src={mobile && motion && visible ? '/media/hero-products-mobile.webp' : poster} width={900} height={470} fetchPriority="high" alt="Produtos Sonar demonstrando absorção, difusão, atenuação e bloqueio das ondas sonoras" className="hero-products-image pointer-events-none absolute inset-0 h-full w-full select-none object-contain" />}
  </div>;
}
