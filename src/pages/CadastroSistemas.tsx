
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Plus, X, Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PageContainer from "@/components/PageContainer";
import FormActions from "@/components/FormActions";

// Definir o tipo de sistema
interface Sistema {
  id: string;
  sigla: string;
  nome: string;
  descricao: string;
  modulos: Modulo[];
}

// Definir o tipo de módulo
interface Modulo {
  id: string;
  nome: string;
  descricao: string;
}

// Schema de validação com Zod para Sistema
const sistemaSchema = z.object({
  sigla: z.string().min(2, "A sigla deve ter pelo menos 2 caracteres"),
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
});

// Schema de validação com Zod para Módulo
const moduloSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
});

type SistemaFormValues = z.infer<typeof sistemaSchema>;
type ModuloFormValues = z.infer<typeof moduloSchema>;

const CadastroSistemas = () => {
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showModulos, setShowModulos] = useState(false);
  const [currentSistema, setCurrentSistema] = useState<Sistema | null>(null);
  const [editingModulo, setEditingModulo] = useState<Modulo | null>(null);
  
  const navigate = useNavigate();
  
  // Formulário principal
  const form = useForm<SistemaFormValues>({
    resolver: zodResolver(sistemaSchema),
    defaultValues: {
      sigla: "",
      nome: "",
      descricao: "",
    },
  });
  
  // Formulário de módulo
  const moduloForm = useForm<ModuloFormValues>({
    resolver: zodResolver(moduloSchema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
  });
  
  // Verificar sigla duplicada
  const isSiglaDuplicada = (sigla: string, excludeId?: string): boolean => {
    return sistemas.some(sistema => 
      sistema.sigla.toLowerCase() === sigla.toLowerCase() && 
      sistema.id !== excludeId
    );
  };
  
  // Manipulador para inclusão e alteração de sistema
  const onSubmit = (data: SistemaFormValues) => {
    if (isEditing && editingId) {
      // Modo de edição
      if (isSiglaDuplicada(data.sigla, editingId)) {
        toast({
          title: "Erro",
          description: "Sigla já cadastrada para outro sistema.",
          variant: "destructive",
        });
        return;
      }

      setSistemas(sistemas.map(sistema => {
        if (sistema.id === editingId) {
          return {
            ...sistema,
            sigla: data.sigla,
            nome: data.nome,
            descricao: data.descricao,
          };
        }
        return sistema;
      }));
      
      toast({
        title: "Sucesso",
        description: "Sistema alterado com sucesso!",
      });
    } else {
      // Modo de inclusão
      if (isSiglaDuplicada(data.sigla)) {
        toast({
          title: "Erro",
          description: "Sigla já cadastrada.",
          variant: "destructive",
        });
        return;
      }

      const novoSistema: Sistema = {
        id: `sistema-${Date.now()}`, // Gerar ID único
        sigla: data.sigla,
        nome: data.nome,
        descricao: data.descricao,
        modulos: [],
      };
      
      setSistemas([...sistemas, novoSistema]);
      
      toast({
        title: "Sucesso",
        description: "Sistema incluído com sucesso!",
      });
      
      // Configurar módulos após inclusão
      setCurrentSistema(novoSistema);
      setShowModulos(true);
    }
    
    resetForm();
    setShowResults(false);
  };
  
  // Manipulador para inclusão/edição de módulo
  const onSubmitModulo = (data: ModuloFormValues) => {
    if (!currentSistema) {
      toast({
        title: "Erro",
        description: "Nenhum sistema selecionado.",
        variant: "destructive",
      });
      return;
    }

    if (editingModulo) {
      // Editar módulo existente
      setSistemas(sistemas.map(sistema => {
        if (sistema.id === currentSistema.id) {
          return {
            ...sistema,
            modulos: sistema.modulos.map(modulo => 
              modulo.id === editingModulo.id ? { 
                id: modulo.id,
                nome: data.nome,
                descricao: data.descricao 
              } : modulo
            ),
          };
        }
        return sistema;
      }));
      
      toast({
        title: "Sucesso",
        description: "Módulo atualizado com sucesso!",
      });
      
      setEditingModulo(null);
    } else {
      // Adicionar novo módulo
      const novoModulo: Modulo = {
        id: `modulo-${Date.now()}`,
        nome: data.nome,
        descricao: data.descricao,
      };
      
      setSistemas(sistemas.map(sistema => {
        if (sistema.id === currentSistema.id) {
          return {
            ...sistema,
            modulos: [...sistema.modulos, novoModulo],
          };
        }
        return sistema;
      }));
      
      toast({
        title: "Sucesso",
        description: "Módulo adicionado com sucesso!",
      });
    }
    
    moduloForm.reset();
  };
  
  // Resetar formulário
  const resetForm = () => {
    form.reset();
    setIsEditing(false);
    setEditingId(null);
  };
  
  // Editar sistema
  const handleEdit = (sistema: Sistema) => {
    form.reset({
      sigla: sistema.sigla,
      nome: sistema.nome,
      descricao: sistema.descricao,
    });
    setIsEditing(true);
    setEditingId(sistema.id);
    setShowResults(false);
  };
  
  // Excluir sistema
  const handleDelete = (id: string) => {
    setSistemas(sistemas.filter(sistema => sistema.id !== id));
    toast({
      title: "Sistema excluído",
      description: "O sistema foi excluído com sucesso.",
    });
  };
  
  // Pesquisar sistemas
  const handleSearch = () => {
    setShowResults(true);
  };
  
  // Filtrar sistemas na pesquisa
  const filteredSistemas = sistemas.filter(sistema => {
    const term = searchTerm.toLowerCase();
    return (
      sistema.sigla.toLowerCase().includes(term) || 
      sistema.nome.toLowerCase().includes(term)
    );
  });
  
  // Imprimir relatório
  const handlePrint = () => {
    window.print();
  };
  
  // Configurar módulos para um sistema
  const setupModulos = (sistema: Sistema) => {
    setCurrentSistema(sistema);
    setShowModulos(true);
  };
  
  // Editar módulo
  const handleEditModulo = (modulo: Modulo) => {
    moduloForm.reset({
      nome: modulo.nome,
      descricao: modulo.descricao,
    });
    setEditingModulo(modulo);
  };
  
  // Excluir módulo
  const handleDeleteModulo = (sistemaId: string, moduloId: string) => {
    setSistemas(sistemas.map(sistema => {
      if (sistema.id === sistemaId) {
        return {
          ...sistema,
          modulos: sistema.modulos.filter(
            modulo => modulo.id !== moduloId
          ),
        };
      }
      return sistema;
    }));
    
    toast({
      title: "Módulo excluído",
      description: "O módulo foi excluído com sucesso.",
    });
  };
  
  return (
    <PageContainer title="Cadastro de Sistemas">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sigla"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sigla</FormLabel>
                    <FormControl>
                      <Input placeholder="Sigla do sistema (ex: SIS)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Sistema</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do sistema" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Descrição Detalhada</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição detalhada do sistema" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormActions 
              onIncluir={form.handleSubmit(onSubmit)} 
              onAlterar={() => setIsEditing(true)}
              onExcluir={() => {
                if (editingId) {
                  handleDelete(editingId);
                  resetForm();
                }
              }}
              onPesquisar={handleSearch}
              onImprimir={handlePrint}
              isEditing={isEditing}
              isSaving={form.formState.isSubmitting}
            />
          </form>
        </Form>
        
        {/* Área de gerenciamento de módulos */}
        {showModulos && currentSistema && (
          <div className="mt-8 border rounded-md p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Módulos - {currentSistema.sigla} - {currentSistema.nome}
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowModulos(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Form {...moduloForm}>
              <form onSubmit={moduloForm.handleSubmit(onSubmitModulo)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={moduloForm.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Módulo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do módulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={moduloForm.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do Módulo</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição do módulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    {editingModulo ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" /> Atualizar Módulo
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" /> Adicionar Módulo
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            
            {/* Lista de módulos */}
            <div className="mt-4 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSistema.modulos.length > 0 ? (
                    currentSistema.modulos.map((modulo) => (
                      <TableRow key={modulo.id}>
                        <TableCell>{modulo.nome}</TableCell>
                        <TableCell>{modulo.descricao}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditModulo(modulo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteModulo(currentSistema.id, modulo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        Nenhum módulo cadastrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        {/* Área de pesquisa */}
        {showResults && (
          <div className="mt-8">
            <div className="flex items-center mb-4 gap-2">
              <h3 className="text-lg font-medium">Resultados da Pesquisa</h3>
              <Input 
                placeholder="Pesquisar por Sigla ou Nome" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="ml-4 max-w-sm"
              />
              <Button variant="outline" onClick={() => setShowResults(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sigla</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Módulos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSistemas.length > 0 ? (
                    filteredSistemas.map((sistema) => (
                      <TableRow key={sistema.id}>
                        <TableCell>{sistema.sigla}</TableCell>
                        <TableCell>{sistema.nome}</TableCell>
                        <TableCell>{sistema.modulos.length}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(sistema)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setupModulos(sistema)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(sistema.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhum sistema encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CadastroSistemas;
