import { Link } from "react-router-dom";
import expertImg from "@/assets/gallery/escritorio-paineis.webp";
import designerImg from "@/assets/gallery/estudio-paineis.webp";

interface PlanCard {
  image: string;
  alt: string;
  title: string;
  text: string;
  cta: string;
  to: string;
}

const cards: PlanCard[] = [
  {
    image: expertImg,
    alt: "Escritório com painéis acústicos instalados",
    title: "Fale com um Especialista",
    text: "Receba uma consultoria acústica gratuita com nossa equipe técnica. Analisamos o seu ambiente, identificamos os problemas de reverberação e indicamos exatamente quais produtos usar — e onde instalar.",
    cta: "Pedir Consultoria Grátis",
    to: "/contato",
  },
  {
    image: designerImg,
    alt: "Estúdio com painéis acústicos posicionados",
    title: "Projeto 3D do Ambiente",
    text: "Visualize o resultado antes de comprar. Criamos a modelagem 3D da sua sala com o posicionamento otimizado dos painéis, calculado para máxima performance acústica no seu espaço.",
    cta: "Projetar Minha Sala",
    to: "/calculadora",
  },
];

const GikPlanYourSpace = () => {
  return (
    <section className="bg-[rgb(253,254,254)] py-[92px] font-['Lexend']">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-12 flex flex-col items-center gap-4 text-center lg:gap-6">
          <h2 className="font-['Lexend_Giga'] text-2xl font-bold leading-tight text-[rgb(11,14,17)] md:text-[29.7px]">
            Planeje Seu Espaço Como um Profissional
          </h2>
          <p className="max-w-2xl text-base font-normal leading-relaxed text-[rgb(11,14,17)]/70">
            Do diagnóstico ao projeto final, a Sonar acompanha cada etapa do
            tratamento acústico do seu ambiente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col overflow-hidden rounded-[22px] bg-[rgb(243,246,246)]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col items-start gap-4 p-8 lg:p-10">
                <h3 className="text-xl font-semibold leading-snug text-[rgb(25,49,57)]">
                  {card.title}
                </h3>
                <p className="text-base font-normal leading-relaxed text-[rgb(11,14,17)]/75">
                  {card.text}
                </p>
                <Link
                  to={card.to}
                  className="mt-auto inline-flex items-center justify-center rounded-full border border-[rgb(11,14,17)] px-8 py-3 text-sm font-semibold tracking-wide text-[rgb(11,14,17)] transition-colors duration-200 hover:bg-[rgb(11,14,17)] hover:text-[rgb(253,254,254)]"
                >
                  {card.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GikPlanYourSpace;
