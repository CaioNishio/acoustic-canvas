import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Calculator, BookOpen } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { educationalArticles } from "@/data/educationalArticles";
import {
  KNOWLEDGE_TRACKS,
  SOLUTION_GUIDES,
  GLOSSARY,
  KNOWLEDGE_FAQ,
  KNOWLEDGE_REFERENCES,
  REFERENCES_ROADMAP,
} from "@/data/knowledge";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const articleBySlug = new Map(educationalArticles.map((a) => [a.slug, a]));

function SectionTitle({ tag, title, description }: { tag: string; title: string; description?: string }) {
  return (
    <motion.div {...fadeUp} className="mb-10 max-w-2xl">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{tag}</span>
      <h2 className="font-display text-3xl md:text-4xl font-medium mt-3">{title}</h2>
      {description && <p className="text-muted-foreground mt-3 leading-relaxed">{description}</p>}
    </motion.div>
  );
}

export default function ConhecimentoPage() {
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_0%,rgba(48,180,195,.23),transparent_34%),linear-gradient(125deg,#06263c,#0a4560_58%,#0c6a74)] px-4 pb-14 pt-28 text-white md:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.1),transparent_36%,rgba(255,255,255,.03))]" />
        <div className="container relative mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <BookOpen size={14} /> Conhecimento
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-medium mt-4 leading-tight">
              Entenda sua sala antes de tratá-la
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/78">
              Acústica não é sobre cobrir paredes com espuma. É sobre entender o que o som faz
              no seu ambiente e escolher a resposta certa para cada faixa de frequência.
              Aqui explicamos o raciocínio inteiro — inclusive quando a resposta é não comprar nada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Trilhas ── */}
      <section className="section-padding bg-[radial-gradient(circle_at_8%_15%,rgba(64,182,197,.16),transparent_25%),linear-gradient(135deg,#edf7f9,#fbfdfe_58%,#e7f2f5)]">
        <div className="container mx-auto">
          <SectionTitle
            tag="Trilhas"
            title="Do fenômeno à solução"
            description="A ordem não é temática — é a ordem em que um projetista raciocina."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {KNOWLEDGE_TRACKS.map((track, i) => {
              const Icon = track.icon;
              return (
                <motion.div key={track.id} {...fadeUp} transition={{ delay: i * 0.08 }} className="glass-card p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="text-primary" size={20} />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{track.level}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold">{track.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">{track.goal}</p>
                  <ul className="mt-5 space-y-2 border-t border-border pt-4">
                    {track.articles.map((slug) => {
                      const article = articleBySlug.get(slug);
                      if (!article) return null;
                      return (
                        <li key={slug}>
                          <Link
                            to={`/aprender/${slug}`}
                            className="group flex items-start gap-2 text-sm text-foreground hover:text-primary transition-colors"
                          >
                            <ArrowRight size={14} className="mt-1 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            <span>{article.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Guia de decisão ── */}
      <section className="section-padding bg-[linear-gradient(180deg,#f7fbfc,#eef6f8)] pt-0">
        <div className="container mx-auto">
          <SectionTitle
            tag="Guia de decisão"
            title="Painel, bass trap ou difusor?"
            description="Cada família resolve um fenômeno diferente. Usar a errada não é meia solução — costuma ser nenhuma."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {SOLUTION_GUIDES.map((guide, i) => {
              const Icon = guide.icon;
              return (
                <motion.div key={guide.id} {...fadeUp} transition={{ delay: i * 0.08 }} className="glass-card p-6 flex flex-col">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="text-primary" size={20} />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{guide.title}</h3>

                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{guide.principle}</p>

                  <div className="mt-4 rounded-md bg-secondary px-3 py-2">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">Faixa de atuação</span>
                    <span className="text-sm text-foreground">{guide.range}</span>
                  </div>

                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-5 mb-2">Use quando</p>
                  <ul className="space-y-1.5 flex-1">
                    {guide.whenToUse.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary mt-0.5">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 border-l-2 border-destructive/50 pl-3">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">Não use quando</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guide.whenNotToUse}</p>
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-2">
                      Produtos correspondentes
                    </span>
                    <ul className="space-y-1.5">
                      {guide.products.map((p) => (
                        <li key={p.slug}>
                          <Link
                            to={`/produtos/${p.slug}`}
                            className="group flex items-start gap-2 text-sm text-foreground hover:text-primary transition-colors"
                          >
                            <ArrowRight size={14} className="mt-1 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            <span>{p.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Calculadora ── */}
      <section className="section-padding bg-[#eef6f8] pt-0">
        <div className="container mx-auto">
          <motion.div {...fadeUp} className="flex flex-col gap-6 rounded-[28px] border border-cyan-200/20 bg-[linear-gradient(115deg,#06283f,#0a5265_64%,#08707a)] p-8 text-white shadow-[0_24px_56px_-30px_rgba(6,35,59,.8)] md:flex-row md:items-center md:p-10">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cyan-100/30 bg-white/10">
              <Calculator className="text-cyan-200" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-2xl font-semibold">Aplique na sua sala</h3>
              <p className="mt-2 leading-relaxed text-white/76">
                A calculadora usa Sabine e Eyring por banda de oitava, parte do RT60 alvo e
                desconta o que a sala nua já absorve. O resultado é uma estimativa declarada —
                com as suposições visíveis, não escondidas.
              </p>
            </div>
            <Link
              to="/calculadora"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#07384e] transition-colors hover:bg-cyan-50"
            >
              Abrir calculadora <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Glossário ── */}
      <section className="section-padding bg-[radial-gradient(circle_at_90%_12%,rgba(48,180,195,.14),transparent_25%),#f6fafb] pt-0">
        <div className="container mx-auto">
          <SectionTitle tag="Glossário" title="Os termos que importam" />
          <div className="grid gap-3 md:grid-cols-2">
            {GLOSSARY.map((g, i) => (
              <motion.div key={g.term} {...fadeUp} transition={{ delay: Math.min(i, 6) * 0.04 }}>
                <button
                  onClick={() => setOpenTerm(openTerm === g.term ? null : g.term)}
                  aria-expanded={openTerm === g.term}
                  className="glass-card w-full text-left p-5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold">{g.term}</h3>
                      <p className="text-sm text-muted-foreground">{g.short}</p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-muted-foreground transition-transform ${openTerm === g.term ? "rotate-180" : ""}`}
                    />
                  </div>
                  {openTerm === g.term && (
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed border-t border-border pt-3">
                      {g.detail}
                    </p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding bg-[#f6fafb] pt-0">
        <div className="container mx-auto max-w-3xl">
          <SectionTitle tag="Dúvidas frequentes" title="As perguntas que mais recebemos" />
          <div className="space-y-3">
            {KNOWLEDGE_FAQ.map((item, i) => (
              <motion.div key={item.q} {...fadeUp} transition={{ delay: Math.min(i, 6) * 0.04 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="glass-card w-full text-left p-5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-foreground">{item.q}</h3>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </div>
                  {openFaq === i && (
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed border-t border-border pt-3">
                      {item.a}
                    </p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Procedência ── */}
      <section className="section-padding bg-[linear-gradient(145deg,#edf7f9,#f9fcfd_58%,#e8f2f5)] pt-0">
        <div className="container mx-auto">
          <SectionTitle
            tag="Procedência"
            title="De onde vem cada número"
            description="Nenhum coeficiente desta plataforma existe sem fonte declarada. Quando o valor é derivado e não medido, dizemos isso."
          />
          <div className="glass-card divide-y divide-border">
            {KNOWLEDGE_REFERENCES.map((ref) => (
              <div key={ref.id} className="p-5 flex flex-col sm:flex-row sm:items-start gap-3">
                <span className="text-[11px] uppercase tracking-wider text-primary shrink-0 sm:w-24 pt-0.5">
                  {ref.kind}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{ref.title}</h3>
                  <p className="text-sm text-muted-foreground">{ref.author}</p>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{ref.usedFor}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-6 glass-card p-5">
            <h3 className="font-medium text-foreground">Em incorporação</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              Fontes já mapeadas, pendentes de análise antes de entrarem na base:
            </p>
            <ul className="space-y-1.5">
              {REFERENCES_ROADMAP.map((item) => (
                <li key={item} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary mt-0.5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
