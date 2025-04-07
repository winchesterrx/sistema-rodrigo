
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CadastroEntidades from "./pages/CadastroEntidades";
import CadastroMunicipios from "./pages/CadastroMunicipios";
import CadastroSistemas from "./pages/CadastroSistemas";
import CadastroIndices from "./pages/CadastroIndices";
import CadastroModalidades from "./pages/CadastroModalidades";
import CadastroResponsaveis from "./pages/CadastroResponsaveis";
import CadastroUsuarios from "./pages/CadastroUsuarios";
import CadastroContratos from "./pages/CadastroContratos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/entidades" element={<CadastroEntidades />} />
            <Route path="/municipios" element={<CadastroMunicipios />} />
            <Route path="/sistemas" element={<CadastroSistemas />} />
            <Route path="/indices" element={<CadastroIndices />} />
            <Route path="/modalidades" element={<CadastroModalidades />} />
            <Route path="/responsaveis" element={<CadastroResponsaveis />} />
            <Route path="/usuarios" element={<CadastroUsuarios />} />
            <Route path="/contratos" element={<CadastroContratos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
