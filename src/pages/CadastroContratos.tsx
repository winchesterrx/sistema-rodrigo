
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PageContainer from "@/components/PageContainer";
import FormActions from "@/components/FormActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";

import ContratoForm, { contratoFormSchema, ContratoFormValues } from "@/components/contratos/ContratoForm";
import TabelaEntidades, { Entidade } from "@/components/contratos/TabelaEntidades";
import TabelaSistemas, { Sistema } from "@/components/contratos/TabelaSistemas";
import TabelaAditivos, { Aditivo } from "@/components/contratos/TabelaAditivos";
import TabelaDocumentos, { Documento } from "@/components/contratos/TabelaDocumentos";

// Mock data for testing
const MOCK_ENTIDADES: Entidade[] = [
  { id: 1, nome: "Prefeitura Municipal", cnpj: "12.345.678/0001-00", tipo: "Prefeitura" },
  { id: 2, nome: "Câmara Municipal", cnpj: "98.765.432/0001-00", tipo: "Câmara" },
  { id: 3, nome: "Secretaria de Educação", cnpj: "11.222.333/0001-00", tipo: "Secretaria" },
];

const MOCK_SISTEMAS: Sistema[] = [
  { id: 1, sigla: "SIAFIC", nome: "Sistema de Administração Financeira", valor: 10000, implantado: "Sim", dataImplantacao: "2023-01-15", status: "Ativo" },
  { id: 2, sigla: "RH", nome: "Sistema de Recursos Humanos", valor: 8000, implantado: "Sim", dataImplantacao: "2023-02-20", status: "Ativo" },
  { id: 3, sigla: "TRIBUTOS", nome: "Sistema de Gestão Tributária", valor: 12000, implantado: "Não", dataImplantacao: null, status: "Inativo" },
];

const MOCK_ADITIVOS: Aditivo[] = [
  { id: 1, numero: "001/2023", dataInscricao: "2023-06-10", dataAssinatura: "2023-06-15", dataInicioVigencia: "2023-07-01", dataFimVigencia: "2024-06-30", tipo: "Prorrogação", indiceCorrecao: "IPCA", valorComplemento: "5000" },
  { id: 2, numero: "002/2023", dataInscricao: "2023-11-10", dataAssinatura: "2023-11-20", dataInicioVigencia: "2023-12-01", dataFimVigencia: "2024-06-30", tipo: "Reajuste", indiceCorrecao: "IGPM", valorComplemento: "3000" },
];

const MOCK_DOCUMENTOS: Documento[] = [
  { id: 1, data: "2023-05-15", historico: "Contrato Original Assinado", nomeArquivo: "contrato_original.pdf", tipoArquivo: "application/pdf", tamanhoArquivo: 1024 },
  { id: 2, data: "2023-07-10", historico: "Termo de Referência", nomeArquivo: "termo_referencia.docx", tipoArquivo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", tamanhoArquivo: 512 },
];

const CadastroContratos = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState("entidades");
  const [entidades, setEntidades] = useState(MOCK_ENTIDADES);
  const [sistemas, setSistemas] = useState(MOCK_SISTEMAS);
  const [aditivos, setAditivos] = useState(MOCK_ADITIVOS);
  const [documentos, setDocumentos] = useState(MOCK_DOCUMENTOS);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<ContratoFormValues>({
    resolver: zodResolver(contratoFormSchema),
    defaultValues: {
      sequencial: "00001",  // Auto-generated
      situacao: "Ativo",
      tipoContrato: "",
      municipio: "",
      codigoIBGE: "",
      qtdeHabitantes: "",
      numeroContrato: "",
      anoContrato: new Date().getFullYear().toString(),
      modalidadeLicitacao: "",
      numeroProcessoLicitatorio: "",
      valorContrato: "",
      responsavel: "",
      nomeResponsavelContratante: "",
      telefoneFixo: "",
      telefoneCelular: "",
    }
  });

  // Handler for form submission
  const onSubmit = async (data: ContratoFormValues) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Form data submitted:", data);
    setIsSaving(false);
    setIsEditing(false);
    toast.success("Registro gravado com sucesso!");
  };

  // Handlers for CRUD operations
  const handleIncluir = () => {
    if (isEditing) {
      form.handleSubmit(onSubmit)();
    } else {
      setIsEditing(true);
      form.reset();
    }
  };

  const handleAlterar = () => {
    setIsEditing(true);
  };

  const handleExcluir = () => {
    toast.success("Registro excluído com sucesso!");
  };

  const handlePesquisar = () => {
    toast("Funcionalidade de pesquisa em desenvolvimento");
  };

  const handleImprimir = () => {
    toast("Funcionalidade de impressão em desenvolvimento");
  };

  const handleCancelar = () => {
    setIsEditing(false);
    form.reset();
  };

  // UI component for the main form
  return (
    <PageContainer title="Cadastro de Contratos">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Main contract form section */}
            <ContratoForm form={form} isEditing={isEditing} />

            {/* Tabs for the related information */}
            <Tabs 
              defaultValue="entidades" 
              value={selectedTab} 
              onValueChange={setSelectedTab}
              className="mt-6"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="entidades">Entidades Vinculadas</TabsTrigger>
                <TabsTrigger value="sistemas">Sistemas Licitados</TabsTrigger>
                <TabsTrigger value="aditivos">Controle de Aditamentos</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>
              
              {/* Tab 1: Entidades */}
              <TabsContent value="entidades">
                <TabelaEntidades entidades={entidades} isEditing={isEditing} />
              </TabsContent>
              
              {/* Tab 2: Sistemas */}
              <TabsContent value="sistemas">
                <TabelaSistemas sistemas={sistemas} isEditing={isEditing} />
              </TabsContent>
              
              {/* Tab 3: Aditivos */}
              <TabsContent value="aditivos">
                <TabelaAditivos aditivos={aditivos} isEditing={isEditing} />
              </TabsContent>
              
              {/* Tab 4: Documentos */}
              <TabsContent value="documentos">
                <TabelaDocumentos documentos={documentos} isEditing={isEditing} />
              </TabsContent>
            </Tabs>

            {/* Form action buttons */}
            <FormActions
              onIncluir={handleIncluir}
              onAlterar={handleAlterar}
              onExcluir={handleExcluir}
              onPesquisar={handlePesquisar}
              onImprimir={handleImprimir}
              onCancelar={handleCancelar}
              isEditing={isEditing}
              isSaving={isSaving}
            />
          </div>
        </form>
      </Form>
    </PageContainer>
  );
};

export default CadastroContratos;
