import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Palette, Layers, Ruler, Weight, Lightbulb, ArrowRight } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const features = [
  { icon: Palette, title: "40+ cores", desc: "Paleta completa de tecidos acústicos para combinar com qualquer projeto de interiores" },
  { icon: Layers, title: "Tecidos & acabamentos", desc: "Tecido padrão, suede acústico, MDF vazado e moldura em madeira natural" },
  { icon: Ruler, title: "Sob medida", desc: "Dimensões personalizadas de 300×300 mm até 2000×800 mm — qualquer formato" },
  { icon: Weight, title: "Densidades", desc: "De 32 kg/m³ (absorção geral) até 144 kg/m³ (graves e isolamento)" },
  { icon: Lightbulb, title: "LED opcional", desc: "Iluminação RGB ou fosca integrada para painéis decorativos e hexagonais" },
];

export default function HomePersonalizacao() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(205,78%,8%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="text-[hsl(25,80%,50%)] text-xs font-semibold tracking-[0.3em] uppercase">
            Personalização Total
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-white">
            Configuração sob medida
          </h2>
          <p className="mt-3 text-white/50 max-w-xl mx-auto">
            Cada projeto é único — performance acústica e estética em perfeita harmonia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-7 hover:border-white/[0.15] transition-all ${
                i >= 3 ? "sm:col-span-1 lg:col-span-1" : ""
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-[hsl(25,80%,50%)]/10 flex items-center justify-center mb-5">
                <f.icon size={22} className="text-[hsl(25,80%,50%)]" />
              </div>
              <h3 className="text-lg font-display font-medium text-white">{f.title}</h3>
              <p className="text-sm text-white/50 mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl rounded-full hover:bg-white/[0.12] transition-all"
          >
            Explorar opções <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
