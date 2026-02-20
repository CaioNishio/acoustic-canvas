import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Instagram, MessageCircle, Phone, Search } from "lucide-react";
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
  const navItemClass = (key: MenuKey) => `px-4 py-2 lg:px-5 lg:py-2.5 text-sm lg:text-base font-light tracking-wider transition-all duration-500 ease-out rounded-full cursor-pointer font-display whitespace-nowrap uppercase ${activeMenu === key ? "text-white bg-white/15 backdrop-blur-sm shadow-md" : "text-white/70 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:scale-[1.02]"}`;
  return <header className="fixed top-0 left-0 right-0 z-50 px-0 py-[7px] border-destructive">
      {/* Top Bar */}
      <div className="text-white border-2 bg-gray-800">
        <div className="container h-9 text-xs mx-0 flex-row rounded-3xl gap-0 px-[33px] py-[7px] opacity-100 flex items-end justify-between border-0 bg-slate-800">
          <div className="flex items-center shadow-inner gap-[30px] px-0 py-0 mx-0 text-[#f2aa36]">
            <a href="https://instagram.com/sonar_acusticos" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram"><Instagram size={14} /></a>
            <a href="https://wa.me/5511967484000" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="WhatsApp"><MessageCircle size={14} /></a>
          </div>
          <div className="flex items-center gap-1.5 mx-auto md:mx-0">
            <Phone size={12} className="text-secondary my-[8px] mx-0 px-0 py-0" />
            <span className="tracking-wider text-base text-left font-normal py-0 my-0 mx-[28px] font-sans">Consultoria Acústica Gratuita</span>
          </div>
          <div className="hidden md:block text-white/60">São Paulo, Brasil</div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="backdrop-blur-md shadow-lg bg-slate-800 text-primary" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
        <div className="container h-20 lg:h-24 px-[40px] py-0 border-0 rounded-none opacity-100 gap-0 border-dashed bg-gray-900 flex-col flex items-end justify-between mx-0 text-primary">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img alt="Sonar Acústicos" className="h-16 lg:h-20 w-auto px-0 mx-0 my-[11px] border-muted-foreground" src="/lovable-uploads/3ca143a0-e798-45d3-b9c3-9499e7d7d501.png" />
          </Link>

          {/* Nav - centered */}
          <nav className="gap-1 lg:gap-2 items-start justify-start px-[140px] flex flex-row py-0">
            <div onMouseEnter={() => openMenu("produtos")} onMouseLeave={scheduleClose} className="border-primary-foreground">
              <button className={navItemClass("produtos")}>Produtos</button>
            </div>
            <div onMouseEnter={() => openMenu("espacos")} onMouseLeave={scheduleClose}>
              <button className={navItemClass("espacos")}>Ambientes </button>
            </div>
            <div onMouseEnter={() => openMenu("recursos")} onMouseLeave={scheduleClose}>
              <button className={navItemClass("recursos")}>CALCULADORA</button>
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

          {/* Right actions */}
          <div className="hidden gap-3 flex-row mx-0 py-0 lg:flex items-start justify-start">
            <Link to="/contato" className="px-5 py-2.5 text-sm font-light font-display transition-all duration-300 tracking-wider whitespace-nowrap text-secondary hover:text-secondary/80 uppercase">
              Fale com um Especialista
            </Link>
            <Link to="/orcamento" className="px-5 py-2.5 text-sm font-light font-display text-white/70 hover:text-white transition-all duration-300 tracking-wider whitespace-nowrap uppercase">
              Projete sua Sala
            </Link>
            <button aria-label="Pesquisar" className="p-2 text-white/50 hover:text-white transition-colors"><Search size={18} /></button>
          </div>
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
      }} className="lg:hidden overflow-hidden border-b border-border bg-white shadow-xl">
            <nav className="flex flex-col p-5 gap-2">
              {[
          { to: "/produtos", label: "Produtos" },
          { to: "/solucoes", label: "Espaços" },
          { to: "/projetos", label: "Projetos" },
          { to: "/calculadora", label: "Calculadora" }].
          map((item) =>
          <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="px-6 py-3 text-lg font-bold tracking-wide rounded-full font-display text-[hsl(205,78%,15%)] hover:text-white hover:bg-primary hover:shadow-md transition-all duration-200">
                  {item.label}
                </Link>
          )}

              <div className="h-px bg-border my-2" />

              <Link to="/contato" onClick={() => setMobileOpen(false)} className="px-6 py-3 text-lg font-bold tracking-wide rounded-full font-display text-[hsl(205,78%,15%)] hover:text-white hover:bg-primary hover:shadow-md transition-all duration-200">
                Fale com um Especialista
              </Link>
              <Link to="/orcamento" onClick={() => setMobileOpen(false)} className="px-6 py-3 text-lg font-bold tracking-wide rounded-full font-display text-[hsl(205,78%,15%)] hover:text-white hover:bg-primary hover:shadow-md transition-all duration-200">
                Projete sua Sala
              </Link>

              <div className="h-px bg-border my-2" />
              <p className="px-6 text-xs font-bold uppercase tracking-widest text-[hsl(205,78%,30%)] mb-1 font-display">Espaços</p>
              {spaces.map((space) => <Link key={space.path} to={space.path} onClick={() => setMobileOpen(false)} className="px-6 py-2.5 text-base font-bold text-[hsl(205,78%,15%)] hover:text-primary transition-colors flex items-center gap-3 font-display rounded-full hover:bg-primary/5">
                  <img src={space.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                  {space.label}
                </Link>)}
            </nav>
          </motion.div>}
      </AnimatePresence>
    </header>;
}