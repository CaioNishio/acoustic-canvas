import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuoteCartProvider } from "@/contexts/QuoteCartContext";
import QuoteCartDrawer from "@/components/shared/QuoteCartDrawer";
import { useCartSync } from "@/hooks/useCartSync";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";
import RouteErrorBoundary from "@/components/layout/RouteErrorBoundary";
import RouteSeo from "@/components/layout/RouteSeo";

const Produtos = lazy(() => import("./pages/Produtos"));
const ProdutoDetalhe = lazy(() => import("./pages/ProdutoDetalhe"));
const Solucoes = lazy(() => import("./pages/Solucoes"));
const SolucaoDetalhe = lazy(() => import("./pages/SolucaoDetalhe"));
const Projetos = lazy(() => import("./pages/Projetos"));
const ProjetoDetalhe = lazy(() => import("./pages/ProjetoDetalhe"));
const Calculadora = lazy(() => import("./pages/Calculadora"));
const Orcamento = lazy(() => import("./pages/Orcamento"));
const Contato = lazy(() => import("./pages/Contato"));
const Loja = lazy(() => import("./pages/Loja"));
const LojaDetalhe = lazy(() => import("./pages/LojaDetalhe"));
const EnvioFotos = lazy(() => import("./pages/EnvioFotos"));
const EnvioFotosDetalhe = lazy(() => import("./pages/EnvioFotosDetalhe"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Artigo = lazy(() => import("./pages/Artigo"));
const Conhecimento = lazy(() => import("./pages/Conhecimento"));
const GikHome = lazy(() => import("./pages/GikHome"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function RouteLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#061c2a] px-6 text-white">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#8fd2ee]" aria-hidden="true" />
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-white/60">Preparando a experiência</p>
      </div>
    </main>
  );
}

function AppContent() {
  useCartSync();
  return (
    <Suspense fallback={<RouteLoading />}>
      <ScrollToTop />
      <RouteSeo />
      <RouteErrorBoundary>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/:slug" element={<ProdutoDetalhe />} />
        <Route path="/solucoes" element={<Solucoes />} />
        <Route path="/solucoes/:slug" element={<SolucaoDetalhe />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/projetos/:slug" element={<ProjetoDetalhe />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/orcamento" element={<Orcamento />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/loja/:handle" element={<LojaDetalhe />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/conhecimento" element={<Conhecimento />} />
        <Route path="/aprender/:slug" element={<Artigo />} />
        <Route path="/envio-fotos" element={<EnvioFotos />} />
        <Route path="/envio-fotos/:slug" element={<EnvioFotosDetalhe />} />
        <Route path="/gik-home" element={<GikHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </RouteErrorBoundary>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <QuoteCartProvider>
      <Toaster />
      <Sonner />
      <QuoteCartDrawer />
      {/*
        basename vem do BASE_URL do Vite. Em hospedagem na raiz (Netlify,
        Vercel, dominio proprio) isso e "/" e nada muda. No GitHub Pages o site
        e servido em /acoustic-canvas/, e sem o basename toda rota do React
        Router apontaria para fora do subcaminho.
      */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppContent />
      </BrowserRouter>
    </QuoteCartProvider>
  </QueryClientProvider>
);

export default App;
