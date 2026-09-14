import { ArrowRight, BarChart3, Factory, Headphones, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import artwork from '@/assets/home-reference/technical-journey-layout.png';
import './technical-journey.css';
import DeferredSvgImage from './DeferredSvgImage';

const stages = [
  { number: '01', title: 'Análise técnica', text: 'Diagnósticos precisos para soluções eficientes.', to: '/calculadora', cropX: 60 },
  { number: '02', title: 'Consultoria', text: 'Orientação especializada em todas as etapas.', to: '/contato', cropX: 320 },
  { number: '03', title: 'Projeto 3D', text: 'Modelagem e simulações para melhores decisões.', to: '/calculadora', cropX: 580 },
  { number: '04', title: 'Materiais', text: 'Soluções acústicas de alta performance.', to: '/produtos', cropX: 840 },
  { number: '05', title: 'Instalação', text: 'Equipe especializada com qualidade e precisão.', to: '/projetos', cropX: 1100 },
  { number: '06', title: 'Acompanhamento', text: 'Suporte técnico contínuo para o melhor resultado.', to: '/contato', cropX: 1360 },
] as const;

const benefits = [
  { title: 'Projetos personalizados', text: 'Soluções sob medida para cada ambiente.', to: '/orcamento', icon: BarChart3 },
  { title: 'Atendimento especializado', text: 'Especialistas acústicos do início ao fim.', to: '/contato', icon: Headphones },
  { title: 'Fabricação própria', text: 'Produção nacional com controle de qualidade.', to: '/produtos', icon: Factory },
  { title: 'Entrega nacional', text: 'Enviamos para todo o Brasil com segurança.', to: '/contato', icon: Truck },
  { title: 'Suporte técnico', text: 'Antes, durante e após o seu projeto.', to: '/contato', icon: ShieldCheck },
] as const;

function ArtworkCrop({ x, y, width, height, label }: { x: number; y: number; width: number; height: number; label: string }) {
  return (
    <svg viewBox={`${x} ${y} ${width} ${height}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <DeferredSvgImage href={artwork} width="1672" height="941" />
    </svg>
  );
}

export default function TechnicalJourney() {
  return (
    <section className="technical-journey" aria-labelledby="technical-journey-title">
      <div className="technical-journey__mobile">
        <div className="technical-journey__top">
          <div className="technical-journey__intro">
            <p className="technical-journey__eyebrow">SOLUÇÕES TÉCNICAS</p>
            <h2 id="technical-journey-title">Análise técnica, projeto e acompanhamento.</h2>
            <p className="technical-journey__lead">Da leitura do ambiente à instalação final, desenvolvemos soluções acústicas com rigor técnico, planejamento inteligente e execução especializada.</p>
            <div className="technical-journey__actions">
              <Link to="/orcamento">Solicitar análise <ArrowRight aria-hidden="true" /></Link>
              <Link to="/contato">Falar com especialista</Link>
            </div>
          </div>
          <div className="technical-journey__visuals">
            <div className="technical-journey__hero-crop">
              <ArtworkCrop x={704} y={30} width={620} height={390} label="Instalação de painéis acústicos em restaurante" />
            </div>
            <div className="technical-journey__side-crop">
              <ArtworkCrop x={1347} y={34} width={250} height={388} label="Restaurante com tratamento acústico" />
            </div>
          </div>
        </div>

        <div className="technical-journey__stages">
          {stages.map((stage) => (
            <Link key={stage.title} to={stage.to} className="technical-journey__stage">
              <ArtworkCrop x={stage.cropX} y={444} width={252} height={174} label={stage.title} />
              <div className="technical-journey__stage-copy">
                <span>{stage.number}</span>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
                <ArrowRight aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        <div className="technical-journey__benefits">
          {benefits.map(({ icon: Icon, ...benefit }) => (
            <Link key={benefit.title} to={benefit.to} className="technical-journey__benefit-card">
              <Icon aria-hidden="true" />
              <div><h3>{benefit.title}</h3><p>{benefit.text}</p></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
