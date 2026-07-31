import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Rola para o topo a cada troca de rota.
 *
 * Sem isto, navegar entre duas paginas do MESMO componente — por exemplo de
 * /produtos/a para /produtos/b pelos "produtos relacionados", que ficam no
 * rodape — mantinha a viewport la embaixo. O conteudo trocava e a animacao
 * reiniciava, mas o usuario continuava vendo a mesma secao: a impressao era de
 * que o card "piscava e nao navegava".
 *
 * Respeita prefers-reduced-motion e nao interfere no botao voltar do navegador,
 * que tem restauracao propria de posicao.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduz = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduz ? "auto" : "smooth" });
  }, [pathname]);

  return null;
}
