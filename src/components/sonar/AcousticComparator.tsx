import { useCallback, useEffect, useRef, useState } from "react";
import { Eyebrow, Lead, Section, SectionTitle } from "./primitives";
import roomUntreated from "@/assets/comparador/restaurante-sem-tratamento.png";
import roomTreated from "@/assets/comparador/restaurante-com-tratamento.png";

/**
 * Comparador acústico — assinatura visual da homepage.
 *
 * O mesmo ambiente em dois estados. O lado sem tratamento recebe
 * iluminação mais fria e contraste mais duro; o lado tratado fica mais
 * nítido e confortável. Sobre cada lado, uma camada de ondas: densas e
 * refletidas à esquerda, organizadas e de menor amplitude à direita.
 */

interface Point {
  x: number;
  y: number;
}

/**
 * Traça o caminho de um raio sonoro dentro do ambiente.
 * Em cada parede o ângulo de reflexão espelha o de incidência — é isso
 * que produz o acúmulo de reflexos quando não há absorção.
 */
function traceRay(
  origin: Point,
  angle: number,
  bounces: number,
  w: number,
  h: number,
  /** quando verdadeiro, o teto absorve o raio em vez de refleti-lo —
      é onde os painéis estão instalados na foto tratada */
  absorbCeiling = false,
): Point[] {
  const points: Point[] = [{ ...origin }];
  let dx = Math.cos(angle);
  let dy = Math.sin(angle);
  let cx = origin.x;
  let cy = origin.y;

  for (let b = 0; b <= bounces; b++) {
    let t = Infinity;
    let axis: "x" | "y" | null = null;
    let hitCeiling = false;

    if (dx > 1e-9) { const tt = (w - cx) / dx; if (tt < t) { t = tt; axis = "x"; hitCeiling = false; } }
    else if (dx < -1e-9) { const tt = -cx / dx; if (tt < t) { t = tt; axis = "x"; hitCeiling = false; } }

    if (dy > 1e-9) { const tt = (h - cy) / dy; if (tt < t) { t = tt; axis = "y"; hitCeiling = false; } }
    else if (dy < -1e-9) { const tt = -cy / dy; if (tt < t) { t = tt; axis = "y"; hitCeiling = true; } }

    if (!isFinite(t) || t <= 0) break;

    cx += dx * t;
    cy += dy * t;
    points.push({ x: cx, y: cy });

    // painel absorvente no teto: a energia termina aqui
    if (absorbCeiling && hitCeiling) break;

    if (axis === "x") dx = -dx;
    else dy = -dy;

    // desloca minimamente para dentro para não travar na parede
    cx += dx * 0.02;
    cy += dy * 0.02;
  }

  return points;
}

/** Comprimento acumulado ao longo do caminho, para posicionar o pulso. */
function cumulativeLengths(points: Point[]) {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    lengths.push(lengths[i - 1] + d);
  }
  return lengths;
}

function pointAt(points: Point[], lengths: number[], distance: number): Point | null {
  const total = lengths[lengths.length - 1];
  if (distance < 0 || distance > total) return null;
  for (let i = 1; i < lengths.length; i++) {
    if (distance <= lengths[i]) {
      const seg = lengths[i] - lengths[i - 1];
      const t = seg === 0 ? 0 : (distance - lengths[i - 1]) / seg;
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * t,
      };
    }
  }
  return points[points.length - 1];
}

/**
 * Campo sonoro do comparador — frentes de onda esféricas.
 *
 * O som sai da fonte como anéis que se expandem. Onde a superfície é dura,
 * a reflexão equivale a uma fonte-imagem espelhada além da parede: por isso
 * o lado sem tratamento acumula frentes vindas de várias direções, que se
 * cruzam. Com os painéis no teto, a energia que sobe é absorvida — a frente
 * apenas se afasta e desvanece, sem devolver nada à sala.
 */
interface Emitter {
  x: number;
  y: number;
  /** ordem da reflexão: 0 = fonte real */
  order: number;
}

const WaveFieldRays = ({ treated }: { treated: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let time = 0;
    let rays: { points: Point[]; lengths: number[]; total: number; offset: number }[] = [];
    let source: Point = { x: 0, y: 0 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = rect.width;
      const h = rect.height;
      // fonte na altura das mesas, onde as conversas acontecem
      source = { x: w * 0.34, y: h * 0.6 };

      // Sem painéis o som ricocheteia por toda a sala. Com os painéis no
      // teto, cada raio que sobe termina ali — só o que segue rente ao
      // piso ainda devolve alguma reflexão.
      const bounces = treated ? 2 : 6;
      const count = treated ? 26 : 30;

      rays = [];
      for (let i = 0; i < count; i++) {
        // leque completo, com raios quase paralelos às paredes para
        // evidenciar o flutter echo entre superfícies opostas
        const angle = (i / count) * Math.PI * 2 + (treated ? 0.04 : 0.017);
        const points = traceRay(source, angle, bounces, w, h, treated);
        const lengths = cumulativeLengths(points);
        rays.push({
          points,
          lengths,
          total: lengths[lengths.length - 1],
          offset: (i / count) * 0.9,
        });
      }
    };

    build();
    window.addEventListener("resize", build);

    const hue = treated ? 199 : 18; // azul-oceano controlado / laranja descontrolado
    const speed = treated ? 620 : 780; // px por segundo

    const draw = (now: number) => {
      time = now / 1000;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      ctx.lineCap = "round";

      rays.forEach((ray) => {
        const { points, lengths, total } = ray;
        if (total <= 0) return;

        // 1. rastro do caminho — mostra a geometria das reflexões
        for (let i = 1; i < points.length; i++) {
          const decay = Math.pow(0.62, i - 1); // cada reflexão perde energia
          ctx.beginPath();
          ctx.moveTo(points[i - 1].x, points[i - 1].y);
          ctx.lineTo(points[i].x, points[i].y);
          ctx.strokeStyle = `hsla(${hue}, ${treated ? 70 : 85}%, ${treated ? 62 : 58}%, ${
            (treated ? 0.3 : 0.26) * decay
          })`;
          ctx.lineWidth = treated ? 1.5 : 1.2;
          ctx.stroke();
        }

        // 2. pulso viajando pelo caminho — a energia em movimento
        const cycle = (time * speed + ray.offset * total) % (total * 1.35);
        const head = cycle;
        const tail = Math.max(0, head - (treated ? 130 : 96));

        for (let d = tail; d < head; d += 7) {
          const p = pointAt(points, lengths, d);
          if (!p) continue;
          const along = d / total;
          const fade = 1 - (head - d) / (treated ? 130 : 96);
          // no lado tratado a energia cai rápido ao se aproximar do painel
          const energy = treated ? Math.pow(1 - along, 0.8) : Math.pow(0.78, along * 6);
          const alpha = fade * energy * (treated ? 0.85 : 0.95);
          if (alpha <= 0.02) continue;

          ctx.beginPath();
          ctx.arc(p.x, p.y, treated ? 2.1 : 1.9, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, ${treated ? 78 : 92}%, ${treated ? 66 : 60}%, ${alpha})`;
          ctx.fill();
        }

        // 3. no lado tratado, marca de absorção onde o raio encontra o painel
        if (treated && points.length > 1) {
          const end = points[points.length - 1];
          const arrived = ((time * speed + ray.offset * total) % (total * 1.35)) / total;
          if (arrived > 0.9 && arrived < 1.12) {
            const glow = 1 - Math.abs(arrived - 1) / 0.12;
            ctx.beginPath();
            ctx.arc(end.x, end.y, 9 * glow, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(199, 70%, 62%, ${0.22 * glow})`;
            ctx.fill();
          }
        }
      });

      // 4. fonte sonora pulsando
      const pulse = 0.5 + 0.5 * Math.sin(time * 3.4);
      ctx.beginPath();
      ctx.arc(source.x, source.y, 5 + pulse * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 90%, ${treated ? 70 : 62}%, 0.9)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(source.x, source.y, 12 + pulse * 7, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${0.32 * (1 - pulse)})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
    };
  }, [treated]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
};

/** Frentes de onda esféricas — a representação usada no comparador. */
const WaveField = ({ treated }: { treated: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let emitters: Emitter[] = [];
    let source = { x: 0, y: 0 };
    let W = 0;
    let H = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = rect.width;
      H = rect.height;

      // fonte na altura das mesas, onde as conversas acontecem
      source = { x: W * 0.36, y: H * 0.58 };
      emitters = [{ ...source, order: 0 }];

      if (!treated) {
        // superfícies duras: cada parede devolve uma fonte-imagem
        const first: Emitter[] = [
          { x: -source.x, y: source.y, order: 1 },
          { x: 2 * W - source.x, y: source.y, order: 1 },
          { x: source.x, y: -source.y, order: 1 },
          { x: source.x, y: 2 * H - source.y, order: 1 },
        ];
        // segunda ordem: as reflexões refletem de novo
        const second: Emitter[] = [
          { x: -source.x, y: -source.y, order: 2 },
          { x: 2 * W - source.x, y: -source.y, order: 2 },
          { x: -source.x, y: 2 * H - source.y, order: 2 },
          { x: 2 * W - source.x, y: 2 * H - source.y, order: 2 },
        ];
        emitters.push(...first, ...second);
      } else {
        // painéis no teto absorvem: só o piso ainda devolve algo, e fraco
        emitters.push({ x: source.x, y: 2 * H - source.y, order: 1 });
      }
    };

    build();
    window.addEventListener("resize", build);

    const hue = treated ? 199 : 18;
    const period = treated ? 3.1 : 2.2; // segundos até a frente cruzar a sala
    const rings = treated ? 3 : 7; // sem absorção as frentes se acumulam

    const draw = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";

      const maxR = Math.hypot(W, H) * 1.15;

      for (const em of emitters) {
        // reflexões chegam mais fracas e mais tarde
        const orderFade = em.order === 0 ? 1 : em.order === 1 ? 0.62 : 0.4;
        const base = treated ? 0.3 : 0.5;

        for (let k = 0; k < rings; k++) {
          const age = ((t + (k * period) / rings + em.order * 0.35) % period) / period;
          const r = age * maxR;
          if (r < 6) continue;

          // A frente perde energia ao se espalhar. Sem absorção esse
          // decaimento é lento, então várias frentes coexistem na sala.
          const spread = Math.pow(1 - age, treated ? 1.5 : 0.75);
          const alpha = base * orderFade * spread;
          if (alpha <= 0.012) continue;

          // desenha em segmentos para modular a opacidade ao longo do arco
          const SEG = 46;
          for (let s = 0; s < SEG; s++) {
            const a0 = (s / SEG) * Math.PI * 2;
            const a1 = ((s + 1) / SEG) * Math.PI * 2;
            const mid = (a0 + a1) / 2;

            const px = em.x + Math.cos(mid) * r;
            const py = em.y + Math.sin(mid) * r;
            // fora do ambiente não há o que mostrar
            if (px < -40 || px > W + 40 || py < -40 || py > H + 40) continue;

            let segAlpha = alpha;

            if (treated) {
              // no lado tratado a energia que sobe morre no painel:
              // quanto mais o segmento aponta para cima, mais fraco ele fica
              const upward = -Math.sin(mid); // 1 = subindo
              segAlpha *= 1 - Math.max(0, upward) * 0.82;
              // e some ao se aproximar do teto
              const nearCeiling = 1 - Math.min(1, py / (H * 0.45));
              segAlpha *= 1 - Math.max(0, nearCeiling) * 0.75;
            }

            if (segAlpha <= 0.012) continue;

            ctx.beginPath();
            ctx.arc(em.x, em.y, r, a0, a1);
            ctx.strokeStyle = `hsla(${hue}, ${treated ? 72 : 88}%, ${treated ? 68 : 60}%, ${segAlpha})`;
            ctx.lineWidth = em.order === 0 ? 1.25 : 0.9;
            ctx.stroke();
          }
        }
      }

      // fonte: ponto discreto com um halo suave
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.6);
      ctx.beginPath();
      ctx.arc(source.x, source.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 88%, ${treated ? 74 : 64}%, 0.82)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(source.x, source.y, 8 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 88%, 68%, ${0.24 * (1 - pulse)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
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
          Arraste para comparar. O mesmo salão, na mesma hora: à esquerda o teto exposto devolve
          cada conversa de volta à sala. À direita, os painéis instalados no teto absorvem essa
          energia antes que ela retorne.
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
            src={roomTreated}
            alt="O mesmo restaurante depois, com painéis acústicos instalados no teto"
            className="h-full w-full object-cover"
            style={{ filter: "saturate(1.04) contrast(1.02) brightness(0.78)" }}
          />
          <div className="absolute inset-0 bg-snr-graphite-deep/25" />
          <WaveField treated />
        </div>

        {/* Lado sem tratamento (recortado pela barra) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
        >
          <img
            src={roomUntreated}
            alt="Restaurante antes do tratamento, com o teto exposto e sem painéis"
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.72) contrast(1.18) brightness(0.62) hue-rotate(-8deg)" }}
          />
          <div className="absolute inset-0 bg-snr-graphite-deep/40" />
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
