
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { X, Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Definir o tipo de modalidade
interface Modalidade {
  id: string;
  descricao: string;
  observacoes: string;
}

// Schema de validação com Zod
const modalidadeSchema = z.object({
  descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  observacoes: z.string().optional(),
});

type ModalidadeFormValues = z.infer<typeof modalidadeSchema>;

const CadastroModalidades = () => {
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const navigate = useNavigate();
  
  const form = useForm<ModalidadeFormValues>({
    resolver: zodResolver(modalidadeSchema),
    defaultValues: {
      descricao: "",
      observacoes: "",
    },
  });
  
  // Verificar descrição duplicada
  const isDescricaoDuplicada = (descricao: string, excludeId?: string): boolean => {
    return modalidades.some(
      modalidade => 
        modalidade.descricao.toLowerCase() === descricao.toLowerCase() && 
        modalidade.id !== excludeId
    );
  };
  
  // Manipulador para inclusão e alteração
  const onSubmit = (data: ModalidadeFormValues) => {
    if (isEditing && editingId) {
      // Modo de edição
      if (isDescricaoDuplicada(data.descricao, editingId)) {
        toast({
          title: "Erro",
          description: "Esta modalidade de licitação já está cadastrada.",
          variant: "destructive",
        });
        return;
      }

      setModalidades(modalidades.map(modalidade => {
        if (modalidade.id === editingId) {
          return { 
            ...modalidade,
            descricao: data.descricao,
            observacoes: data.observacoes || "",
          };
        }
        return modalidade;
      }));
      
      toast({
        title: "Sucesso",
        description: "Modalidade de licitação alterada com sucesso!",
      });
    } else {
      // Modo de inclusão
      if (isDescricaoDuplicada(data.descricao)) {
        toast({
          title: "Erro",
          description: "Esta modalidade de licitação já está cadastrada.",
          variant: "destructive",
        });
        return;
      }

      const novaModalidade: Modalidade = {
        id: `modalidade-${Date.now()}`, // Gerar ID único
        descricao: data.descricao,
        observacoes: data.observacoes || "",
      };
      
      setModalidades([...modalidades, novaModalidade]);
      
      toast({
        title: "Sucesso",
        description: "Modalidade de licitação incluída com sucesso!",
      });
    }
    
    resetForm();
    setShowResults(false);
  };
  
  // Resetar formulário
  const resetForm = () => {
    form.reset({
      descricao: "",
      observacoes: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };
  
  // Editar modalidade
  const handleEdit = (modalidade: Modalidade) => {
    form.reset({
      descricao: modalidade.descricao,
      observacoes: modalidade.observacoes,
    });
    setIsEditing(true);
    setEditingId(modalidade.id);
    setShowResults(false);
  };
  
  // Excluir modalidade
  const handleDelete = (id: string) => {
    setModalidades(modalidades.filter(modalidade => modalidade.id !== id));
    toast({
      title: "Modalidade excluída",
      description: "A modalidade de licitação foi excluída com sucesso.",
    });
  };
  
  // Pesquisar modalidades
  const handleSearch = () => {
    setShowResults(true);
  };
  
  // Filtrar modalidades na pesquisa
  const filteredModalidades = modalidades.filter(modalidade => {
    const term = searchTerm.toLowerCase();
    return modalidade.descricao.toLowerCase().includes(term);
  });
  
  // Imprimir relatório
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <PageContainer title="Cadastro de Modalidade de Licitações">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição da Modalidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pregão Eletrônico, Tomada de Preços, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Observações (opcional)" {...field} />
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
                placeholder="Pesquisar modalidade" 
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
                    <TableHead>Descrição</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModalidades.length > 0 ? (
                    filteredModalidades.map((modalidade) => (
                      <TableRow key={modalidade.id}>
                        <TableCell>{modalidade.descricao}</TableCell>
                        <TableCell>{modalidade.observacoes}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(modalidade)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(modalidade.id)}
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
                        Nenhuma modalidade encontrada.
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

export default CadastroModalidades;
