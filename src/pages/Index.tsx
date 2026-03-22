import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, Ruler, Wrench, Palette, Star, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SoundWaveBackground from "@/components/shared/SoundWaveBackground";

// New GIK-style section components
import HomeDiscernment from "@/components/home/HomeDiscernment";
import HomeBestSellers from "@/components/home/HomeBestSellers";
import HomeKits from "@/components/home/HomeKits";
import HomeConsultoria from "@/components/home/HomeConsultoria";
import HomeProvaTecnica from "@/components/home/HomeProvaTecnica";
import HomePersonalizacao from "@/components/home/HomePersonalizacao";
import HomeEducacao from "@/components/home/HomeEducacao";
import HomeMicroBenefits from "@/components/home/HomeMicroBenefits";

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

// New uploaded images
import imgPaineisLaranja from "@/assets/gallery/paineis-laranja-preto.jpg";
import imgTetoColorido from "@/assets/gallery/paineis-teto-coloridos.jpg";
import imgEstudioProfissional from "@/assets/gallery/estudio-profissional-vermelho.png";
import imgRaftsSuspensos from "@/assets/gallery/rafts-suspensos-industrial.jpg";
import imgEscritorioColorido from "@/assets/gallery/escritorio-paineis-coloridos-grande.png";
import imgRestauranteModerno from "@/assets/gallery/restaurante-forro-moderno.jpg";

// Professional reference images
import imgEscritorioNeutros from "@/assets/gallery/escritorio-paineis-neutros.jpg";
import imgAuditorioPaineis from "@/assets/gallery/auditorio-paineis-acusticos.jpeg";
import imgInstalacaoAmarelo from "@/assets/gallery/instalacao-painel-amarelo.jpeg";
import imgMontagemFixadores from "@/assets/gallery/montagem-fixadores-detalhe.jpeg";
import imgProdutorEstudio from "@/assets/gallery/produtor-musical-estudio.png";
import imgEngenheiroMedicao from "@/assets/gallery/engenheiro-medicao-industrial.png";
import imgSonometro from "@/assets/gallery/medicao-sonometro.webp";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const spaces = [
  { label: "Mixagem e Gravação", path: "/solucoes/estudios", image: imgEstudioProfissional, desc: "Clareza sonora e controle de graves" },
  { label: "Templos e Igrejas", path: "/solucoes/igrejas", image: imgNuvem, desc: "Inteligibilidade e controle de reverberação" },
  { label: "Escritórios", path: "/solucoes/corporativo", image: imgEscritorioColorido, desc: "Redução de ruído e mais conforto" },
  { label: "Auditórios", path: "/solucoes/auditorios", image: heroMdf, desc: "Acústica otimizada para grandes públicos" },
  { label: "Residencial", path: "/solucoes/residencial", image: imgTetoColorido, desc: "Menos eco e mais bem-estar" },
  { label: "Clínicas", path: "/solucoes/corporativo", image: imgEscritorioNeutros, desc: "Ambiente silencioso e confortável" },
  { label: "Podcast / Conteúdo", path: "/solucoes/estudios", image: imgProdutorEstudio, desc: "Qualidade sonora profissional" },
  { label: "Indústria / Galpão", path: "/solucoes/corporativo", image: imgRaftsSuspensos, desc: "Controle de ruído em grandes áreas" },
];

const processSteps = [
  {
    icon: Calculator,
    title: "Calculadora Acústica",
    desc: "Insira as dimensões do seu ambiente e receba uma recomendação inteligente de quantidade e tipo de material — com visualização 3D em tempo real.",
    image: imgSonometro,
    cta: "Testar Calculadora",
    path: "/calculadora"
  },
  {
    icon: Ruler,
    title: "Medição & Projeto",
    desc: "Nossa equipe analisa o espaço, identifica os pontos críticos de reflexão e projeta a solução acústica ideal com base em normas técnicas.",
    image: imgEngenheiroMedicao,
    cta: "Solicitar Análise",
    path: "/orcamento"
  },
  {
    icon: Palette,
    title: "Personalização",
    desc: "Mais de 40 cores, acabamentos em tecido, MDF ou madeira natural. Cada projeto é único — combinando performance acústica e design de interiores.",
    image: imgEscritorioNeutros,
    cta: "Ver Cores",
    path: "/produtos"
  },
  {
    icon: Wrench,
    title: "Instalação Profissional",
    desc: "Instalação realizada por equipe especializada em todo o Brasil, com acabamento impecável e garantia de resultado acústico.",
    image: imgInstalacaoAmarelo,
    cta: "Fale Conosco",
    path: "/contato"
  },
];

const portfolioGrid = [
  { img: imgEscritorioColorido, label: "Escritório Corporativo", span: "md:col-span-2 md:row-span-2" },
  { img: imgAuditorioPaineis, label: "Auditório — Painéis Acústicos", span: "" },
  { img: imgProdutorEstudio, label: "Estúdio de Produção Musical", span: "" },
  { img: imgMontagemFixadores, label: "Sistema de Fixação Profissional", span: "md:col-span-2" },
  { img: heroDifusores, label: "Difusores Skyline", span: "" },
  { img: imgTetoColorido, label: "Nuvens Coloridas", span: "" },
  { img: imgRestauranteModerno, label: "Forro Restaurante", span: "" },
  { img: imgEstudioProfissional, label: "Estúdio Profissional", span: "" },
];

const testimonials = [
  { name: "Ricardo Almeida", role: "Engenheiro de Som", text: "Os painéis da Sonar transformaram completamente a acústica do meu estúdio." },
  { name: "Arq. Marina Santos", role: "Arquiteta", text: "A qualidade dos materiais e o suporte técnico são incomparáveis no mercado brasileiro." },
  { name: "Pe. João Silva", role: "Paróquia N.S. Aparecida", text: "A inteligibilidade da palavra na igreja melhorou enormemente após o tratamento." },
];

const stats = [
  { value: "700+", label: "Projetos" },
  { value: "Frete", label: " TODO O BRASIL " },
  { value: "5", label: "Anos" },
  { value: "40+", label: "Cores" },
];

const HomePage = () => {
  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col overflow-hidden -mt-[11.5rem]">
        <div className="absolute inset-0">
          <img src={imgEscritorioColorido} alt="Tratamento acústico profissional" className="w-full h-full object-cover object-[center_50%]" width={1920} height={1080} fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(205,78%,8%)]/75 via-[hsl(205,78%,8%)]/35 to-transparent" />
        </div>

        <div className="flex-1 relative z-10 pt-40 flex items-center justify-start">
          <div className="container mx-auto px-8 md:px-16">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-2xl">
              <p className="tracking-[0.3em] uppercase text-sm text-secondary mb-4 font-normal border-primary-foreground">
                PROJETADO POR ESPECIALISTAS E APROVADO POR PROFISSIONAIS
              </p>
              <h1 className="text-4xl md:text-6xl font-display leading-[1.08] tracking-[-0.04em] text-white shadow-none font-medium lg:text-6xl">
                Controle acústico com desempenho técnico real
              </h1>
              <p className="mt-6 text-base md:text-lg max-w-md leading-relaxed text-left mx-0 my-0 px-0 text-muted font-normal">
                Soluções para reverberação, ruído e isolamento com engenharia aplicada e resultado mensurável.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/orcamento" className="inline-flex items-center gap-3 text-white backdrop-blur-md shadow-accent/20 transition-all text-lg shadow-none border-solid my-[5px] border-card border-2 rounded-2xl bg-neutral-500/[0.36] px-[88px] py-[14px] font-bold font-sans">
                  Quero melhorar meu ambiente
                </Link>
                <Link to="/produtos" className="inline-flex items-center gap-3 text-white backdrop-blur-md transition-all text-lg rounded-xl opacity-100 border-solid py-[14px] my-0 text-center font-bold border-primary-foreground border-2 shadow-none px-[88px] font-sans bg-neutral-500/0">
                  Catálogo de Produtos
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 bg-white/[0.04] backdrop-blur-xl border-t border-white/[0.08]">
          <div className="container mx-auto px-8 md:px-16 py-3">
            <div className="grid grid-cols-4 gap-6 max-w-xl">
              {stats.map((s) =>
                <div key={s.label} className="px-3 py-2 border border-white/[0.08] bg-white/[0.04] backdrop-blur-md rounded-lg">
                  <p className="text-base text-white font-display font-light text-center">{s.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5 font-display text-center">{s.label}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Transition: Hero → Discernment ===== */}
      <div className="relative bg-gradient-to-b from-[hsl(205,78%,8%)] to-[hsl(210,20%,96%)] py-6">
        <div className="px-8 gap-0 flex items-end justify-center border-2 opacity-85 border-[#042a76]">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[hsl(25,80%,55%)]/30" />
          <div className="flex items-end gap-[2px]">
            {[4, 8, 14, 20, 14, 8, 4].map((h, i) =>
              <motion.div key={i} className="w-[1.5px] rounded-full bg-[hsl(25,80%,50%)]/60 font-semibold border-secondary-foreground" style={{ height: h }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.4 }} />
            )}
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[hsl(25,80%,55%)]/30" />
        </div>
      </div>

      {/* ===== BLOCO 2 — DISCERNIMENTO ===== */}
      <HomeDiscernment />

      {/* ===== BLOCO — MICRO BENEFITS BAR ===== */}
      <HomeMicroBenefits />

      {/* ===== BLOCO 3 — SOLUÇÕES POR AMBIENTE (expanded) ===== */}
      <section className="relative py-12 overflow-hidden border-solid border-2 border-primary-foreground bg-neutral-500/[0.12]">
        <SoundWaveBackground variant="a" />

        <div className="container relative z-10 border-solid border-0 px-0 mx-0 my-0 opacity-100 mb-[53px] rounded-sm bg-neutral-500/0">
          <motion.div {...fadeUp} className="rounded-2xl backdrop-blur-2xl border border-white/[0.06] px-6 py-4 mb-10 mx-auto w-fit shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] bg-[#0e375d]/[0.91]">
            <p className="text-center text-white/60 uppercase tracking-[0.3em] shadow-none font-mono text-lg font-light border-[sidebar-primary-foreground] border-card-foreground">
              APLICAÇÕES REAIS POR AMBIENTE
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spaces.map((space) =>
              <Link key={space.path + space.label} to={space.path} className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-[hsl(205,78%,6%)]/60 backdrop-blur-2xl border border-white/[0.06] p-1 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] hover:border-white/[0.12] transition-all hover:shadow-lg">
                <img src={space.image} alt={space.label} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110 brightness-[0.5] group-hover:brightness-[0.4]" width={400} height={300} loading="lazy" decoding="async" />
                <div className="absolute inset-1 bg-gradient-to-t from-[hsl(205,78%,8%)]/70 via-transparent to-transparent opacity-90 rounded-md border-4 border-solid" />
                <div className="absolute bottom-1 left-1 right-1 p-3 bg-white/[0.06] backdrop-blur-xl border-t border-white/[0.08] rounded-b-xl">
                  <div className="flex flex-col">
                    <h3 className="text-white text-sm md:text-base font-display font-normal drop-shadow-lg">{space.label}</h3>
                    <p className="text-white/40 text-[10px] md:text-xs mt-0.5 line-clamp-1">{space.desc}</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ===== BLOCO 4 — PRODUTOS PRINCIPAIS (best sellers + preço) ===== */}
      <HomeBestSellers />

      {/* ===== BLOCO 5 — KITS PRONTOS ===== */}
      <HomeKits />

      {/* ===== Transition ===== */}
      <div className="relative py-4 bg-[hsl(210,20%,96%)] overflow-hidden">
        <div className="flex items-center justify-center px-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[hsl(25,70%,55%)]/25" />
          <div className="mx-4 flex items-center gap-2">
            {[0.15, 0.25, 0.35, 0.25, 0.15].map((op, i) =>
              <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: `hsl(25 80% 50% / ${op})` }} />
            )}
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[hsl(25,70%,55%)]/25" />
        </div>
      </div>

      {/* ===== BLOCO 6 — SIMULADOR / Process ===== */}
      <section className="relative bg-[hsl(210,20%,96%)] overflow-hidden border-destructive px-0 py-0">
        <SoundWaveBackground variant="c" />

        <div className="container mx-auto px-6 relative z-10 border-sidebar-ring">
          <motion.div {...fadeUp} className="text-center mb-16 backdrop-blur-2xl mx-auto w-fit shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] border-2 border-solid rounded-none px-[118px] py-0 border-primary bg-muted-foreground">
            <span className="text-secondary text-sm font-semibold tracking-[0.3em] uppercase">Processo</span>
            <h2 className="text-3xl font-display font-normal mt-3 text-white md:text-2xl">Calculando... Projetando...Formalizando</h2>
          </motion.div>

          <div className="space-y-8">
            {processSteps.map((step, i) => <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="rounded-3xl backdrop-blur-2xl p-4 md:p-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] transition-all border-neutral-500 border-2 bg-[#0e375d]">

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
                    <h3 className="text-2xl font-display font-normal text-white md:text-2xl">{step.title}</h3>
                    <p className="mt-4 leading-relaxed text-white/60 text-lg">{step.desc}</p>
                    <Link to={step.path} className="inline-flex items-center gap-2 mt-7 text-secondary font-semibold text-sm hover:gap-3 transition-all font-display">
                      {step.cta} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ===== BLOCO 7 — CONSULTORIA ===== */}
      <HomeConsultoria />

      {/* ===== BLOCO 8 — PORTFOLIO / APLICAÇÕES REAIS ===== */}
      <section className="relative overflow-hidden bg-[hsl(210,20%,96%)]">
        <SoundWaveBackground variant="b" flip />

        <div className="relative py-14 border-[#0e4fc8] bg-[#07182c]">
          <div className="container mx-auto relative z-10 border-[sidebar-primary-foreground] bg-[sidebar-accent-foreground] py-[40px] px-6 md:px-[146px] bg-[#0e375d]/[0.51] border-[#e6e6e6]">
            <motion.div {...fadeUp} className="backdrop-blur-2xl w-fit shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] rounded-md border-muted border-2 mb-[30px] mr-auto px-8 md:px-[106px] text-center py-[28px] my-0 font-thin font-mono text-xs bg-[#03111c]/[0.76] mx-0">
              <span className="text-secondary text-xs font-semibold tracking-[0.3em] uppercase">Portfólio</span>
              <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-white my-0">Aplicações Reais</h2>
              <p className="mt-3 max-w-lg text-white/50 mx-0 py-0 my-0">Ambientes reais tratados com nossos produtos — design sob medida</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
              {portfolioGrid.map((item, i) => <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer bg-[hsl(205,78%,6%)]/60 backdrop-blur-2xl border border-white/[0.06] p-1.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] hover:border-white/[0.12] transition-all hover:shadow-lg ${item.span}`}>

                  <img src={item.img} alt={item.label} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110 border-neutral-500/0" loading="lazy" decoding="async" width={640} height={480} />
                  <div className="absolute inset-1.5 rounded-xl transition-colors duration-500 border-secondary bg-[#041825]/0" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block text-white font-semibold text-sm drop-shadow-lg bg-[hsl(205,78%,8%)]/70 backdrop-blur-xl border border-white/[0.1] rounded-lg px-3 py-1.5">{item.label}</span>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="text-center mt-12">
              <Link to="/projetos" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white bg-[hsl(205,78%,6%)]/70 border border-white/[0.06] backdrop-blur-2xl rounded-full hover:bg-[hsl(205,78%,6%)]/80 hover:border-white/[0.10] transition-all shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)]">
                Ver todos os projetos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOCO 9 — PROVA TÉCNICA ===== */}
      <HomeProvaTecnica />

      {/* ===== BLOCO 10 — PERSONALIZAÇÃO ===== */}
      <HomePersonalizacao />

      {/* ===== BLOCO 11 — EDUCAÇÃO ===== */}
      <HomeEducacao />

      {/* ===== Transition: → Why Us ===== */}
      <div className="relative h-8 bg-gradient-to-b from-[hsl(210,20%,96%)] to-[hsl(205,78%,8%)]" />

      {/* ===== BLOCO 12 — DIFERENCIAIS (Why Us) ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[hsl(205,78%,8%)]" />
        <div className="absolute inset-x-[3%] top-0 bottom-0 bg-[hsl(205,78%,6%)]/40 border-x border-white/[0.03]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="relative py-14 px-6 text-white">
          <div className="absolute top-10 right-10 w-48 h-48 border border-white/[0.04] rounded-full" />
          <div className="absolute top-14 right-14 w-36 h-36 border border-white/[0.03] rounded-full" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/[0.05] rotate-12" />

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
                    "Estrutura reforçada com materiais de alta performance",
                    "Lã de rocha RockFibras — densidade controlada",
                    "Acabamento técnico com tecidos acústicos certificados",
                    "Mais de 40 opções de cores e acabamentos",
                    "Instalação simplificada com resultado previsível",
                    "Fabricação própria com controle de qualidade",
                    "Entrega e instalação em todo o Brasil",
                  ].map((item) =>
                    <li key={item} className="flex items-start gap-3 text-sm text-white/80 rounded-lg px-3 py-2 bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                      <CheckCircle size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  )}
                </ul>
                <Link to="/contato" className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors text-sm">
                  Fale com um Especialista <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div {...fadeUp} className="hidden lg:grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[hsl(205,78%,8%)]/[0.5] backdrop-blur-xl border border-white/[0.07] p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <div className="rounded-xl overflow-hidden aspect-[3/4]">
                    <img src={imgInstalacaoAmarelo} alt="Instalação de painel acústico" className="w-full h-full object-cover" loading="lazy" decoding="async" width={400} height={533} />
                  </div>
                </div>
                <div className="rounded-2xl bg-[hsl(205,78%,8%)]/[0.5] backdrop-blur-xl border border-white/[0.07] p-2 mt-12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <div className="rounded-xl overflow-hidden aspect-[3/4]">
                    <img src={imgSonometro} alt="Medição acústica com sonômetro" className="w-full h-full object-cover" loading="lazy" decoding="async" width={400} height={533} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Transition: Why Us → Testimonials ===== */}
      <div className="relative h-8 bg-gradient-to-b from-[hsl(205,78%,8%)] to-[hsl(210,20%,96%)]" />

      {/* ===== Testimonials ===== */}
      <section className="relative overflow-hidden bg-[hsl(210,20%,96%)]">
        <SoundWaveBackground variant="a" flip />

        <div className="relative py-14 px-6">
          <div className="container mx-auto relative z-10">
            <motion.div {...fadeUp} className="text-center mb-14 rounded-2xl bg-[hsl(205,78%,6%)]/70 backdrop-blur-2xl border border-white/[0.06] px-8 py-6 mx-auto w-fit shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)]">
              <span className="text-secondary text-xs font-semibold tracking-[0.3em] uppercase">Depoimentos</span>
              <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-white">O Que Nossos Clientes Dizem</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {testimonials.map((t, i) =>
                <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.1 }} className="rounded-2xl p-8 backdrop-blur-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all hover:shadow-lg shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] bg-[#db7624]">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) =>
                      <Star key={j} size={14} className="fill-yellow-400 text-yellow-400 bg-transparent" />
                    )}
                  </div>
                  <p className="leading-relaxed italic text-muted">"{t.text}"</p>
                  <div className="mt-6 pt-5 border-t border-white/[0.06]">
                    <p className="font-semibold text-white font-display">{t.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{t.role}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Transition: Testimonials → CTA ===== */}
      <div className="relative h-6 bg-gradient-to-b from-[hsl(210,20%,96%)] to-transparent" />

      {/* ===== CTA ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroMdf} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" width={1920} height={823} />
          <div className="absolute inset-0 bg-[hsl(205,78%,8%)]/85" />
        </div>
        <div className="absolute top-8 left-8 w-28 h-28 border border-white/[0.06] rounded-full z-10" />
        <div className="absolute bottom-8 right-8 w-20 h-20 border border-white/[0.05] rotate-45 z-10" />
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
