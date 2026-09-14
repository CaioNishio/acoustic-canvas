import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, UserRound, X } from "lucide-react";
import officialLogo from "@/assets/brand/logo-sonar-official.png";
import { CartDrawer } from "@/components/shared/CartDrawer";

const navigation = [
  ["PRODUTOS", "/produtos"],
  ["AMBIENTES", "/solucoes"],
  ["CALCULADORA ACÚSTICA", "/calculadora"],
  ["SOBRE", "/conhecimento"],
  ["CONTATO", "/contato"],
] as const;

function SonarBrand() {
  const sharedMask = {WebkitMaskImage:`url(${officialLogo})`,maskImage:`url(${officialLogo})`,WebkitMaskRepeat:"no-repeat",maskRepeat:"no-repeat"} as const;
  return <span role="img" aria-label="Sonar Acústicos" className="flex h-[40px] w-[93px] items-center gap-0 bg-transparent text-[#04265d] lg:-ml-[19px]">
    <span className="block h-[32px] w-[40px] bg-current" style={{...sharedMask,WebkitMaskSize:"60px 60px",maskSize:"60px 60px",WebkitMaskPosition:"center -6px",maskPosition:"center -6px"}}/>
    <span className="block h-[18px] w-[53px] bg-current" style={{...sharedMask,WebkitMaskSize:"96px 96px",maskSize:"96px 96px",WebkitMaskPosition:"center -64px",maskPosition:"center -64px"}}/>
  </span>;
}

export default function SonarSiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return <header className="sticky top-0 z-50 w-full bg-transparent p-0 text-[#0a3f7b]">
    <div className="relative w-full">
      <div className="relative z-20 flex h-[54px] w-full items-center border-y border-white/85 bg-[linear-gradient(110deg,rgba(255,255,255,.82),rgba(225,232,241,.68),rgba(255,255,255,.78))] px-4 shadow-[0_8px_24px_rgba(7,35,73,.14),inset_0_1px_0_rgba(255,255,255,.95)] backdrop-blur-[26px] backdrop-saturate-150 sm:h-[60px] sm:px-[3vw]">
        <Link to="/" aria-label="Página inicial Sonar Acústicos" className="shrink-0"><SonarBrand/></Link>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link to="/produtos" aria-label="Buscar produtos" className="grid size-9 place-items-center rounded-full transition hover:bg-white/60 hover:scale-105"><Search size={22} strokeWidth={1.8}/></Link>
          <Link to="/contato" aria-label="Atendimento e contato" className="grid size-9 place-items-center rounded-full transition hover:bg-white/60 hover:scale-105"><UserRound size={22} strokeWidth={1.8}/></Link>
          <CartDrawer />
          <button type="button" aria-label={menuOpen?"Fechar menu":"Abrir menu"} aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)} className="grid size-9 place-items-center rounded-full transition hover:bg-white/60 hover:scale-105">{menuOpen?<X size={24}/>:<Menu size={24}/>}</button>
        </div>
        {menuOpen&&<div className="absolute right-3 top-[84px] z-50 w-[min(320px,calc(100vw-30px))] rounded-3xl border border-white/90 bg-white/90 p-3 text-[#0a3f7b] shadow-[0_24px_70px_rgba(4,25,59,.25)] backdrop-blur-2xl sm:right-6 sm:top-[100px]">{navigation.map(([label,to])=><Link key={label} to={to} onClick={()=>setMenuOpen(false)} className="block rounded-2xl px-5 py-3 text-[12px] font-semibold tracking-[.08em] transition hover:bg-[#0b4384] hover:text-white">{label}</Link>)}</div>}
      </div>

      <nav aria-label="Navegação principal" className="relative z-10 flex h-[34px] w-full items-center overflow-x-auto border-y border-white/15 bg-[#003375] px-1.5 text-white shadow-[0_8px_20px_rgba(5,36,82,.28),inset_0_1px_0_rgba(255,255,255,.12)] [scrollbar-width:none]">
        {navigation.map(([label,to])=>{const active=pathname===to||pathname.startsWith(`${to}/`);return <Link key={label} to={to} className={`grid h-[27px] min-w-[125px] flex-1 place-items-center whitespace-nowrap rounded-full px-3 text-[8px] font-semibold tracking-[.09em] transition sm:min-w-0 sm:text-[9px] ${active?"bg-[#184f91] shadow-[inset_0_1px_0_rgba(255,255,255,.14)]":"text-white/88 hover:bg-white/10 hover:text-white"}`}>{label}</Link>})}
      </nav>
    </div>
  </header>;
}
