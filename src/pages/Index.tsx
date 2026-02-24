import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, Ruler, Wrench, Palette, Star, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { WaveDivider, FrequencyBars, SoundWaveLine, SoundRings, AcousticDots } from "@/components/shared/SoundDividers";

// All images use ES6 imports for Vite optimization pipeline
import classroomBaffles from "@/assets/gallery/classroom-baffles.jpeg";
import heroEstudioAzul from "@/assets/gallery/hero-estudio-azul.png";
import heroMdf from "@/assets/gallery/hero-mdf-vazado.jpg";
import heroDifusores from "@/assets/gallery/hero-difusores-madeira.jpg";
import heroNuvens from "@/assets/gallery/hero-nuvens-acusticas.jpg";
import heroForro from "@/assets/gallery/hero-forro-industrial.jpg";
import heroBafflesColor from "@/assets/gallery/hero-baffles-coloridos.jpeg";
import heroBafflesAzuis from "@/assets/gallery/hero-baffles-azuis.jpg";
import heroForroCorp from "@/assets/gallery/hero-forro-corporativo.jpg";
import heroHomeStudio from "@/assets/gallery/hero-home-studio.jpeg";
import heroEstudioDark from "@/assets/gallery/hero-estudio-dark.jpeg";
import imgEstudio from "@/assets/gallery/estudio-paineis.jpeg";
import imgSalaReuniao from "@/assets/gallery/paineis-sala-reuniao.png";
import imgNuvem from "@/assets/gallery/nuvem-acustica.webp";
import imgEscritorio from "@/assets/gallery/escritorio-paineis.png";
import imgAcademiaBaffles from "@/assets/gallery/academia-baffles.jpeg";
import imgEscritorioAzuis from "@/assets/gallery/escritorio-paineis-azuis.jpeg";
import imgSalaTratamento from "@/assets/gallery/sala-tratamento-acustico.jpeg";
import imgPaineisSeminario from "@/assets/gallery/paineis-seminario.jpg";
import imgHexagonais from "@/assets/gallery/hexagonais-teto.png";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const spaces = [
  { label: "Estúdios", path: "/solucoes/estudios", image: heroEstudioAzul },
  { label: "Igrejas", path: "/solucoes/igrejas", image: imgNuvem },
  { label: "Auditórios", path: "/solucoes/auditorios", image: heroMdf },
  { label: "Corporativo", path: "/solucoes/corporativo", image: heroForroCorp },
  { label: "Residencial", path: "/solucoes/residencial", image: heroHomeStudio },
];

const processSteps = [
  {
    icon: Calculator,
    title: "Calculadora Acústica",
    desc: "Insira as dimensões do seu ambiente e receba uma recomendação inteligente de quantidade e tipo de material — com visualização 3D em tempo real.",
    image: imgSalaReuniao,
    cta: "Testar Calculadora",
    path: "/calculadora",
  },
  {
    icon: Ruler,
    title: "Medição & Projeto",
    desc: "Nossa equipe analisa o espaço, identifica os pontos críticos de reflexão e projeta a solução acústica ideal com base em normas técnicas.",
    image: imgEstudio,
    cta: "Solicitar Análise",
    path: "/orcamento",
  },
  {
    icon: Palette,
    title: "Personalização",
    desc: "Mais de 40 cores, acabamentos em tecido, MDF ou madeira natural. Cada projeto é único — combinando performance acústica e design de interiores.",
    image: heroDifusores,
    cta: "Ver Cores",
    path: "/produtos",
  },
  {
    icon: Wrench,
    title: "Instalação Profissional",
    desc: "Instalação realizada por equipe especializada em todo o Brasil, com acabamento impecável e garantia de resultado acústico.",
    image: heroBafflesColor,
    cta: "Fale Conosco",
    path: "/contato",
  },
];

const portfolioGrid = [
  { img: heroEstudioAzul, label: "Estúdio Musical", span: "md:col-span-2 md:row-span-2" },
  { img: heroBafflesAzuis, label: "Baffles Suspensos", span: "" },
  { img: heroMdf, label: "Painéis MDF Vazado", span: "" },
  { img: heroForro, label: "Forro Industrial", span: "md:col-span-2" },
  { img: heroDifusores, label: "Difusores Skyline", span: "" },
  { img: heroNuvens, label: "Nuvens Acústicas", span: "" },
  { img: heroForroCorp, label: "Forro Corporativo", span: "" },
  { img: imgSalaTratamento, label: "Sala de Tratamento", span: "" },
];

const testimonials = [
  { name: "Ricardo Almeida", role: "Engenheiro de Som", text: "Os painéis da Sonar transformaram completamente a acústica do meu estúdio." },
  { name: "Arq. Marina Santos", role: "Arquiteta", text: "A qualidade dos materiais e o suporte técnico são incomparáveis no mercado brasileiro." },
  { name: "Pe. João Silva", role: "Paróquia N.S. Aparecida", text: "A inteligibilidade da palavra na igreja melhorou enormemente após o tratamento." },
];

const stats = [
  { value: "700+", label: "Projetos" },
  { value: "93%", label: "Satisfação" },
  { value: "5", label: "Anos" },
  { value: "40+", label: "Cores" },
];

const HomePage = () => {
  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col overflow-hidden -mt-[11.5rem]">
        <div className="absolute inset-0">
          <img src={classroomBaffles} alt="Tratamento acústico profissional" className="w-full h-full object-cover object-[center_30%]" width={1920} height={1080} fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(205,78%,8%)]/80 via-[hsl(205,78%,8%)]/40 to-transparent" />
        </div>

        <div className="flex-1 flex items-center relative z-10 pt-40">
          <div className="container mx-auto px-8 md:px-16">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-2xl">
              <p className="tracking-[0.3em] uppercase text-sm font-medium text-secondary mb-4">
                Projetado por Especialistas
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extralight leading-[1.08] tracking-[-0.04em] text-white">
                Transformamos<br />Espaços com<br />Acústica
              </h1>
              <p className="mt-6 text-base md:text-lg font-light text-white/70 max-w-md leading-relaxed">
                Do projeto à instalação — soluções acústicas de alto padrão para ambientes que exigem performance e estética.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/orcamento" className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-white border border-accent/50 bg-accent/20 backdrop-blur-md hover:bg-accent/35 hover:border-accent/70 shadow-lg shadow-accent/20 transition-all">
                  Solicitar Orçamento <ArrowRight size={16} />
                </Link>
                <Link to="/projetos" className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-white border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
                  Ver Portfólio
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 bg-white/[0.04] backdrop-blur-xl border-t border-white/[0.08]">
          <div className="container mx-auto px-8 md:px-16 py-5">
            <div className="grid grid-cols-4 gap-6 max-w-xl">
              {stats.map((s) => (
                <div key={s.label} className="text-center px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <p className="text-2xl md:text-3xl font-bold text-white font-display">{s.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-display">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Linear divider ===== */}
      <div className="bg-background py-6 flex items-center justify-center gap-4 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/10 to-primary/5" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/15" />
        <div className="w-px h-6 bg-primary/10" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/15" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/10 to-primary/5" />
      </div>

      {/* ===== Spaces ===== */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="rounded-2xl bg-[hsl(205,78%,8%)]/[0.55] backdrop-blur-2xl border border-white/[0.07] px-6 py-4 mb-10 mx-auto w-fit shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <p className="text-center text-white/50 uppercase tracking-[0.3em] text-sm font-display">
              Soluções para cada ambiente
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {spaces.map((space) => (
              <Link key={space.path} to={space.path} className="group relative overflow-hidden rounded-2xl aspect-[4/3] border border-border/30">
                <img src={space.image} alt={space.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.45] group-hover:brightness-[0.35]" width={400} height={300} loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(205,78%,8%)]/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/[0.06] backdrop-blur-xl border-t border-white/[0.08]">
                  <div className="flex items-end justify-between">
                    <h3 className="text-white text-sm md:text-base font-display font-normal drop-shadow-lg">{space.label}</h3>
                    <ArrowRight size={14} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Linear divider ===== */}
      <div className="bg-background py-6 flex items-center justify-center gap-3 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/8" />
        <div className="flex gap-1.5">
          {[12, 20, 28, 20, 12].map((h, i) => (
            <div key={i} className="w-px bg-primary/10" style={{ height: h }} />
          ))}
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/8" />
      </div>

      {/* ===== Portfolio ===== */}
      <section className="relative overflow-hidden">
        {/* Background strip — extra depth layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-muted/20 to-muted/40" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        <div className="absolute inset-x-[5%] top-0 bottom-0 bg-muted/15 border-x border-primary/[0.04]" />

        <div className="relative py-12">
          {/* Geometric decorations */}
          <div className="absolute top-8 left-8 w-32 h-32 border border-primary/10 rounded-full" />
          <div className="absolute top-12 left-12 w-24 h-24 border border-primary/5 rounded-full" />
          <div className="absolute bottom-16 right-12 w-40 h-40 border border-primary/[0.08] rotate-45" />
          <div className="absolute top-1/2 right-6 w-px h-32 bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
          <div className="absolute bottom-8 left-1/4 w-20 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <svg className="absolute top-20 right-20 opacity-[0.06]" width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M60 10 L110 90 L10 90 Z" stroke="hsl(var(--primary))" strokeWidth="1" />
          </svg>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="text-center mb-14 rounded-2xl bg-[hsl(205,78%,8%)]/[0.55] backdrop-blur-2xl border border-white/[0.07] px-8 py-6 mx-auto w-fit shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <span className="text-secondary text-xs font-semibold tracking-[0.3em] uppercase">Portfólio</span>
              <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-white">Nossos Projetos</h2>
              <p className="mt-3 max-w-lg mx-auto text-white/50">Ambientes reais transformados com soluções acústicas Sonar.</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
              {portfolioGrid.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative group overflow-hidden rounded-2xl cursor-pointer bg-[hsl(205,78%,8%)]/[0.5] backdrop-blur-xl border border-white/[0.07] p-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ${item.span}`}
                >
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" width={640} height={480} />
                  <div className="absolute inset-1.5 rounded-xl bg-[hsl(205,78%,8%)]/0 group-hover:bg-[hsl(205,78%,8%)]/40 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block text-white font-semibold text-sm drop-shadow-lg bg-[hsl(205,78%,8%)]/70 backdrop-blur-xl border border-white/[0.1] rounded-lg px-3 py-1.5">{item.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/projetos" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors">
                Ver todos os projetos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Linear divider ===== */}
      <div className="bg-background py-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-4 w-full max-w-xs px-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/10" />
          <svg width="24" height="24" viewBox="0 0 24 24" className="opacity-[0.08]">
            <rect x="4" y="4" width="16" height="16" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" />
            <rect x="8" y="8" width="8" height="8" stroke="hsl(var(--primary))" strokeWidth="0.5" fill="none" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/10" />
        </div>
      </div>

      {/* ===== Process ===== */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16 rounded-2xl bg-[hsl(205,78%,8%)]/[0.55] backdrop-blur-2xl border border-white/[0.07] px-8 py-6 mx-auto w-fit shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <span className="text-secondary text-sm font-semibold tracking-[0.3em] uppercase">Processo</span>
            <h2 className="text-3xl md:text-5xl font-display font-normal mt-3 text-white">Como Funciona</h2>
            <p className="mt-3 max-w-lg mx-auto text-white/50">Da medição à instalação — um processo completo e transparente.</p>
          </motion.div>

          <div className="space-y-14">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                {...fadeUp}
                transition={{ delay: 0.1 }}
                className="rounded-3xl bg-[hsl(205,78%,8%)]/[0.65] backdrop-blur-2xl border border-white/[0.07] p-4 md:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_8px_40px_-12px_rgba(0,0,0,0.4)]"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center`}>
                  <div className={`overflow-hidden rounded-2xl aspect-[16/10] ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" decoding="async" width={800} height={500} />
                  </div>
                  <div className={`p-4 md:p-6 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/[0.1] flex items-center justify-center">
                        <step.icon className="text-secondary" size={22} />
                      </div>
                      <span className="text-sm font-semibold tracking-[0.2em] uppercase text-white/40 font-display">Etapa {i + 1}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-normal text-white">{step.title}</h3>
                    <p className="mt-4 leading-relaxed text-white/60 text-lg">{step.desc}</p>
                    <Link to={step.path} className="inline-flex items-center gap-2 mt-7 text-secondary font-semibold text-sm hover:gap-3 transition-all font-display">
                      {step.cta} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Linear divider ===== */}
      <div className="bg-background py-6 flex items-center justify-center gap-4 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/8 to-primary/5" />
        <div className="w-2 h-2 border border-primary/15 rotate-45" />
        <div className="w-8 h-px bg-primary/12" />
        <div className="w-2 h-2 border border-primary/15 rotate-45" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/8 to-primary/5" />
      </div>

      {/* ===== Gallery strip ===== */}
      <section className="relative">
        {/* Background strip */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/15 to-muted/30" />
        <div className="absolute inset-x-[8%] top-0 bottom-0 bg-muted/10 border-x border-primary/[0.03]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/8 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/8 to-transparent" />

        <div className="relative py-10">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl bg-[hsl(205,78%,8%)]/[0.6] backdrop-blur-2xl border border-white/[0.07] p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_8px_40px_-12px_rgba(0,0,0,0.4)]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[heroEstudioDark, imgEscritorioAzuis, imgAcademiaBaffles, imgEscritorio].map((img, i) => (
                  <div key={i} className="relative group overflow-hidden aspect-[4/3] rounded-2xl">
                    <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" width={400} height={300} />
                    <div className="absolute inset-0 bg-[hsl(205,78%,8%)]/0 group-hover:bg-[hsl(205,78%,8%)]/20 transition-colors duration-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="rounded-3xl bg-[hsl(205,78%,8%)]/[0.6] backdrop-blur-2xl border border-white/[0.07] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                <div className="rounded-2xl overflow-hidden aspect-[16/10]">
                  <img src={imgPaineisSeminario} alt="Painéis acústicos em seminário" className="w-full h-full object-cover" loading="lazy" decoding="async" width={800} height={500} />
                </div>
              </div>
              <div className="rounded-3xl bg-[hsl(205,78%,8%)]/[0.6] backdrop-blur-xl border border-white/[0.07] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] mt-6 md:mt-12">
                <div className="rounded-2xl overflow-hidden aspect-[16/10]">
                  <img src={imgHexagonais} alt="Painéis hexagonais no teto" className="w-full h-full object-cover" loading="lazy" decoding="async" width={800} height={500} />
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-[hsl(205,78%,8%)]/[0.6] backdrop-blur-2xl border border-white/[0.07] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <div className="rounded-2xl overflow-hidden aspect-[21/9]">
                <img src={heroNuvens} alt="Nuvens acústicas em ambiente corporativo" className="w-full h-full object-cover" loading="lazy" decoding="async" width={1200} height={514} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Linear divider ===== */}
      <div className="bg-background py-8 flex items-center justify-center gap-3 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/8" />
        <div className="flex items-end gap-[2px]">
          {[6, 10, 16, 22, 16, 10, 6].map((h, i) => (
            <div key={i} className="w-[1.5px] rounded-full bg-primary/10" style={{ height: h }} />
          ))}
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/8" />
      </div>

      {/* ===== Why us ===== */}
      <section className="relative overflow-hidden">
        {/* Background strip — extra dark layer */}
        <div className="absolute inset-0 bg-[hsl(205,78%,8%)]" />
        <div className="absolute inset-x-[3%] top-0 bottom-0 bg-[hsl(205,78%,6%)]/40 border-x border-white/[0.03]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="relative py-14 px-6 text-white">
          {/* Geometric decorations */}
          <div className="absolute top-10 right-10 w-48 h-48 border border-white/[0.04] rounded-full" />
          <div className="absolute top-14 right-14 w-36 h-36 border border-white/[0.03] rounded-full" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/[0.05] rotate-12" />
          <div className="absolute top-1/3 left-0 w-24 h-px bg-gradient-to-r from-secondary/20 to-transparent" />
          <div className="absolute bottom-1/3 right-0 w-32 h-px bg-gradient-to-l from-secondary/15 to-transparent" />
          <svg className="absolute bottom-12 right-1/4 opacity-[0.04]" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="10" width="60" height="60" stroke="white" strokeWidth="1" rx="4" />
            <rect x="20" y="20" width="40" height="40" stroke="white" strokeWidth="0.5" rx="2" />
          </svg>
          <svg className="absolute top-16 left-1/3 opacity-[0.05]" width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="0.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="0.3" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="white" strokeWidth="0.3" />
          </svg>

          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <motion.div {...fadeUp} className="rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_32px_-8px_rgba(0,0,0,0.3)]">
                <span className="text-secondary text-xs font-semibold tracking-[0.3em] uppercase">Diferenciais</span>
                <h2 className="text-3xl md:text-4xl font-display font-normal mt-3">Por Que Escolher a Sonar?</h2>
                <p className="text-white/50 mt-5 leading-relaxed text-lg">
                  Mais de uma década combinando engenharia acústica de ponta com design contemporâneo.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Materiais certificados com classe de fogo A2",
                    "Mais de 40 opções de cores e acabamentos",
                    "Projetos personalizados com consultoria técnica",
                    "Fabricação própria com controle de qualidade",
                    "Entrega e instalação em todo o Brasil",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/80 rounded-lg px-3 py-2 bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                      <CheckCircle size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/contato" className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors text-sm">
                  Fale com um Especialista <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div {...fadeUp} className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[hsl(205,78%,8%)]/[0.5] backdrop-blur-xl border border-white/[0.07] p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <div className="rounded-xl overflow-hidden aspect-[3/4]">
                    <img src={heroBafflesColor} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" width={400} height={533} />
                  </div>
                </div>
                <div className="rounded-2xl bg-[hsl(205,78%,8%)]/[0.5] backdrop-blur-xl border border-white/[0.07] p-2 mt-12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <div className="rounded-xl overflow-hidden aspect-[3/4]">
                    <img src={heroDifusores} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" width={400} height={533} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Linear divider ===== */}
      <div className="bg-background py-6 flex items-center justify-center gap-4 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/8" />
        <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-[0.1]">
          <circle cx="10" cy="10" r="7" stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" />
          <circle cx="10" cy="10" r="3" stroke="hsl(var(--primary))" strokeWidth="0.4" fill="none" />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/8" />
      </div>

      {/* ===== Testimonials ===== */}
      <section className="relative overflow-hidden">
        {/* Background strip */}
        <div className="absolute inset-0 bg-muted/25" />
        <div className="absolute inset-x-[6%] top-0 bottom-0 bg-muted/15 border-x border-primary/[0.04]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

        <div className="relative py-12 px-6">
          {/* Geometric decorations */}
          <div className="absolute top-6 right-16 w-20 h-20 border border-primary/[0.08] rounded-full" />
          <div className="absolute bottom-10 left-12 w-16 h-16 border border-primary/[0.06] rotate-45" />
          <div className="absolute top-1/2 left-0 w-16 h-px bg-gradient-to-r from-primary/15 to-transparent" />
          <div className="absolute top-8 left-1/3 w-px h-16 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
          <svg className="absolute bottom-6 right-1/3 opacity-[0.05]" width="60" height="60" viewBox="0 0 60 60" fill="none">
            <polygon points="30,5 55,50 5,50" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" />
          </svg>

          <div className="container mx-auto relative z-10">
            <motion.div {...fadeUp} className="text-center mb-14 rounded-2xl bg-[hsl(205,78%,8%)]/[0.55] backdrop-blur-2xl border border-white/[0.07] px-8 py-6 mx-auto w-fit shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <span className="text-secondary text-xs font-semibold tracking-[0.3em] uppercase">Depoimentos</span>
              <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-white">O Que Nossos Clientes Dizem</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.1 }} className="rounded-2xl p-8 bg-[hsl(205,78%,8%)]/[0.55] backdrop-blur-2xl border border-white/[0.07] hover:border-white/[0.12] transition-all hover:shadow-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_24px_-8px_rgba(0,0,0,0.3)]">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className="fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="leading-relaxed italic text-white/60">"{t.text}"</p>
                  <div className="mt-6 pt-5 border-t border-white/[0.06]">
                    <p className="font-semibold text-white font-display">{t.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Linear divider ===== */}
      <div className="bg-background py-6 flex items-center justify-center gap-4 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/10 to-primary/5" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/15" />
        <div className="w-6 h-px bg-primary/12" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/15" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/10 to-primary/5" />
      </div>

      {/* ===== CTA ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroMdf} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" width={1920} height={823} />
          <div className="absolute inset-0 bg-[hsl(205,78%,8%)]/85" />
        </div>
        {/* Geometric decorations */}
        <div className="absolute top-8 left-8 w-28 h-28 border border-white/[0.06] rounded-full z-10" />
        <div className="absolute bottom-8 right-8 w-20 h-20 border border-white/[0.05] rotate-45 z-10" />
        <div className="absolute top-1/2 right-12 w-px h-24 bg-gradient-to-b from-transparent via-secondary/20 to-transparent z-10" />
        <div className="absolute top-1/2 left-12 w-px h-24 bg-gradient-to-b from-transparent via-secondary/15 to-transparent z-10" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div {...fadeUp} className="rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-8 py-14 mx-auto max-w-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_32px_-8px_rgba(0,0,0,0.3)]">
            <h2 className="text-3xl md:text-5xl font-display font-normal text-white">Pronto para transformar seu espaço?</h2>
            <p className="text-white/50 mt-5 max-w-lg mx-auto text-lg">Solicite um orçamento gratuito e receba uma proposta personalizada.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link to="/orcamento" className="inline-flex items-center gap-2 px-9 py-4 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors shadow-xl shadow-secondary/30 text-lg">
                Solicitar Orçamento <ArrowRight size={18} />
              </Link>
              <Link to="/contato" className="inline-flex items-center gap-2 px-9 py-4 border border-white/[0.15] text-white font-semibold rounded-full bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.12] transition-colors text-lg">
                Falar com Especialista
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
