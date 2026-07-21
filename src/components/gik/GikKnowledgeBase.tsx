import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { educationalArticles } from "@/data/educationalArticles";
import imgGrande from "@/assets/gallery/estudio-paineis.webp";
import imgA from "@/assets/gallery/paineis-sala-reuniao.webp";
import imgB from "@/assets/gallery/nuvem-acustica.webp";

const fallbackImages = [imgGrande, imgA, imgB];

const GikKnowledgeBase = () => {
  const articles = educationalArticles.slice(0, 3);
  const [featured, ...secondary] = articles;

  return (
    <section className="bg-[#FDFEFE] py-[72px]">
      <div className="max-w-7xl mx-auto px-12">
        <p className="font-['Lexend'] text-[13px] text-[#193139] mb-2">A Ciência do Som</p>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-['Lexend_Giga'] font-bold text-[30px] text-[#0B0E11]">
              Base de Conhecimento Acústico
            </h2>
            <p className="font-['Lexend'] text-[15px] text-[#0B0E11]/70 mt-2 max-w-xl">
              Entenda o impacto do som em ambientes fechados e o papel do tratamento acústico na melhoria da acústica.
            </p>
          </div>
          <Link
            to={`/aprender/${featured?.slug ?? ""}`}
            className="hidden md:inline-flex items-center gap-2 border border-[#0B0E11] rounded-full px-6 py-3 font-['Lexend'] text-[13px] hover:bg-[#0B0E11] hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Ver tudo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featured && (
            <Link to={`/aprender/${featured.slug}`} className="group relative rounded-2xl overflow-hidden min-h-[480px] block cursor-pointer">
              <img src={fallbackImages[0]} alt={featured.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <span className="inline-block bg-white/15 backdrop-blur text-white font-['Lexend'] text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                  Teoria Acústica
                </span>
                <h3 className="font-['Lexend_Giga'] font-semibold text-[24px] text-white leading-snug mb-3">
                  {featured.title}
                </h3>
                <p className="font-['Lexend'] text-[14px] text-white/80 line-clamp-2 mb-4">{featured.subtitle}</p>
                <span className="font-['Lexend'] text-[13px] text-white underline underline-offset-4">Leia mais</span>
              </div>
            </Link>
          )}

          <div className="flex flex-col gap-8">
            {secondary.map((article, i) => (
              <Link key={article.slug} to={`/aprender/${article.slug}`} className="group flex gap-6 items-stretch cursor-pointer">
                <div className="relative w-[45%] shrink-0 rounded-2xl overflow-hidden">
                  <img src={fallbackImages[i + 1]} alt={article.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="py-2">
                  <span className="inline-block bg-[#193139]/10 text-[#193139] font-['Lexend'] text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                    Estratégias de Tratamento
                  </span>
                  <h3 className="font-['Lexend_Giga'] font-semibold text-[17px] text-[#0B0E11] leading-snug mb-2 group-hover:underline underline-offset-4">
                    {article.title}
                  </h3>
                  <p className="font-['Lexend'] text-[13px] text-[#0B0E11]/70 line-clamp-3 mb-3">{article.desc}</p>
                  <span className="font-['Lexend'] text-[13px] text-[#0B0E11] underline underline-offset-4">Leia mais</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GikKnowledgeBase;
