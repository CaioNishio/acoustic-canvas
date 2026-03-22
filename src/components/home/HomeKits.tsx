import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package, Zap, Award, Crown } from "lucide-react";
import { formatPrice } from "@/data/productPrices";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const kits = [
  {
    icon: Package,
    name: "Kit Classic",
    slug: "kit-estudio-classic",
    price: 1549.45,
    items: "6 painéis High-Mid + 2 bass traps",
    ideal: "Home studios e podcasts",
    level: "Tratamento inicial",
    accent: "hsl(205,60%,50%)",
  },
  {
    icon: Zap,
    name: "Kit Premium",
    slug: "kit-estudio-premium",
    price: 2849.45,
    items: "10 painéis + 4 bass traps + 2 difusores",
    ideal: "Estúdios semi-profissionais",
    level: "Resultado avançado",
    accent: "hsl(25,80%,50%)",
    featured: true,
  },
  {
    icon: Crown,
    name: "Kit Pro",
    slug: "kit-estudio-pro",
    price: 5099.45,
    items: "15 painéis + 6 bass traps + 4 difusores",
    ideal: "Estúdios profissionais e auditórios",
    level: "Performance máxima",
    accent: "hsl(45,80%,50%)",
  },
];

export default function HomeKits() {
  return (
    <section className="relative py-16 md:py-24 bg-[hsl(210,20%,96%)] overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="text-[hsl(25,80%,50%)] text-xs font-semibold tracking-[0.3em] uppercase">
            Soluções Completas
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-normal mt-3 text-foreground">
            Kits prontos para cada nível
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Selecionados por engenheiros acústicos para o melhor resultado no seu ambiente
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {kits.map((kit, i) => (
            <motion.div key={kit.slug} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Link
                to={`/produtos/${kit.slug}`}
                className={`group block h-full rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                  kit.featured
                    ? "border-[hsl(25,80%,50%)]/40 bg-background shadow-lg shadow-[hsl(25,80%,50%)]/[0.06]"
                    : "border-border/40 bg-background hover:border-[hsl(25,80%,50%)]/30"
                }`}
              >
                {kit.featured && (
                  <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-white bg-[hsl(25,80%,50%)] px-3 py-1 rounded-full mb-4">
                    Mais vendido
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${kit.accent}15` }}
                  >
                    <kit.icon size={20} style={{ color: kit.accent }} />
                  </div>
                  <h3 className="text-xl font-display font-medium text-foreground">{kit.name}</h3>
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                  {kit.level}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{kit.items}</p>
                <p className="text-xs text-muted-foreground/70 mt-3 italic">Ideal para: {kit.ideal}</p>

                <div className="mt-6 pt-4 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase">a partir de</span>
                  <p className="text-2xl font-bold text-foreground">{formatPrice(kit.price)}</p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[hsl(25,80%,50%)] group-hover:gap-3 transition-all">
                  Ver kit completo <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
