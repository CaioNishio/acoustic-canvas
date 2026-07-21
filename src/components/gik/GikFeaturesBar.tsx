import { Cpu, Leaf, Award } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Tecnologia de Ponta",
    text: "Painéis projetados com medição acústica real e engenharia própria. Cada produto nasce de dados, não de suposições.",
  },
  {
    icon: Leaf,
    title: "Materiais Eco-Eficientes",
    text: "Madeiras certificadas e tecidos de baixo impacto ambiental. Desempenho acústico premium sem abrir mão da sustentabilidade.",
  },
  {
    icon: Award,
    title: "Produtos Premiados",
    text: "Reconhecidos por estúdios e profissionais em todo o Brasil. Qualidade comprovada em centenas de projetos entregues.",
  },
];

const GikFeaturesBar = () => {
  return (
    <section className="bg-[#FDFEFE] py-16 text-[#0B0E11]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-12 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center text-center">
            <feature.icon className="mb-5 h-8 w-8 text-[#193139]" strokeWidth={1.5} />
            <h4 className="mb-3 font-['Lexend_Giga'] text-lg font-semibold text-[#193139]">
              {feature.title}
            </h4>
            <p className="max-w-xs font-['Lexend'] text-sm leading-relaxed text-[#0B0E11]/80">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GikFeaturesBar;
