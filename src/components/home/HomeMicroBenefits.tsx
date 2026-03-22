import { motion } from "framer-motion";
import { Volume1, Mic, Wrench, Palette, BarChart3, Truck } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const benefits = [
  { icon: Volume1, text: "Reduz eco e reverberação" },
  { icon: Mic, text: "Melhora clareza da fala" },
  { icon: Wrench, text: "Instalação simplificada" },
  { icon: Palette, text: "Personalização completa" },
  { icon: BarChart3, text: "Resultado técnico comprovado" },
  { icon: Truck, text: "Entrega em todo o Brasil" },
];

export default function HomeMicroBenefits() {
  return (
    <section className="relative py-10 bg-[hsl(210,20%,96%)] border-y border-border/30">
      <div className="container mx-auto px-6">
        <motion.div
          {...fadeUp}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {benefits.map((b) => (
            <div key={b.text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <b.icon size={16} className="text-[hsl(25,80%,50%)] flex-shrink-0" />
              <span className="font-medium">{b.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
