
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Definir o tipo de índice
interface Indice {
  id: string;
  nome: string;
  mes: string;
  ano: number;
  valor: number;
}

// Schema de validação com Zod
const indiceSchema = z.object({
  nome: z.string().min(2, "O nome do índice deve ter pelo menos 2 caracteres"),
  mes: z.string().min(1, "Selecione um mês"),
  ano: z.coerce.number().min(1900, "Ano inválido").max(2100, "Ano inválido"),
  valor: z.coerce.number().min(0, "O valor deve ser maior ou igual a zero"),
});

type IndiceFormValues = z.infer<typeof indiceSchema>;

const meses = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const CadastroIndices = () => {
  const [indices, setIndices] = useState<Indice[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const navigate = useNavigate();
  
  const form = useForm<IndiceFormValues>({
    resolver: zodResolver(indiceSchema),
    defaultValues: {
      nome: "",
      mes: "",
      ano: new Date().getFullYear(),
      valor: 0,
    },
  });
  
  // Verificar se o índice já existe (combinação nome, mês e ano)
  const isIndiceDuplicado = (data: IndiceFormValues, excludeId?: string): boolean => {
    return indices.some(
      indice => 
        indice.nome.toLowerCase() === data.nome.toLowerCase() && 
        indice.mes === data.mes && 
        indice.ano === data.ano && 
        indice.id !== excludeId
    );
  };
  
  // Manipulador para inclusão e alteração
  const onSubmit = (data: IndiceFormValues) => {
    if (isEditing && editingId) {
      // Modo de edição
      if (isIndiceDuplicado(data, editingId)) {
        toast({
          title: "Erro",
          description: "Este índice já está cadastrado para o mês e ano especificados.",
          variant: "destructive",
        });
        return;
      }

      setIndices(indices.map(indice => {
        if (indice.id === editingId) {
          return { 
            ...indice,
            nome: data.nome,
            mes: data.mes,
            ano: data.ano,
            valor: data.valor,
          };
        }
        return indice;
      }));
      
      toast({
        title: "Sucesso",
        description: "Índice alterado com sucesso!",
      });
    } else {
      // Modo de inclusão
      if (isIndiceDuplicado(data)) {
        toast({
          title: "Erro",
          description: "Este índice já está cadastrado para o mês e ano especificados.",
          variant: "destructive",
        });
        return;
      }

      const novoIndice: Indice = {
        id: `indice-${Date.now()}`, // Gerar ID único
        nome: data.nome,
        mes: data.mes,
        ano: data.ano,
        valor: data.valor,
      };
      
      setIndices([...indices, novoIndice]);
      
      toast({
        title: "Sucesso",
        description: "Índice incluído com sucesso!",
      });
    }
    
    resetForm();
    setShowResults(false);
  };
  
  // Resetar formulário
  const resetForm = () => {
    form.reset({
      nome: "",
      mes: "",
      ano: new Date().getFullYear(),
      valor: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  };
  
  // Editar índice
  const handleEdit = (indice: Indice) => {
    form.reset({
      nome: indice.nome,
      mes: indice.mes,
      ano: indice.ano,
      valor: indice.valor,
    });
    setIsEditing(true);
    setEditingId(indice.id);
    setShowResults(false);
  };
  
  // Excluir índice
  const handleDelete = (id: string) => {
    setIndices(indices.filter(indice => indice.id !== id));
    toast({
      title: "Índice excluído",
      description: "O índice foi excluído com sucesso.",
    });
  };
  
  // Pesquisar índices
  const handleSearch = () => {
    setShowResults(true);
  };
  
  // Filtrar índices na pesquisa
  const filteredIndices = indices.filter(indice => {
    const term = searchTerm.toLowerCase();
    const mesNome = meses.find(m => m.value === indice.mes)?.label.toLowerCase() || "";
    
    return (
      indice.nome.toLowerCase().includes(term) || 
      mesNome.includes(term) || 
      indice.ano.toString().includes(term)
    );
  });
  
  // Imprimir relatório
  const handlePrint = () => {
    window.print();
  };
  
  // Obter o nome do mês a partir do valor
  const getMesNome = (mesValue: string): string => {
    return meses.find(m => m.value === mesValue)?.label || "";
  };
  
  return (
    <PageContainer title="Cadastro de Índices de Correções">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Índice</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: IGP-M, IPCA, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o mês" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {meses.map(mes => (
                          <SelectItem key={mes.value} value={mes.value}>
                            {mes.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input type="number" min="1900" max="2100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Índice</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.0001" 
                        placeholder="Ex: 0.0530 (5.30%)" 
                        {...field}
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
                placeholder="Pesquisar por Índice, Mês ou Ano" 
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
                    <TableHead>Índice</TableHead>
                    <TableHead>Mês</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Valor (%)</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndices.length > 0 ? (
                    filteredIndices.map((indice) => (
                      <TableRow key={indice.id}>
                        <TableCell>{indice.nome}</TableCell>
                        <TableCell>{getMesNome(indice.mes)}</TableCell>
                        <TableCell>{indice.ano}</TableCell>
                        <TableCell>{(indice.valor * 100).toFixed(4)}%</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(indice)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(indice.id)}
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
                        Nenhum índice encontrado.
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

export default CadastroIndices;
