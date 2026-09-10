import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Calculator, LayoutTemplate, MessageCircle } from 'lucide-react';
import artwork from '@/assets/home-reference/solutions-catalog-reference.png';
import hybridPanel from '@/assets/home-reference/painel-hibrido-mdf-vazado-card.jpg';
import './solutions-catalog.css';
import DeferredSvgImage from './DeferredSvgImage';

const solutions = [
  { title:'Painel Acústico Móvel', description:'Flexibilidade para dividir e tratar ambientes.', slug:'biombo-acustico-cavalete', viewBox:'53 258 262 450', image:null },
  { title:'Bass Trap', description:'Controle modal de graves e ressonâncias.', slug:'bass-trap-membrana-snr6420', viewBox:'332 258 261 450', image:null },
  { title:'Painel Acústico Plotado', description:'Tratamento com personalização visual.', slug:'painel-imagem-plotada', viewBox:'610 258 263 450', image:null },
  { title:'Painel Híbrido com MDF Vazado', description:'Absorção e difusão em composição elegante.', slug:'painel-moldura-madeira', viewBox:'890 258 265 450', image:hybridPanel },
  { title:'Cortina Acústica', description:'Solução prática para conforto sonoro sem obra.', slug:'cortina-acustica-snr96c', viewBox:'1172 258 263 450', image:null },
  { title:'Nuvem Acústica', description:'Tratamento suspenso para tetos e áreas amplas.', slug:'nuvem-acustica-snr3250', viewBox:'1452 258 263 450', image:null },
] as const;

export default function SolutionsCatalog(){
 return <section className="solutions-catalog" aria-labelledby="solutions-catalog-title">
  <div className="solutions-catalog__inner">
   <header className="solutions-catalog__heading">
    <div><p>Orientação técnica sem custo</p><h2 id="solutions-catalog-title">Consultoria acústica gratuita <span>via WhatsApp.</span></h2></div>
    <div><p>Envie fotos, medidas, objetivos e a atividade realizada no local. Nossa equipe avalia o ambiente com cálculos de RT60 para orientar absorção, posicionamento dos painéis e a reverberação adequada.</p></div>
   </header>
   <div className="solutions-catalog__process" aria-label="Etapas da avaliação acústica">
    <span><Camera size={18}/><b>Leitura do ambiente</b><small>Fotos, medidas e uso do espaço</small></span>
    <span><Calculator size={18}/><b>Análise técnica</b><small>RT60 e necessidade de absorção</small></span>
    <span><LayoutTemplate size={18}/><b>Orientação de projeto</b><small>Materiais e posicionamento</small></span>
    <span><MessageCircle size={18}/><b>Retorno pelo WhatsApp</b><small>Recomendação clara e personalizada</small></span>
   </div>
   <div className="solutions-catalog__grid">
    {solutions.map(item=><Link className="solutions-catalog__card" to={`/produtos/${item.slug}`} key={item.title}>
      {item.image
        ? <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
        : <svg viewBox={item.viewBox} role="img" aria-label={item.title}><DeferredSvgImage href={artwork} width="1774" height="887"/></svg>}
      <span className="solutions-catalog__shade" aria-hidden="true"/>
      <span className="solutions-catalog__copy"><strong>{item.title}</strong><small>{item.description}</small><i aria-hidden="true"><ArrowRight size={18}/></i></span>
    </Link>)}
   </div>
  </div>
 </section>;
}
