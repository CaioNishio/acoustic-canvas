import { useState, useRef, useEffect } from "react";
import { Calculator, Box, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import { Link } from "react-router-dom";

const useTypes = [
{ value: "estudio", label: "Estúdio de Gravação", rtTarget: 0.4, absPercent: 0.6 },
{ value: "igreja", label: "Igreja / Templo", rtTarget: 1.2, absPercent: 0.35 },
{ value: "reuniao", label: "Sala de Reunião", rtTarget: 0.6, absPercent: 0.45 },
{ value: "auditorio", label: "Auditório", rtTarget: 0.8, absPercent: 0.4 },
{ value: "home-theater", label: "Home Theater", rtTarget: 0.5, absPercent: 0.5 },
{ value: "escritorio", label: "Escritório Open Office", rtTarget: 0.7, absPercent: 0.4 }];


// Simple 3D room renderer using CSS transforms
function Room3D({ width, length, height }: {width: number;length: number;height: number;}) {
  const maxDim = Math.max(width, length, height, 1);
  const scale = 140 / maxDim;
  const w = width * scale;
  const l = length * scale;
  const h = height * scale;

  return (
    <div className="relative w-full aspect-square flex items-center justify-center" style={{ perspective: "600px" }}>
      <div
        className="relative"
        style={{
          width: `${w}px`,
          height: `${h}px`,
          transformStyle: "preserve-3d",
          transform: "rotateX(-20deg) rotateY(-30deg)"
        }}>

        {/* Floor */}
        <div
          className="absolute border-2 border-primary/40 bg-primary/5"
          style={{
            width: `${w}px`,
            height: `${l}px`,
            bottom: 0,
            left: 0,
            transform: `rotateX(90deg) translateZ(0px)`,
            transformOrigin: "bottom"
          }}>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-mono text-primary/60">{width}m × {length}m</span>
          </div>
          {/* Grid lines */}
          {Array.from({ length: Math.floor(width) }).map((_, i) =>
          <div key={`gx-${i}`} className="absolute top-0 bottom-0 border-l border-primary/10" style={{ left: `${(i + 1) / width * 100}%` }} />
          )}
          {Array.from({ length: Math.floor(length) }).map((_, i) =>
          <div key={`gy-${i}`} className="absolute left-0 right-0 border-t border-primary/10" style={{ top: `${(i + 1) / length * 100}%` }} />
          )}
        </div>

        {/* Back wall */}
        <div
          className="absolute border-2 border-primary/30 bg-primary/3"
          style={{
            width: `${w}px`,
            height: `${h}px`,
            top: 0,
            left: 0,
            transform: `translateZ(-${l}px)`
          }}>

          <div className="absolute right-1 bottom-1">
            <span className="text-[9px] font-mono text-primary/50">{height}m</span>
          </div>
        </div>

        {/* Left wall */}
        <div
          className="absolute border-2 border-primary/25 bg-primary/3"
          style={{
            width: `${l}px`,
            height: `${h}px`,
            top: 0,
            left: 0,
            transform: `rotateY(90deg) translateZ(0px)`,
            transformOrigin: "left"
          }} />


        {/* Panels on back wall (visual) */}
        <div
          className="absolute"
          style={{
            width: `${w * 0.3}px`,
            height: `${h * 0.4}px`,
            top: `${h * 0.2}px`,
            left: `${w * 0.1}px`,
            transform: `translateZ(-${l - 1}px)`,
            backgroundColor: "hsl(var(--primary) / 0.25)",
            border: "1px solid hsl(var(--primary) / 0.5)",
            borderRadius: "2px"
          }} />

        <div
          className="absolute"
          style={{
            width: `${w * 0.3}px`,
            height: `${h * 0.4}px`,
            top: `${h * 0.2}px`,
            left: `${w * 0.55}px`,
            transform: `translateZ(-${l - 1}px)`,
            backgroundColor: "hsl(var(--primary) / 0.25)",
            border: "1px solid hsl(var(--primary) / 0.5)",
            borderRadius: "2px"
          }} />

      </div>
    </div>);

}

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
    products: {name: string;placement: string;qty: number;slug: string;}[];
    panelsNeeded: number;
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
    const panelArea = 0.6 * 1.2; // 1200x600mm panel
    const panelsNeeded = Math.ceil(absorptionArea / panelArea);

    const products: {name: string;placement: string;qty: number;slug: string;}[] = [];
    if (useType.value === "estudio" || useType.value === "home-theater") {
      const wallPanels = Math.ceil(panelsNeeded * 0.5);
      const bassTraps = Math.min(4, Math.ceil(w * 0.5));
      const clouds = Math.ceil(panelsNeeded * 0.2);
      products.push({ name: "Painel SNR3250 (High-Mid)", placement: "Paredes laterais e primeira reflexão", qty: wallPanels, slug: "painel-acustico-snr3250" });
      products.push({ name: "Bass Trap Corner 3S", placement: "Cantos verticais", qty: bassTraps, slug: "bass-trap-corner" });
      products.push({ name: "Nuvem Acústica SNR3250", placement: "Teto — acima da posição de escuta", qty: clouds, slug: "nuvem-acustica-snr3250" });
      products.push({ name: "Difusor Skyline", placement: "Parede traseira", qty: Math.ceil(w / 0.6), slug: "difusor-skyline" });
    } else if (useType.value === "igreja" || useType.value === "auditorio") {
      products.push({ name: "Painel SNR3250 (High-Mid)", placement: "Paredes laterais", qty: Math.ceil(panelsNeeded * 0.6), slug: "painel-acustico-snr3250" });
      products.push({ name: "Baffles Acústicos", placement: "Teto", qty: Math.ceil(panelsNeeded * 0.3), slug: "baffles-acusticos" });
      products.push({ name: "Painel SNR6450 (Low-Mid)", placement: "Parede do fundo", qty: Math.ceil(panelsNeeded * 0.1), slug: "painel-acustico-snr6450" });
    } else {
      products.push({ name: "Painel SNR3250 (High-Mid)", placement: "Paredes", qty: Math.ceil(panelsNeeded * 0.6), slug: "painel-acustico-snr3250" });
      products.push({ name: "Nuvem Acústica SNR3250", placement: "Teto", qty: Math.ceil(panelsNeeded * 0.3), slug: "nuvem-acustica-snr3250" });
      products.push({ name: "Painel SNR3225 Slim", placement: "Divisórias", qty: Math.ceil(panelsNeeded * 0.1), slug: "painel-acustico-snr3225-slim" });
    }

    setResult({ volume, totalSurface, absorptionArea, rtTarget: useType.rtTarget, products, panelsNeeded });
  };

  const InputField = ({ label, value, onChange, unit }: {label: string;value: string;onChange: (v: string) => void;unit: string;}) =>
  <div>
      <label className="text-sm text-muted-foreground mb-1 block">{label}</label>
      <div className="flex">
        <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-white border border-border rounded-l-md px-3 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
        placeholder="0"
        min="0"
        step="0.1" />

        <span className="bg-muted border border-l-0 border-border rounded-r-md px-3 py-2.5 text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>;


  const hasRoomDimensions = parseFloat(width) > 0 && parseFloat(length) > 0 && parseFloat(height) > 0;

  return (
    <Layout>
      <section className="section-padding bg-slate-200">
        <div className="container mx-auto">
          <SectionHeading
            tag="Ferramenta"
            title="Calculadora Acústica"
            description="Calcule a área de absorção recomendada e visualize o material ideal para o seu ambiente." />


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Left — Calculator Form */}
            <div className="space-y-6">
              <div className="glass-card p-6 md:p-8 space-y-5">
                <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Calculator size={20} className="text-primary" /> Dimensões do Ambiente
                </h3>
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
                    className="w-full bg-white border border-border rounded-md px-3 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow">

                    <option value="">Selecione o uso</option>
                    {useTypes.map((u) =>
                    <option key={u.value} value={u.value}>{u.label}</option>
                    )}
                  </select>
                </div>

                <button
                  onClick={calculate}
                  disabled={!width || !length || !height || !use}
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">

                  <Calculator size={18} /> Calcular
                </button>
              </div>

              {/* Results */}
              <AnimatePresence>
                {result &&
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card p-6 md:p-8">

                    <h3 className="font-display text-xl font-bold mb-4">Resultado da Análise</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white rounded-lg border border-border p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{result.volume.toFixed(1)}m³</p>
                        <p className="text-xs text-muted-foreground mt-1">Volume</p>
                      </div>
                      <div className="bg-white rounded-lg border border-border p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{result.totalSurface.toFixed(1)}m²</p>
                        <p className="text-xs text-muted-foreground mt-1">Superfície Total</p>
                      </div>
                      <div className="bg-white rounded-lg border border-border p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{result.absorptionArea}m²</p>
                        <p className="text-xs text-muted-foreground mt-1">Área de Absorção</p>
                      </div>
                      <div className="bg-white rounded-lg border border-border p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{result.rtTarget}s</p>
                        <p className="text-xs text-muted-foreground mt-1">RT60 Alvo</p>
                      </div>
                    </div>

                    <h4 className="font-display font-semibold mb-3">Produtos Recomendados</h4>
                    <div className="space-y-2">
                      {result.products.map((p) =>
                    <Link
                      key={p.name}
                      to={`/produtos/${p.slug}`}
                      className="flex items-center justify-between bg-white rounded-lg border border-border p-3 hover:border-primary/40 transition-colors group">

                          <div className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.placement}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{p.qty}×</span>
                            <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </Link>
                    )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Total estimado: <strong className="text-foreground">{result.panelsNeeded} painéis</strong> (1200×600mm)
                      </p>
                      <Link
                      to="/orcamento"
                      className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">

                        Solicitar Orçamento <ArrowRight size={14} />
                      </Link>
                    </div>

                    <p className="text-[10px] text-muted-foreground mt-4">
                      * Valores estimados com base na fórmula de Sabine. Para um projeto detalhado, solicite uma análise acústica profissional.
                    </p>
                  </motion.div>
                }
              </AnimatePresence>
            </div>

            {/* Right — 3D Room Preview */}
            <div className="space-y-6">
              <div className="glass-card p-6 md:p-8">
                <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2 mb-4">
                  <Box size={20} className="text-primary" /> Visualização do Espaço
                </h3>

                {hasRoomDimensions ?
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4">

                    <Room3D
                    width={parseFloat(width) || 1}
                    length={parseFloat(length) || 1}
                    height={parseFloat(height) || 1} />


                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg border border-border p-3 text-center">
                        <p className="text-lg font-bold text-foreground">{width}m</p>
                        <p className="text-[10px] text-muted-foreground">Largura</p>
                      </div>
                      <div className="bg-white rounded-lg border border-border p-3 text-center">
                        <p className="text-lg font-bold text-foreground">{length}m</p>
                        <p className="text-[10px] text-muted-foreground">Comprimento</p>
                      </div>
                      <div className="bg-white rounded-lg border border-border p-3 text-center">
                        <p className="text-lg font-bold text-foreground">{height}m</p>
                        <p className="text-[10px] text-muted-foreground">Pé-direito</p>
                      </div>
                    </div>

                    {/* Material Recommendation */}
                    <div className="bg-white rounded-xl border border-border p-5">
                      <h4 className="font-display font-semibold text-sm text-foreground mb-3">Material de Absorção Recomendado</h4>
                      {(() => {
                      const vol = (parseFloat(width) || 0) * (parseFloat(length) || 0) * (parseFloat(height) || 0);
                      const selectedUse = useTypes.find((u) => u.value === use);
                      if (vol <= 30) {
                        return (
                          <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg">
                                <span className="text-sm font-medium text-foreground">Lã de Rocha D32</span>
                                <span className="text-xs text-primary font-mono font-bold">NRC 0.80</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Ideal para salas pequenas. Absorção eficiente em médias e altas frequências com perfil fino (50mm).</p>
                            </div>);

                      } else if (vol <= 80) {
                        return (
                          <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg">
                                <span className="text-sm font-medium text-foreground">Lã de Rocha D64</span>
                                <span className="text-xs text-primary font-mono font-bold">NRC 0.93</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Recomendado para salas médias. Maior densidade garante absorção em baixas e médias frequências, ideal para {selectedUse?.label || "este uso"}.</p>
                            </div>);

                      } else {
                        return (
                          <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg">
                                <span className="text-sm font-medium text-foreground">Lã de Rocha D96</span>
                                <span className="text-xs text-primary font-mono font-bold">NRC 1.07</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Para espaços grandes (acima de 80m³). Alta densidade para máxima absorção em toda a faixa de frequência, excelente para {selectedUse?.label || "este uso"}.</p>
                            </div>);

                      }
                    })()}
                    </div>
                  </motion.div> :

                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Box size={48} className="text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Insira as dimensões do ambiente para visualizar o espaço em 3D</p>
                  </div>
                }
              </div>

              {/* Material quick reference */}
              <div className="glass-card p-5">
                <h4 className="font-display font-semibold text-sm text-foreground mb-3">Referência Rápida de Materiais</h4>
                <div className="space-y-2">
                  {[
                  { density: "D32 (32 kg/m³)", nrc: "0.80", use: "High-Mid · Salas pequenas", color: "bg-emerald-500" },
                  { density: "D64 (64 kg/m³)", nrc: "0.93", use: "Low-Mid · Salas médias", color: "bg-amber-500" },
                  { density: "D96 (96 kg/m³)", nrc: "1.07", use: "Full Range · Salas grandes", color: "bg-red-500" }].
                  map((m) =>
                  <div key={m.density} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className={`w-3 h-3 ${m.color} rounded-full shrink-0`} />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground">{m.density}</p>
                        <p className="text-[10px] text-muted-foreground">{m.use}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-primary">{m.nrc}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>);

}