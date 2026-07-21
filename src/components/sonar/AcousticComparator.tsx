import { useCallback, useEffect, useRef, useState } from "react";
import { Eyebrow, Lead, Section, SectionTitle } from "./primitives";
import roomPhoto from "@/assets/products/painel-acustico-snr3250/panneaux_acoustiques_noir_gris_podcast - Copia.jpg";

/**
 * Comparador acústico — assinatura visual da homepage.
 *
 * O mesmo ambiente em dois estados. O lado sem tratamento recebe
 * iluminação mais fria e contraste mais duro; o lado tratado fica mais
 * nítido e confortável. Sobre cada lado, uma camada de ondas: densas e
 * refletidas à esquerda, organizadas e de menor amplitude à direita.
 */

const WaveField = ({ treated }: { treated: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Sem tratamento: muitas ondas, amplitudes altas, frequências dissonantes.
    // Tratado: poucas ondas, amplitude baixa, movimento lento e regular.
    const lines = treated ? 4 : 9;
    const speed = treated ? 0.006 : 0.019;

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < lines; i++) {
        const progress = i / lines;
        const amplitude = treated
          ? 8 + progress * 6
          : 20 + progress * 26 + Math.sin(frame * 0.02 + i) * 6;
        const wavelength = treated ? 260 + progress * 60 : 90 + progress * 55;
        const yBase = height * (0.18 + progress * 0.66);
        const phase = frame * speed * (treated ? 1 : 1 + progress * 0.9);

        ctx.beginPath();
        for (let x = 0; x <= width; x += 4) {
          const y =
            yBase +
            Math.sin(x / wavelength + phase) * amplitude +
            // reflexões secundárias só existem no lado sem tratamento
            (treated ? 0 : Math.sin(x / (wavelength * 0.38) - phase * 1.6) * amplitude * 0.45);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = treated
          ? `hsla(199, 68%, 62%, ${0.32 - progress * 0.12})`
          : `hsla(18, 82%, 60%, ${0.34 - progress * 0.14})`;
        ctx.lineWidth = treated ? 1.4 : 1;
        ctx.stroke();
      }

      frame += 1;
      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [treated]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
};

export default function AcousticComparator() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [updateFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 4));
    if (e.key === "Home") setPosition(0);
    if (e.key === "End") setPosition(100);
  };

  return (
    <Section tone="paper" id="comparador">
      <div className="mb-10 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Antes e depois</Eyebrow>
          <SectionTitle className="mt-3 max-w-xl">
            O mesmo ambiente, dois comportamentos sonoros
          </SectionTitle>
        </div>
        <Lead className="lg:max-w-md lg:text-right">
          Arraste para comparar. À esquerda, reflexões se acumulam sem controle. À direita, o
          tratamento organiza a energia sonora e devolve clareza ao ambiente.
        </Lead>
      </div>

      <div
        ref={containerRef}
        className="relative w-full select-none overflow-hidden rounded-2xl bg-snr-graphite"
        style={{ aspectRatio: "16 / 9" }}
        onPointerDown={(e) => {
          draggingRef.current = true;
          updateFromClientX(e.clientX);
        }}
      >
        {/* Lado tratado (base) */}
        <div className="absolute inset-0">
          <img
            src={roomPhoto}
            alt="Ambiente com tratamento acústico Sonar instalado"
            className="h-full w-full object-cover"
            style={{ filter: "saturate(1.04) contrast(1.02) brightness(1.02)" }}
          />
          <div className="absolute inset-0 bg-snr-petrol/10" />
          <WaveField treated />
        </div>

        {/* Lado sem tratamento (recortado pela barra) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
        >
          <img
            src={roomPhoto}
            alt="O mesmo ambiente sem tratamento acústico"
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.72) contrast(1.22) brightness(0.86) hue-rotate(-8deg)" }}
          />
          <div className="absolute inset-0 bg-snr-graphite-deep/25" />
          <WaveField treated={false} />
        </div>

        {/* Rótulos */}
        <span className="snr-caption pointer-events-none absolute left-5 top-5 rounded-full bg-snr-graphite-deep/70 px-3 py-1.5 text-snr-white backdrop-blur-sm">
          Sem tratamento
        </span>
        <span className="snr-caption pointer-events-none absolute right-5 top-5 rounded-full bg-snr-petrol/80 px-3 py-1.5 text-snr-white backdrop-blur-sm">
          Com tratamento
        </span>

        {/* Barra divisória */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-snr-white/90"
          style={{ left: `${position}%`, boxShadow: "0 0 18px hsl(var(--snr-white) / 0.55)" }}
        >
          <button
            type="button"
            role="slider"
            tabIndex={0}
            aria-label="Comparar ambiente com e sem tratamento acústico"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            aria-valuetext={`${Math.round(position)}% sem tratamento`}
            onKeyDown={onKeyDown}
            onPointerDown={(e) => {
              e.stopPropagation();
              draggingRef.current = true;
            }}
            className="pointer-events-auto absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-snr-white/60 bg-snr-white/15 backdrop-blur-md transition-transform duration-micro ease-snr hover:scale-105"
          >
            <span className="flex items-center gap-1 text-snr-white" aria-hidden="true">
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </Section>
  );
}
