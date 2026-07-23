import { useState, Suspense, lazy } from "react";
import { ArrowRight, Box, Maximize2, Minimize2, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import { Link } from "react-router-dom";
import CalculatorForm, { useTypes, instrumentOptions, monitorSizes, type EquipmentData } from "@/components/calculadora/CalculatorForm";
import AcousticMetrics from "@/components/calculadora/AcousticMetrics";
import type { LayoutPreset } from "@/components/calculadora/Room3DViewer";
import {
  dimension,
  bareAbsorption,
  treatedAbsorption,
  rt60ByBand,
  type BandValues } from
"@/components/calculadora/acousticsEngine";

const Room3DViewer = lazy(() => import("@/components/calculadora/Room3DViewer"));

const layoutPresets: {value: LayoutPreset;label: string;desc: string;}[] = [
{ value: "simetrico", label: "Simétrico", desc: "Distribuição espelhada nas paredes — visual limpo e equilibrado" },
{ value: "reflexao", label: "Reflexão", desc: "Baseado nos pontos de primeira reflexão — máxima precisão acústica" },
{ value: "hibrido", label: "Híbrido", desc: "Checkerboard decorativo — visual premium com boa performance" }];


export default function CalculadoraPage() {
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [use, setUse] = useState("");
  const [expanded3D, setExpanded3D] = useState(false);
  const [layout, setLayout] = useState<LayoutPreset>("simetrico");
  const [equipment, setEquipment] = useState<EquipmentData>({
    instruments: [],
    monitorSize: "",
    hasSub: false,
    subSize: ""
  });

  const [result, setResult] = useState<null | {
    volume: number;
    totalSurface: number;
    absorptionArea: number;
    rtTarget: number;
    products: {name: string;placement: string;qty: number;slug: string;}[];
    panelsNeeded: number;
    useLabel: string;
    equipmentNotes: string[];
    /** RT60 por banda antes e depois, calculado por Sabine/Eyring */
    rtBefore: BandValues;
    rtAfter: BandValues;
    method: ("sabine" | "eyring")[];
    schroeder: number;
    /** avisos e suposições declaradas ao usuário */
    warnings: string[];
    assumptions: string[];
  }>(null);

  const calculate = () => {
    const w = parseFloat(width);
    const l = parseFloat(length);
    const h = parseFloat(height);
    const useType = useTypes.find((u) => u.value === use);
    if (!w || !l || !h || !useType) return;

    const room = { w, l, h };

    // ── Notas de equipamento (informativas) ──
    const equipmentNotes: string[] = [];
    // Demanda extra de graves gerada pelo equipamento. NÃO altera a área total de
    // absorção — graves se tratam nos cantos, não cobrindo mais parede de painel fino.
    let lowFreqDemand = 0;

    // Low-freq impact from instruments
    const selectedInstruments = instrumentOptions.filter((i) => equipment.instruments.includes(i.id));
    const totalLowImpact = selectedInstruments.reduce((sum, i) => sum + i.lowFreqImpact, 0);
    if (totalLowImpact > 0) {
      lowFreqDemand += totalLowImpact;
      equipmentNotes.push(`Instrumentos com energia em graves — priorize os cantos, não mais área de painel`);
    }

    const monitor = monitorSizes.find((m) => m.value === equipment.monitorSize);
    if (monitor) {
      lowFreqDemand += (parseInt(monitor.value) - 5) * 0.05;
      equipmentNotes.push(`Monitores ${monitor.label} — extensão até ~${monitor.lowExtension}Hz — ${monitor.power}W`);
    }

    if (equipment.hasSub) {
      const subInch = parseInt(equipment.subSize) || 10;
      lowFreqDemand += 0.3;
      equipmentNotes.push(`Subwoofer ${subInch}" — extensão até ~${Math.max(20, 50 - subInch * 2)}Hz — exige bass trap nos 4 cantos`);
    }

    const needsHighDensity = lowFreqDemand > 0.2;
    const mainPanelSlug = needsHighDensity ? "painel-acustico-snr6450" : "painel-acustico-snr3250";

    // ── Dimensionamento por Sabine/Eyring (ver acousticsEngine.ts) ──
    // RT alvo → absorção requerida → desconta a sala nua → converte pelo α real.
    const dim = dimension(room, useType.rtTarget, mainPanelSlug);
    const volume = dim.volume;
    const totalSurface = dim.surface;
    const panelsNeeded = dim.mainPanelQty;
    const absorptionArea = Math.round(dim.missingAtRef);

    // ── Product recommendation based on use + equipment ──
    const products: {name: string;placement: string;qty: number;slug: string;}[] = [];

    // Determine bass trap count based on equipment
    let bassTrapCount = Math.min(4, Math.ceil(w * 0.5));
    if (equipment.hasSub || totalLowImpact > 0.2) {
      bassTrapCount = 4; // Always 4 corners with significant low-freq sources
    }
    if (selectedInstruments.some((i) => i.id === "bateria")) {
      bassTrapCount = 4;
      equipmentNotes.push("Bateria requer tratamento máximo nos 4 cantos");
    }

    // Determine cloud count — more with monitoring setup
    let cloudCount = Math.ceil(panelsNeeded * 0.2);
    if (monitor && parseInt(monitor.value) >= 8) {
      cloudCount = Math.max(cloudCount, 3);
      equipmentNotes.push("Monitores ≥8\" requerem nuvem acústica na posição de escuta");
    }

    if (useType.value === "estudio" || useType.value === "home-theater" || useType.value === "ensaio" || useType.value === "podcast") {
      // Painéis de parede recebem a maior fatia; o restante da absorção vem de nuvem e
      // bass trap, que são contabilizados por seu próprio α no balanço final.
      const wallPanels = Math.max(2, Math.ceil(panelsNeeded * 0.55));
      const panelName = needsHighDensity ? "Painel SNR6450 (Low-Mid)" : "Painel SNR3250 (High-Mid)";
      const panelSlug = mainPanelSlug;

      products.push({ name: panelName, placement: "Paredes laterais e primeira reflexão", qty: wallPanels, slug: panelSlug });
      products.push({ name: "Bass Trap Corner 3S", placement: "Cantos verticais — do piso ao teto", qty: bassTrapCount, slug: "bass-trap-corner-3s-snr6430" });
      products.push({ name: "Nuvem Acústica SNR3250", placement: "Teto — acima da posição de escuta", qty: cloudCount, slug: "nuvem-acustica-snr3250" });
      products.push({ name: "Difusor Skyline", placement: "Parede traseira", qty: Math.ceil(w / 0.5), slug: "difusor-skyline" });

      // Add kit de fixação
      const totalProducts = wallPanels + bassTrapCount + cloudCount + Math.ceil(w / 0.5);
      products.push({ name: "Kit de Fixação Acústica", placement: "Fixadores para todos os produtos", qty: totalProducts, slug: "kit-fixacao-acustica" });
    } else if (useType.value === "igreja" || useType.value === "auditorio") {
      products.push({ name: "Painel SNR3250 (High-Mid)", placement: "Paredes laterais", qty: Math.ceil(panelsNeeded * 0.6), slug: "painel-acustico-snr3250" });
      products.push({ name: "Baffles Acústicos", placement: "Teto", qty: Math.ceil(panelsNeeded * 0.3), slug: "baffles-acusticos" });
      products.push({ name: "Painel SNR6450 (Low-Mid)", placement: "Parede do fundo", qty: Math.ceil(panelsNeeded * 0.1), slug: "painel-acustico-snr6450" });
    } else {
      products.push({ name: "Painel SNR3250 (High-Mid)", placement: "Paredes", qty: Math.ceil(panelsNeeded * 0.6), slug: "painel-acustico-snr3250" });
      products.push({ name: "Nuvem Acústica SNR3250", placement: "Teto", qty: Math.ceil(panelsNeeded * 0.3), slug: "nuvem-acustica-snr3250" });
      products.push({ name: "Painel SNR3225 Slim", placement: "Divisórias", qty: Math.ceil(panelsNeeded * 0.1), slug: "painel-acustico-snr3225-slim" });
    }

    // ── Balanço acústico: antes x depois, por banda de oitava ──
    const before = rt60ByBand(room, bareAbsorption(room));
    const afterAbs = treatedAbsorption(room, products.map((p) => ({ slug: p.slug, qty: p.qty })));
    const after = rt60ByBand(room, afterAbs);

    const warnings = [...dim.warnings];
    if (lowFreqDemand > 0.2 && bassTrapCount < 4) {
      warnings.push("Com esta fonte de graves, os 4 cantos verticais devem receber bass trap.");
    }

    setResult({
      volume, totalSurface, absorptionArea,
      rtTarget: useType.rtTarget,
      products, panelsNeeded,
      useLabel: useType.label,
      equipmentNotes,
      rtBefore: before.rt,
      rtAfter: after.rt,
      method: after.method,
      schroeder: dim.schroeder,
      warnings,
      assumptions: dim.assumptions
    });
  };

  const hasRoomDimensions = parseFloat(width) > 0 && parseFloat(length) > 0 && parseFloat(height) > 0;
  const showEquipment = use === "estudio" || use === "home-theater" || use === "ensaio" || use === "podcast";

  return (
    <Layout>
      <section className="section-padding bg-gradient-to-b from-background via-muted/30 to-background min-h-screen mx-[3px] bg-transparent">
        <div className="container mx-auto">
          <SectionHeading
            tag="Ferramenta"
            title="Calculadora Acústica"
            description="Calcule a área de absorção recomendada e visualize o material ideal para o seu ambiente." />


          <div className="mt-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* LEFT COLUMN — Form */}
            <div className="xl:col-span-3 space-y-5">
              <div className="glass-card p-5 md:p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <CalculatorForm
                  width={width} length={length} height={height} use={use} equipment={equipment}
                  setWidth={setWidth} setLength={setLength} setHeight={setHeight} setUse={setUse} setEquipment={setEquipment}
                  onCalculate={calculate} />


                {/* Material quick reference */}
                <div className="mt-6 pt-5 border-t border-border/50">
                  <h4 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Materiais</h4>
                  <div className="space-y-2">
                    {[
                    { density: "D32", nrc: "0.80", use: "High-Mid", color: "bg-primary/60" },
                    { density: "D64", nrc: "0.93", use: "Low-Mid", color: "bg-accent/60" },
                    { density: "D96", nrc: "1.07", use: "Full Range", color: "bg-destructive/60" }].
                    map((m) =>
                    <div key={m.density} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <span className={`w-2 h-2 ${m.color} rounded-full shrink-0`} />
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-foreground">{m.density}</p>
                          <p className="text-[9px] text-muted-foreground">{m.use}</p>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-primary">{m.nrc}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER/RIGHT — 3D + Results */}
            <div className="xl:col-span-9 space-y-5">
              {/* 3D Viewer */}
              <motion.div
                layout
                className={`glass-card overflow-hidden transition-all ${expanded3D ? "fixed inset-4 z-50" : "relative"}`}>

                <div className="flex items-center justify-between p-4 pb-0">
                  <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                    <Box size={18} className="text-primary" /> Visualização 3D
                    {hasRoomDimensions &&
                    <span className="text-[10px] font-mono text-muted-foreground ml-2">
                        {width}×{length}×{height}m
                      </span>
                    }
                  </h3>
                  <div className="flex items-center gap-2">
                    {/* Layout Selector */}
                    {result &&
                    <div className="flex gap-1">
                        {layoutPresets.map((lp) =>
                      <button
                        key={lp.value}
                        onClick={() => setLayout(lp.value)}
                        title={lp.desc}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        layout === lp.value ?
                        "bg-primary/15 text-primary border border-primary/30" :
                        "text-muted-foreground hover:text-foreground border border-transparent"}`
                        }>

                            {lp.label}
                          </button>
                      )}
                      </div>
                    }
                    <button
                      onClick={() => setExpanded3D(!expanded3D)}
                      className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">

                      {expanded3D ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                </div>

                {/* Layout description */}
                {result &&
                <div className="px-4 pt-2">
                    <p className="text-[10px] text-muted-foreground/70">
                      <LayoutGrid size={10} className="inline mr-1" />
                      {layoutPresets.find((lp) => lp.value === layout)?.desc}
                    </p>
                  </div>
                }

                <div className={`p-4 ${expanded3D ? "h-[calc(100%-80px)]" : "h-[450px] lg:h-[500px]"}`}>
                  {hasRoomDimensions ?
                  <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #0d1f33 100%)" }}>
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-xs text-blue-400/60">Carregando cena 3D...</p>
                        </div>
                      </div>
                  }>
                      <Room3DViewer
                      width={parseFloat(width) || 1}
                      length={parseFloat(length) || 1}
                      height={parseFloat(height) || 1}
                      products={result?.products}
                      showProducts={!!result}
                      layout={layout}
                      hasMonitors={!!equipment.monitorSize}
                      hasSub={equipment.hasSub} />

                    </Suspense> :

                  <div className="w-full h-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20">
                      <Box size={48} className="text-muted-foreground/20 mb-3" />
                      <p className="text-sm text-muted-foreground">Use os sliders para definir o ambiente</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-1">A sala aparecerá aqui em tempo real</p>
                    </div>
                  }
                </div>
              </motion.div>

              {expanded3D &&
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setExpanded3D(false)} />
              }

              {/* Results */}
              <AnimatePresence>
                {result &&
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5">

                    {/* Equipment Notes */}
                    {result.equipmentNotes.length > 0 &&
                  <div className="glass-card p-4">
                        <h4 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">Análise de Equipamentos</h4>
                        <div className="space-y-1">
                          {result.equipmentNotes.map((note, i) =>
                      <p key={i} className="text-[12px] text-foreground flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              {note}
                            </p>
                      )}
                        </div>
                      </div>
                  }

                    {/* Metrics */}
                    <AcousticMetrics
                    volume={result.volume}
                    totalSurface={result.totalSurface}
                    absorptionArea={result.absorptionArea}
                    rtTarget={result.rtTarget}
                    panelsNeeded={result.panelsNeeded}
                    useLabel={result.useLabel}
                    rtBefore={result.rtBefore}
                    rtAfter={result.rtAfter}
                    method={result.method}
                    schroeder={result.schroeder}
                    warnings={result.warnings}
                    assumptions={result.assumptions} />


                    {/* Material */}
                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-display font-semibold text-sm">Material de Absorção Recomendado</h4>
                        <span className="text-[10px] text-muted-foreground font-mono">{result.useLabel}</span>
                      </div>
                      {(() => {
                      const vol = result.volume;
                      if (vol <= 30) {
                        return (
                          <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg mt-2">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <span className="text-lg font-bold font-mono text-primary">32</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">Lã de Rocha D32</p>
                                <p className="text-[11px] text-muted-foreground">Ideal para salas pequenas — NRC 0.80 — perfil fino 50mm</p>
                              </div>
                              <span className="text-xs font-mono font-bold text-primary">NRC 0.80</span>
                            </div>);

                      } else if (vol <= 80) {
                        return (
                          <div className="flex items-center gap-4 p-3 bg-accent/5 rounded-lg mt-2">
                              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                <span className="text-lg font-bold font-mono text-accent">64</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">Lã de Rocha D64</p>
                                <p className="text-[11px] text-muted-foreground">Maior densidade para baixas frequências — {result.useLabel}</p>
                              </div>
                              <span className="text-xs font-mono font-bold text-accent">NRC 0.93</span>
                            </div>);

                      } else {
                        return (
                          <div className="flex items-center gap-4 p-3 bg-destructive/5 rounded-lg mt-2">
                              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                                <span className="text-lg font-bold font-mono text-destructive">96</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">Lã de Rocha D96</p>
                                <p className="text-[11px] text-muted-foreground">Máxima absorção full range para espaços grandes — {result.useLabel}</p>
                              </div>
                              <span className="text-xs font-mono font-bold text-destructive">NRC 1.07</span>
                            </div>);

                      }
                    })()}
                    </div>

                    {/* Products */}
                    <div className="glass-card p-5">
                      <h4 className="font-display font-semibold text-sm mb-3">Produtos Recomendados</h4>
                      <div className="space-y-2">
                        {result.products.map((p) =>
                      <Link
                        key={p.name}
                        to={`/produtos/${p.slug}`}
                        className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:border-primary/40 transition-all group bg-card/30">

                            <div className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                                <p className="text-[11px] text-muted-foreground">{p.placement}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{p.qty}×</span>
                              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </Link>
                      )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Total: <strong className="text-foreground">{result.panelsNeeded} painéis</strong> (1200×600mm)
                        </p>
                        <Link
                        to="/orcamento"
                        className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">

                          Solicitar Orçamento <ArrowRight size={14} />
                        </Link>
                      </div>

                      <p className="text-[9px] text-muted-foreground/60 mt-3">
                        * Dimensionamento por Sabine/Eyring a partir do RT60 alvo, usando os coeficientes de
                        absorção das fichas técnicas. O acabamento da sala nua é uma suposição declarada em
                        "Base do cálculo" — não uma medição do seu ambiente. Para projeto executivo, solicite
                        análise acústica com medição in loco.
                      </p>
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </Layout>);

}