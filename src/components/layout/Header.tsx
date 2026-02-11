import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Instagram, Youtube, Facebook, Linkedin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-sonar.png";

import imgEstudio from "@/assets/gallery/estudio-paineis.jpeg";
import imgForro from "@/assets/gallery/forro-corporativo.jpg";
import imgSalaReuniao from "@/assets/gallery/paineis-sala-reuniao.png";
import imgAcademia from "@/assets/gallery/academia-baffles.jpeg";
import imgEscritorio from "@/assets/gallery/escritorio-paineis.png";

const navItems = [
  { label: "Produtos", path: "/produtos" },
  { label: "Soluções", path: "/solucoes" },
  { label: "Projetos", path: "/projetos" },
  { label: "Calculadora", path: "/calculadora" },
  { label: "Fale com um Especialista", path: "/contato" },
  { label: "Projete sua Sala", path: "/orcamento" },
];

const spaces = [
  { label: "Estúdios", path: "/solucoes/estudios", image: imgEstudio },
  { label: "Igrejas", path: "/solucoes/igrejas", image: imgForro },
  { label: "Auditórios", path: "/solucoes/auditorios", image: imgSalaReuniao },
  { label: "Corporativo", path: "/solucoes/corporativo", image: imgEscritorio },
  { label: "Residencial", path: "/solucoes/residencial", image: imgAcademia },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [spacesOpen, setSpacesOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto flex items-center justify-between h-9 px-4 text-xs">
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors"><Instagram size={14} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Youtube size={14} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Facebook size={14} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Linkedin size={14} /></a>
          </div>
          <div className="flex items-center gap-1 mx-auto md:mx-0">
            <Phone size={12} className="text-primary" />
            <span className="tracking-wider">Consultoria Acústica Gratuita</span>
          </div>
          <div className="hidden md:block text-secondary-foreground/60">
            São Paulo, Brasil
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Sonar Acústicos" className="h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            <Link
              to="/produtos"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname.startsWith("/produtos") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Produtos
            </Link>
            <button
              onMouseEnter={() => setSpacesOpen(true)}
              onMouseLeave={() => setSpacesOpen(false)}
              className={`px-3 py-2 text-sm font-medium rounded-full transition-colors relative ${
                spacesOpen || location.pathname.startsWith("/solucoes") ? "bg-secondary text-secondary-foreground" : "text-foreground hover:text-primary"
              }`}
            >
              Espaços
            </button>
            <Link
              to="/projetos"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname.startsWith("/projetos") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Projetos
            </Link>
            <Link
              to="/calculadora"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === "/calculadora" ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Recursos
            </Link>
            <Link
              to="/contato"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === "/contato" ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Fale com um Especialista
            </Link>
            <Link
              to="/orcamento"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === "/orcamento" ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Projete sua Sala
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Spaces sub-nav dropdown (desktop) */}
      <AnimatePresence>
        {spacesOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setSpacesOpen(true)}
            onMouseLeave={() => setSpacesOpen(false)}
            className="hidden lg:block absolute left-0 right-0 bg-card/98 backdrop-blur-lg border-b border-border shadow-xl z-40"
          >
            <div className="container mx-auto px-4 py-5">
              <div className="grid grid-cols-5 gap-4">
                {spaces.map((space) => (
                  <Link
                    key={space.path}
                    to={space.path}
                    className="group relative overflow-hidden rounded-xl aspect-[4/3]"
                    onClick={() => setSpacesOpen(false)}
                  >
                    <img
                      src={space.image}
                      alt={space.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-[0.6] group-hover:brightness-[0.5]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <h3 className="text-white font-display font-bold text-lg leading-tight">{space.label}</h3>
                      <ArrowRight size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-b border-border bg-card shadow-xl"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "text-primary bg-muted"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="h-px bg-border my-2" />
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Espaços</p>
              {spaces.map((space) => (
                <Link
                  key={space.path}
                  to={space.path}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3"
                >
                  <img src={space.image} alt="" className="w-8 h-8 rounded object-cover" />
                  {space.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
