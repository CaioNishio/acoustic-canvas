import circleCloud from '@/assets/home-product-showcase/01-nuvem-circle-cnr3280.webp';
import albusScreen from '@/assets/home-product-showcase/02-biombo-unico-albus-snr3264.webp';
import retractableScreen from '@/assets/home-product-showcase/03-biombo-retratil-snr6450.webp';
import acousticKit from '@/assets/home-product-showcase/04-kit-acustico-completo.webp';
import cloudPair from '@/assets/home-product-showcase/05-nuvem-snr3250-cloud.webp';
import './materials-showcase.css';

const products = [
  {
    name: 'Nuvem Circle CNR3280',
    description: 'Elemento suspenso circular para absorção sonora com presença arquitetônica leve.',
    image: circleCloud,
    alt: 'Nuvem acústica circular CNR3280 suspensa no teto',
  },
  {
    name: 'Biombo Único Albus SNR32/64',
    description: 'Divisória acústica móvel de acabamento claro para organizar espaços com conforto.',
    image: albusScreen,
    alt: 'Biombo acústico único Albus SNR32/64 em ambiente corporativo',
  },
  {
    name: 'Biombo Retrátil SNR6450',
    description: 'Composição articulada que cria separações adaptáveis e melhora o controle sonoro.',
    image: retractableScreen,
    alt: 'Biombo acústico retrátil SNR6450 com três módulos',
  },
  {
    name: 'Kit Acústico Completo',
    description: 'Conjunto com quatro painéis, duas nuvens e dois bass traps para tratamento integrado.',
    image: acousticKit,
    alt: 'Kit acústico com quatro painéis, duas nuvens e dois bass traps',
  },
  {
    name: 'Nuvem SNR3250 Cloud',
    description: 'Dupla de nuvens retangulares suspensas para reduzir reflexões e preservar a clareza.',
    image: cloudPair,
    alt: 'Duas nuvens acústicas retangulares SNR3250 Cloud suspensas',
  },
] as const;

export default function MaterialsShowcase() {
  return (
    <section className="materials-showcase" aria-labelledby="materials-showcase-title">
      <div className="materials-showcase__glow" aria-hidden="true" />
      <div className="materials-showcase__inner">
        <header className="materials-showcase__heading">
          <p>Soluções em destaque</p>
          <h2 id="materials-showcase-title">Produtos que <span>moldam o som.</span></h2>
          <p>Uma seleção de soluções para teto, parede e divisão de ambientes, combinando desempenho acústico, flexibilidade e integração arquitetônica.</p>
        </header>

        <div className="materials-showcase__grid">
          {products.map((product, index) => (
            <article className="materials-showcase__card" key={product.name}>
              <img src={product.image} alt={product.alt} loading="lazy" decoding="async" />
              <div className="materials-showcase__overlay" aria-hidden="true" />
              <div className="materials-showcase__copy">
                <small>{String(index + 1).padStart(2, '0')}</small>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
