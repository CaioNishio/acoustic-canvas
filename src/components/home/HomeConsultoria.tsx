import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Ruler, FileText, ArrowRight, Send } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const steps = [
  { icon: Camera, label: "Envie fotos", desc: "Fotografe os pontos críticos do ambiente" },
  { icon: Ruler, label: "Informe medidas", desc: "Dimensões, altura do pé-direito e uso" },
  { icon: FileText, label: "Receba diagnóstico", desc: "Análise técnica + sugestão de layout" },
  { icon: Send, label: "Orçamento pronto", desc: "Proposta personalizada com produtos e preços" },
];

export default function HomeConsultoria() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(205,78%,8%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp}>
            <span className="text-[hsl(25,80%,50%)] text-xs font-semibold tracking-[0.3em] uppercase">
              Consultoria Gratuita
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-white">
              Análise acústica orientada
            </h2>
            <p className="text-white/50 mt-5 leading-relaxed text-lg max-w-lg">
              Envie as medidas e fotos do seu ambiente para receber uma sugestão técnica com base no seu objetivo — sem custo e sem compromisso.
            </p>
            <div className="mt-8 space-y-4">
              {steps.map((s, i) => (
                <div
                  key={s.label}
                  className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-[hsl(25,80%,50%)]/10 flex items-center justify-center flex-shrink-0">
                    <s.icon size={18} className="text-[hsl(25,80%,50%)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/30 font-mono">{String(i + 1).padStart(2, "0")}</span>
                      <p className="text-sm font-semibold text-white">{s.label}</p>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/orcamento"
              className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-[hsl(25,80%,50%)] text-white font-semibold rounded-full hover:bg-[hsl(25,80%,45%)] transition-colors text-sm shadow-xl shadow-[hsl(25,80%,50%)]/20"
            >
              Solicitar análise gratuita <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="hidden lg:block rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_32px_-8px_rgba(0,0,0,0.3)]"
          >
            <div className="space-y-6 text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[hsl(25,80%,50%)]" />
                <p className="text-sm font-semibold text-white">O que você recebe:</p>
              </div>
              {[
                "Diagnóstico acústico do ambiente",
                "Sugestão de produtos e quantidades",
                "Layout básico de posicionamento",
                "Estimativa de melhoria em dB / RT60",
                "Proposta comercial sem compromisso",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 pl-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
