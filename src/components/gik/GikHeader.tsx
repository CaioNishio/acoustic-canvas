import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingBag } from "lucide-react";

const navLinks = [
  { label: "Produtos", to: "/produtos" },
  { label: "Soluções", to: "/solucoes" },
  { label: "Recursos", to: "/projetos" },
  { label: "Sobre", to: "/contato" },
  { label: "Consultoria Grátis", to: "/orcamento" },
  { label: "Projete Sua Sala", to: "/calculadora" },
];

const GikHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-[#FDFEFE] text-[#0B0E11] transition-all duration-300 ${
        scrolled ? "py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)]" : "py-8"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-12">
        <Link
          to="/"
          className="font-['Lexend_Giga'] text-lg font-bold tracking-tight text-[#193139]"
        >
          SONAR ACÚSTICOS
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="font-['Lexend'] text-base font-semibold text-[#193139] transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Buscar"
            className="transition-opacity hover:opacity-70"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Minha conta"
            className="transition-opacity hover:opacity-70"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Carrinho"
            className="transition-opacity hover:opacity-70"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default GikHeader;
