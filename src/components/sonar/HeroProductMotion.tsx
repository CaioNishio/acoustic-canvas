/** Keeps the decorative composition outside the readable copy column. */
export default function HeroProductMotion() {
  return <div className="relative mt-7 min-h-[300px] overflow-hidden sm:min-h-[390px] lg:mt-0 lg:min-h-0">
    <img src="/media/hero-home-master.png" width={1672} height={941} fetchPriority="high" alt="Soluções Sonar de absorção, difusão, atenuação e isolamento acústico" className="absolute inset-0 size-full select-none object-cover object-[77%_center]" draggable={false} />
    <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-[#f9fcff]/95 to-transparent lg:hidden" />
  </div>;
}
