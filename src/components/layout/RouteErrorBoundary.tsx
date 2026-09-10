import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

type Props = { children: ReactNode };
type State = { error: Error | null };

/** Evita telas brancas quando uma rota lazy ou integração externa falha. */
export default class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route rendering failed", { error, info });
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-[#061c2a] px-6 py-16 text-white">
        <section className="max-w-xl rounded-[2rem] border border-white/15 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <AlertTriangle className="h-8 w-8 text-[#8fd2ee]" aria-hidden="true" />
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-[#8fd2ee]">Recuperação segura</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Esta área não pôde ser carregada agora.</h1>
          <p className="mt-4 leading-relaxed text-white/70">O restante do site continua disponível. Você pode tentar novamente ou retornar à página inicial enquanto ajustamos a conexão necessária.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => this.setState({ error: null })} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#082a43] transition hover:bg-white/90">
              <RefreshCw size={16} /> Tentar novamente
            </button>
            <a href="/" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              <ArrowLeft size={16} /> Voltar ao início
            </a>
          </div>
        </section>
      </main>
    );
  }
}
