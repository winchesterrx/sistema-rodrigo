
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
}

const PageContainer = ({ title, children }: PageContainerProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">{title}</h1>
          <div className="space-x-2 flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Cadastros <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Cadastros do Sistema</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/entidades")}>
                  Entidades
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/municipios")}>
                  Municípios
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/sistemas")}>
                  Sistemas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/indices")}>
                  Índices de Correção
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/modalidades")}>
                  Modalidades de Licitação
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/responsaveis")}>
                  Responsáveis
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/contratos")}>
                  Contratos
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/usuarios")}>
                    Usuários
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>Dashboard</Button>
            <Button variant="secondary" onClick={() => navigate("/")}>Início</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PageContainer;
