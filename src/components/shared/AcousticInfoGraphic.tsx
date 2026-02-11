import { motion } from "framer-motion";

interface AcousticSpec {
  label: string;
  value: number;
  maxValue?: number;
  unit?: string;
  color?: string;
}

function CircularGauge({ label, value, maxValue = 1, unit = "", color = "hsl(var(--primary))", delay = 0 }: AcousticSpec & { delay?: number }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-bold text-foreground">{value}{unit}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">{label}</span>
    </div>
  );
}

function HorizontalBar({ label, value, maxValue = 1, unit = "", color = "hsl(var(--primary))", delay = 0 }: AcousticSpec & { delay?: number }) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold text-primary">{value}{unit}</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface Props {
  specs: { label: string; value: string }[];
}

export default function AcousticInfoGraphic({ specs }: Props) {
  // Extract acoustic metrics from specs
  const nrc = specs.find((s) => s.label === "NRC");
  const nrcAbsorption = specs.find((s) => s.label === "NRC (Absorção)");
  const fireClass = specs.find((s) => s.label === "Classe de Fogo");
  const absorptionRange = specs.find((s) => s.label === "Faixa de Absorção");
  const diffusionRange = specs.find((s) => s.label === "Faixa de Difusão");
  const weight = specs.find((s) => s.label === "Peso");
  const thickness = specs.find((s) => s.label === "Espessura") || specs.find((s) => s.label === "Espessura Total");

  const nrcValue = nrc ? parseFloat(nrc.value) : nrcAbsorption ? parseFloat(nrcAbsorption.value) : null;

  const gauges: AcousticSpec[] = [];
  if (nrcValue !== null) {
    gauges.push({ label: "NRC", value: nrcValue, maxValue: 1 });
  }

  // Frequency bars
  const freqBars: { label: string; low: number; high: number; color: string }[] = [];
  if (absorptionRange) {
    const match = absorptionRange.value.match(/(\d+)\s*Hz\s*[–-]\s*(\d+)\s*(Hz|kHz)/i);
    if (match) {
      const low = parseInt(match[1]);
      const high = match[3].toLowerCase() === "khz" ? parseInt(match[2]) * 1000 : parseInt(match[2]);
      freqBars.push({ label: "Faixa de Absorção", low, high, color: "hsl(var(--primary))" });
    }
  }
  if (diffusionRange) {
    const match = diffusionRange.value.match(/(\d+)\s*Hz\s*[–-]\s*(\d+)\s*(Hz|kHz)/i);
    if (match) {
      const low = parseInt(match[1]);
      const high = match[3].toLowerCase() === "khz" ? parseInt(match[2]) * 1000 : parseInt(match[2]);
      freqBars.push({ label: "Faixa de Difusão", low, high, color: "hsl(var(--accent))" });
    }
  }

  if (gauges.length === 0 && freqBars.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="font-display font-semibold text-lg mb-5">Performance Acústica</h3>
      <div className="glass-card rounded-xl p-6 space-y-6">
        {/* Gauges row */}
        {gauges.length > 0 && (
          <div className="flex flex-wrap gap-8 justify-center">
            {gauges.map((g, i) => (
              <CircularGauge key={g.label} {...g} delay={i * 0.2} />
            ))}
            {fireClass && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-28 h-28 rounded-full border-[6px] border-primary/30 flex items-center justify-center">
                  <div className="text-center">
                    <span className="font-display text-xl font-bold text-foreground">{fireClass.value}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">Classe de Fogo</span>
              </div>
            )}
            {thickness && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-28 h-28 rounded-full border-[6px] border-accent/30 flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-foreground">{thickness.value}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">Espessura</span>
              </div>
            )}
          </div>
        )}

        {/* Frequency spectrum visualization */}
        {freqBars.length > 0 && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Espectro de Frequência</p>
            {freqBars.map((fb, i) => {
              // Map frequency to position on 20Hz-20kHz log scale
              const logMin = Math.log10(20);
              const logMax = Math.log10(20000);
              const leftPct = ((Math.log10(fb.low) - logMin) / (logMax - logMin)) * 100;
              const rightPct = ((Math.log10(fb.high) - logMin) / (logMax - logMin)) * 100;

              return (
                <div key={fb.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{fb.label}</span>
                    <span className="font-mono">{fb.low >= 1000 ? `${fb.low / 1000}kHz` : `${fb.low}Hz`} – {fb.high >= 1000 ? `${fb.high / 1000}kHz` : `${fb.high}Hz`}</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 h-full rounded-full"
                      style={{ backgroundColor: fb.color, left: `${leftPct}%` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${rightPct - leftPct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                    />
                    {/* Frequency markers */}
                    <div className="absolute inset-0 flex justify-between items-center px-0">
                      {[100, 500, 1000, 5000, 10000].map((f) => {
                        const pos = ((Math.log10(f) - logMin) / (logMax - logMin)) * 100;
                        return <div key={f} className="absolute h-full w-px bg-border/50" style={{ left: `${pos}%` }} />;
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground/60 font-mono">
                    <span>20Hz</span>
                    <span>100</span>
                    <span>1kHz</span>
                    <span>10kHz</span>
                    <span>20kHz</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* NRC Performance bar */}
        {nrcValue !== null && (
          <div className="pt-2">
            <HorizontalBar label="Coeficiente de Absorção (NRC)" value={nrcValue} maxValue={1} delay={0.3} />
            <p className="text-[10px] text-muted-foreground mt-2">
              NRC (Noise Reduction Coefficient): valor de 0 a 1 indicando a fração de som absorvida. Quanto maior, melhor a absorção.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
