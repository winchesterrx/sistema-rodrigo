import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart, 
  Building2, 
  Landmark, 
  ListChecks, 
  LogOut, 
  MapPin, 
  Percent, 
  Users, 
  UserCircle,
  BookOpen,
  Home,
  FileText
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset
} from "@/components/ui/sidebar";

// Interface para contagens
interface DashboardCounts {
  entidades: number;
  municipios: number;
  sistemas: number;
  indices: number;
  modalidades: number;
  responsaveis: number;
  contratos: number;
}

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<DashboardCounts>({
    entidades: 0,
    municipios: 0,
    sistemas: 0,
    indices: 0,
    modalidades: 0,
    responsaveis: 0,
    contratos: 0
  });

  // Função para carregar contagens de todas as tabelas
  const loadCounts = () => {
    // Obter dados das tabelas do localStorage
    const entidadesData = JSON.parse(localStorage.getItem("entidades") || "[]");
    const municipiosData = JSON.parse(localStorage.getItem("municipios") || "[]");
    const sistemasData = JSON.parse(localStorage.getItem("sistemas") || "[]");
    const indicesData = JSON.parse(localStorage.getItem("indices") || "[]");
    const modalidadesData = JSON.parse(localStorage.getItem("modalidades") || "[]");
    const responsaveisData = JSON.parse(localStorage.getItem("responsaveis") || "[]");
    const contratosData = JSON.parse(localStorage.getItem("contratos") || "[]");

    // Sequencial - começa com 1 para o primeiro cadastro e incrementa
    const entidades = entidadesData.length > 0 ? 1 + entidadesData.length - 1 : 0;
    const municipios = municipiosData.length > 0 ? 1 + municipiosData.length - 1 : 0;
    const sistemas = sistemasData.length > 0 ? 1 + sistemasData.length - 1 : 0;
    const indices = indicesData.length > 0 ? 1 + indicesData.length - 1 : 0;
    const modalidades = modalidadesData.length > 0 ? 1 + modalidadesData.length - 1 : 0;
    const responsaveis = responsaveisData.length > 0 ? 1 + responsaveisData.length - 1 : 0;
    const contratos = contratosData.length > 0 ? 1 + contratosData.length - 1 : 0;

    // Atualizar o estado com as contagens sequenciais
    setCounts({
      entidades,
      municipios,
      sistemas,
      indices,
      modalidades,
      responsaveis,
      contratos
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      // Carregar contagens quando o componente montar ou quando o usuário autenticar
      loadCounts();
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect via the useEffect
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-blue-50">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <div className="rounded-lg bg-blue-600 p-1">
                <Landmark className="h-6 w-6 text-white" />
              </div>
              <div className="font-semibold text-lg">Sistema Gerencial</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/dashboard")} isActive={true}>
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Cadastros</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/entidades")}>
                    <Building2 />
                    <span>Entidades</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/municipios")}>
                    <MapPin />
                    <span>Municípios</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/sistemas")}>
                    <BookOpen />
                    <span>Sistemas</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/indices")}>
                    <Percent />
                    <span>Índices</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/modalidades")}>
                    <ListChecks />
                    <span>Modalidades</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/responsaveis")}>
                    <Users />
                    <span>Responsáveis</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/contratos")}>
                    <FileText />
                    <span>Contratos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/usuarios")}>
                    <UserCircle />
                    <span>Usuários</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-2">
              <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                <UserCircle className="h-5 w-5 text-blue-600" />
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="w-full mt-2 flex justify-center items-center"
              >
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="p-6">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-blue-700">Dashboard</h1>
              <p className="text-gray-500">Visão geral do sistema</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                    Entidades
                  </CardTitle>
                  <CardDescription>Entidades cadastradas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{counts.entidades}</div>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/entidades")} 
                    className="p-0 h-auto text-blue-600"
                  >
                    Gerenciar Entidades
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                    Municípios
                  </CardTitle>
                  <CardDescription>Municípios cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{counts.municipios}</div>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/municipios")} 
                    className="p-0 h-auto text-blue-600"
                  >
                    Gerenciar Municípios
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                    Sistemas
                  </CardTitle>
                  <CardDescription>Sistemas cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{counts.sistemas}</div>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/sistemas")} 
                    className="p-0 h-auto text-blue-600"
                  >
                    Gerenciar Sistemas
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <Percent className="h-5 w-5 text-blue-500 mr-2" />
                    Índices
                  </CardTitle>
                  <CardDescription>Índices cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{counts.indices}</div>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/indices")} 
                    className="p-0 h-auto text-blue-600"
                  >
                    Gerenciar Índices
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <ListChecks className="h-5 w-5 text-blue-500 mr-2" />
                    Modalidades
                  </CardTitle>
                  <CardDescription>Modalidades cadastradas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{counts.modalidades}</div>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/modalidades")} 
                    className="p-0 h-auto text-blue-600"
                  >
                    Gerenciar Modalidades
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    Responsáveis
                  </CardTitle>
                  <CardDescription>Responsáveis cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{counts.responsaveis}</div>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/responsaveis")} 
                    className="p-0 h-auto text-blue-600"
                  >
                    Gerenciar Responsáveis
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    Contratos
                  </CardTitle>
                  <CardDescription>Contratos cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{counts.contratos}</div>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/contratos")} 
                    className="p-0 h-auto text-blue-600"
                  >
                    Gerenciar Contratos
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Cadastros</CardTitle>
                <CardDescription>Visão geral dos dados no sistema</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ChartContainer
                  config={{
                    entidades: { label: "Entidades", color: "#3b82f6" },
                    municipios: { label: "Municípios", color: "#10b981" },
                    sistemas: { label: "Sistemas", color: "#8b5cf6" },
                    indices: { label: "Índices", color: "#f59e0b" },
                    modalidades: { label: "Modalidades", color: "#ec4899" },
                    responsaveis: { label: "Responsáveis", color: "#6366f1" },
                    contratos: { label: "Contratos", color: "#0ea5e9" }
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center">
                      <BarChart className="h-16 w-16 text-blue-600 mb-4" />
                      <p className="text-gray-500">Estatísticas detalhadas serão implementadas em breve</p>
                    </div>
                  </div>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
