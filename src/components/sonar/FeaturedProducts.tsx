import { Link } from "react-router-dom";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "./primitives";
import { SonarButton } from "./Button";
import { products } from "@/data/products";
import { useShopifyCatalogMedia } from "@/hooks/useShopifyCatalogMedia";
import ImageBandOverlay from "./ImageBandOverlay";

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
  "painel-acustico-snr3225-slim",
];

export default function FeaturedProducts() {
  const { contentFor, imagesFor } = useShopifyCatalogMedia();
  const items = highlighted
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Section id="produtos">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#0a617d]/15 bg-[radial-gradient(circle_at_9%_0%,rgba(49,184,201,.22),transparent_31%),radial-gradient(circle_at_92%_94%,rgba(7,83,113,.14),transparent_33%),linear-gradient(135deg,#e7f4f7_0%,#fbfdfe_49%,#e8f2f5_100%)] px-5 py-8 shadow-[0_22px_70px_-48px_rgba(4,57,78,.72)] sm:px-8 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="relative mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Catálogo completo</Eyebrow>
          <SectionTitle className="mt-3 max-w-lg">Todos os produtos</SectionTitle>
        </div>
        <Lead className="lg:max-w-sm lg:text-right">
          Fabricação sob medida, com mais de 34 cores de tecido acústico certificado.
        </Lead>
      </div>

      {/* 1,2 cartão visível no mobile indica continuidade; 5 por linha no desktop */}
      <div className="relative -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {items.map((product, i) => {
          const shopify = contentFor(product.slug);
          const displayName = shopify?.title || product.name;
          const displayDescription = shopify?.description || product.shortDescription;
          return (
          <Reveal key={product.slug} delay={i * 60} className="w-[76vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto">
            <Link
              to={`/produtos/${product.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_15px_32px_-28px_rgba(5,58,78,.82)] backdrop-blur-md transition-[border-color,transform,box-shadow] duration-ui ease-snr hover:-translate-y-0.5 hover:border-snr-ocean/40 hover:shadow-[0_22px_40px_-28px_rgba(5,58,78,.82)]"
            >
              <div className="snr-product-cover relative overflow-hidden rounded-xl">
                {badges[product.slug] && (
                  <span className="snr-caption absolute left-3 top-3 z-10 rounded-full bg-snr-white/90 px-2.5 py-1 text-[10px] text-snr-petrol backdrop-blur-sm">
                    {badges[product.slug]}
                  </span>
                )}
                {/* imagem isolada com área vazia generosa */}
                <img
                  src={product.curatedCover ? product.image : imagesFor(product.slug)[0] || product.image}
                  alt={displayName}
                  loading="lazy"
                  className="snr-zoom-media aspect-[4/5] w-full object-contain object-center p-3 sm:aspect-square sm:p-4"
                />
                <ImageBandOverlay tone="dark" />
              </div>

              <div className="flex flex-1 flex-col p-3">
                <span className="snr-caption text-snr-mineral-500">{product.category}</span>
                <h3 className="mt-2 font-display text-[15px] font-medium leading-snug text-snr-graphite">
                  {displayName}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-snr-mineral-700">
                  {displayDescription}
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
          );
        })}
      </div>

      <div className="relative mt-10">
        <SonarButton to="/produtos" variant="secondary">
          Ver catálogo completo
        </SonarButton>
      </div>
      </div>
    </Section>
  );
}
