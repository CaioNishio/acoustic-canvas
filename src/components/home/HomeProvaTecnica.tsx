import { motion } from "framer-motion";
import { BarChart3, Thermometer, FlameKindling, ShieldCheck, Microscope } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const proofs = [
  {
    icon: BarChart3,
    title: "Absorção comprovada",
    desc: "Coeficientes de absorção medidos em laboratório conforme ISO 354. NRC até 0,95 em configurações otimizadas.",
    stat: "NRC 0,85–0,95",
  },
  {
    icon: Microscope,
    title: "Densidades controladas",
    desc: "Lã de rocha RockFibras em 32, 64, 96 e 144 kg/m³ — cada densidade projetada para uma faixa de frequência específica.",
    stat: "32–144 kg/m³",
  },
  {
    icon: FlameKindling,
    title: "Classe anti-chamas A2",
    desc: "Material incombustível certificado conforme ABNT NBR 9442. Segurança absoluta para ambientes comerciais e públicos.",
    stat: "Classe A2",
  },
  {
    icon: Thermometer,
    title: "Isolamento térmico",
    desc: "Coeficiente de condutividade térmica ≤ 0,040 W/m·K. Os painéis também contribuem para o conforto térmico do ambiente.",
    stat: "≤ 0,040 W/m·K",
  },
  {
    icon: ShieldCheck,
    title: "Normas técnicas",
    desc: "Produtos desenvolvidos conforme ABNT, ISO 354, ASTM C423 e normas europeias EN 13501-1 de reação ao fogo.",
    stat: "ISO · ABNT · ASTM",
  },
];

export default function HomeProvaTecnica() {
  return (
    <section className="relative py-16 md:py-24 bg-[hsl(210,20%,96%)] overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="text-[hsl(25,80%,50%)] text-xs font-semibold tracking-[0.3em] uppercase">
            Desempenho Validado
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-foreground">
            Dados técnicos reais
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Performance comprovada em laboratório — não estimativas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {proofs.map((p, i) => (
            <motion.div
              key={p.title}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border-2 border-border/40 bg-background p-7 hover:border-[hsl(25,80%,50%)]/30 transition-all ${
                i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-[hsl(25,80%,50%)]/10 flex items-center justify-center">
                  <p.icon size={22} className="text-[hsl(25,80%,50%)]" />
                </div>
                <span className="text-xs font-mono font-bold text-foreground/60 bg-muted px-2.5 py-1 rounded-full">
                  {p.stat}
                </span>
              </div>
              <h3 className="text-lg font-display font-medium text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
