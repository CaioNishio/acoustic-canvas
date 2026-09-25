import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Gauge,
  House,
  Layers3,
  MessageCircle,
  Mic2,
  Monitor,
  Recycle,
  Ruler,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import panelBlack from "@/assets/curated-products/painel-acustico-snr3250/01.png";
import panelSand from "@/assets/curated-products/painel-acustico-snr3250/01-areia-transparente.png";
import panelBlue from "@/assets/curated-products/painel-acustico-snr3250/04.png";
import waveWood from "@/assets/curated-covers/difusor-skyline.png";
import framedPanel from "@/assets/produtos/painel-moldura-madeira/00-capa-branca-organizada.png";
import catalogLayout from "@/assets/home-reference/area-4-catalog-layout-clean.webp";
import engineeringReference from "@/assets/home-reference/engineering-performance-reference.png";
import acousticCurtain from "@/assets/curated-products/cortina-acustica/catalog-cutout.png";
import bassTrapComposition from "@/assets/curated-products/bass-trap/composition-reference.png";

const cats = [
  [Monitor, "HOME THEATER"],
  [Mic2, "ESTÚDIOS"],
  [BriefcaseBusiness, "ESCRITÓRIOS"],
  [UtensilsCrossed, "RESTAURANTES"],
  [Building2, "AUDITÓRIOS"],
  [ShoppingBag, "LOJAS"],
  [House, "RESIDÊNCIAS"],
] as const;
const items = [
  ["Painel SNR3250", panelBlack, "painel-acustico-snr3250"],
  ["Painel SNR6450", panelBlue, "painel-acustico-snr6450"],
  ["Cortina Acústica - Isolamento", acousticCurtain, "cortina-acustica-snr96c"],
  ["Difusor Skyline SNR12D", waveWood, "difusor-skyline"],
  ["Moldura Premium", framedPanel, "painel-moldura-madeira"],
  ["Bass Trap", bassTrapComposition, "bass-trap-corner-3s-snr6430"],
] as const;

export default function HomeCatalogExperience() {
  return (
    <section className="relative z-0 order-2 flex flex-col overflow-hidden bg-[#fbfaf7] text-[#071b3d]">
      <style>{`.snr-catalog-intro{display:grid;gap:34px;align-items:stretch}.snr-feature-card{display:grid;grid-template-columns:minmax(0,38fr) minmax(0,62fr)}.snr-feature-card>dl{grid-column:1/-1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;border-left:0;border-top:1px solid rgba(7,27,61,.1)}.snr-engineering{display:grid}@media(min-width:560px){.snr-feature-card{grid-template-columns:42% 58%;min-height:340px}.snr-feature-card>dl{grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}}@media(min-width:900px){.snr-catalog-intro{grid-template-columns:minmax(0,32fr) minmax(0,68fr)}.snr-feature-card{grid-template-columns:40% 34% 26%}.snr-feature-card>dl{grid-column:auto;display:flex;border-left:1px solid rgba(7,27,61,.1);border-top:0}.snr-engineering{grid-template-columns:repeat(3,minmax(0,1fr))}}`}</style>
      <div className="h-2 bg-[#020d1d]" />
      <div className="snr-catalog-art relative isolate aspect-[2134/737] w-full overflow-hidden bg-[#031a38] text-white">
        <img
          src={catalogLayout}
          width={2134}
          height={737}
          fetchPriority="high"
          alt="Catálogo Sonar — Performance que se vê, com painéis e difusores acústicos"
          className="block h-full w-full select-none object-contain"
          draggable={false}
        />
        <h2 className="sr-only">Performance que se vê.</h2>
        <Link
          to="/produtos"
          aria-label="Explorar produtos"
          className="absolute left-[3.1%] top-[68%] h-[12%] w-[14.8%] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white"
        />
        <Link
          to="/solucoes"
          aria-label="Ver aplicações"
          className="absolute left-[20.4%] top-[68%] h-[12%] w-[12%] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white"
        />
      </div>
      <div className="bg-[#07346b] text-[#d9b879]">
        <div className="mx-auto grid max-w-[1600px] grid-cols-7 px-2 py-1.5">
          {cats.map(([Icon, label]) => (
            <Link
              to="/solucoes"
              key={label}
              className="flex min-h-9 flex-col items-center justify-center gap-0.5 border-l border-white/10 text-center first:border-l-0"
            >
              <Icon size={15} strokeWidth={1.35} />
              <span className="text-[6px] leading-none text-white/80">{label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="h-3 bg-[#f8f8f7]" />
      <div
        className="order-first mx-auto max-w-[1600px] pb-16 pt-7"
        style={{ paddingInline: "var(--snr-home-gutter)" }}
      >
        <div className="snr-catalog-intro">
          <div className="flex flex-col justify-center">
            <p className="text-[10px] tracking-[.16em] text-[#5d6b82]">
              — &nbsp; CATÁLOGO COMPLETO
            </p>
            <h2 className="mt-7 max-w-[12ch] font-display text-[clamp(28px,2.6vw,40px)] leading-[1.04]">
              Todos os produtos em um só lugar.
            </h2>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-7 text-[#5d697f]">
              Painéis, bass traps, difusores e soluções completas — fabricados
              sob medida para o seu ambiente.
            </p>
            <Link
              to="/produtos"
              className="mt-8 inline-flex w-fit items-center gap-9 border border-[#071b3d]/35 px-6 py-3 text-[10px]"
            >
              VER TODOS OS PRODUTOS <ArrowRight size={16} />
            </Link>
          </div>
          <article className="snr-feature-card relative overflow-hidden rounded-[24px] border border-white/85 bg-[#dfe3e8]/55 shadow-[0_28px_80px_rgba(32,52,82,.16),inset_0_1px_0_rgba(255,255,255,.92)] backdrop-blur-[28px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.54),rgba(214,220,227,.28)_52%,rgba(255,255,255,.16))]"
            />
            <span className="absolute left-3 top-3 z-20 rounded-full bg-[#275e65] px-3 py-2 text-[9px] font-bold text-white shadow-sm sm:left-5 sm:top-5 sm:px-5 sm:text-[10px]">
              MAIS VENDIDO
            </span>
            <div className="relative z-10 m-3 flex items-center justify-center rounded-[18px] border border-white/75 bg-white/28 p-3 pt-12 shadow-[inset_0_1px_0_rgba(255,255,255,.78),0_18px_42px_rgba(56,67,78,.08)] backdrop-blur-xl sm:m-5 sm:p-6">
              <img
                loading="lazy"
                decoding="async"
                src={panelSand}
                alt="Painel Acústico SNR3250 em acabamento areia"
                className="h-[150px] w-full object-contain drop-shadow-[0_16px_20px_rgba(70,55,36,.18)] transition-transform duration-500 hover:scale-105 sm:h-[210px]"
              />
            </div>
            <div className="relative z-10 flex min-w-0 flex-col justify-center px-3 py-5 sm:px-6 sm:py-8">
              <p className="text-[9px] font-medium text-[#46566e] sm:text-[10px]">
                PAINEL ACÚSTICO
              </p>
              <h3 className="mt-1 text-[24px] text-[#071b3d] sm:mt-2 sm:text-[32px]">
                SNR3250
              </h3>
              <p className="text-[15px] text-[#40526d] sm:text-[18px]">
                Absorção High-Mid
              </p>
              <p className="mt-3 text-[11px] leading-[1.45] text-[#4f5e74] sm:mt-6 sm:text-[12px] sm:leading-5">
                Alta performance em médias e altas frequências. Medidas de 60×60
                até 200×60 cm.
              </p>
              <Link
                to="/produtos/painel-acustico-snr3250"
                className="mt-4 inline-flex w-fit items-center gap-3 border border-[#071b3d]/35 bg-white/28 px-3 py-2 text-[9px] backdrop-blur-md sm:mt-7 sm:gap-8 sm:px-5 sm:py-3 sm:text-[10px]"
              >
                VER DETALHES <ArrowRight size={14} />
              </Link>
            </div>
            <dl className="relative z-10 flex flex-col justify-center gap-5 border-t border-white/55 bg-white/14 px-4 py-5 sm:px-6 sm:py-8 md:border-l md:border-t-0">
              <Tech icon={Ruler} l="ESPESSURA" v="50 mm" />
              <Tech icon={Gauge} l="DENSIDADE" v="32, 64 e 96 kg/m³" />
              <Tech icon={Monitor} l="APLICAÇÃO" v="Parede / Teto" />
              <Tech
                icon={Layers3}
                l="MATERIAL"
                v="LÃ MINERAL DE ABSORÇÃO COM REVESTIMENTO POROSO DE ALTA QUALIDADE"
              />
              <Tech icon={Gauge} l="NRC" v="0,85" />
            </dl>
          </article>
        </div>
        <div className="mt-5 flex snap-x overflow-x-auto rounded-2xl border border-[#071b3d]/10 bg-white [scrollbar-width:none] lg:grid lg:grid-cols-6">
          {items.map(([name, img, slug]) => (
            <Link
              to={`/produtos/${slug}`}
              key={name}
              className="group min-w-[190px] border-r border-[#071b3d]/10 p-4 text-center lg:min-w-0"
            >
              <img
                loading="lazy"
                decoding="async"
                src={img}
                alt={name}
                className="mx-auto h-32 w-full object-contain transition duration-500 group-hover:scale-110"
              />
              <p className="mt-3 text-[11px] text-[#657188]">{name}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 overflow-hidden border-y border-[#071b3d]/10 bg-white">
          <img
            src={engineeringReference}
            alt="Desempenho comprovado, tecnologia e visualização do painel acústico no ambiente"
            className="block h-auto w-full"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
export function CatalogBenefitsStrip() {
  return (
    <section
      aria-label="Benefícios Sonar"
      className="relative z-20 order-1 -mt-10 w-full bg-transparent pb-7 pt-0 sm:-mt-12 sm:pb-8 xl:-mt-14"
      style={{ paddingInline: "clamp(8px, 1.8vw, 28px)" }}
    >
      <div className="mx-auto grid w-full max-w-[1880px] grid-cols-2 gap-x-3 gap-y-2 rounded-[16px] border border-white/20 bg-[linear-gradient(105deg,#0b4a91_0%,#073873_38%,#062654_100%)] px-3 py-3 text-white shadow-[0_18px_45px_rgba(5,38,83,.22),inset_0_1px_0_rgba(255,255,255,.2)] sm:px-5 md:grid-cols-4 md:gap-0 md:px-4 md:py-2.5">
        <Benefit icon={MessageCircle} t="ATENDIMENTO ESPECIALIZADO" x="Suporte técnico para seu projeto" />
        <Benefit icon={Ruler} t="FABRICAÇÃO SOB MEDIDA" x="Painéis e soluções personalizadas" />
        <Benefit icon={Truck} t="ENVIO PARA TODO O BRASIL" x="Logística segura e ágil" />
        <Benefit icon={Recycle} t="SUSTENTABILIDADE" x="Materiais recicláveis e responsáveis" />
      </div>
    </section>
  );
}
function Tech({
  icon: Icon,
  l,
  v,
}: {
  icon: typeof Ruler;
  l: string;
  v: string;
}) {
  const isMaterial = l === "MATERIAL";
  return (
    <div>
      <dt className="flex items-center gap-3 text-[8px] text-[#59677d]">
        <Icon size={18} aria-hidden="true" />
        <span>{l}</span>
      </dt>
      <dd
        className={`mt-1 pl-[30px] font-semibold ${isMaterial ? "snr-material-copy text-[8px] leading-[1.35] sm:text-[11px] sm:leading-normal" : "text-[11px]"}`}
      >
        {v}
      </dd>
    </div>
  );
}
function Benefit({
  icon: Icon,
  t,
  x,
}: {
  icon: typeof Ruler;
  t: string;
  x: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 px-1 py-1 md:justify-center md:border-l md:border-white/10 md:first:border-l-0">
      <Icon size={22} className="shrink-0 text-[#d7b276]" />
      <div>
        <p className="text-[7px] leading-tight sm:text-[8px]">{t}</p>
        <p className="mt-0.5 text-[9px] leading-tight text-white/75 sm:text-[10px]">{x}</p>
      </div>
    </div>
  );
}
