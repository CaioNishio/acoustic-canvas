import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, Ruler, Wrench, Palette, Star, Users, CheckCircle, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { WaveDivider, FrequencyBars, SoundWaveLine, SoundRings, AcousticDots, WaveSectionBorder } from "@/components/shared/SoundDividers";
// Hero & showcase images
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
import classroomBaffles from "@/assets/gallery/classroom-baffles.jpeg";

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
{ label: "Residencial", path: "/solucoes/residencial", image: heroHomeStudio }];


const processSteps = [
{
  icon: Calculator,
  title: "Calculadora Acústica",
  desc: "Insira as dimensões do seu ambiente e receba uma recomendação inteligente de quantidade e tipo de material — com visualização 3D em tempo real.",
  image: imgSalaReuniao,
  cta: "Testar Calculadora",
  path: "/calculadora"
},
{
  icon: Ruler,
  title: "Medição & Projeto",
  desc: "Nossa equipe analisa o espaço, identifica os pontos críticos de reflexão e projeta a solução acústica ideal com base em normas técnicas.",
  image: imgEstudio,
  cta: "Solicitar Análise",
  path: "/orcamento"
},
{
  icon: Palette,
  title: "Personalização",
  desc: "Mais de 40 cores, acabamentos em tecido, MDF ou madeira natural. Cada projeto é único — combinando performance acústica e design de interiores.",
  image: heroDifusores,
  cta: "Ver Cores",
  path: "/produtos"
},
{
  icon: Wrench,
  title: "Instalação Profissional",
  desc: "Instalação realizada por equipe especializada em todo o Brasil, com acabamento impecável e garantia de resultado acústico.",
  image: heroBafflesColor,
  cta: "Fale Conosco",
  path: "/contato"
}];


const portfolioGrid = [
{ img: heroEstudioAzul, label: "Estúdio Musical", span: "md:col-span-2 md:row-span-2" },
{ img: heroBafflesAzuis, label: "Baffles Suspensos", span: "" },
{ img: heroMdf, label: "Painéis MDF Vazado", span: "" },
{ img: heroForro, label: "Forro Industrial", span: "md:col-span-2" },
{ img: heroDifusores, label: "Difusores Skyline", span: "" },
{ img: heroNuvens, label: "Nuvens Acústicas", span: "" },
{ img: heroForroCorp, label: "Forro Corporativo", span: "" },
{ img: imgSalaTratamento, label: "Sala de Tratamento", span: "" }];


const testimonials = [
{ name: "Ricardo Almeida", role: "Engenheiro de Som", text: "Os painéis da Sonar transformaram completamente a acústica do meu estúdio." },
{ name: "Arq. Marina Santos", role: "Arquiteta", text: "A qualidade dos materiais e o suporte técnico são incomparáveis no mercado brasileiro." },
{ name: "Pe. João Silva", role: "Paróquia N.S. Aparecida", text: "A inteligibilidade da palavra na igreja melhorou enormemente após o tratamento." }];


const stats = [
{ value: "500+", label: "Projetos" },
{ value: "98%", label: "Satisfação" },
{ value: "12", label: "Anos" },
{ value: "40+", label: "Cores" }];


const HomePage = () => {
  return (
    <Layout>
      {/* ===== HERO — Full-width cinematic ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={classroomBaffles} alt="Tratamento acústico profissional" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(205,78%,10%)]/90 via-[hsl(205,78%,10%)]/50 to-transparent text-muted rounded-3xl opacity-40" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-2xl">
            <p className="text-secondary font-bold tracking-[0.4em] uppercase mb-6 text-xl">
              Projetado por Especialistas. Aprovado por Profissionais.
            </p>
            <h1 className="text-4xl md:text-6xl leading-[1.05] text-white font-normal lg:text-6xl">
              Transformamos<br />Espaços com<br />Acústica
            </h1>
            <p className="text-white/50 mt-7 text-lg max-w-md leading-relaxed">
              Do projeto à instalação — soluções acústicas de alto padrão para ambientes que exigem performance e estética.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/orcamento" className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-secondary/90 transition-all text-sm shadow-lg shadow-secondary/30">
                Solicitar Orçamento <ArrowRight size={16} />
              </Link>
              <Link to="/projetos" className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/25 text-white font-semibold rounded-full hover:bg-white/10 transition-all text-sm backdrop-blur-sm">
                Ver Portfólio
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Stats overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[hsl(205,78%,10%)]/80 to-transparent pt-16 pb-8">
          <div className="container mx-auto px-6">
            <div className="flex justify-start gap-12 md:gap-16">
              {stats.map((s) =>
              <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/40 mt-0.5 uppercase tracking-wider">{s.label}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider: Hero → Spaces */}
      <WaveDivider color="hsl(var(--primary))" />

      {/* ===== Spaces — horizontal navigation ===== */}
      <section className="py-16 opacity-95 rounded-2xl shadow-inner border-8 border-muted-foreground bg-transparent">
        <div className="container mx-auto px-6">
          <motion.p {...fadeUp} className="text-center text-muted-foreground uppercase tracking-[0.3em] mb-8 text-lg font-bold">
            Soluções para cada ambiente
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {spaces.map((space) =>
            <Link key={space.path} to={space.path} className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
                <img src={space.image} alt={space.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.45] group-hover:brightness-[0.35]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(205,78%,10%)]/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="text-white font-bold text-sm md:text-base drop-shadow-lg">{space.label}</h3>
                  <ArrowRight size={14} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Sound wave line: Spaces → Portfolio */}
      <SoundWaveLine />

      {/* ===== Portfolio mosaic ===== */}
      <section className="py-20 bg-muted-foreground">
        <div className="container mx-auto px-6 border-8 border-muted-foreground bg-muted-foreground">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-secondary text-xs font-bold tracking-[0.3em] uppercase">Portfólio</span>
            <h2 className="text-3xl md:text-5xl mt-3 text-center bg-transparent font-medium text-muted">Nossos Projetos</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Ambientes reais transformados com soluções acústicas Sonar.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
            {portfolioGrid.map((item, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer ${item.span}`}>

                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-[hsl(205,78%,10%)]/0 group-hover:bg-[hsl(205,78%,10%)]/40 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-white font-bold text-sm drop-shadow-lg">{item.label}</span>
                </div>
              </motion.div>
            )}
          </div>
          <div className="text-center mt-12">
            <Link to="/projetos" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm">
              Ver todos os projetos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Frequency bars: Portfolio → Process */}
      <FrequencyBars count={32} className="py-10" />

      {/* ===== Process — Como Funciona ===== */}
      <section className="py-24 bg-primary-foreground">
        <div className="container mx-auto px-6 border-destructive-foreground opacity-80 bg-white">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-secondary font-bold tracking-[0.3em] uppercase text-xl">Processo</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 bg-sidebar">Como Funciona</h2>
            <p className="mt-3 max-w-lg mx-auto bg-[#242424]/0 text-zinc-950">Da medição à instalação — um processo completo e transparente.</p>
          </motion.div>

          <div className="space-y-20 bg-primary mx-0 px-[145px] py-0 my-0">
            {processSteps.map((step, i) =>
            <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>

                {/* Image */}
                <div className={`overflow-hidden rounded-3xl aspect-[16/10] ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                {/* Content */}
                <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="text-primary" size={26} />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase">Etapa {i + 1}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">{step.title}</h3>
                  <p className="mt-4 leading-relaxed text-lg text-black">{step.desc}</p>
                  <Link to={step.path} className="inline-flex items-center gap-2 mt-7 text-secondary font-bold text-sm hover:gap-3 transition-all">
                    {step.cta} <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Wave border: Process → Gallery strip */}
      <WaveDivider flip color="hsl(var(--primary))" />

      {/* ===== Full-width gallery strip ===== */}
      <section className="bg-background py-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {[heroEstudioDark, imgEscritorioAzuis, imgAcademiaBaffles, imgEscritorio].map((img, i) =>
          <div key={i} className="relative group overflow-hidden aspect-[4/3]">
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-[hsl(205,78%,10%)]/0 group-hover:bg-[hsl(205,78%,10%)]/20 transition-colors duration-500" />
            </div>
          )}
        </div>

        {/* Large showcase images */}
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl overflow-hidden aspect-[16/10]">
              <img src={imgPaineisSeminario} alt="Painéis acústicos em seminário" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[16/10]">
              <img src={imgHexagonais} alt="Painéis hexagonais no teto" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="mt-6 rounded-3xl overflow-hidden aspect-[21/9]">
            <img src={heroNuvens} alt="Nuvens acústicas em ambiente corporativo" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Acoustic dots: Gallery → Why us */}
      <AcousticDots />

      {/* ===== Why us — with image ===== */}
      <section className="py-24 px-6 text-white bg-blue-950">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp}>
              <span className="text-secondary text-xs font-bold tracking-[0.3em] uppercase">Diferenciais</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3">Por Que Escolher a Sonar?</h2>
              <p className="text-white/50 mt-5 leading-relaxed text-lg">
                Mais de uma década combinando engenharia acústica de ponta com design contemporâneo.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                "Materiais certificados com classe de fogo A2",
                "Mais de 40 opções de cores e acabamentos",
                "Projetos personalizados com consultoria técnica",
                "Fabricação própria com controle de qualidade",
                "Entrega e instalação em todo o Brasil"].
                map((item) =>
                <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                    <CheckCircle size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                )}
              </ul>
              <Link to="/contato" className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-secondary/90 transition-colors text-sm">
                Fale com um Especialista <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div {...fadeUp} className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={heroBafflesColor} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4] mt-12">
                <img src={heroDifusores} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sound rings: Why us → Testimonials */}
      <SoundRings />

      {/* ===== Testimonials ===== */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-secondary text-xs font-bold tracking-[0.3em] uppercase">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">O Que Nossos Clientes Dizem</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials.map((t, i) =>
            <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.1 }} className="bg-background rounded-2xl p-8 border border-border/60 hover:border-primary/20 transition-all hover:shadow-lg">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) =>
                <Star key={j} size={14} className="text-secondary fill-secondary" />
                )}
                </div>
                <p className="text-muted-foreground leading-relaxed italic">"{t.text}"</p>
                <div className="mt-6 pt-5 border-t border-border/60">
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Wave divider: Testimonials → CTA */}
      <WaveDivider color="hsl(var(--primary))" className="opacity-50" />

      {/* ===== CTA ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroMdf} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[hsl(205,78%,10%)]/85" />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Pronto para transformar seu espaço?</h2>
            <p className="text-white/45 mt-5 max-w-lg mx-auto text-lg">Solicite um orçamento gratuito e receba uma proposta personalizada.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link to="/orcamento" className="inline-flex items-center gap-2 px-9 py-4 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-secondary/90 transition-colors shadow-xl shadow-secondary/30 text-lg">
                Solicitar Orçamento <ArrowRight size={18} />
              </Link>
              <Link to="/contato" className="inline-flex items-center gap-2 px-9 py-4 border-2 border-white/25 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-lg backdrop-blur-sm">
                Falar com Especialista
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>);

};

export default HomePage;