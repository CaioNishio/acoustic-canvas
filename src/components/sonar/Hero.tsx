import { useEffect, useRef } from "react";
import { SonarButton } from "./Button";
import heroImage from "@/assets/products/nuvem-acustica-snr3250/IMG_1158 - Copia.webp";

/**
 * Hero arquitetônico 40/60.
 *
 * A camada de ondas atravessa o ambiente lentamente. O cursor altera
 * levemente a trajetória e a intensidade — o movimento narra som
 * desorganizado sendo controlado, não decora a tela.
 */
function WaveLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, active: 0 });

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

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = (e.clientX - rect.left) / rect.width;
      pointer.current.y = (e.clientY - rect.top) / rect.height;
      pointer.current.active = 1;
    };
    const onPointerLeave = () => {
      pointer.current.active = 0;
    };
    canvas.parentElement?.addEventListener("pointermove", onPointerMove);
    canvas.parentElement?.addEventListener("pointerleave", onPointerLeave);

    // suavização do alvo do cursor
    let px = 0.5;
    let py = 0.5;
    let pa = 0;

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      px += (pointer.current.x - px) * 0.05;
      py += (pointer.current.y - py) * 0.05;
      pa += (pointer.current.active - pa) * 0.04;

      const lines = 7;
      for (let i = 0; i < lines; i++) {
        const t = i / (lines - 1);
        const yBase = height * (0.2 + t * 0.62);
        const amplitude = 14 + t * 22;
        const wavelength = 180 + t * 120;
        const phase = frame * 0.004 * (1 + t * 0.35);

        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const nx = x / width;
          // atração local: o cursor puxa a onda e aumenta a amplitude por perto
          const distance = Math.abs(nx - px);
          const influence = Math.exp(-(distance * distance) / 0.012) * pa;
          const y =
            yBase +
            Math.sin(nx * ((width / wavelength) * Math.PI * 2) + phase) * amplitude +
            influence * (py - 0.5) * height * 0.22 +
            influence * Math.sin(nx * 26 - frame * 0.03) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(199, 68%, ${58 + t * 12}%, ${0.26 - t * 0.1})`;
        ctx.lineWidth = 1.2;
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
      canvas.parentElement?.removeEventListener("pointermove", onPointerMove);
      canvas.parentElement?.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export default function Hero() {
  return (
    <section className="relative bg-snr-white">
      <div className="snr-container">
        <div className="grid min-h-[82vh] items-center gap-10 py-16 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-16 lg:py-0">
          {/* 40% — texto */}
          <div className="max-w-[620px]">
            <p className="snr-caption snr-rule-editorial text-snr-mineral-700">
              Acústica arquitetônica de alta performance
            </p>

            <h1 className="snr-display-hero mt-6 text-snr-graphite">
              Cada ambiente com o som sob controle
            </h1>

            <p className="snr-body mt-6 max-w-[46ch] text-snr-mineral-700">
              Diagnóstico, projeto e fabricação própria de painéis, difusores e bass traps sob
              medida — do estúdio ao auditório.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <SonarButton to="/produtos" variant="primary" size="lg">
                Encontre a solução ideal
              </SonarButton>
              <SonarButton to="/contato" variant="secondary" size="lg">
                Fale com um especialista
              </SonarButton>
            </div>
          </div>

          {/* 60% — ambiente com camada de ondas */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-snr-graphite lg:aspect-auto lg:h-[76vh]">
            <img
              src={heroImage}
              alt="Nuvens acústicas suspensas em ambiente corporativo tratado pela Sonar"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-snr-graphite-deep/55 via-snr-graphite/10 to-transparent" />
            <WaveLayer />
          </div>
        </div>
      </div>
    </section>
  );
}
