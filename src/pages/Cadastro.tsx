
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import { useAuth } from "@/contexts/AuthContext";

const Cadastro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  return (
    <PageContainer title="Cadastros do Sistema">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Entidades</h2>
          <p className="text-gray-600 mb-6">Cadastro e manutenção de entidades do sistema.</p>
          <Button onClick={() => handleRedirect("/entidades")}>Acessar</Button>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Municípios</h2>
          <p className="text-gray-600 mb-6">Cadastro e manutenção de municípios.</p>
          <Button onClick={() => handleRedirect("/municipios")}>Acessar</Button>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sistemas</h2>
          <p className="text-gray-600 mb-6">Cadastro e manutenção de sistemas.</p>
          <Button onClick={() => handleRedirect("/sistemas")}>Acessar</Button>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Índices de Correção</h2>
          <p className="text-gray-600 mb-6">Cadastro e manutenção de índices de correção.</p>
          <Button onClick={() => handleRedirect("/indices")}>Acessar</Button>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Modalidades de Licitação</h2>
          <p className="text-gray-600 mb-6">Cadastro e manutenção de modalidades de licitação.</p>
          <Button onClick={() => handleRedirect("/modalidades")}>Acessar</Button>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Responsáveis</h2>
          <p className="text-gray-600 mb-6">Cadastro e manutenção de responsáveis.</p>
          <Button onClick={() => handleRedirect("/responsaveis")}>Acessar</Button>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contratos</h2>
          <p className="text-gray-600 mb-6">Cadastro e manutenção de contratos.</p>
          <Button onClick={() => handleRedirect("/contratos")}>Acessar</Button>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuários</h2>
          <p className="text-gray-600 mb-6">Cadastro e manutenção de usuários do sistema.</p>
          <Button onClick={() => handleRedirect("/usuarios")}>Acessar</Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Cadastro;
