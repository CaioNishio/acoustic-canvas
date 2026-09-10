import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

const TAU = Math.PI * 2;

/**
 * Campo acústico decorativo do hero.
 * Usa Canvas 2D (sem dependências extras), pausa fora da viewport e respeita
 * prefers-reduced-motion. O DPR é limitado para preservar a GPU em notebooks.
 */
export default function AcousticCursorField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const pointer: Point = { x: 0, y: 0 };
    const target: Point = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let pointerInside = false;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!pointer.x && !pointer.y) {
        pointer.x = target.x = width * 0.76;
        pointer.y = target.y = height * 0.5;
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      const energy = pointerInside ? 1 : 0.54;
      const radiusStep = Math.max(54, Math.min(width, height) * 0.095);
      context.save();
      context.globalCompositeOperation = "screen";

      for (let ring = 1; ring <= 5; ring += 1) {
        const radius = radiusStep * ring + Math.sin(time * 0.9 + ring) * 5;
        const points = 96;
        context.beginPath();

        for (let index = 0; index <= points; index += 1) {
          const angle = (index / points) * TAU;
          const wave = Math.sin(angle * 6 - time * 2.2 + ring * 0.8) * (3 + ring * 0.65);
          const x = pointer.x + Math.cos(angle) * (radius + wave);
          const y = pointer.y + Math.sin(angle) * (radius + wave) * 0.62;
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.strokeStyle = `rgba(112, 205, 235, ${Math.max(0.025, (0.17 - ring * 0.023) * energy)})`;
        context.lineWidth = ring === 1 ? 1.4 : 0.8;
        context.stroke();
      }

      const gradient = context.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        radiusStep * 2.8,
      );
      gradient.addColorStop(0, `rgba(67, 174, 212, ${0.12 * energy})`);
      gradient.addColorStop(0.42, `rgba(67, 174, 212, ${0.045 * energy})`);
      gradient.addColorStop(1, "rgba(67, 174, 212, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(pointer.x, pointer.y, radiusStep * 2.8, 0, TAU);
      context.fill();
      context.restore();
    };

    const animate = () => {
      if (!visible) return;
      pointer.x += (target.x - pointer.x) * 0.075;
      pointer.y += (target.y - pointer.y) * 0.075;
      time += 0.016;
      draw();
      frame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      window.cancelAnimationFrame(frame);
      if (reducedMotion.matches) draw();
      else frame = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!pointerInside || coarsePointer.matches || reducedMotion.matches) return;
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      pointerInside = false;
      target.x = width * 0.76;
      target.y = height * 0.5;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion.matches) draw();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else window.cancelAnimationFrame(frame);
    });

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    reducedMotion.addEventListener("change", start);
    resize();
    start();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full opacity-80 mix-blend-screen"
    />
  );
}
