import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Instagram, Phone, Search } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-sonar.png";
import imgEstudio from "@/assets/gallery/estudio-paineis.jpeg";
import imgForro from "@/assets/gallery/forro-corporativo.jpg";
import imgSalaReuniao from "@/assets/gallery/paineis-sala-reuniao.png";
import imgAcademia from "@/assets/gallery/academia-baffles.jpeg";
import imgEscritorio from "@/assets/gallery/escritorio-paineis.png";
import imgPaineisAzuis from "@/assets/gallery/paineis-azuis.png";
import imgDifusor from "@/assets/gallery/difusor-skyline-produto.jpg";
import imgBassTrap from "@/assets/gallery/bass-trap-corner-1.jpg";
type MenuKey = "produtos" | "espacos" | "recursos" | "sobre" | null;
const productCategories = [{
  label: "Absorção Acústica",
  path: "/produtos"
}, {
  label: "Controle de Graves",
  path: "/produtos"
}, {
  label: "Difusão Sonora",
  path: "/produtos"
}, {
  label: "Soluções Especiais",
  path: "/produtos"
}, {
  label: "Tratamento Aéreo",
  path: "/produtos"
}, {
  label: "Isolamento Acústico",
  path: "/produtos"
}];
const productHighlights = [{
  name: "Painel Absorvedor Premium",
  image: imgPaineisAzuis,
  path: "/produtos/painel-absorvedor-premium"
}, {
  name: "Difusor Skyline",
  image: imgDifusor,
  path: "/produtos/difusor-skyline"
}, {
  name: "Bass Trap Corner",
  image: imgBassTrap,
  path: "/produtos/bass-trap-corner"
}];
const spaces = [{
  label: "Estúdios",
  path: "/solucoes/estudios",
  image: imgEstudio
}, {
  label: "Igrejas",
  path: "/solucoes/igrejas",
  image: imgForro
}, {
  label: "Auditórios",
  path: "/solucoes/auditorios",
  image: imgSalaReuniao
}, {
  label: "Corporativo",
  path: "/solucoes/corporativo",
  image: imgEscritorio
}, {
  label: "Residencial",
  path: "/solucoes/residencial",
  image: imgAcademia
}];
const recursos = [{
  label: "Calculadora Acústica",
  desc: "Calcule a quantidade ideal de painéis",
  path: "/calculadora"
}, {
  label: "Projetos",
  desc: "Veja nossos projetos realizados",
  path: "/projetos"
}];
const sobreLinks = [{
  label: "Sobre Nós",
  path: "/contato"
}, {
  label: "Contato",
  path: "/contato"
}, {
  label: "Orçamento",
  path: "/orcamento"
}];
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const openMenu = (key: MenuKey) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveMenu(key);
  };
  const scheduleClose = () => {
    closeTimeout.current = setTimeout(() => setActiveMenu(null), 150);
  };
  const cancelClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  };
  const navItemClass = (key: MenuKey) => `px-4 py-2 lg:px-5 lg:py-2 text-[13px] lg:text-sm font-medium tracking-[0.15em] transition-all duration-300 ease-out rounded-full cursor-pointer whitespace-nowrap uppercase font-[\'Space_Grotesk\',sans-serif] ${activeMenu === key ? "text-white bg-white/[0.18] backdrop-blur-xl border border-white/[0.15] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]" : "text-white/90 hover:text-white hover:bg-white/[0.10] hover:backdrop-blur-xl"}`;
  return <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="fixed top-0 left-0 right-0 z-50 px-0 py-[7px] border-destructive">
      {/* Top Bar — frosted glass */}
      <div className="relative text-white bg-[hsl(205,78%,6%)]/80 backdrop-blur-2xl border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>

        <div className="container relative h-9 text-xs mx-auto flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-5 text-white/50">
            <a href="https://www.instagram.com/sonar_acusticos" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors" aria-label="Instagram"><Instagram size={15} /></a>
            <a href="https://wa.me/5511967484000" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors" aria-label="WhatsApp"><WhatsAppIcon size={15} /></a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-white/40" />
            <span className="tracking-[0.2em] text-[11px] font-light text-white/50 uppercase">Consultoria Acústica Gratuita</span>
          </div>
          <div className="hidden md:block" />
        </div>
      </div>

      {/* Main Nav — frosted glass */}
      <div className="bg-[hsl(205,78%,6%)]/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
        <div className="max-w-screen-xl h-16 lg:h-20 px-6 my-[13px] flex-row flex items-center justify-between gap-[20px] mx-0 lg:px-[77px] py-[41px] text-center bg-[#0e375d]">

          {/* Logo - left */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img alt="Sonar Acústicos" className="h-14 lg:h-20 w-auto" src="/lovable-uploads/3ca143a0-e798-45d3-b9c3-9499e7d7d501.png" width={80} height={80} />
          </Link>

          {/* Nav - center */}
          <nav className="hidden md:flex flex-row items-center gap-1 md:gap-1.5 lg:gap-2">
            <div onMouseEnter={() => openMenu("produtos")} onMouseLeave={scheduleClose}>
              <button className={navItemClass("produtos")}>Produtos</button>
            </div>
            <div onMouseEnter={() => openMenu("espacos")} onMouseLeave={scheduleClose}>
              <button className={navItemClass("espacos")}>Ambientes</button>
            </div>
            <div onMouseEnter={() => openMenu("recursos")} onMouseLeave={scheduleClose}>
              <button className={navItemClass("recursos")}>Calculadora técnica     </button>
            </div>
            <div className="relative" onMouseEnter={() => openMenu("sobre")} onMouseLeave={scheduleClose}>
              <button className={navItemClass("sobre")}>Sobre</button>
              <AnimatePresence>
                {activeMenu === "sobre" && <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-border shadow-xl z-50 min-w-[200px] py-3 px-4">
                    <ul className="space-y-1">
                      {sobreLinks.map((link) => <li key={link.label}>
                          <Link to={link.path} onClick={() => setActiveMenu(null)} className="block py-1.5 text-sm text-[hsl(205,78%,15%)] hover:text-primary transition-colors font-medium">
                            {link.label}
                          </Link>
                        </li>)}
                    </ul>
                  </motion.div>}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right actions - desktop */}
          <div className="hidden md:flex flex-row items-center gap-2 flex-shrink-0">
            <CartDrawer />
            <Link to="/loja" className="px-4 py-2 text-[13px] font-medium tracking-[0.15em] whitespace-nowrap text-white/90 hover:text-white transition-all duration-300 uppercase">
              Loja
            </Link>
            <Link to="/orcamento" className="px-5 py-2 text-[13px] font-semibold text-white bg-white/[0.14] border border-white/[0.18] backdrop-blur-xl hover:bg-white/[0.20] hover:border-white/[0.28] transition-all duration-300 tracking-[0.15em] whitespace-nowrap uppercase rounded-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              Orçamento
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-white/70 hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mega Menu Dropdowns */}
      <AnimatePresence>
        {activeMenu && activeMenu !== "sobre" && <motion.div key={activeMenu} initial={{
        opacity: 0,
        y: -4
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -4
      }} transition={{
        duration: 0.2
      }} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} className="absolute left-0 right-0 bg-white border-b border-border shadow-lg z-40">
            <div className="container mx-auto px-4 py-6">
              {/* PRODUTOS */}
              {activeMenu === "produtos" && <div className="flex gap-8">
                  <div className="w-48 flex-shrink-0">
                    <h3 className="font-display font-bold text-[hsl(205,78%,15%)] mb-4">Categorias</h3>
                     <ul className="space-y-2">
                       {productCategories.map((cat) => <li key={cat.label}>
                           <Link to={cat.path} onClick={() => setActiveMenu(null)} className="text-sm text-[hsl(205,78%,30%)] hover:text-primary transition-colors">
                             {cat.label}
                           </Link>
                         </li>)}
                     </ul>
                     <Link to="/produtos" onClick={() => setActiveMenu(null)} className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(205,78%,15%)] mt-6 hover:text-primary transition-colors">
                       Ver Todos os Produtos <ArrowRight size={14} />
                     </Link>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    {productHighlights.map((p) => <Link key={p.name} to={p.path} onClick={() => setActiveMenu(null)} className="group bg-muted/50 rounded-xl overflow-hidden">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-[hsl(205,78%,15%)]">{p.name}</p>
                        </div>
                      </Link>)}
                  </div>
                </div>}

              {/* ESPAÇOS */}
              {activeMenu === "espacos" && <div className="grid grid-cols-5 gap-4">
                  {spaces.map((space) => <Link key={space.path} to={space.path} onClick={() => setActiveMenu(null)} className="group relative overflow-hidden rounded-xl aspect-[4/3]">
                      <img src={space.image} alt={space.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-[0.55] group-hover:brightness-[0.45]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <h3 className="text-white font-display font-bold text-base leading-tight">{space.label}</h3>
                        <ArrowRight size={16} className="text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-300" />
                      </div>
                    </Link>)}
                </div>}

              {/* RECURSOS */}
              {activeMenu === "recursos" && <div className="flex gap-8">
                  <div className="w-48 flex-shrink-0">
                       <h3 className="font-display font-bold text-[hsl(205,78%,15%)] mb-4">Ferramentas</h3>
                     <ul className="space-y-3">
                       {recursos.map((r) => <li key={r.label}>
                           <Link to={r.path} onClick={() => setActiveMenu(null)} className="block group">
                             <span className="text-sm font-semibold text-[hsl(205,78%,15%)] group-hover:text-primary transition-colors">{r.label}</span>
                             <span className="block text-xs text-[hsl(205,78%,30%)] mt-0.5">{r.desc}</span>
                          </Link>
                        </li>)}
                    </ul>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Link to="/calculadora" onClick={() => setActiveMenu(null)} className="group bg-muted/50 rounded-xl overflow-hidden">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={imgEscritorio} alt="Calculadora" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-[hsl(205,78%,15%)]">Calculadora Acústica</p>
                        <p className="text-xs text-[hsl(205,78%,30%)] mt-1">Quantos painéis você precisa?</p>
                        <span className="text-sm font-semibold text-[hsl(205,78%,15%)] underline mt-2 inline-block">Calcular Agora</span>
                      </div>
                    </Link>
                    <Link to="/projetos" onClick={() => setActiveMenu(null)} className="group bg-muted/50 rounded-xl overflow-hidden">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={imgEstudio} alt="Projetos" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                         <p className="font-semibold text-[hsl(205,78%,15%)]">Nossos Projetos</p>
                         <p className="text-xs text-[hsl(205,78%,30%)] mt-1">Veja ambientes transformados</p>
                         <span className="text-sm font-semibold text-[hsl(205,78%,15%)] underline mt-2 inline-block">Ver Projetos</span>
                      </div>
                    </Link>
                  </div>
                </div>}
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: "auto",
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} className="md:hidden overflow-hidden bg-[hsl(205,78%,6%)]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)]">
            <nav className="flex flex-col p-5 gap-1">
              {[
          { to: "/produtos", label: "Produtos" },
          { to: "/solucoes", label: "Espaços" },
          { to: "/projetos", label: "Projetos" },
          { to: "/calculadora", label: "Calculadora" }].
          map((item) =>
          <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="px-6 py-3 text-base font-light tracking-[0.12em] rounded-full text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-300 uppercase">
                  {item.label}
                </Link>
          )}

              <div className="h-px bg-white/[0.06] my-2" />

              <Link to="/contato" onClick={() => setMobileOpen(false)} className="px-6 py-3 text-base font-light tracking-[0.12em] rounded-full text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-300 uppercase">
                Fale com um Especialista
              </Link>
              <Link to="/orcamento" onClick={() => setMobileOpen(false)} className="px-6 py-3 text-base font-light tracking-[0.12em] rounded-full text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-300 uppercase">
                Projete sua Sala
              </Link>

              <div className="h-px bg-white/[0.06] my-2" />
              <p className="px-6 text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Espaços</p>
              {spaces.map((space) => <Link key={space.path} to={space.path} onClick={() => setMobileOpen(false)} className="px-6 py-2.5 text-sm font-light text-white/60 hover:text-white transition-colors flex items-center gap-3 rounded-full hover:bg-white/[0.06]">
                  <img src={space.image} alt="" className="w-9 h-9 rounded-full object-cover ring-1 ring-white/[0.08]" />
                  {space.label}
                </Link>)}
            </nav>
          </motion.div>}
      </AnimatePresence>
    </motion.header>;
}