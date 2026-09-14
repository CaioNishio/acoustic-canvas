import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import artwork from '@/assets/home-reference/projects-sonar-clean.png';
import './projects-editorial.css';
import DeferredSvgImage from './DeferredSvgImage';

export default function ProjectsEditorial() {
 return <section className="projects-editorial" aria-labelledby="projects-editorial-title">
  <div className="projects-editorial__inner">
   <div className="projects-editorial__copy">
    <p className="projects-editorial__eyebrow">Projetos reais</p>
    <h2 id="projects-editorial-title">Ambientes que unem <span>acústica, design e bem-estar.</span></h2>
    <p>Soluções acústicas com estética arquitetônica, alta performance e composições pensadas para transformar espaços reais.</p>
    <Link to="/projetos">Ver projetos <ArrowRight size={18} aria-hidden="true" /></Link>
   </div>
   <div className="projects-editorial__visual">
    {[
      ['568 127 450 340','Design com performance','Sala de reunião com painéis acústicos coloridos'],
      ['1052 144 411 339','Conforto em cada detalhe','Estúdio musical com tratamento no teto'],
      ['574 496 414 315','Tecnologia aplicada ao silêncio','Sala de reunião com painéis no teto'],
      ['1023 510 403 317','Projetos que inspiram','Sala de audição com difusores e painéis acústicos'],
    ].map(([viewBox,label,description])=><figure className="projects-editorial__photo" key={label}>
      <svg viewBox={viewBox} role="img" aria-label={description}>
        <DeferredSvgImage href={artwork} width="1672" height="941" />
      </svg>
      <figcaption>{label}</figcaption>
    </figure>)}
   </div>
  </div>
 </section>;
}
