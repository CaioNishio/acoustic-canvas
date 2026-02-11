import { Calculator, Music, Speaker, Volume1, Guitar, Piano, Drum, Mic } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const useTypes = [
  { value: "estudio", label: "Estúdio de Gravação", rtTarget: 0.4, absPercent: 0.40 },
  { value: "igreja", label: "Igreja / Templo", rtTarget: 1.2, absPercent: 0.25 },
  { value: "reuniao", label: "Sala de Reunião", rtTarget: 0.6, absPercent: 0.30 },
  { value: "auditorio", label: "Auditório", rtTarget: 0.8, absPercent: 0.28 },
  { value: "home-theater", label: "Home Theater", rtTarget: 0.5, absPercent: 0.38 },
  { value: "escritorio", label: "Escritório Open Office", rtTarget: 0.7, absPercent: 0.25 },
  { value: "ensaio", label: "Sala de Ensaio", rtTarget: 0.5, absPercent: 0.42 },
  { value: "podcast", label: "Podcast / Locução", rtTarget: 0.3, absPercent: 0.45 },
];

export { useTypes };

export const instrumentOptions = [
  { id: "guitarra", label: "Guitarra / Contrabaixo", icon: "guitar", lowFreqImpact: 0.15 },
  { id: "bateria", label: "Bateria / Percussão", icon: "drum", lowFreqImpact: 0.3 },
  { id: "piano", label: "Piano / Teclado", icon: "piano", lowFreqImpact: 0.2 },
  { id: "vocal", label: "Vocal / Locução", icon: "mic", lowFreqImpact: 0.05 },
  { id: "sopro", label: "Sopro / Cordas", icon: "music", lowFreqImpact: 0.1 },
  { id: "eletronica", label: "Produção Eletrônica", icon: "speaker", lowFreqImpact: 0.25 },
];

export const monitorSizes = [
  { value: "5", label: "5\"", lowExtension: 55, power: 50 },
  { value: "6", label: "6.5\"", lowExtension: 47, power: 75 },
  { value: "7", label: "7\"", lowExtension: 43, power: 100 },
  { value: "8", label: "8\"", lowExtension: 38, power: 120 },
  { value: "10", label: "10\"", lowExtension: 33, power: 200 },
  { value: "12", label: "12\"", lowExtension: 28, power: 300 },
];

export interface EquipmentData {
  instruments: string[];
  monitorSize: string;
  hasSub: boolean;
  subSize: string;
}

interface CalculatorFormProps {
  width: string;
  length: string;
  height: string;
  use: string;
  equipment: EquipmentData;
  setWidth: (v: string) => void;
  setLength: (v: string) => void;
  setHeight: (v: string) => void;
  setUse: (v: string) => void;
  setEquipment: (v: EquipmentData) => void;
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

function InstrumentIcon({ type, size = 14 }: { type: string; size?: number }) {
  switch (type) {
    case "guitar": return <Guitar size={size} />;
    case "drum": return <Drum size={size} />;
    case "piano": return <Piano size={size} />;
    case "mic": return <Mic size={size} />;
    case "speaker": return <Speaker size={size} />;
    default: return <Music size={size} />;
  }
}

export default function CalculatorForm({
  width, length, height, use, equipment,
  setWidth, setLength, setHeight, setUse, setEquipment,
  onCalculate,
}: CalculatorFormProps) {
  const canCalculate = parseFloat(width) > 0 && parseFloat(length) > 0 && parseFloat(height) > 0 && !!use;
  const showEquipment = use === "estudio" || use === "home-theater" || use === "ensaio" || use === "podcast";

  const toggleInstrument = (id: string) => {
    const instruments = equipment.instruments.includes(id)
      ? equipment.instruments.filter(i => i !== id)
      : [...equipment.instruments, id];
    setEquipment({ ...equipment, instruments });
  };

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
              className={`text-left p-2.5 rounded-lg border text-[13px] transition-all ${
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

      {/* Equipment Section — visible for studio/HT/rehearsal/podcast */}
      {showEquipment && (
        <div className="space-y-4 pt-3 border-t border-border/50">
          <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
            <Music size={18} className="text-primary" /> Equipamentos
          </h3>

          {/* Instruments */}
          <div>
            <label className="text-xs text-muted-foreground font-medium tracking-wide uppercase mb-2 block">
              Instrumentos / Fontes Sonoras
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {instrumentOptions.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => toggleInstrument(inst.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-[12px] transition-all ${
                    equipment.instruments.includes(inst.id)
                      ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                      : "bg-card/30 border-border/50 text-foreground hover:border-primary/20"
                  }`}
                >
                  <InstrumentIcon type={inst.icon} size={13} />
                  <span className="truncate">{inst.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Monitor Size */}
          <div>
            <label className="text-xs text-muted-foreground font-medium tracking-wide uppercase mb-2 block">
              <Speaker size={13} className="inline mr-1" />
              Monitor de Áudio (Polegadas)
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {monitorSizes.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setEquipment({ ...equipment, monitorSize: m.value })}
                  className={`px-3 py-2 rounded-lg border text-sm font-mono transition-all ${
                    equipment.monitorSize === m.value
                      ? "bg-primary/10 border-primary/40 text-primary font-bold"
                      : "bg-card/30 border-border/50 text-foreground hover:border-primary/20"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {equipment.monitorSize && (
              <p className="text-[9px] text-muted-foreground mt-1 font-mono">
                Extensão: ~{monitorSizes.find(m => m.value === equipment.monitorSize)?.lowExtension}Hz
              </p>
            )}
          </div>

          {/* Subwoofer */}
          <div>
            <label className="text-xs text-muted-foreground font-medium tracking-wide uppercase mb-2 block">
              <Volume1 size={13} className="inline mr-1" />
              Subwoofer
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setEquipment({ ...equipment, hasSub: false, subSize: "" })}
                className={`flex-1 p-2 rounded-lg border text-sm text-center transition-all ${
                  !equipment.hasSub
                    ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                    : "bg-card/30 border-border/50 text-foreground"
                }`}
              >
                Sem Sub
              </button>
              <button
                onClick={() => setEquipment({ ...equipment, hasSub: true, subSize: "10" })}
                className={`flex-1 p-2 rounded-lg border text-sm text-center transition-all ${
                  equipment.hasSub
                    ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                    : "bg-card/30 border-border/50 text-foreground"
                }`}
              >
                Com Sub
              </button>
            </div>
            {equipment.hasSub && (
              <div className="mt-2 flex gap-1.5">
                {["8", "10", "12", "15", "18"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setEquipment({ ...equipment, subSize: s })}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                      equipment.subSize === s
                        ? "bg-accent/15 border-accent/40 text-accent font-bold"
                        : "bg-card/30 border-border/50 text-foreground"
                    }`}
                  >
                    {s}"
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
