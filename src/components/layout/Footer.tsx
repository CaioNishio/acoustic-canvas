import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import logo from "@/assets/logo-sonar.png";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[hsl(205,78%,12%)] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="Sonar Acústicos" className="h-44 w-auto mb-4" width={176} height={176} loading="lazy" decoding="async" />
            <p className="text-base text-white/60">
              Soluções profissionais em tratamento acústico para todos os tipos de ambientes.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://www.instagram.com/sonar_acusticos" target="_blank" rel="noopener noreferrer" aria-label="Siga-nos no Instagram" className="text-white/50 hover:text-secondary transition-colors"><Instagram size={28} /></a>
              <a href="https://wa.me/5511967484000" target="_blank" rel="noopener noreferrer" aria-label="Fale conosco pelo WhatsApp" className="text-white/50 hover:text-secondary transition-colors"><WhatsAppIcon size={28} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-base font-semibold text-secondary mb-3">Produtos</h4>
            <ul className="space-y-2 text-base text-white/60">
              <li><Link to="/produtos" className="hover:text-white transition-colors">Absorção Acústica</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Controle de Graves</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Difusão Sonora</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Soluções Especiais</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Tratamento Aéreo</Link></li>
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
              <li><a href="https://wa.me/5511967484000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><WhatsAppIcon size={18} /> (11) 96748-4000</a></li>
              <li><a href="https://www.instagram.com/sonar_acusticos" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Instagram size={20} /> @sonar_acusticos</a></li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-white/10 mt-8 mb-4" />
        <div className="flex items-center justify-center gap-4 text-xs text-white/70">
          <span>© {new Date().getFullYear()} Sonar Acústicos. Todos os direitos reservados.</span>
          <Link to="/admin-login" className="text-white/30 hover:text-white/60 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
