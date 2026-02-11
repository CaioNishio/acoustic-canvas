import { Calculator } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const useTypes = [
  { value: "estudio", label: "Estúdio de Gravação", rtTarget: 0.4, absPercent: 0.6 },
  { value: "igreja", label: "Igreja / Templo", rtTarget: 1.2, absPercent: 0.35 },
  { value: "reuniao", label: "Sala de Reunião", rtTarget: 0.6, absPercent: 0.45 },
  { value: "auditorio", label: "Auditório", rtTarget: 0.8, absPercent: 0.4 },
  { value: "home-theater", label: "Home Theater", rtTarget: 0.5, absPercent: 0.5 },
  { value: "escritorio", label: "Escritório Open Office", rtTarget: 0.7, absPercent: 0.4 },
];

export { useTypes };

interface CalculatorFormProps {
  width: string;
  length: string;
  height: string;
  use: string;
  setWidth: (v: string) => void;
  setLength: (v: string) => void;
  setHeight: (v: string) => void;
  setUse: (v: string) => void;
  onCalculate: () => void;
}

function SliderInput({ label, value, onChange, min, max, unit }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  unit: string;
}) {
  const numVal = parseFloat(value) || 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{label}</label>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 text-right bg-transparent border-b border-border text-foreground text-lg font-bold font-mono outline-none focus:border-primary transition-colors"
            placeholder="0"
            min={min}
            max={max}
            step="0.1"
          />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <Slider
        value={[numVal]}
        onValueChange={(v) => onChange(v[0].toFixed(1))}
        min={min}
        max={max}
        step={0.1}
        className="w-full"
      />
      <div className="flex justify-between text-[9px] text-muted-foreground/50 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function CalculatorForm({
  width, length, height, use,
  setWidth, setLength, setHeight, setUse,
  onCalculate,
}: CalculatorFormProps) {
  const canCalculate = parseFloat(width) > 0 && parseFloat(length) > 0 && parseFloat(height) > 0 && !!use;

  return (
    <div className="space-y-5">
      <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
        <Calculator size={18} className="text-primary" /> Dimensões do Ambiente
      </h3>

      <SliderInput label="Largura" value={width} onChange={setWidth} min={1} max={30} unit="m" />
      <SliderInput label="Comprimento" value={length} onChange={setLength} min={1} max={40} unit="m" />
      <SliderInput label="Pé-direito" value={height} onChange={setHeight} min={2} max={12} unit="m" />

      <div>
        <label className="text-xs text-muted-foreground font-medium tracking-wide uppercase mb-2 block">
          Uso do ambiente
        </label>
        <div className="grid grid-cols-2 gap-2">
          {useTypes.map((u) => (
            <button
              key={u.value}
              onClick={() => setUse(u.value)}
              className={`text-left p-3 rounded-lg border text-sm transition-all ${
                use === u.value
                  ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                  : "bg-card/30 border-border/50 text-foreground hover:border-primary/20"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onCalculate}
        disabled={!canCalculate}
        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 text-sm"
      >
        <Calculator size={16} /> Calcular Tratamento
      </button>
    </div>
  );
}
