import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, ShieldCheck, Layers } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const options = [
  {
    icon: Volume2,
    title: "O som fica ecoando",
    subtitle: "Reverberação excessiva",
    desc: "Controle o tempo de reverberação e melhore a clareza sonora com painéis absorvedores e difusores estratégicos.",
    solution: "Tratamento Acústico",
    path: "/produtos",
    color: "hsl(25,80%,50%)",
  },
  {
    icon: ShieldCheck,
    title: "O barulho vem de fora",
    subtitle: "Ruído externo indesejado",
    desc: "Reduza a transmissão sonora com barreiras acústicas, portas especiais e materiais de alta densidade.",
    solution: "Isolamento Acústico",
    path: "/produtos",
    color: "hsl(205,70%,50%)",
  },
  {
    icon: Layers,
    title: "Tenho os dois problemas",
    subtitle: "Reverberação + ruído externo",
    desc: "Combinamos absorção, difusão e isolamento para entregar o melhor resultado acústico possível.",
    solution: "Solução Combinada",
    path: "/orcamento",
    color: "hsl(160,50%,45%)",
  },
];

export default function HomeDiscernment() {
  return (
    <section className="relative py-16 md:py-24 bg-[hsl(210,20%,96%)] overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="text-[hsl(25,80%,50%)] text-xs font-semibold tracking-[0.3em] uppercase">
            Diagnóstico Rápido
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-foreground">
            Qual é o comportamento sonoro do seu ambiente?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Identifique o problema principal para receber a recomendação técnica correta
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={opt.path}
                className="group block h-full rounded-2xl border-2 border-border/40 bg-background p-8 hover:border-[hsl(25,80%,50%)]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(25,80%,50%)]/[0.06]"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${opt.color}15` }}
                >
                  <opt.icon size={26} style={{ color: opt.color }} />
                </div>
                <h3 className="text-xl font-display font-medium text-foreground">
                  {opt.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  {opt.subtitle}
                </p>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  {opt.desc}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: opt.color }}>
                  {opt.solution}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
