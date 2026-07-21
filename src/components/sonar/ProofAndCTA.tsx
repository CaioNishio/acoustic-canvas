import { useEffect, useRef, useState } from "react";
import { Eyebrow, Section, SectionTitle } from "./primitives";
import { SonarButton } from "./Button";

const stats = [
  { value: 700, suffix: "+", label: "Projetos entregues" },
  { value: 34, suffix: "+", label: "Cores de tecido acústico" },
  { value: 27, suffix: "", label: "Estados atendidos" },
  { value: 5, suffix: " anos", label: "De fabricação própria" },
];

/** Contagem suave — surge quando a seção entra na viewport. */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // easing de saída suave
          setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <p ref={ref} className="font-display text-4xl font-semibold text-snr-white lg:text-5xl">
      {display}
      {suffix}
    </p>
  );
}

export default function ProofAndCTA() {
  return (
    <Section tone="dark" size="lg" id="contato">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Números */}
        <div className="lg:col-span-5">
          <Eyebrow className="text-snr-mineral-300">Prova</Eyebrow>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <span className="mt-2 block text-[13px] leading-snug text-snr-mineral-300">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Consultoria */}
        <div className="lg:col-span-7 lg:border-l lg:border-snr-white/10 lg:pl-16">
          <Eyebrow className="text-snr-mineral-300">Próximo passo</Eyebrow>
          <SectionTitle className="mt-3 max-w-xl text-snr-white">
            Descreva seu ambiente e receba uma recomendação técnica
          </SectionTitle>
          <p className="snr-body mt-5 max-w-xl text-snr-mineral-300">
            A consultoria inicial é gratuita. Você envia as medidas e o uso do espaço; devolvemos o
            diagnóstico, a especificação sugerida e a estimativa de investimento.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <SonarButton to="/orcamento" variant="onDark" size="lg">
              Pedir consultoria gratuita
            </SonarButton>
            <SonarButton to="/calculadora" variant="ghost" size="lg" className="text-snr-ocean-light">
              Usar a calculadora acústica
            </SonarButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
