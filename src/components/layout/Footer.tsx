import { Link } from "react-router-dom";
import { Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/logo-sonar.png";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[hsl(205,78%,12%)] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="Sonar Acústicos" className="h-44 w-auto mb-4" />
            <p className="text-base text-white/60">
              Soluções profissionais em tratamento acústico para todos os tipos de ambientes.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://www.instagram.com/sonar_acusticos" target="_blank" rel="noopener noreferrer" aria-label="Siga-nos no Instagram" className="text-white/50 hover:text-secondary transition-colors"><Instagram size={30} /></a>
              <a href="https://wa.me/5511967484000" target="_blank" rel="noopener noreferrer" aria-label="Fale conosco pelo WhatsApp" className="text-white/50 hover:text-secondary transition-colors"><MessageCircle size={30} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-base font-semibold text-secondary mb-3">Produtos</h4>
            <ul className="space-y-2 text-base text-white/60">
              <li><Link to="/produtos" className="hover:text-white transition-colors">Painéis Acústicos</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Bass Traps</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Difusores</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Painéis MDF Vazado</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Forros</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-base font-semibold text-secondary mb-3">Espaços</h4>
            <ul className="space-y-2 text-base text-white/60">
              <li><Link to="/solucoes/estudios" className="hover:text-white transition-colors">Estúdios</Link></li>
              <li><Link to="/solucoes/igrejas" className="hover:text-white transition-colors">Igrejas</Link></li>
              <li><Link to="/solucoes/auditorios" className="hover:text-white transition-colors">Auditórios</Link></li>
              <li><Link to="/solucoes/corporativo" className="hover:text-white transition-colors">Corporativo</Link></li>
              <li><Link to="/solucoes/residencial" className="hover:text-white transition-colors">Residencial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-base font-semibold text-secondary mb-3">Contato</h4>
            <ul className="space-y-2 text-base text-white/60">
              <li><a href="mailto:contato@sonaracusticos.com.br" className="hover:text-white transition-colors">contato@sonaracusticos.com.br</a></li>
              <li><a href="https://wa.me/5511967484000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><MessageCircle size={20} /> (11) 96748-4000</a></li>
              <li><a href="https://www.instagram.com/sonar_acusticos" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Instagram size={20} /> @sonar_acusticos</a></li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-white/10 mt-8 mb-4" />
        <p className="text-center text-xs text-white/70">
          © {new Date().getFullYear()} Sonar Acústicos. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
