import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Phone, Waves, Orbit, Calculator, Crosshair, Clock3, SlidersHorizontal, Circle, Grid3X3, Layers3, Box, Package, Blinds, Columns3 } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { motion, AnimatePresence } from "framer-motion";
// Ambientes — uma imagem própria e coerente para cada área
import imgEstudio from "@/assets/curated/home/revisao-2026/estudio-com-paineis.webp";
import imgIgreja from "@/assets/gallery/igreja-templo-paineis.png";
import imgAuditorio from "@/assets/gallery/auditorio-paineis-acusticos.jpeg";
import imgCorporativo from "@/assets/gallery/escritorio-neutros-v2.jpg";
import imgResidencial from "@/assets/novas/paineis-bege-sala-violao.jpg";
import imgCalculadora from "@/assets/gallery/estudio-tratamento-completo.png";
import imgTodosProdutos from "@/assets/gallery/forro-industrial-rafts.jpg";

// Curadoria exclusiva do menu Produtos — os arquivos originais permanecem intactos.
import headerPainelDifusao from "@/assets/curated/header-products/painel-difusao-vazada.jpg";
import headerNuvemCircular from "@/assets/curated/header-products/nuvem-circular.png";
import headerDifusao from "@/assets/curated/header-products/difusao.jfif";
import headerLaRocha from "@/assets/curated/header-products/la-de-rocha.png";
import headerNuvemAcustica from "@/assets/curated/header-products/nuvem-acustica.jpg";
import headerKits from "@/assets/curated/header-products/kits-produtos.webp";
import headerBaffles from "@/assets/curated/header-products/baffles.jpg";
import headerCortinaAlternativa from "@/assets/curated/home/categoria-cortinas.png";
import headerPainelAbsorvedorAlternativo from "@/assets/novas/painel-laranja-sala-estar.jpg";

// "conhecimento" navega direto, sem dropdown — existe aqui só para o estado ativo.
type MenuKey = "produtos" | "espacos" | "recursos" | "sobre" | "conhecimento" | null;
/** cada categoria abre o catálogo já filtrado */
const catUrl = (label: string) => `/produtos?categoria=${encodeURIComponent(label)}`;
const productCategories = [
  "Absorção Acústica",
  "Controle de Graves",
  "Difusão Sonora",
  "Soluções Especiais",
  "Tratamento Aéreo",
  "Isolamento Acústico",
].map((label) => ({ label, path: catUrl(label) }));

const spaces = [{
  label: "Estúdio",
  path: "/solucoes/estudios",
  image: imgEstudio
}, {
  label: "Templo",
  path: "/solucoes/igrejas",
  image: imgIgreja
}, {
  label: "Auditório",
  path: "/solucoes/auditorios",
  image: imgAuditorio
}, {
  label: "Escritório",
  path: "/solucoes/corporativo",
  image: imgCorporativo
}, {
  label: "Residência",
  path: "/solucoes/residencial",
  image: imgResidencial
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
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [activeSpace, setActiveSpace] = useState(2);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  const toggleMenu = (key: MenuKey) => setActiveMenu((current) => current === key ? null : key);
  // Tipografia de sistema em caixa alta com espaçamento largo: leve,
  // contemporânea e consistente com a nova pilha inspirada na Apple.
  const navItemClass = (key: MenuKey) => `sonar-nav-modern inline-flex shrink-0 items-center justify-center min-h-11 px-3 py-2 2xl:px-5 text-[11px] 2xl:text-[12px] font-medium tracking-[0.1em] transition-all duration-200 ease-out rounded-full cursor-pointer whitespace-nowrap uppercase max-xl:px-3 max-xl:text-[11px] max-xl:tracking-[0.055em] sm:max-xl:px-3.5 sm:max-xl:text-[11px] ${activeMenu === key ? "text-white bg-white/15 border border-white/25 shadow-[0_6px_18px_-12px_rgba(0,0,0,.7)]" : "text-white/90 hover:bg-white/10 hover:text-white"}`;
  return <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="fixed left-0 right-0 top-0 z-50 border-destructive p-0">
      {/* Top Bar — frosted glass */}
      <div className="relative text-[#10213f] bg-white/95 backdrop-blur-2xl border-b border-[#10213f]/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>

        <div className="container relative h-8 text-xs mx-auto flex items-center justify-between px-5 xl:px-10">
          <div className="flex items-center gap-5 text-white/70">
            <a href="https://www.instagram.com/sonar_acusticos" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors" aria-label="Instagram"><Instagram size={15} /></a>
            <a href="https://wa.me/5511967484000" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors" aria-label="WhatsApp"><WhatsAppIcon size={15} /></a>
          </div>
          <div className="flex items-center gap-2 text-muted font-sans text-xs font-normal">
            <Phone size={12} className="text-white/40" />
            <span className="sonar-handwritten text-[13px] text-white/80">Consultoria Acústica Gratuita</span>
          </div>
          <div className="hidden w-[55px] xl:block" aria-hidden="true" />
        </div>
      </div>

      {/* Main Nav — frosted glass */}
      <div className="border-b border-white/[0.10] bg-[#0b3a64]/95 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="mx-auto my-0 flex h-[5rem] w-full flex-row items-center justify-between gap-5 bg-[#0b3a64]/90 px-5 py-2 text-center sm:px-7 xl:h-[6rem] xl:px-[77px]">

          {/* Logo - left */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img alt="Sonar Acústicos" className="h-16 w-auto xl:h-20" src="/lovable-uploads/3ca143a0-e798-45d3-b9c3-9499e7d7d501.png" width={120} height={120} />
          </Link>

          {/* Nav - center */}
          <nav className="hidden xl:flex flex-row items-center gap-1 2xl:gap-2">
            {/* Cada item navega ao ser clicado; o menu abre no hover */}
            <div onMouseEnter={() => openMenu("produtos")} onMouseLeave={scheduleClose}>
              <Link to="/produtos" onClick={() => setActiveMenu(null)} className={navItemClass("produtos")}>Produtos</Link>
            </div>
            <div onMouseEnter={() => openMenu("espacos")} onMouseLeave={scheduleClose}>
              <Link to="/solucoes" onClick={() => setActiveMenu(null)} className={navItemClass("espacos")}>Ambientes</Link>
            </div>
            <div onMouseEnter={() => openMenu("recursos")} onMouseLeave={scheduleClose}>
              <Link to="/calculadora" onClick={() => setActiveMenu(null)} className={navItemClass("recursos")}>Calculadora Acústica</Link>
            </div>
            <div onMouseEnter={() => openMenu(null)} onMouseLeave={scheduleClose}>
              <Link to="/conhecimento" onClick={() => setActiveMenu(null)} className={navItemClass("conhecimento")}>Conhecimento</Link>
            </div>
            <div className="relative" onMouseEnter={() => openMenu("sobre")} onMouseLeave={scheduleClose}>
              <Link to="/contato" onClick={() => setActiveMenu(null)} className={navItemClass("sobre")}>Sobre</Link>
              <AnimatePresence>
                {activeMenu === "sobre" && <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-border shadow-xl z-50 min-w-[200px] py-3 px-4">
                    <ul className="space-y-1 font-serif">
                      {sobreLinks.map((link) => <li key={link.label}>
                          <Link to={link.path} onClick={() => setActiveMenu(null)} className="block py-1.5 text-[hsl(205,78%,15%)] hover:text-primary transition-colors font-medium text-base">
                            {link.label}
                          </Link>
                        </li>)}
                    </ul>
                  </motion.div>}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right actions - desktop */}
          <div className="hidden xl:flex flex-row items-center gap-2 flex-shrink-0">
            <CartDrawer />
            <Link to="/orcamento" className="px-5 py-2 text-[13px] font-semibold text-[#0b3152] bg-white border border-white hover:bg-white/90 transition-all duration-300 tracking-[0.15em] whitespace-nowrap uppercase rounded-full shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]">
              Orçamento
            </Link>
          </div>

          <div className="xl:hidden flex items-center gap-2">
            <CartDrawer />
          </div>
        </div>

        {/*
          Em celular, cada área fica visível de uma vez: três opções na
          primeira linha e duas na segunda. Assim não há abas cortadas ou
          navegação escondida fora da tela; o toque continua abrindo os
          painéis de Produtos, Ambientes e Calculadora.
        */}
        <nav aria-label="Navegação principal móvel" className="xl:hidden grid min-h-[104px] w-full grid-cols-6 items-center gap-1.5 border-t border-white/[0.10] px-3 py-2 sm:min-h-14 sm:grid-cols-5 sm:gap-1 sm:px-4">
          <button onClick={() => toggleMenu("produtos")} className={`${navItemClass("produtos")} col-span-2 w-full !min-h-[40px] !whitespace-normal !px-2 !py-1.5 !text-[11px] !leading-tight !tracking-[0.045em] sm:col-span-1 sm:!text-[11px]`}>Produtos</button>
          <button onClick={() => toggleMenu("espacos")} className={`${navItemClass("espacos")} col-span-2 w-full !min-h-[40px] !whitespace-normal !px-2 !py-1.5 !text-[11px] !leading-tight !tracking-[0.045em] sm:col-span-1 sm:!text-[11px]`}>Ambientes</button>
          <button onClick={() => toggleMenu("recursos")} className={`${navItemClass("recursos")} col-span-2 w-full !min-h-[40px] !whitespace-normal !px-2 !py-1.5 !text-[11px] !leading-tight !tracking-[0.045em] sm:col-span-1 sm:!text-[11px]`}>Calculadora Acústica</button>
          <Link to="/conhecimento" onClick={() => setActiveMenu(null)} className={`${navItemClass("conhecimento")} col-span-3 w-full !min-h-[40px] !whitespace-normal !px-2 !py-1.5 !text-[11px] !leading-tight !tracking-[0.045em] sm:col-span-1 sm:!text-[11px]`}>Conhecimento</Link>
          <Link to="/contato" onClick={() => setActiveMenu(null)} className={`${navItemClass("sobre")} col-span-3 w-full !min-h-[40px] !whitespace-normal !px-2 !py-1.5 !text-[11px] !leading-tight !tracking-[0.045em] sm:col-span-1 sm:!text-[11px]`}>Sobre</Link>
        </nav>
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
              {activeMenu === "produtos" && <div className="max-h-[calc(100vh-11rem)] space-y-1.5 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#6c8796_transparent]">
                {[
                  { label: "Todos os produtos", desc: "Encontre a solução acústica ideal para o seu projeto", image: imgTodosProdutos, imagePosition: "58%", icon: Package, path: "/produtos", color: "from-[#052f46] via-[#07516c] to-[#0b7792]" },
                  { label: "Painel Absorvedor com Difusão Vazada", desc: "Absorção eficiente com acabamento arquitetônico", image: headerPainelDifusao, imagePosition: "center", icon: Waves, path: "/produtos/painel-mdf-vazado", color: "from-[#064a61] via-[#087086] to-[#16899a]" },
                  { label: "Nuvem Circular", desc: "Conforto acústico suspenso com desenho orgânico", image: headerNuvemCircular, imagePosition: "35%", icon: Circle, path: "/produtos/nuvem-acustica-snr3250", color: "from-[#174a68] via-[#226985] to-[#3689a0]" },
                  { label: "Difusão", desc: "Distribuição sonora equilibrada e espacial", image: headerDifusao, imagePosition: "70%", icon: Orbit, path: "/produtos/difusor-skyline", color: "from-[#23435c] via-[#315e76] to-[#4a7d8e]" },
                  { label: "Painel Absorvedor", desc: "Controle de reflexões com composição personalizada", image: headerPainelAbsorvedorAlternativo, imagePosition: "48%", icon: Layers3, path: "/produtos/painel-acustico-snr3250", color: "from-[#4f3a54] via-[#72516d] to-[#946b7f]" },
                  { label: "Lã de Rocha", desc: "Desempenho termoacústico para sistemas construtivos", image: headerLaRocha, icon: Box, path: "/produtos/la-de-rocha-d96", color: "from-[#67512c] via-[#89703d] to-[#aa9153]" },
                  { label: "Nuvem Acústica", desc: "Tratamento aéreo para grandes áreas e pé-direito", image: headerNuvemAcustica, icon: Grid3X3, path: "/produtos/nuvem-acustica-snr3250", color: "from-[#7a2f22] via-[#a8442d] to-[#d06d42]" },
                  { label: "Kit de Produtos", desc: "Conjunto coordenado para um tratamento completo", image: headerKits, imagePosition: "52%", icon: Package, path: "/produtos/kit-estudio-classic", color: "from-[#39465f] via-[#50637d] to-[#6b8297]" },
                  { label: "Cortina Acústica", desc: "Barreira flexível para portas, janelas e vãos", image: headerCortinaAlternativa, imagePosition: "48%", icon: Blinds, path: "/produtos/cortina-acustica-snr96c", color: "from-[#5b4a43] via-[#78665e] to-[#9a8379]" },
                  { label: "Baffle", desc: "Absorção vertical suspensa para ambientes amplos", image: headerBaffles, imagePosition: "18%", icon: Columns3, path: "/produtos/baffles-acusticos", color: "from-[#173e5d] via-[#245b7b] to-[#357999]" },
                ].map((item) => <Link key={item.label} to={item.path} onClick={() => setActiveMenu(null)} className="group relative flex min-h-[68px] cursor-pointer overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_7px_24px_-20px_rgba(6,35,59,.65)] transition-shadow duration-200 hover:shadow-[0_12px_30px_-17px_rgba(6,35,59,.72)] sm:min-h-[76px]">
                  <img src={item.image} alt={item.label} loading="lazy" className="absolute inset-y-0 right-0 h-full w-[62%] object-cover transition-transform duration-300 group-hover:scale-[1.02]" style={{ objectPosition: `center ${item.imagePosition ?? "center"}` }} />
                  <div className={`relative z-10 flex w-[66%] max-w-[520px] items-center gap-3 border-y border-l border-white/25 bg-gradient-to-r ${item.color} px-4 py-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-xl [clip-path:polygon(0_0,96%_0,88%_100%,0_100%)] sm:gap-4 sm:px-7`}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/55 sm:h-10 sm:w-10"><item.icon size={19} /></span>
                    <span><strong className="sonar-nav-modern block text-[13px] font-semibold leading-tight sm:text-base">{item.label}</strong><small className="mt-0.5 hidden max-w-[330px] text-[11px] leading-snug text-white/82 min-[460px]:block sm:text-xs">{item.desc}</small></span>
                  </div>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-[#083955] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"><ArrowRight size={16} /></span>
                </Link>)}
              </div>}

              {/* ESPAÇOS */}
              {activeMenu === "espacos" && <div className="grid gap-2">
                <div className="grid grid-cols-3 gap-2">
                  {spaces.slice(0, 3).map((space, index) => <button key={space.path} type="button" onMouseEnter={() => setActiveSpace(index)} onFocus={() => setActiveSpace(index)} onClick={() => setActiveSpace(index)} className={`group relative h-24 overflow-hidden rounded-xl text-left sm:h-32 ${activeSpace === index ? "ring-2 ring-cyan-500 ring-offset-2" : ""}`}>
                    <img src={space.image} alt="" className="h-full w-full object-cover brightness-[0.62] transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                    <strong className="absolute bottom-3 left-3 text-sm text-white sm:text-lg">{space.label}</strong>
                  </button>)}
                </div>

                <Link to={spaces[activeSpace].path} onClick={() => setActiveMenu(null)} className="group relative min-h-[210px] overflow-hidden rounded-2xl bg-[#073f4b] sm:min-h-[260px]">
                  <img src={spaces[activeSpace].image} alt={spaces[activeSpace].label} className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-[1.03]" />
                  <span className="absolute inset-0 bg-gradient-to-r from-[#075267] via-[#075267]/80 to-transparent" />
                  <div className="relative z-10 flex h-full min-h-[210px] max-w-lg flex-col justify-center p-6 text-white sm:min-h-[260px] sm:p-10">
                    <h3 className="text-2xl font-semibold sm:text-4xl">{spaces[activeSpace].label}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">Projetos acústicos que garantem clareza, conforto e desempenho para cada tipo de ambiente.</p>
                    <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/70 px-5 py-2.5 text-sm">Ver mais <ArrowRight size={15}/></span>
                  </div>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  {spaces.slice(3, 5).map((space, index) => <button key={space.path} type="button" onMouseEnter={() => setActiveSpace(index + 3)} onFocus={() => setActiveSpace(index + 3)} onClick={() => setActiveSpace(index + 3)} className={`group relative h-24 overflow-hidden rounded-xl text-left sm:h-28 ${activeSpace === index + 3 ? "ring-2 ring-cyan-500 ring-offset-2" : ""}`}>
                    <img src={space.image} alt="" className="h-full w-full object-cover brightness-[0.58] transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                    <strong className="absolute bottom-3 left-4 text-sm text-white sm:text-lg">{space.label}</strong>
                  </button>)}
                </div>
              </div>}

              {/* RECURSOS */}
              {activeMenu === "recursos" && <Link to="/calculadora" onClick={() => setActiveMenu(null)} className="group relative grid min-h-[430px] overflow-hidden rounded-[28px] bg-snr-paper text-white lg:grid-cols-[38%_62%] lg:pb-24">
                <div className="relative z-10 flex flex-col justify-center bg-gradient-to-br from-[#03131d] via-[#063b48] to-[#08798b] p-7 lg:p-10 [clip-path:polygon(0_0,100%_0,84%_100%,0_100%)]">
                  <Calculator className="mb-4 text-cyan-300" size={34} />
                  <h3 className="text-3xl font-semibold leading-none">Calculadora<br/><span className="text-cyan-300">Acústica</span></h3>
                  <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/75">Simule seu ambiente e descubra a área aproximada de tratamento acústico.</p>
                  <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white">Calcular agora <ArrowRight size={16}/></span>
                </div>
                <div className="absolute inset-0 lg:relative"><img src={imgCalculadora} alt="Estúdio tratado para simulação acústica" className="h-full w-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-[1.03] lg:opacity-100"/><div className="absolute inset-0 bg-gradient-to-r from-[#063b48] via-transparent to-transparent"/><span className="absolute right-7 top-7 rounded-lg border border-cyan-300/50 bg-[#03131d]/75 px-3 py-2 text-xs text-cyan-100 backdrop-blur">Painel absorvedor · 120 × 60 cm</span></div>
                <div className="absolute bottom-4 left-[7%] right-[7%] z-20 hidden h-20 items-center justify-around rounded-2xl bg-white px-5 text-[#06233b] shadow-[0_20px_45px_-20px_rgba(0,0,0,.45)] lg:flex">
                  {[{icon:Crosshair,title:"Estime com precisão",text:"Resultados aproximados"},{icon:Clock3,title:"Em tempo real",text:"Simulação instantânea"},{icon:SlidersHorizontal,title:"Solução ideal",text:"Tratamento recomendado"}].map((item) => <span key={item.title} className="flex items-center gap-3 border-r border-slate-200 pr-7 last:border-0 last:pr-0"><span className="grid h-10 w-10 place-items-center rounded-full border border-cyan-500/40 text-cyan-600"><item.icon size={19}/></span><span><strong className="block text-xs">{item.title}</strong><small className="text-[10px] text-slate-500">{item.text}</small></span></span>)}
                </div>
                <div className="absolute bottom-2 right-5 z-30 hidden h-28 w-28 place-items-center rounded-full border-[8px] border-cyan-400 bg-[#03131d] text-center shadow-xl lg:grid"><span><strong className="block text-3xl text-cyan-300">24</strong><small className="text-[10px] text-white/70">m² estimados</small></span></div>
              </Link>}
            </div>
          </motion.div>}
      </AnimatePresence>

    </motion.header>;
}
