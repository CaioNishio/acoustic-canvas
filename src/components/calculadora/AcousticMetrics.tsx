import { motion } from "framer-motion";
import { Activity, Ruler, Box, Info, TriangleAlert, Table2 } from "lucide-react";
import { BANDS, type BandValues } from "./acousticsEngine";

/**
 * Painel de resultados da calculadora.
 *
 * Substitui o "espectro de absorção" que antes era um array fixo — os mesmos oito
 * valores para qualquer sala e qualquer material. Agora o gráfico mostra RT60 medido
 * por banda de oitava, antes e depois do tratamento, calculado por Sabine/Eyring.
 *
 * Cores validadas com scripts/validate_palette.js da skill dataviz:
 *   claro  #E8641C / #2E7FBF — ΔE protan 22,2 · normal 31,1
 *   escuro #D2762F / #3E8FCB — ΔE protan 21,4 · normal 26,2
 */

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  accent?: boolean;
  delay?: number;
  hint?: string;
}

function MetricCard({ label, value, unit, icon, accent, delay = 0, hint }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-xl p-4 border transition-all ${
      accent ?
      "bg-primary/10 border-primary/30 shadow-lg shadow-primary/5" :
      "bg-card/50 border-border/50"}`
      }>

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
      {hint && <p className="text-[10px] text-muted-foreground mt-1.5 leading-snug">{hint}</p>}
    </motion.div>);

}

const fmt = (n: number) => n.toFixed(2).replace(".", ",");
const bandLabel = (hz: number) => hz >= 1000 ? `${hz / 1000}k` : `${hz}`;

interface AcousticMetricsProps {
  volume: number;
  totalSurface: number;
  absorptionArea: number;
  rtTarget: number;
  panelsNeeded: number;
  useLabel: string;
  rtBefore: BandValues;
  rtAfter: BandValues;
  method: ("sabine" | "eyring")[];
  schroeder: number;
  warnings: string[];
  assumptions: string[];
}

export default function AcousticMetrics({
  volume, totalSurface, absorptionArea, rtTarget, panelsNeeded, useLabel,
  rtBefore, rtAfter, method, schroeder, warnings, assumptions
}: AcousticMetricsProps) {
  const REF = 2; // 500 Hz — banda de referência (ISO 3382)
  const rtRefAfter = rtAfter[REF];
  const rtRefBefore = rtBefore[REF];

  // Escala do gráfico: maior valor entre as séries e o alvo, com folga.
  const maxRT = Math.max(...rtBefore, ...rtAfter, rtTarget) * 1.12;
  const pct = (v: number) => `${Math.max(Math.min(v / maxRT * 100, 100), 1.5)}%`;

  const desvio = rtRefAfter - rtTarget;
  const dentroDoAlvo = Math.abs(desvio) <= rtTarget * 0.15;

  return (
    <div
      className="space-y-4 [--c-antes:#E8641C] [--c-depois:#2E7FBF] dark:[--c-antes:#D2762F] dark:[--c-depois:#3E8FCB]">

      {/* ── Números principais ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Volume" value={fmt(volume)} unit="m³" icon={<Box size={16} />} delay={0} />
        <MetricCard label="Superfície" value={fmt(totalSurface)} unit="m²" icon={<Ruler size={16} />} delay={0.05} />
        <MetricCard
          label="Absorção a acrescentar" value={absorptionArea.toString()} unit="sabines"
          icon={<Activity size={16} />} accent delay={0.1}
          hint="Diferença entre o que a sala nua já absorve e o necessário para o RT60 alvo, a 500 Hz." />

        <MetricCard
          label="Painéis principais" value={panelsNeeded.toString()} unit="un"
          icon={<Table2 size={16} />} delay={0.15}
          hint="1200 × 600 mm. Nuvens e bass traps entram além destes." />

      </div>

      {/* ── Resultado de projeto ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/50 bg-card/50 p-5">

        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              RT60 previsto a 500 Hz — {useLabel}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono text-foreground">{fmt(rtRefAfter)}</span>
              <span className="text-lg text-muted-foreground">s</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
              dentroDoAlvo ?
              "bg-primary/15 text-primary" :
              "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`
              }>
                {dentroDoAlvo ? "dentro do alvo" : `${desvio > 0 ? "+" : ""}${fmt(desvio)} s vs alvo`}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Alvo · Antes</p>
            <p className="font-mono text-sm text-foreground">
              {fmt(rtTarget)} s <span className="text-muted-foreground">·</span>{" "}
              <span className="text-muted-foreground">{fmt(rtRefBefore)} s</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Gráfico: RT60 por banda de oitava ── */}
      <motion.figure
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="rounded-xl bg-card/50 border border-border/50 p-4 m-0">

        <figcaption className="mb-1 text-sm font-semibold text-foreground">
          Tempo de reverberação por banda de oitava
        </figcaption>
        <p className="text-[11px] text-muted-foreground mb-3">
          Estimativa por Sabine/Eyring. A linha tracejada é o RT60 alvo de {fmt(rtTarget)} s.
        </p>

        {/* legenda — sempre presente com 2 séries */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--c-antes)" }} />
            Sala nua
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--c-depois)" }} />
            Com tratamento
          </span>
        </div>

        <div className="relative h-44 pl-9">
          {/* eixo Y */}
          <div className="absolute left-0 inset-y-0 w-8 flex flex-col justify-between items-end pr-1.5">
            {[maxRT, maxRT / 2, 0].map((v, i) =>
            <span key={i} className="text-[9px] font-mono text-muted-foreground leading-none">{v.toFixed(1)}</span>
            )}
          </div>

          {/* linha do alvo */}
          <div
            className="absolute left-9 right-0 border-t border-dashed border-primary/60 z-10 pointer-events-none"
            style={{ bottom: pct(rtTarget) }}>

            <span className="absolute -top-4 right-0 text-[9px] font-mono text-primary bg-card/80 px-1 rounded">
              alvo {fmt(rtTarget)} s
            </span>
          </div>

          {/* barras */}
          <div className="h-full flex items-end gap-2 border-l border-b border-border/50 pl-2 pb-0">
            {BANDS.map((hz, i) =>
            <div key={hz} className="flex-1 h-full flex flex-col justify-end group relative">
                {/* tooltip */}
                <div
                className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-20 hidden group-hover:block
                           whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 shadow-md">

                  <p className="text-[10px] font-semibold text-popover-foreground">{hz} Hz</p>
                  <p className="text-[10px] text-muted-foreground">Nua: {fmt(rtBefore[i])} s</p>
                  <p className="text-[10px] text-muted-foreground">Tratada: {fmt(rtAfter[i])} s</p>
                  <p className="text-[9px] text-muted-foreground/70 mt-0.5">método: {method[i]}</p>
                </div>

                <div className="flex items-end justify-center gap-[2px] h-full">
                  <div
                  className="w-1/2 max-w-[16px] rounded-t transition-opacity group-hover:opacity-100 opacity-90"
                  style={{ height: pct(rtBefore[i]), background: "var(--c-antes)" }} />

                  <div
                  className="w-1/2 max-w-[16px] rounded-t transition-opacity group-hover:opacity-100 opacity-90"
                  style={{ height: pct(rtAfter[i]), background: "var(--c-depois)" }} />

                </div>
                {/* rótulo direto apenas na banda de referência */}
                {i === REF &&
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-foreground">
                    {fmt(rtAfter[i])}
                  </span>
              }
              </div>
            )}
          </div>

          {/* eixo X */}
          <div className="flex gap-2 pl-2 mt-1">
            {BANDS.map((hz) =>
            <span key={hz} className="flex-1 text-center text-[9px] font-mono text-muted-foreground">
                {bandLabel(hz)}
              </span>
            )}
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground text-right mt-1">Hz</p>

        {/* alternativa em tabela — o gráfico não pode ser a única via de leitura */}
        <details className="mt-3 group">
          <summary className="text-[11px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            Ver como tabela
          </summary>
          <table className="w-full mt-2 text-[11px]">
            <caption className="sr-only">RT60 por banda de oitava, antes e depois do tratamento</caption>
            <thead>
              <tr className="text-muted-foreground">
                <th scope="col" className="text-left font-medium py-1">Banda</th>
                <th scope="col" className="text-right font-medium py-1">Sala nua</th>
                <th scope="col" className="text-right font-medium py-1">Tratada</th>
                <th scope="col" className="text-right font-medium py-1">Método</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {BANDS.map((hz, i) =>
              <tr key={hz} className="border-t border-border/30">
                  <th scope="row" className="text-left font-normal py-1 text-muted-foreground">{hz} Hz</th>
                  <td className="text-right py-1 text-foreground">{fmt(rtBefore[i])} s</td>
                  <td className="text-right py-1 text-foreground">{fmt(rtAfter[i])} s</td>
                  <td className="text-right py-1 text-muted-foreground">{method[i]}</td>
                </tr>
              )}
            </tbody>
          </table>
        </details>
      </motion.figure>

      {/* ── Avisos técnicos ── */}
      {warnings.length > 0 &&
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-2">

          {warnings.map((w, i) =>
        <p key={i} className="flex items-start gap-2 text-[12px] text-foreground leading-snug">
              <TriangleAlert size={13} className="text-amber-500 mt-0.5 shrink-0" />
              {w}
            </p>
        )}
        </motion.div>
      }

      {/* ── Procedência: o que é medido e o que é suposto ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="rounded-xl border border-border/50 bg-muted/20 p-4">

        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
          <Info size={13} className="text-muted-foreground" /> Base do cálculo
        </p>
        <ul className="space-y-1">
          {assumptions.map((a, i) =>
          <li key={i} className="text-[11px] text-muted-foreground leading-snug">• {a}</li>
          )}
          <li className="text-[11px] text-muted-foreground leading-snug">
            • Frequência de Schroeder ≈ {Math.round(schroeder)} Hz — abaixo dela o campo não é
            difuso e o RT60 estatístico não descreve a sala.
          </li>
          <li className="text-[11px] text-muted-foreground leading-snug">
            • Sabine para ᾱ &lt; 0,2; Eyring acima disso. O método usado em cada banda está na tabela.
          </li>
        </ul>
      </motion.div>
    </div>);

}
