interface ImageBandOverlayProps {
  tone?: "light" | "dark";
}

/**
 * Tratamento visual editorial aplicado somente sobre imagens interativas.
 * As faixas não carregam conteúdo e permanecem invisíveis para leitores de tela.
 */
export default function ImageBandOverlay({ tone = "light" }: ImageBandOverlayProps) {
  const divider = tone === "dark" ? "border-snr-graphite/15 bg-snr-graphite/[0.025]" : "border-white/20 bg-white/[0.025]";
  const line = tone === "dark" ? "bg-snr-graphite/70" : "bg-snr-white/85";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-4 opacity-0 transition-opacity duration-ui ease-snr group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className={`-translate-y-3 border-r transition-transform duration-ui ease-snr group-hover:translate-y-0 group-focus-visible:translate-y-0 ${divider}`} />
        <span className={`translate-y-3 border-r transition-transform delay-75 duration-ui ease-snr group-hover:translate-y-0 group-focus-visible:translate-y-0 ${divider}`} />
        <span className={`-translate-y-3 border-r transition-transform delay-100 duration-ui ease-snr group-hover:translate-y-0 group-focus-visible:translate-y-0 ${divider}`} />
        <span className={`translate-y-3 transition-transform delay-150 duration-ui ease-snr group-hover:translate-y-0 group-focus-visible:translate-y-0 ${divider}`} />
      </div>
      <span className={`absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-[0.18] transition-transform duration-ui ease-snr group-hover:scale-x-100 group-focus-visible:scale-x-100 ${line}`} />
    </div>
  );
}
