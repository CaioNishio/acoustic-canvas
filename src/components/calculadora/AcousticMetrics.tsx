import { motion } from "framer-motion";
import { Activity, Waves, Volume2, BarChart3, Ruler, Box } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  accent?: boolean;
  delay?: number;
}

function MetricCard({ label, value, unit, icon, accent, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-xl p-4 border transition-all ${
        accent
          ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/5"
          : "bg-card/50 border-border/50"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={accent ? "text-primary" : "text-muted-foreground"}>{icon}</span>
        <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold font-mono tracking-tight ${accent ? "text-primary" : "text-foreground"}`}>
          {value}
        </span>
        {unit && <span className="text-base text-muted-foreground">{unit}</span>}
      </div>
    </motion.div>
  );
}

interface AcousticMetricsProps {
  volume: number;
  totalSurface: number;
  absorptionArea: number;
  rtTarget: number;
  panelsNeeded: number;
  useLabel: string;
}

export default function AcousticMetrics({ volume, totalSurface, absorptionArea, rtTarget, panelsNeeded, useLabel }: AcousticMetricsProps) {
  // Sabine RT60 estimate (before treatment)
  const avgAlpha = 0.05; // bare room
  const rt60Before = (0.161 * volume) / (totalSurface * avgAlpha);
  // After treatment estimate
  const treatedAlpha = absorptionArea * 0.85 / totalSurface;
  const rt60After = (0.161 * volume) / (totalSurface * (avgAlpha + treatedAlpha));

  // Clarity improvement
  const clarityImprovement = Math.round((1 - rt60After / rt60Before) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricCard label="Volume" value={volume.toFixed(1)} unit="m³" icon={<Box size={16} />} delay={0} />
        <MetricCard label="Superfície" value={totalSurface.toFixed(1)} unit="m²" icon={<Ruler size={16} />} delay={0.05} />
        <MetricCard label="Área de Absorção" value={absorptionArea.toString()} unit="m²" icon={<Activity size={16} />} accent delay={0.1} />
        <MetricCard label="RT60 Alvo" value={rtTarget.toFixed(1)} unit="s" icon={<Waves size={16} />} accent delay={0.15} />
        <MetricCard label="RT60 Estimado (Antes)" value={rt60Before.toFixed(1)} unit="s" icon={<Volume2 size={16} />} delay={0.2} />
        <MetricCard label="RT60 Estimado (Após)" value={rt60After.toFixed(2)} unit="s" icon={<Volume2 size={16} />} accent delay={0.25} />
      </div>

      {/* Extra insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="rounded-xl bg-card/50 border border-border/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Melhoria de Clareza</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(clarityImprovement, 100)}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <span className="text-base font-bold font-mono text-primary">{clarityImprovement}%</span>
          </div>
        </div>
        <div className="rounded-xl bg-card/50 border border-border/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total de Painéis</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-foreground">{panelsNeeded}</span>
            <span className="text-xs text-muted-foreground">unidades (1200×600mm)</span>
          </div>
        </div>
      </motion.div>

      {/* Frequency spectrum quick view */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl bg-card/50 border border-border/50 p-4"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Espectro de Absorção Estimado</p>
        <div className="flex items-end gap-1 h-16">
          {[
            { freq: "63", value: 0.15 },
            { freq: "125", value: 0.25 },
            { freq: "250", value: 0.55 },
            { freq: "500", value: 0.82 },
            { freq: "1k", value: 0.92 },
            { freq: "2k", value: 0.94 },
            { freq: "4k", value: 0.96 },
            { freq: "8k", value: 0.90 },
          ].map((band, i) => (
            <div key={band.freq} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${band.value * 100}%` }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                className="w-full rounded-t-sm bg-gradient-to-t from-primary/80 to-primary/40"
              />
              <span className="text-[8px] font-mono text-muted-foreground">{band.freq}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[8px] text-muted-foreground">Hz</span>
          <span className="text-[8px] text-muted-foreground">Coeficiente α</span>
        </div>
      </motion.div>
    </div>
  );
}
