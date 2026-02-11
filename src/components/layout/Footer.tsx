import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-4">
              SONAR<span className="text-primary">.</span>
            </h3>
            <p className="text-sm text-accent-foreground/60">
              Soluções profissionais em tratamento acústico para todos os tipos de ambientes.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3">Produtos</h4>
            <ul className="space-y-2 text-sm text-accent-foreground/60">
              <li><Link to="/produtos" className="hover:text-primary transition-colors">Painéis Acústicos</Link></li>
              <li><Link to="/produtos" className="hover:text-primary transition-colors">Bass Traps</Link></li>
              <li><Link to="/produtos" className="hover:text-primary transition-colors">Difusores</Link></li>
              <li><Link to="/produtos" className="hover:text-primary transition-colors">Painéis MDF Vazado</Link></li>
              <li><Link to="/produtos" className="hover:text-primary transition-colors">Forros</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3">Soluções</h4>
            <ul className="space-y-2 text-sm text-accent-foreground/60">
              <li><Link to="/solucoes/estudios" className="hover:text-primary transition-colors">Estúdios</Link></li>
              <li><Link to="/solucoes/igrejas" className="hover:text-primary transition-colors">Igrejas</Link></li>
              <li><Link to="/solucoes/corporativo" className="hover:text-primary transition-colors">Corporativo</Link></li>
              <li><Link to="/solucoes/residencial" className="hover:text-primary transition-colors">Residencial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3">Contato</h4>
            <ul className="space-y-2 text-sm text-accent-foreground/60">
              <li>contato@sonaracusticos.com.br</li>
              <li>(11) 99999-0000</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-accent-foreground/10 mt-8 mb-4" />
        <p className="text-center text-xs text-accent-foreground/40">
          © {new Date().getFullYear()} Sonar Acústicos. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
