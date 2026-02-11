import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AbsorptionData } from "@/data/products";

const FREQ_LABELS = [125, 250, 500, 1000, 2000, 4000];

// Dados realistas de competidores (espuma acústica genérica 50mm)
const competitionData: Record<number, number> = {
  40: 0.01, 50: 0.02, 63: 0.03, 80: 0.05, 100: 0.08, 125: 0.11, 160: 0.18, 200: 0.25,
  250: 0.35, 315: 0.45, 400: 0.52, 500: 0.60, 630: 0.68, 800: 0.73, 1000: 0.76,
  1250: 0.78, 1600: 0.75, 2000: 0.72, 2500: 0.70, 3150: 0.71, 4000: 0.72, 5000: 0.73, 6300: 0.72, 8000: 0.70, 10000: 0.68,
};

interface Props {
  data: AbsorptionData[];
}

export default function AbsorptionChart({ data }: Props) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [selectedDensity, setSelectedDensity] = useState<number | null>(null);

  const activeData = selectedDensity !== null
    ? data.filter((d) => d.density === selectedDensity)
    : data;

  const chartData = selectedDensity !== null
    ? data.find((d) => d.density === selectedDensity)
    : data.length > 0 ? data[Math.floor(data.length / 2)] : null;

  // Build line chart data — extended frequency range like GIK
  const extendedFreqs = [40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000];

  const lineChartData = extendedFreqs.map((freq) => {
    // Interpolate Sonar data from the 6-point table
    let sonarValue = 0;
    if (chartData) {
      const coeffs = chartData.coefficients;
      const exact = coeffs.find((c) => c.freq === freq);
      if (exact) {
        sonarValue = exact.value;
      } else {
        // Interpolate
        let lower = coeffs[0], upper = coeffs[coeffs.length - 1];
        for (let i = 0; i < coeffs.length - 1; i++) {
          if (freq >= coeffs[i].freq && freq <= coeffs[i + 1].freq) {
            lower = coeffs[i];
            upper = coeffs[i + 1];
            break;
          }
        }
        if (freq < coeffs[0].freq) {
          // Below range - taper down
          sonarValue = coeffs[0].value * (freq / coeffs[0].freq);
        } else if (freq > coeffs[coeffs.length - 1].freq) {
          sonarValue = coeffs[coeffs.length - 1].value;
        } else {
          const ratio = (Math.log(freq) - Math.log(lower.freq)) / (Math.log(upper.freq) - Math.log(lower.freq));
          sonarValue = lower.value + ratio * (upper.value - lower.value);
        }
      }
    }
    return {
      freq,
      freqLabel: freq >= 1000 ? `${(freq / 1000).toFixed(freq % 1000 === 0 ? 0 : 1)}k Hz` : `${freq} Hz`,
      sonar: Math.round(sonarValue * 100) / 100,
      competition: competitionData[freq] || 0,
    };
  });

  return (
    <div className="space-y-10">
      {/* ── LINE CHART — GIK Style ────────────────────────── */}
      {chartData && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h4 className="font-display font-semibold text-base text-foreground">Curva de Absorção Sonora</h4>
            {selectedDensity !== null && (
              <span className="text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded-full">{selectedDensity} kg/m³</span>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={lineChartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="freqLabel"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={1}
                />
                <YAxis
                  domain={[0, 1.3]}
                  ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  label={{ value: "Coeficiente de Absorção", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#6b7280" }, offset: 0 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number, name: string) => [value.toFixed(2), name === "sonar" ? "Sonar SNR (Lã de Rocha)" : "Concorrência (Espuma)"]}
                  labelFormatter={(label: string) => `Frequência: ${label}`}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value: string) => value === "sonar" ? "Painel Sonar SNR (Lã de Rocha)" : "Concorrência (Espuma Genérica)"}
                />
                <Line
                  type="monotone"
                  dataKey="sonar"
                  stroke="#c57a1e"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#c57a1e", stroke: "#c57a1e" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="competition"
                  stroke="#2a7b8e"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#2a7b8e", stroke: "#2a7b8e" }}
                  activeDot={{ r: 5 }}
                  strokeDasharray="4 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Density selector pills ────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Selecione a densidade para comparar</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDensity(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              selectedDensity === null ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            Todas
          </button>
          {data.map((d) => (
            <button
              key={d.density}
              onClick={() => setSelectedDensity(selectedDensity === d.density ? null : d.density)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                selectedDensity === d.density ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {d.density} kg/m³
            </button>
          ))}
        </div>
      </div>

      {/* ── HEATMAP TABLE ─────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display font-semibold text-base text-foreground">Coeficientes de Absorção Acústica</h4>
          <span className="text-[10px] text-muted-foreground font-mono">(ISO/R 354 e ASTM C 423)</span>
        </div>
        <div className="bg-white rounded-xl overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary text-secondary-foreground">
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Dens kg/m³</th>
                  <th className="text-center px-3 py-3 text-xs font-bold uppercase tracking-wider">Esp (mm)</th>
                  {FREQ_LABELS.map((f) => (
                    <th key={f} className="text-center px-3 py-3 text-xs font-bold uppercase tracking-wider">
                      {f >= 1000 ? `${f / 1000}k` : f}
                    </th>
                  ))}
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary">NRC</th>
                </tr>
              </thead>
              <tbody>
                {activeData.map((row, idx) => (
                  <tr
                    key={`${row.density}-${row.thickness}`}
                    className={`transition-colors border-t border-border/50 ${
                      hoveredRow === idx ? "bg-primary/5" : idx % 2 === 0 ? "bg-white" : "bg-muted/20"
                    } ${selectedDensity === row.density ? "bg-primary/10" : ""}`}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">{row.density}</td>
                    <td className="text-center px-3 py-3 text-muted-foreground">{row.thickness}</td>
                    {row.coefficients.map((c) => {
                      const intensity = Math.min(c.value / 1.3, 1);
                      return (
                        <td key={c.freq} className="text-center px-3 py-3 relative">
                          <div
                            className="absolute inset-1 rounded-md opacity-20"
                            style={{ backgroundColor: `hsl(var(--primary) / ${intensity})` }}
                          />
                          <span className="relative font-mono text-foreground font-medium">{c.value.toFixed(2)}</span>
                        </td>
                      );
                    })}
                    <td className="text-center px-4 py-3">
                      <span className="font-bold text-primary font-mono">{row.nrc.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-muted/30 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground">
              Obs.: Valores superiores a 1 são previstos em norma. Para efeito de projeto, utilizar valor igual a 1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
