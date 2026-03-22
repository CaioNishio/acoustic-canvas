import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/data/productPrices";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const bestSellers = [
  {
    name: "Painel SNR High-Mid",
    slug: "painel-acustico-snr3250",
    desc: "Controle de eco e clareza sonora — ideal para estúdios, escritórios e salas de reunião",
    use: "Reverberação · Clareza da fala",
    price: 92.45,
    specs: ["NRC 0,85", "32–144 kg/m³", "25–100 mm"],
  },
  {
    name: "Bass Trap Corner 3S",
    slug: "bass-trap-corner-3s-snr6430",
    desc: "Controle de frequências graves e ressonância modal em cantos e encontros de parede",
    use: "Graves · Modos de sala",
    price: 194.45,
    specs: ["Absorção < 200 Hz", "Densidade 64 kg/m³", "Triangular"],
  },
  {
    name: "Difusor QRD",
    slug: "difusor-qrd",
    desc: "Distribuição sonora equilibrada sem remover energia — padrão de estúdios profissionais",
    use: "Difusão · Campo sonoro",
    price: 339.45,
    specs: ["500–4000 Hz", "Madeira maciça", "Cálculo QRD"],
  },
  {
    name: "Cortina Acústica Pro",
    slug: "cortina-acustica-snr96c",
    desc: "Redução de ruído externo com barreira flexível — até 18 dB de atenuação",
    use: "Isolamento · Ruído externo",
    price: 774.45,
    specs: ["STC 18–25", "96 kg/m³", "Sob medida"],
  },
];

export default function HomeBestSellers() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(205,78%,8%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="text-[hsl(25,80%,50%)] text-xs font-semibold tracking-[0.3em] uppercase">
            Mais Utilizados
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-white">
            Soluções mais utilizadas
          </h2>
          <p className="mt-3 text-white/50 max-w-xl mx-auto">
            Produtos com melhor custo-benefício e maior impacto acústico
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestSellers.map((p, i) => (
            <motion.div key={p.slug} {...fadeUp} transition={{ delay: i * 0.08 }}>
              <Link
                to={`/produtos/${p.slug}`}
                className="group block h-full rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-6 hover:border-white/[0.15] transition-all duration-300 hover:shadow-xl"
              >
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-3">
                  {p.use}
                </p>
                <h3 className="text-lg font-display font-medium text-white group-hover:text-[hsl(25,80%,55%)] transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-white/50 mt-3 leading-relaxed line-clamp-3">
                  {p.desc}
                </p>

                {/* Specs chips */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {p.specs.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] text-white/50 bg-white/[0.03]">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-white/30 uppercase">a partir de</span>
                    <p className="text-xl font-bold text-[hsl(25,80%,55%)]">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl rounded-full hover:bg-white/[0.12] transition-all"
          >
            Ver catálogo completo <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
