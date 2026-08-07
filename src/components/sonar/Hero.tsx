import { SonarButton } from "./Button";
import heroImage from "@/assets/gallery/hero-capa-site.jpg";
import AcousticCursorField from "./AcousticCursorField";

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
        width={1920}
        height={1080}
      />
      {/* gradiente lateral garante contraste do texto sobre qualquer área da foto */}
      <div className="absolute inset-0 bg-gradient-to-r from-snr-graphite-deep/85 via-snr-graphite-deep/45 to-snr-graphite-deep/10" />

      <AcousticCursorField />
      <div className="relative z-10 flex min-h-[88vh] items-center">
        <div className="snr-container">
          <div className="max-w-[620px]">
            <p className="snr-caption snr-rule-editorial text-snr-white/75">
              Acústica arquitetônica de alta performance
            </p>

            <h1 className="snr-display-hero mt-6 text-snr-white">
              Cada ambiente com o som sob controle
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

      <div className="absolute bottom-8 right-8 z-10 hidden items-end gap-4 border-l border-white/20 pl-5 text-white/70 lg:flex">
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/45">Campo acústico interativo</p>
          <p className="mt-1 text-xs text-white/75">Mova o cursor para modular a onda</p>
        </div>
        <span className="mb-1 block h-2 w-2 rounded-full bg-[hsl(var(--snr-ocean-light))] shadow-[0_0_18px_hsl(var(--snr-ocean-light))]" aria-hidden="true" />
      </div>
    </section>
  );
}
