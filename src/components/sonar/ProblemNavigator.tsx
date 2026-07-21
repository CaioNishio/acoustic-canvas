import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Lead, Section, SectionTitle } from "./primitives";
import { SonarButton } from "./Button";
import ecoImg from "@/assets/gallery/paineis-seminario.jpg";
import falaImg from "@/assets/gallery/sala-aula-baffles.jpeg";
import gravesImg from "@/assets/products/bass-trap-corner-3s-snr6430/IMG_1197.webp";
import ruidoImg from "@/assets/gallery/sala-tratamento-acustico.jpeg";
import privacidadeImg from "@/assets/gallery/escritorio-paineis.webp";
import amplosImg from "@/assets/gallery/forro-industrial.webp";
import musicalImg from "@/assets/gallery/estudio-paineis.webp";

interface Problem {
  id: string;
  label: string;
  diagnosis: string;
  metric: { value: string; label: string };
  solution: string;
  productSlug: string;
  productName: string;
  image: string;
}

const problems: Problem[] = [
  {
    id: "eco",
    label: "Excesso de eco",
    diagnosis:
      "Superfícies rígidas e paralelas devolvem o som com atraso. A voz se sobrepõe a si mesma e o ambiente cansa em minutos.",
    metric: { value: "RT60 > 1,2s", label: "tempo de reverberação típico" },
    solution: "Absorção broadband em paredes e teto",
    productSlug: "painel-acustico-snr3250",
    productName: "Painel Acústico SNR3250",
    image: ecoImg,
  },
  {
    id: "fala",
    label: "Baixa clareza da fala",
    diagnosis:
      "As consoantes se perdem antes de chegar ao ouvinte. Em salas de aula e auditórios, o esforço de escuta derruba a atenção.",
    metric: { value: "STI < 0,60", label: "índice de inteligibilidade" },
    solution: "Baffles suspensos e absorção no plano do teto",
    productSlug: "baffles-acusticos",
    productName: "Baffle Acústico",
    image: falaImg,
  },
  {
    id: "graves",
    label: "Graves descontrolados",
    diagnosis:
      "Ondas longas se acumulam nos cantos e criam picos e vales de pressão. O grave soa arrastado em um ponto e some em outro.",
    metric: { value: "40–250 Hz", label: "faixa dos modos de sala" },
    solution: "Bass traps de canto com lã de alta densidade",
    productSlug: "bass-trap-corner-3s-snr6430",
    productName: "Bass Trap Corner 3S",
    image: gravesImg,
  },
  {
    id: "ruido",
    label: "Ruído externo",
    diagnosis:
      "O problema não está dentro da sala, e sim na passagem do som por paredes, portas e frestas. Absorver não resolve — é preciso massa.",
    metric: { value: "STC 45–65", label: "meta de isolamento" },
    solution: "Sistema massa-mola-massa e vedação perimetral",
    productSlug: "painel-isolamento-d96",
    productName: "Painel Isolante D96",
    image: ruidoImg,
  },
  {
    id: "privacidade",
    label: "Falta de privacidade",
    diagnosis:
      "Em escritórios abertos, conversas viajam entre estações. O incômodo é de confidencialidade antes de ser de conforto.",
    metric: { value: "1,5–4 m", label: "raio de inteligibilidade indesejada" },
    solution: "Divisórias acústicas e absorção entre estações",
    productSlug: "biombo-acustico-cavalete",
    productName: "Biombo Acústico Cavalete",
    image: privacidadeImg,
  },
  {
    id: "amplos",
    label: "Desconforto em ambientes amplos",
    diagnosis:
      "Pé-direito alto e superfícies duras somam reflexões de todas as direções. O ruído de fundo cresce sozinho conforme o espaço enche.",
    metric: { value: "+6 dB", label: "efeito cocktail party" },
    solution: "Nuvens suspensas cobrindo o plano superior",
    productSlug: "nuvem-acustica-snr3250",
    productName: "Nuvem Acústica SNR3250",
    image: amplosImg,
  },
  {
    id: "musical",
    label: "Baixa definição musical",
    diagnosis:
      "As primeiras reflexões chegam junto com o som direto e borram a imagem estéreo. Decisões de mixagem deixam de ser confiáveis.",
    metric: { value: "< 20 ms", label: "janela das reflexões primárias" },
    solution: "Absorção nos pontos de reflexão e difusão ao fundo",
    productSlug: "difusor-skyline",
    productName: "Difusor Skyline",
    image: musicalImg,
  },
];

export default function ProblemNavigator() {
  const [activeId, setActiveId] = useState(problems[0].id);
  const active = problems.find((p) => p.id === activeId) ?? problems[0];

  return (
    <Section tone="dark" id="diagnostico">
      <div className="mb-12 max-w-2xl">
        <Eyebrow className="text-snr-mineral-300">Diagnóstico primeiro</Eyebrow>
        <SectionTitle className="mt-3 text-snr-white">
          Qual problema você está tentando resolver?
        </SectionTitle>
        <Lead className="mt-5 text-snr-mineral-300">
          O produto certo é consequência do diagnóstico correto. Escolha o sintoma que você percebe
          no ambiente e veja o que costuma estar por trás dele.
        </Lead>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
        {/* Menu lateral */}
        <ul className="flex flex-col lg:sticky lg:top-24 lg:self-start">
          {problems.map((problem) => {
            const isActive = problem.id === active.id;
            return (
              <li key={problem.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(problem.id)}
                  aria-pressed={isActive}
                  className={`flex w-full min-h-11 items-center justify-between gap-3 border-l-2 py-3.5 pl-5 pr-2 text-left transition-colors duration-micro ease-snr ${
                    isActive
                      ? "border-snr-ocean text-snr-white"
                      : "border-snr-white/10 text-snr-mineral-300 hover:border-snr-white/40 hover:text-snr-white"
                  }`}
                >
                  <span className="font-display text-[15px] font-medium">{problem.label}</span>
                  <ArrowRight
                    className={`h-4 w-4 shrink-0 transition-all duration-micro ease-snr ${
                      isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                    }`}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Painel de diagnóstico */}
        <div key={active.id} className="animate-fade-in-up">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-snr-graphite-deep">
            <img
              src={active.image}
              alt={`Ambiente com ${active.label.toLowerCase()}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-snr-graphite-deep/80 via-transparent to-transparent" />

            {/* métrica acústica sobreposta */}
            <div className="absolute bottom-5 left-5 rounded-xl border border-snr-white/15 bg-snr-graphite-deep/70 px-5 py-3 backdrop-blur-md">
              <p className="font-display text-xl font-semibold text-snr-white">
                {active.metric.value}
              </p>
              <p className="snr-caption mt-1 text-snr-mineral-300">{active.metric.label}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="snr-caption text-snr-mineral-500">O que está acontecendo</p>
              <p className="snr-body mt-3 text-snr-mineral-300">{active.diagnosis}</p>
            </div>
            <div>
              <p className="snr-caption text-snr-mineral-500">Caminho recomendado</p>
              <p className="snr-body mt-3 text-snr-white">{active.solution}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <SonarButton to={`/produtos/${active.productSlug}`} variant="onDark">
                  Ver {active.productName}
                </SonarButton>
                <SonarButton to="/contato" variant="ghost" className="text-snr-ocean-light">
                  Falar com um especialista
                </SonarButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
