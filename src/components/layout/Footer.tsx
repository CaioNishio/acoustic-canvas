import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook, Linkedin } from "lucide-react";
import logo from "@/assets/logo-sonar.png";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[hsl(205,78%,12%)] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="Sonar Acústicos" className="h-44 w-auto mb-4" />
            <p className="text-sm text-white/60">
              Soluções profissionais em tratamento acústico para todos os tipos de ambientes.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-white/40 hover:text-secondary transition-colors"><Instagram size={16} /></a>
              <a href="#" className="text-white/40 hover:text-secondary transition-colors"><Youtube size={16} /></a>
              <a href="#" className="text-white/40 hover:text-secondary transition-colors"><Facebook size={16} /></a>
              <a href="#" className="text-white/40 hover:text-secondary transition-colors"><Linkedin size={16} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-secondary mb-3">Produtos</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/produtos" className="hover:text-white transition-colors">Painéis Acústicos</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Bass Traps</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Difusores</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Painéis MDF Vazado</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Forros</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-secondary mb-3">Espaços</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/solucoes/estudios" className="hover:text-white transition-colors">Estúdios</Link></li>
              <li><Link to="/solucoes/igrejas" className="hover:text-white transition-colors">Igrejas</Link></li>
              <li><Link to="/solucoes/auditorios" className="hover:text-white transition-colors">Auditórios</Link></li>
              <li><Link to="/solucoes/corporativo" className="hover:text-white transition-colors">Corporativo</Link></li>
              <li><Link to="/solucoes/residencial" className="hover:text-white transition-colors">Residencial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-secondary mb-3">Contato</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>contato@sonaracusticos.com.br</li>
              <li>(11) 99999-0000</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-white/10 mt-8 mb-4" />
        <p className="text-center text-xs text-white/40">
          © {new Date().getFullYear()} Sonar Acústicos. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
