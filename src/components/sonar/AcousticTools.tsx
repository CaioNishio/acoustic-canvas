import { Link } from "react-router-dom";
import { ArrowRight, Calculator, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "./primitives";

const tools = [
  {
    number: "01",
    icon: Calculator,
    title: "Calculadora acústica",
    text: "Informe dimensões, tipo de ambiente e finalidade. A ferramenta devolve a área de tratamento necessária e a distribuição sugerida.",
    cta: "Calcular meu ambiente",
    to: "/calculadora",
    /** visualização: barras de RT60 caindo após tratamento */
    preview: (
      <div className="flex h-16 items-end gap-1.5" aria-hidden="true">
        {[86, 72, 60, 44, 34, 28, 24].map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-snr-ocean/25"
            style={{ height: `${h}%`, backgroundColor: i > 3 ? undefined : "hsl(var(--snr-ocean) / 0.55)" }}
          />
        ))}
      </div>
    ),
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Simulador antes e depois",
    text: "Uma previsão visual simplificada do ambiente tratado, para alinhar expectativa antes de qualquer investimento.",
    cta: "Ver comparação",
    to: "/#comparador",
    preview: (
      <div className="relative h-16 overflow-hidden rounded-md bg-snr-graphite/10" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-snr-graphite/20" />
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-snr-ocean" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-snr-ocean/15" />
      </div>
    ),
  },
  {
    number: "03",
    icon: LayoutGrid,
    title: "Recomendador de soluções",
    text: "A partir do problema acústico que você descreve, sugerimos a categoria e a especificação mais adequadas ao caso.",
    cta: "Descobrir a solução",
    to: "/orcamento",
    preview: (
      <div className="flex h-16 items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-8 flex-1 rounded-md border border-snr-ocean/30"
            style={{ backgroundColor: i === 1 ? "hsl(var(--snr-ocean) / 0.18)" : "transparent" }}
          />
        ))}
      </div>
    ),
  },
];

export default function AcousticTools() {
  return (
    <Section tone="wash" id="ferramentas">
      <div className="mb-10 max-w-2xl">
        <Eyebrow>Ferramentas</Eyebrow>
        <SectionTitle className="mt-3">Decida com dado, não com achismo</SectionTitle>
        <Lead className="mt-5">
          Três instrumentos abertos para você dimensionar o tratamento antes mesmo de falar com a
          gente.
        </Lead>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <Reveal key={tool.number} delay={i * 80}>
            <div className="flex h-full flex-col rounded-2xl border border-snr-ocean/12 bg-snr-white p-7">
              <div className="flex items-start justify-between">
                <tool.icon className="h-6 w-6 text-snr-ocean" strokeWidth={1.5} aria-hidden="true" />
                <span className="font-display text-sm font-medium text-snr-mineral-500">{tool.number}</span>
              </div>

              <h3 className="snr-card-title mt-5 text-snr-graphite">{tool.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-snr-mineral-700">{tool.text}</p>

              <div className="mt-6">{tool.preview}</div>

              <Link
                to={tool.to}
                className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium text-snr-petrol transition-colors duration-micro ease-snr hover:text-snr-ocean"
              >
                {tool.cta}
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
