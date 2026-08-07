import { useEffect, useRef, useState } from "react";
import { Eyebrow, Lead, Section, SectionTitle } from "./primitives";

const steps = [
  { n: "01", title: "Diagnóstico", text: "Entendemos o uso do espaço e o sintoma acústico relatado." },
  { n: "02", title: "Análise", text: "Medição de RT60, modos de sala e pontos críticos de reflexão." },
  { n: "03", title: "Especificação", text: "Definição de produtos, quantidades e posicionamento." },
  { n: "04", title: "Fabricação", text: "Produção sob medida com controle de densidade e acabamento." },
  { n: "05", title: "Instalação", text: "Montagem, conferência do resultado e acompanhamento." },
];

export default function ProcessLine() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // avança de 0 a 1 enquanto a seção cruza a viewport
      const raw = (vh * 0.85 - rect.top) / (rect.height + vh * 0.35);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const reached = Math.round(progress * steps.length);

  return (
    <Section id="processo">
      <div className="mb-12 max-w-2xl">
        <Eyebrow>Como trabalhamos</Eyebrow>
        <SectionTitle className="mt-3">Cinco etapas, do sintoma ao resultado medido</SectionTitle>
        <Lead className="mt-5">
          Um processo definido reduz incerteza — você sabe o que acontece em cada momento do projeto.
        </Lead>
      </div>

      <div ref={ref}>
        {/* linha de progresso atravessando a seção */}
        <div className="relative mb-8 hidden h-px bg-snr-mineral-100 lg:block">
          <span
            className="absolute inset-y-0 left-0 block bg-snr-ocean transition-[width] duration-narrative ease-snr"
            style={{ width: `${progress * 100}%` }}
          />
          {steps.map((_, i) => (
            <span
              key={i}
              className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-ui ease-snr"
              style={{
                left: `${(i / (steps.length - 1)) * 100}%`,
                backgroundColor:
                  i < reached ? "hsl(var(--snr-ocean))" : "hsl(var(--snr-mineral-300))",
              }}
              aria-hidden="true"
            />
          ))}
        </div>

        <ol className="grid gap-8 border-l border-snr-mineral-100 pl-6 lg:grid-cols-5 lg:border-l-0 lg:pl-0">
          {steps.map((step, i) => (
            <li
              key={step.n}
              className="transition-opacity duration-narrative ease-snr"
            >
              <span className="snr-caption text-snr-ocean">{step.n}</span>
              <h3 className="snr-card-title mt-2 text-snr-graphite">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-snr-mineral-700">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
