import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Solucoes from "./pages/Solucoes";
import SolucaoDetalhe from "./pages/SolucaoDetalhe";
import Projetos from "./pages/Projetos";
import ProjetoDetalhe from "./pages/ProjetoDetalhe";
import Calculadora from "./pages/Calculadora";
import Orcamento from "./pages/Orcamento";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
