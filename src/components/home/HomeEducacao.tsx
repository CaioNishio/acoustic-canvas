import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, AlertTriangle, MapPin, Ear, Layers } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const articles = [
  {
    icon: Ear,
    title: "Tratamento vs. Isolamento",
    desc: "Entenda a diferença entre absorver o som dentro do ambiente e bloquear o ruído externo — e quando usar cada abordagem.",
  },
  {
    icon: MapPin,
    title: "Onde posicionar os painéis",
    desc: "Pontos de primeira reflexão, cantos, teto e parede traseira — cada posição resolve um problema diferente.",
  },
  {
    icon: AlertTriangle,
    title: "Erros comuns",
    desc: "Usar apenas espuma, tratar só uma parede ou ignorar os graves são os erros mais frequentes em projetos acústicos.",
  },
  {
    icon: Layers,
    title: "Como melhorar a acústica",
    desc: "Passo a passo para diagnóstico, escolha de materiais, posicionamento e verificação de resultado com medições.",
  },
];

export default function HomeEducacao() {
  return (
    <section className="relative py-16 md:py-24 bg-[hsl(210,20%,96%)] overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="text-[hsl(25,80%,50%)] text-xs font-semibold tracking-[0.3em] uppercase">
            Base de Conhecimento
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-foreground">
            Entenda o seu ambiente
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Conteúdo técnico para tomar a melhor decisão acústica
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {articles.map((a, i) => (
            <motion.div
              key={a.title}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border-2 border-border/40 bg-background p-7 hover:border-[hsl(25,80%,50%)]/30 transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[hsl(25,80%,50%)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <a.icon size={20} className="text-[hsl(25,80%,50%)]" />
                </div>
                <div>
                  <h3 className="text-base font-display font-medium text-foreground group-hover:text-[hsl(25,80%,50%)] transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
