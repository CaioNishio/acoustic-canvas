import { Link } from "react-router-dom";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "./primitives";
import { SonarButton } from "./Button";
import { products } from "@/data/products";
import { useShopifyCatalogMedia } from "@/hooks/useShopifyCatalogMedia";

/** No máximo quatro selos, conforme o sistema definido. */
const badges: Record<string, string> = {
  "painel-acustico-snr3250": "Mais vendido",
  "bass-trap-corner-3s-snr6430": "Recomendado",
  "difusor-skyline": "Personalizado",
  "nuvem-acustica-snr3250": "Recomendado",
};

const highlighted = [
  "painel-acustico-snr3250",
  "bass-trap-corner-3s-snr6430",
  "difusor-skyline",
  "nuvem-acustica-snr3250",
  "biombo-acustico-retratil",
];

export default function FeaturedProducts() {
  const { imagesFor } = useShopifyCatalogMedia();
  const items = highlighted
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Section id="produtos">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Em destaque</Eyebrow>
          <SectionTitle className="mt-3 max-w-lg">Produtos que resolvem a maioria dos projetos</SectionTitle>
        </div>
        <Lead className="lg:max-w-sm lg:text-right">
          Fabricação sob medida, com mais de 34 cores de tecido acústico certificado.
        </Lead>
      </div>

      {/* 1,2 cartão visível no mobile indica continuidade; 5 por linha no desktop */}
      <div className="-mx-[var(--snr-margin)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--snr-margin)] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {items.map((product, i) => (
          <Reveal key={product.slug} delay={i * 60} className="w-[76vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto">
            <Link
              to={`/produtos/${product.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-snr-mineral-100 bg-snr-white p-4 transition-colors duration-ui ease-snr hover:border-snr-ocean/40"
            >
              <div className="relative overflow-hidden rounded-xl bg-snr-paper">
                {badges[product.slug] && (
                  <span className="snr-caption absolute left-3 top-3 z-10 rounded-full bg-snr-white/90 px-2.5 py-1 text-[10px] text-snr-petrol backdrop-blur-sm">
                    {badges[product.slug]}
                  </span>
                )}
                {/* imagem isolada com área vazia generosa */}
                <img
                  src={imagesFor(product.slug)[0] || product.image}
                  alt={product.name}
                  loading="lazy"
                  className="snr-zoom-media aspect-square w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-3">
                <span className="snr-caption text-snr-mineral-500">{product.category}</span>
                <h3 className="mt-2 font-display text-[15px] font-medium leading-snug text-snr-graphite">
                  {product.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-snr-mineral-700">
                  {product.shortDescription}
                </p>

                <div className="mt-auto pt-4">
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-3 flex items-center gap-1" aria-hidden="true">
                      {product.colors.slice(0, 5).map((color) => (
                        <span
                          key={color.code}
                          className="h-3 w-3 rounded-full border border-snr-mineral-100"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                      {product.colors.length > 5 && (
                        <span className="ml-1 text-[11px] text-snr-mineral-500">
                          +{product.colors.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-[13px] font-medium text-snr-petrol">
                    {product.price ? `A partir de ${product.price}` : "Sob consulta"}
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <SonarButton to="/produtos" variant="secondary">
          Ver catálogo completo
        </SonarButton>
      </div>
    </Section>
  );
}
