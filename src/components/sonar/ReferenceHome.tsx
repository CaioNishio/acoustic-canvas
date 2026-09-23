import { Link } from "react-router-dom";
import { ArrowRight, Phone, Waves, Box, ShieldCheck, Leaf, Factory, SlidersHorizontal, Play, Grid2X2, Star, Quote } from "lucide-react";
import painel from "@/assets/curated-covers/painel-snr3250.png";
import skyline from "@/assets/curated-covers/difusor-skyline.png";
import slim from "@/assets/gallery/painel-slim-produto.webp";
import wave from "@/assets/gallery/wavefuser-hibrido.jpg";
import wood from "@/assets/novas/difusor-skyline-blocos-madeira.webp";
import room from "@/assets/gallery/hero-home-studio.webp";
import applicationsReference from "@/assets/home-reference/applications-area-reference.png";
import appRestaurant from "@/assets/curated/home/ambiente-restaurante.png";
import appTemple from "@/assets/curated/home/ambiente-igreja.jpg";
import appOffice from "@/assets/curated/home/ambiente-escritorio.jpg";
import appStudio from "@/assets/curated/home/ambiente-estudio.jpg";
import appAuditorium from "@/assets/curated/home/ambiente-auditorio.png";
import AcousticHeroExperience from "./AcousticHeroExperience";
import HomeCatalogExperience, { CatalogBenefitsStrip } from "./HomeCatalogExperience";
import DiffusionCuration from "./DiffusionCuration";
import ProjectsEditorial from "./ProjectsEditorial";
import SolutionsCatalog from "./SolutionsCatalog";
import AcousticScrollTransition from "./AcousticScrollTransition";
import MaterialsShowcase from "./MaterialsShowcase";
import TechnicalJourney from "./TechnicalJourney";

const reviews = [
  { name: "Mariana R.", context: "Home theater", text: "O ambiente ficou bem mais agradável. A fala está mais clara e o eco diminuiu bastante." },
  { name: "Rafael M.", context: "Estúdio", text: "Gostei muito do acabamento. Os painéis chegaram bem protegidos e ficaram ótimos na parede." },
  { name: "Camila A.", context: "Escritório", text: "A diferença nas reuniões foi perceptível. O espaço ficou mais confortável sem perder a estética." },
  { name: "Bruno S.", context: "Sala residencial", text: "O atendimento ajudou na escolha e o resultado ficou discreto, exatamente como eu queria." },
  { name: "Fernanda L.", context: "Consultório", text: "Além de bonitos, os painéis deixaram o som do ambiente mais controlado e acolhedor." },
  { name: "Eduardo P.", context: "Sala de música", text: "Produto muito bem-feito. A instalação foi tranquila e a melhora acústica apareceu logo no primeiro uso." },
];

const applications = [
  ["Restaurante", "Conforto acústico que valoriza cada detalhe da experiência.", appRestaurant],
  ["Templo", "Clareza e reverberação na medida certa para inspiração e conexão.", appTemple],
  ["Escritório", "Privacidade acústica e foco para mais produtividade.", appOffice],
  ["Estúdio", "Precisão sonora para criar, mixar e gravar sem limites.", appStudio],
  ["Auditório", "Inteligibilidade e impacto sonoro em cada apresentação.", appAuditorium],
  ["Escola", "Ambientes que favorecem aprendizado e concentração.", appOffice],
  ["Residencial", "Soluções que elevam conforto e qualidade de vida.", room],
] as const;

export default function ReferenceHome() {
  return <div className="ref-home flex flex-col bg-[#f8f8f7] text-[#071b3d]">
    <AcousticHeroExperience />
    <CatalogBenefitsStrip />
    {/* <section className="relative overflow-hidden bg-[radial-gradient(circle_at_53%_58%,#fff_0,#f0f0f3_44%,#e8e9ee_100%)]">
      <div className="mx-auto grid min-h-[650px] max-w-[1600px] grid-cols-1 px-6 pb-8 pt-12 lg:grid-cols-[.85fr_1.65fr] lg:px-10">
        <div className="relative z-10 flex flex-col justify-center py-12"><p className="mb-7 text-[12px] font-semibold tracking-[.22em] text-[#60708a]">ENGENHARIA ACÚSTICA<br/>E FABRICAÇÃO PRÓPRIA</p><h1 className="max-w-[520px] font-serif text-5xl leading-[.95] tracking-[-.04em] md:text-7xl">Cada ambiente<br/>merece ser<br/>ouvido com <span className="text-[#2863ee]">clareza</span></h1><p className="mt-7 max-w-[330px] text-sm leading-6 text-[#52617b]">Soluções acústicas que unem ciência, design e integração arquitetônica para transformar ambientes em experiências sonoras superiores.</p><div className="mt-7 flex gap-3"><Link to="/produtos" className="inline-flex items-center gap-4 rounded-full bg-[#06224a] px-5 py-3 text-[10px] font-bold text-white">ENCONTRE A SOLUÇÃO IDEAL <ArrowRight size={16}/></Link><Link to="/contato" className="rounded-full border border-[#071b3d]/35 px-5 py-3 text-[10px] font-bold">FALE COM UM ESPECIALISTA</Link></div></div>
        <div className="relative flex min-h-[390px] items-end justify-center overflow-hidden"><div className="absolute inset-x-[4%] bottom-[18%] h-px bg-[#2e67ff]/60 shadow-[0_0_18px_4px_rgba(55,108,255,.45)]"/><img src={painel} alt="Painel acústico" className="relative z-10 mb-[11%] h-[52%] w-[19%] object-contain drop-shadow-2xl"/><img src={wood} alt="Difusor de madeira" className="relative z-10 mb-[8%] h-[62%] w-[25%] object-contain drop-shadow-2xl"/><img src={room} alt="Biombo acústico" className="relative z-10 mb-[10%] h-[56%] w-[27%] object-cover object-center drop-shadow-2xl"/><img src={slim} alt="Porta acústica" className="relative z-10 mb-[10%] h-[60%] w-[18%] object-contain drop-shadow-2xl"/></div>
      </div>
      <div className="mx-auto mb-6 grid max-w-[1450px] grid-cols-2 gap-px rounded-2xl border border-[#0a1b3b]/12 bg-white/75 p-4 md:grid-cols-4"><Mini icon={Waves} title="PRECISÃO ACÚSTICA" text="Desempenho comprovado em todas as frequências."/><Mini icon={SlidersHorizontal} title="TECNOLOGIA E DESIGN" text="Materiais premium e design pensado para acústica real."/><Mini icon={Box} title="SOLUÇÕES PERSONALIZADAS" text="Projetos sob medida para cada necessidade."/><Mini icon={Leaf} title="SUSTENTABILIDADE EM CADA PROJETO" text="Processos responsáveis e materiais de baixo impacto."/></div>
    </section> */}

    <MaterialsShowcase />

    <AcousticScrollTransition />

    <HomeCatalogExperience />
    <DiffusionCuration />

    <section aria-labelledby="reviews-title" className="order-4 px-6 pb-12 lg:px-10">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-2xl border border-white/40 bg-[rgba(67,77,89,.9)] px-5 py-8 text-white shadow-[0_28px_80px_rgba(20,31,45,.2),inset_0_1px_0_rgba(255,255,255,.25)] backdrop-blur-[28px] md:px-8 md:py-10">
        <div className="flex flex-col justify-between gap-5 border-b border-white/15 pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[.2em] text-[#835718]">EXPERIÊNCIAS COMPARTILHADAS</p>
            <h2 id="reviews-title" className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl">Quem escolheu Sonar, recomenda.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Comentários sobre nossos produtos e o resultado percebido em diferentes ambientes.</p>
          </div>
          <div className="flex items-center gap-3 text-white" aria-label="Avaliação ilustrativa de cinco estrelas">
            <div className="flex gap-1" aria-hidden="true">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={17} className="fill-[#d6a453] text-[#d6a453]" />)}</div>
            <span className="text-xs font-semibold tracking-wide">5,0</span>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => <article key={review.name} className="flex min-h-[190px] flex-col rounded-xl border border-white/20 bg-[rgba(25,37,51,.58)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-xl transition-shadow duration-200 hover:shadow-[0_14px_34px_rgba(10,20,34,.2)]">
            <div className="flex items-center justify-between">
              <div role="img" className="flex gap-0.5" aria-label="5 de 5 estrelas">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} className="fill-[#d6a453] text-[#d6a453]" aria-hidden="true" />)}</div>
              <Quote size={21} strokeWidth={1.3} className="text-white/25" aria-hidden="true" />
            </div>
            <p className="mt-4 flex-1 text-[14px] leading-6 text-white/82">“{review.text}”</p>
            <div className="mt-5 border-t border-white/15 pt-4">
              <p className="text-sm font-semibold text-white">{review.name}</p>
              <p className="mt-0.5 text-[11px] text-white/55">{review.context}</p>
            </div>
          </article>)}
        </div>
        <p className="mt-5 text-[10px] leading-4 text-white/50">Depoimentos ilustrativos para apresentação do layout.</p>
      </div>
    </section>

    <SolutionsCatalog />
    <ProjectsEditorial />
    <TechnicalJourney />
    <section className="order-7 grid grid-cols-2 gap-px bg-white px-6 py-7 text-[#102244] md:grid-cols-5 lg:px-10"><Mini icon={Phone} title="Consultoria especializada" text="Ajudamos você a escolher a solução ideal."/><Mini icon={Factory} title="Fabricação sob medida" text="Painéis e soluções personalizadas."/><Mini icon={Waves} title="Desempenho comprovado" text="Materiais testados e validados."/><Mini icon={Leaf} title="Sustentabilidade" text="Processos responsáveis."/><Mini icon={ShieldCheck} title="Envio para todo o Brasil" text="Logística especializada."/></section>
  </div>;
}

function Mini({icon:Icon,title,text}:{icon:any,title:string,text:string}){return <div className="flex gap-3 p-4"><Icon size={25} strokeWidth={1.4}/><div><h3 className="text-[11px] font-semibold">{title}</h3><p className="mt-1 text-[10px] leading-4 opacity-70">{text}</p></div></div>}
function Spec({label,value}:{label:string,value:string}){return <div className="flex items-center justify-between border-b border-white/10 py-3 last:border-0"><span className="text-[10px] text-white/60">{label}</span><strong className="text-xs">{value}</strong></div>}
