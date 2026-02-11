import { useState } from "react";
import { Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";

const useTypes = [
  { value: "estudio", label: "Estúdio de Gravação", rtTarget: 0.4, absPercent: 0.6 },
  { value: "igreja", label: "Igreja / Templo", rtTarget: 1.2, absPercent: 0.35 },
  { value: "reuniao", label: "Sala de Reunião", rtTarget: 0.6, absPercent: 0.45 },
  { value: "auditorio", label: "Auditório", rtTarget: 0.8, absPercent: 0.4 },
  { value: "home-theater", label: "Home Theater", rtTarget: 0.5, absPercent: 0.5 },
  { value: "escritorio", label: "Escritório Open Office", rtTarget: 0.7, absPercent: 0.4 },
];

export default function CalculadoraPage() {
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [use, setUse] = useState("");
  const [result, setResult] = useState<null | {
    volume: number;
    totalSurface: number;
    absorptionArea: number;
    rtTarget: number;
    products: string[];
  }>(null);

  const calculate = () => {
    const w = parseFloat(width);
    const l = parseFloat(length);
    const h = parseFloat(height);
    const useType = useTypes.find((u) => u.value === use);
    if (!w || !l || !h || !useType) return;

    const volume = w * l * h;
    const totalSurface = 2 * (w * l + w * h + l * h);
    const absorptionArea = Math.round(totalSurface * useType.absPercent);

    const products: string[] = [];
    if (useType.value === "estudio" || useType.value === "home-theater") {
      products.push("Painel Absorvedor Premium — paredes laterais e teto");
      products.push("Bass Trap Corner — cantos verticais");
      products.push("Difusor Skyline — parede traseira");
    } else if (useType.value === "igreja" || useType.value === "auditorio") {
      products.push("Forro Acústico Modular — teto");
      products.push("Painel Absorvedor Premium — paredes laterais");
      products.push("Revestimento Ripado — áreas de destaque");
    } else {
      products.push("Forro Acústico Modular — teto");
      products.push("Painel Tecido Slim — paredes");
      products.push("Revestimento Ripado — áreas de destaque");
    }

    setResult({ volume, totalSurface, absorptionArea, rtTarget: useType.rtTarget, products });
  };

  const InputField = ({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit: string }) => (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">{label}</label>
      <div className="flex">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-secondary border border-border rounded-l-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary"
          placeholder="0"
          min="0"
          step="0.1"
        />
        <span className="bg-muted border border-l-0 border-border rounded-r-md px-3 py-2 text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto max-w-2xl">
          <SectionHeading
            tag="Ferramenta"
            title="Calculadora Acústica"
            description="Calcule a área de absorção recomendada e os produtos ideais para o seu ambiente."
          />

          <div className="glass-card p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField label="Largura" value={width} onChange={setWidth} unit="m" />
              <InputField label="Comprimento" value={length} onChange={setLength} unit="m" />
              <InputField label="Pé-direito" value={height} onChange={setHeight} unit="m" />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Uso do ambiente</label>
              <select
                value={use}
                onChange={(e) => setUse(e.target.value)}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Selecione o uso</option>
                {useTypes.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={calculate}
              disabled={!width || !length || !height || !use}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <Calculator size={18} /> Calcular
            </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6 md:p-8 mt-6"
              >
                <h3 className="font-display text-xl font-bold mb-4">Resultado</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{result.volume.toFixed(1)}m³</p>
                    <p className="text-xs text-muted-foreground mt-1">Volume</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{result.totalSurface.toFixed(1)}m²</p>
                    <p className="text-xs text-muted-foreground mt-1">Superfície Total</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{result.absorptionArea}m²</p>
                    <p className="text-xs text-muted-foreground mt-1">Área de Absorção Recomendada</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{result.rtTarget}s</p>
                    <p className="text-xs text-muted-foreground mt-1">RT60 Alvo</p>
                  </div>
                </div>

                <h4 className="font-display font-semibold mb-3">Produtos Recomendados</h4>
                <ul className="space-y-2">
                  {result.products.map((p) => (
                    <li key={p} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-muted-foreground mt-6">
                  * Valores estimados. Para um projeto detalhado, solicite uma análise acústica profissional.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
