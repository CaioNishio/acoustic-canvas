import { useState } from "react";
import { motion } from "framer-motion";
import type { AbsorptionData } from "@/data/products";

const FREQ_LABELS = [125, 250, 500, 1000, 2000, 4000];

interface Props {
  data: AbsorptionData[];
}

export default function AbsorptionChart({ data }: Props) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [selectedDensity, setSelectedDensity] = useState<number | null>(null);

  const maxCoef = 1.3;

  const activeData = selectedDensity !== null
    ? data.filter((d) => d.density === selectedDensity)
    : data;

  const chartData = selectedDensity !== null
    ? data.find((d) => d.density === selectedDensity)
    : data.length > 0 ? data[Math.floor(data.length / 2)] : null;

  return (
    <div className="space-y-8">
      {/* Absorption Coefficient Chart */}
      {chartData && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold text-base text-foreground">Curva de Absorção Sonora</h4>
            {selectedDensity !== null && (
              <span className="text-xs text-muted-foreground font-mono">{selectedDensity} kg/m³</span>
            )}
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="relative h-52">
              {/* Y axis labels */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
                <div
                  key={v}
                  className="absolute left-0 w-full flex items-center"
                  style={{ bottom: `${(v / maxCoef) * 100}%` }}
                >
                  <span className="text-[10px] text-muted-foreground font-mono w-8 text-right pr-2">{v.toFixed(2)}</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
              ))}
              {/* Bars */}
              <div className="absolute left-10 right-0 bottom-0 h-full flex items-end justify-around gap-2">
                {chartData.coefficients.map((c, i) => {
                  const height = Math.min((c.value / maxCoef) * 100, 100);
                  return (
                    <div key={c.freq} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-foreground">{c.value.toFixed(2)}</span>
                      <motion.div
                        className="w-full max-w-10 rounded-t-md bg-primary"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      />
                      <span className="text-[9px] text-muted-foreground font-mono mt-1">
                        {c.freq >= 1000 ? `${c.freq / 1000}k` : c.freq}Hz
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Density selector pills */}
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

      {/* Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display font-semibold text-base text-foreground">Coeficientes de Absorção Acústica</h4>
          <span className="text-[10px] text-muted-foreground font-mono">(ISO/R 354 e ASTM C 423)</span>
        </div>
        <div className="glass-card rounded-xl overflow-hidden">
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
                      hoveredRow === idx ? "bg-primary/5" : idx % 2 === 0 ? "bg-card" : "bg-muted/20"
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
