import heroSonarAmbient from '@/assets/hero-reference/hero-sonar-ambient.webp';

/** Keeps the decorative composition outside the readable copy column. */
export default function HeroProductMotion() {
  return <div className="relative mt-7 min-h-[300px] overflow-hidden sm:min-h-[390px] lg:mt-0 lg:min-h-0">
    <img src={heroSonarAmbient} width={1042} height={941} fetchPriority="high" alt="Soluções Sonar de absorção, difusão, atenuação e isolamento acústico" className="absolute inset-0 size-full select-none object-cover object-[53%_center] lg:object-center" draggable={false} />
    <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-[#f9fcff]/95 to-transparent lg:hidden" />
  </div>;
}
