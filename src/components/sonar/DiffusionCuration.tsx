import reference from '@/assets/home-reference/diffusion-curation-reference.png';
import './diffusion-curation.css';


/** Additive editorial section. The supplied artwork is not regenerated or distorted. */
export default function DiffusionCuration() {
  return <section className="diffusion-curation" aria-labelledby="diffusion-title">
    <div className="diffusion-curation__inner">
      <div className="diffusion-curation__panorama" aria-hidden="true">
        <img src={reference} alt="" loading="lazy" decoding="async" />
      </div>
      <header className="diffusion-curation__heading">
        <p className="diffusion-curation__eyebrow">Curadoria de difusão</p>
        <h2 id="diffusion-title">Estruturas de difusão sonora, que preservam a clareza e a definição, <span>suavizando reflexões</span></h2>
        <p>Texturas, relevos e geometrias que distribuem o som com inteligência — transformando técnica em presença, profundidade e equilíbrio.</p>
      </header>
      <aside className="diffusion-curation__note">
        <p className="diffusion-curation__eyebrow">Presença. Profundidade. Difusão</p>
        <p>Uma seleção de difusores pensada para transformar superfícies em experiência acústica com clareza, caráter e sofisticação.</p>
      </aside>
    </div>
  </section>;
}
