
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { X, Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { validateCPF, cpfMask } from "@/utils/validations";

// Definir o tipo de responsável
interface Responsavel {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  celular: string;
}

// Schema de validação com Zod
const responsavelSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().min(14, "CPF inválido").refine(
    (val) => validateCPF(val.replace(/\D/g, '')),
    { message: "CPF inválido" }
  ),
  rg: z.string().min(5, "RG inválido"),
  celular: z.string().min(10, "Celular inválido"),
});

type ResponsavelFormValues = z.infer<typeof responsavelSchema>;

const CadastroResponsaveis = () => {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const navigate = useNavigate();
  
  const form = useForm<ResponsavelFormValues>({
    resolver: zodResolver(responsavelSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      rg: "",
      celular: "",
    },
  });
  
  // Verificar CPF duplicado
  const isCPFDuplicado = (cpf: string, excludeId?: string): boolean => {
    const formattedCpf = cpf.replace(/\D/g, '');
    return responsaveis.some(
      responsavel => 
        responsavel.cpf.replace(/\D/g, '') === formattedCpf && 
        responsavel.id !== excludeId
    );
  };
  
  // Manipulador para máscara de telefone celular
  const celularMask = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };
  
  // Manipulador para inclusão e alteração
  const onSubmit = (data: ResponsavelFormValues) => {
    if (isEditing && editingId) {
      // Modo de edição
      if (isCPFDuplicado(data.cpf, editingId)) {
        toast({
          title: "Erro",
          description: "CPF já cadastrado para outro responsável.",
          variant: "destructive",
        });
        return;
      }

      setResponsaveis(responsaveis.map(responsavel => {
        if (responsavel.id === editingId) {
          return { 
            id: editingId,
            nome: data.nome,
            cpf: data.cpf,
            rg: data.rg,
            celular: data.celular
          };
        }
        return responsavel;
      }));
      
      toast({
        title: "Sucesso",
        description: "Responsável alterado com sucesso!",
      });
    } else {
      // Modo de inclusão
      if (isCPFDuplicado(data.cpf)) {
        toast({
          title: "Erro",
          description: "CPF já cadastrado.",
          variant: "destructive",
        });
        return;
      }

      const novoResponsavel: Responsavel = {
        id: `responsavel-${Date.now()}`,
        nome: data.nome,
        cpf: data.cpf,
        rg: data.rg,
        celular: data.celular
      };
      
      setResponsaveis([...responsaveis, novoResponsavel]);
      
      toast({
        title: "Sucesso",
        description: "Responsável incluído com sucesso!",
      });
    }
    
    resetForm();
    setShowResults(false);
  };
  
  // Resetar formulário
  const resetForm = () => {
    form.reset({
      nome: "",
      cpf: "",
      rg: "",
      celular: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };
  
  // Editar responsável
  const handleEdit = (responsavel: Responsavel) => {
    form.reset({
      nome: responsavel.nome,
      cpf: responsavel.cpf,
      rg: responsavel.rg,
      celular: responsavel.celular,
    });
    setIsEditing(true);
    setEditingId(responsavel.id);
    setShowResults(false);
  };
  
  // Excluir responsável
  const handleDelete = (id: string) => {
    setResponsaveis(responsaveis.filter(responsavel => responsavel.id !== id));
    toast({
      title: "Responsável excluído",
      description: "O responsável foi excluído com sucesso.",
    });
  };
  
  // Pesquisar responsáveis
  const handleSearch = () => {
    setShowResults(true);
  };
  
  // Filtrar responsáveis na pesquisa
  const filteredResponsaveis = responsaveis.filter(responsavel => {
    const term = searchTerm.toLowerCase();
    return (
      responsavel.nome.toLowerCase().includes(term) || 
      responsavel.cpf.includes(term)
    );
  });
  
  // Imprimir relatório
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <PageContainer title="Cadastro de Responsável">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000.000.000-00"
                        {...field}
                        value={cpfMask(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <Input placeholder="RG" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="celular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 00000-0000"
                        {...field}
                        value={celularMask(field.value)}
                      />
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
        
        {/* Área de pesquisa */}
        {showResults && (
          <div className="mt-8">
            <div className="flex items-center mb-4 gap-2">
              <h3 className="text-lg font-medium">Resultados da Pesquisa</h3>
              <Input 
                placeholder="Pesquisar por Nome ou CPF" 
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
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>RG</TableHead>
                    <TableHead>Celular</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponsaveis.length > 0 ? (
                    filteredResponsaveis.map((responsavel) => (
                      <TableRow key={responsavel.id}>
                        <TableCell>{responsavel.nome}</TableCell>
                        <TableCell>{responsavel.cpf}</TableCell>
                        <TableCell>{responsavel.rg}</TableCell>
                        <TableCell>{responsavel.celular}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(responsavel)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(responsavel.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Nenhum responsável encontrado.
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

export default CadastroResponsaveis;
