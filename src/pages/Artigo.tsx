import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Lightbulb, Info } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { educationalArticles, type ArticleSection } from "@/data/educationalArticles";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

function SectionRenderer({ section, accentColor }: { section: ArticleSection; accentColor: string }) {
  switch (section.type) {
    case "text":
      return (
        <motion.div {...fadeUp} className="mb-12">
          {section.title && (
            <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-5">
              {section.title}
            </h2>
          )}
          <p className="text-muted-foreground leading-[1.85] text-base md:text-lg">
            {section.content}
          </p>
        </motion.div>
      );

    case "infographic":
      return (
        <motion.div {...fadeUp} className="mb-14">
          {section.title && (
            <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-8">
              {section.title}
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {section.metrics?.map((m, i) => (
              <motion.div
                key={m.label}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border-2 border-border/50 bg-background p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-display font-bold"
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  >
                    {m.value}
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-foreground text-base">{m.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case "comparison":
      return (
        <motion.div {...fadeUp} className="mb-14">
          {section.title && (
            <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-8">
              {section.title}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.left && (
              <div className="rounded-2xl border-2 border-[hsl(160,50%,45%)]/30 bg-[hsl(160,50%,45%)]/[0.04] p-7">
                <h3 className="font-display font-medium text-lg text-foreground mb-5 flex items-center gap-2">
                  <CheckCircle size={20} className="text-[hsl(160,50%,45%)]" />
                  {section.left.title}
                </h3>
                <ul className="space-y-3">
                  {section.left.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "hsl(160,50%,45%)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {section.right && (
              <div className="rounded-2xl border-2 border-[hsl(205,70%,50%)]/30 bg-[hsl(205,70%,50%)]/[0.04] p-7">
                <h3 className="font-display font-medium text-lg text-foreground mb-5 flex items-center gap-2">
                  <Info size={20} className="text-[hsl(205,70%,50%)]" />
                  {section.right.title}
                </h3>
                <ul className="space-y-3">
                  {section.right.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "hsl(205,70%,50%)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      );

    case "tips":
      return (
        <motion.div {...fadeUp} className="mb-12">
          {section.title && (
            <h2 className="text-xl md:text-2xl font-display font-medium text-foreground mb-6">
              {section.title}
            </h2>
          )}
          <div className="space-y-3">
            {section.items?.map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-4 rounded-xl border border-border/40 bg-background p-4 hover:border-border transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case "highlight":
      return (
        <motion.div {...fadeUp} className="mb-12">
          <div
            className="rounded-2xl p-8 border-2"
            style={{
              borderColor: `${accentColor}30`,
              backgroundColor: `${accentColor}08`,
            }}
          >
            <div className="flex items-start gap-4">
              <Lightbulb size={24} style={{ color: accentColor }} className="flex-shrink-0 mt-1" />
              <div>
                {section.title && (
                  <h3 className="text-lg font-display font-medium text-foreground mb-3">
                    {section.title}
                  </h3>
                )}
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            </div>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
}

export default function ArtigoPage() {
  const { slug } = useParams();
  const article = educationalArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <p className="text-muted-foreground">Artigo não encontrado.</p>
          <Link to="/" className="text-primary mt-4 inline-block">Voltar</Link>
        </div>
      </Layout>
    );
  }

  const Icon = article.icon;
  const otherArticles = educationalArticles.filter((a) => a.slug !== slug);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-[hsl(210,20%,96%)]">
        <div className="absolute inset-0 opacity-[0.03]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${60 + i * 30}px`,
                height: `${60 + i * 30}px`,
                border: `1px solid ${article.heroColor}`,
                left: `${10 + (i % 5) * 20}%`,
                top: `${10 + Math.floor(i / 5) * 25}%`,
                opacity: 0.3 - i * 0.01,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Voltar para Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${article.heroColor}15` }}
            >
              <Icon size={30} className="text-current" style={{ color: article.heroColor }} />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-medium text-foreground leading-tight max-w-3xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {article.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {article.sections.map((section, i) => (
            <SectionRenderer key={i} section={section} accentColor={article.heroColor} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[hsl(210,20%,96%)]">
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground">
              Quer aplicar esse conhecimento no seu espaço?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Solicite uma análise acústica gratuita e receba recomendações personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/orcamento"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Solicitar Análise Gratuita <ArrowRight size={16} />
              </Link>
              <Link
                to="/calculadora"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-colors"
              >
                Testar Calculadora
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other articles */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <h2 className="text-xl font-display font-medium text-foreground mb-8 text-center">
            Continue aprendendo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {otherArticles.map((a) => {
              const AIcon = a.icon;
              return (
                <Link
                  key={a.slug}
                  to={`/aprender/${a.slug}`}
                  className="rounded-2xl border-2 border-border/40 bg-background p-6 hover:border-border hover:shadow-md transition-all group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${a.heroColor}15` }}
                  >
                    <AIcon size={20} className="text-current" style={{ color: a.heroColor }} />
                  </div>
                  <h3 className="font-display font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{a.subtitle}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
