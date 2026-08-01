import { SonarButton } from "./Button";
import heroImage from "@/assets/gallery/hero-capa-site.jpg";

/**
 * Hero de abertura: uma única imagem grande, em largura total,
 * com o bloco de texto sobreposto à esquerda.
 */
export default function Hero() {
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden bg-snr-graphite">
      <img
        src={heroImage}
        alt="Ambiente tratado com painéis acústicos Sonar"
        className="absolute inset-0 h-full w-full object-cover object-[center_50%]"
        fetchPriority="high"
        width={1920}
        height={1080}
      />
      {/* gradiente lateral garante contraste do texto sobre qualquer área da foto */}
      <div className="absolute inset-0 bg-gradient-to-r from-snr-graphite-deep/85 via-snr-graphite-deep/45 to-snr-graphite-deep/10" />

      <div className="relative z-10 flex min-h-[88vh] items-center">
        <div className="snr-container">
          <div className="max-w-[620px]">
            <p className="snr-caption snr-rule-editorial text-snr-white/75">
              Acústica arquitetônica de alta performance
            </p>

            <h1 className="snr-display-hero mt-6 text-snr-white">
              Forma, função e comportamento sonoro em equilíbrio.
            </h1>

            <p className="snr-body mt-6 max-w-[48ch] text-snr-white/80">
              Diagnóstico, projeto e fabricação própria de painéis, difusores e bass traps sob
              medida — do estúdio ao auditório.
            </p>

            <div className="snr-on-dark mt-10 flex flex-wrap items-center gap-4">
              <SonarButton to="/produtos" variant="primary" size="lg">
                Encontre a solução ideal
              </SonarButton>
              <SonarButton to="/contato" variant="onDark" size="lg">
                Fale com um especialista
              </SonarButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
