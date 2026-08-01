import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QuoteCartProvider } from "@/contexts/QuoteCartContext";
import type { ReactElement } from "react";

/**
 * Smoke test das paginas publicas.
 *
 * Nao valida layout — valida que a pagina MONTA. Erro de runtime numa pagina
 * (import quebrado, campo inexistente, hook mal usado) so aparecia em
 * producao, porque build e typecheck nao executam o componente. Aqui cada
 * rota e renderizada de verdade contra os dados reais do catalogo.
 */

// A Storefront API e o Supabase nao devem ser chamados num teste: sem os
// mocks, qualquer pagina que os toque falharia por rede, escondendo o que
// este teste quer medir.
vi.mock("@/lib/shopify", async () => {
  const actual = await vi.importActual<typeof import("@/lib/shopify")>("@/lib/shopify");
  return { ...actual, storefrontApiRequest: vi.fn().mockResolvedValue({ data: { product: null } }) };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      select: () => ({ eq: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }) }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: { from: () => ({ upload: () => Promise.resolve({ error: null }) }) },
  },
}));

beforeAll(() => {
  // jsdom nao implementa nenhum dos dois; varias secoes da home usam
  // IntersectionObserver para a revelacao por scroll.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  window.scrollTo = () => {};
});

afterEach(cleanup);

function renderRoute(path: string, element: ReactElement, routePattern = path) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  // Mesma árvore de providers que App.tsx monta em produção.
  return render(
    <QueryClientProvider client={client}>
      <QuoteCartProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path={routePattern} element={element} />
          </Routes>
        </MemoryRouter>
      </QuoteCartProvider>
    </QueryClientProvider>,
  );
}

describe("páginas montam sem erro de runtime", () => {
  it("Home", async () => {
    const { default: Index } = await import("@/pages/Index");
    renderRoute("/", <Index />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("Ambientes (listagem)", async () => {
    const { default: Solucoes } = await import("@/pages/Solucoes");
    renderRoute("/solucoes", <Solucoes />);
    expect(screen.getByRole("heading", { name: /soluções por ambiente/i })).toBeInTheDocument();
  });

  it("Ambiente (detalhe)", async () => {
    const { default: SolucaoDetalhe } = await import("@/pages/SolucaoDetalhe");
    renderRoute("/solucoes/estudios", <SolucaoDetalhe />, "/solucoes/:slug");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("Projetos", async () => {
    const { default: Projetos } = await import("@/pages/Projetos");
    renderRoute("/projetos", <Projetos />);
    expect(screen.getByRole("heading", { name: /nossos projetos/i })).toBeInTheDocument();
  });

  it("Contato", async () => {
    const { default: Contato } = await import("@/pages/Contato");
    renderRoute("/contato", <Contato />);
    expect(screen.getByRole("button", { name: /enviar mensagem/i })).toBeInTheDocument();
  });

  it("Orçamento", async () => {
    const { default: Orcamento } = await import("@/pages/Orcamento");
    renderRoute("/orcamento", <Orcamento />);
    expect(screen.getByRole("heading", { name: /solicitar orçamento/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /próximo/i })).toBeInTheDocument();
  });

  it("Produto (detalhe)", async () => {
    const { default: ProdutoDetalhe } = await import("@/pages/ProdutoDetalhe");
    renderRoute("/produtos/difusor-skyline", <ProdutoDetalhe />, "/produtos/:slug");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
