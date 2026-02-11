import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Instagram, Youtube, Facebook, Linkedin, Phone, Search } from "lucide-react";
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
  label: "Painéis Acústicos",
  path: "/produtos"
}, {
  label: "Bass Traps",
  path: "/produtos"
}, {
  label: "Difusores",
  path: "/produtos"
}, {
  label: "Painéis MDF Vazado",
  path: "/produtos"
}, {
  label: "Forros Acústicos",
  path: "/produtos"
}, {
  label: "Revestimentos",
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
  const navItemClass = (key: MenuKey) => `px-6 py-3 text-lg font-bold tracking-wide transition-all duration-200 rounded-full cursor-pointer font-display ${activeMenu === key ? "text-white bg-primary shadow-md" : "text-[hsl(205,78%,15%)] hover:text-primary hover:bg-primary/5"}`;
  return <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-[hsl(205,78%,12%)] text-white">
        <div className="container mx-auto flex items-center justify-between h-9 px-4 text-xs">
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="hover:text-secondary transition-colors"><Instagram size={14} /></a>
            <a href="#" className="hover:text-secondary transition-colors"><Youtube size={14} /></a>
            <a href="#" className="hover:text-secondary transition-colors"><Facebook size={14} /></a>
            <a href="#" className="hover:text-secondary transition-colors"><Linkedin size={14} /></a>
          </div>
          <div className="flex items-center gap-1.5 mx-auto md:mx-0">
            <Phone size={12} className="text-secondary" />
            <span className="tracking-wider">Consultoria Acústica Gratuita</span>
          </div>
          <div className="hidden md:block text-white/60">São Paulo, Brasil</div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-white/95 backdrop-blur-md border-b shadow-sm border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-28">
          <Link to="/" className="flex items-center flex-shrink-0 mr-6">
            <img src={logo} alt="Sonar Acústicos" className="h-36 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <div onMouseEnter={() => openMenu("produtos")} onMouseLeave={scheduleClose}>
              <button className={navItemClass("produtos")}>Produtos</button>
            </div>
            <div onMouseEnter={() => openMenu("espacos")} onMouseLeave={scheduleClose}>
              <button className={navItemClass("espacos")}>Espaços</button>
            </div>
            <div onMouseEnter={() => openMenu("recursos")} onMouseLeave={scheduleClose}>
              <button className={navItemClass("recursos")}>Recursos</button>
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
            <Link to="/contato" className="px-5 py-3 text-lg font-bold font-display text-[hsl(205,78%,15%)] hover:text-primary transition-colors tracking-wide">
              Fale com um Especialista
            </Link>
            <Link to="/orcamento" className="px-5 py-3 text-lg font-bold font-display text-[hsl(205,78%,15%)] hover:text-primary transition-colors tracking-wide">
              Projete sua Sala
            </Link>
          </nav>

          <div className="hidden lg:flex items-center">
            <button className="p-2 text-foreground hover:text-primary transition-colors"><Search size={18} /></button>
          </div>

          <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
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
      }} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} className="hidden lg:block absolute left-0 right-0 bg-white border-b border-border shadow-lg z-40">
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
       }} className="lg:hidden overflow-hidden border-b border-border bg-white shadow-xl">
            <nav className="flex flex-col p-5 gap-1">
              <Link to="/produtos" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-lg font-bold rounded-xl font-display text-[hsl(205,78%,15%)] hover:text-primary hover:bg-primary/5 transition-all">Produtos</Link>
              <Link to="/solucoes" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-lg font-bold rounded-xl font-display text-[hsl(205,78%,15%)] hover:text-primary hover:bg-primary/5 transition-all">Espaços</Link>
              <Link to="/projetos" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-lg font-bold rounded-xl font-display text-[hsl(205,78%,15%)] hover:text-primary hover:bg-primary/5 transition-all">Projetos</Link>
              <Link to="/calculadora" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-lg font-bold rounded-xl font-display text-[hsl(205,78%,15%)] hover:text-primary hover:bg-primary/5 transition-all">Calculadora</Link>
              <Link to="/contato" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-lg font-bold rounded-xl font-display text-[hsl(205,78%,15%)] hover:text-primary hover:bg-primary/5 transition-all">Fale com um Especialista</Link>
              <Link to="/orcamento" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-lg font-bold rounded-xl font-display text-[hsl(205,78%,15%)] hover:text-primary hover:bg-primary/5 transition-all">Projete sua Sala</Link>

              <div className="h-px bg-border my-3" />
              <p className="px-4 text-xs font-bold uppercase tracking-widest text-[hsl(205,78%,30%)] mb-2 font-display">Espaços</p>
              {spaces.map((space) => <Link key={space.path} to={space.path} onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-base font-semibold text-[hsl(205,78%,15%)] hover:text-primary transition-colors flex items-center gap-3 font-display">
                  <img src={space.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  {space.label}
                </Link>)}
            </nav>
          </motion.div>}
      </AnimatePresence>
    </header>;
}