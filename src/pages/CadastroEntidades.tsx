
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { X, Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  FormDescription,
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

import { cnpjMask, validateCNPJ } from "@/utils/validations";
import PageContainer from "@/components/PageContainer";
import FormActions from "@/components/FormActions";

// Definir o tipo de entidade
interface Entidade {
  id: string;
  cnpj: string;
  razaoSocial: string;
  tipoEntidade: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  cep: string;
  telefone: string;
  outrasInformacoes: string;
}

// Schema de validação com Zod
const entidadeSchema = z.object({
  cnpj: z.string().min(18, "CNPJ inválido").refine(
    (val) => validateCNPJ(val.replace(/\D/g, '')),
    { message: "CNPJ inválido" }
  ),
  razaoSocial: z.string().min(3, "A razão social deve ter pelo menos 3 caracteres"),
  tipoEntidade: z.string().min(1, "Selecione um tipo de entidade"),
  rua: z.string().min(3, "Informe a rua"),
  numero: z.string().min(1, "Informe o número"),
  bairro: z.string().min(2, "Informe o bairro"),
  complemento: z.string().optional(),
  cidade: z.string().min(2, "Informe a cidade"),
  cep: z.string().min(8, "Informe o CEP válido"),
  telefone: z.string().min(10, "Informe um telefone válido"),
  outrasInformacoes: z.string().optional(),
});

type EntidadeFormValues = z.infer<typeof entidadeSchema>;

const CadastroEntidades = () => {
  const [entidades, setEntidades] = useState<Entidade[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<EntidadeFormValues>({
    resolver: zodResolver(entidadeSchema),
    defaultValues: {
      cnpj: "",
      razaoSocial: "",
      tipoEntidade: "",
      rua: "",
      numero: "",
      bairro: "",
      complemento: "",
      cidade: "",
      cep: "",
      telefone: "",
      outrasInformacoes: "",
    },
  });
  
  // Verificar CNPJ duplicado
  const isCnpjDuplicado = (cnpj: string, excludeId?: string): boolean => {
    const formattedCnpj = cnpj.replace(/\D/g, '');
    return entidades.some(entidade => 
      entidade.cnpj.replace(/\D/g, '') === formattedCnpj && 
      entidade.id !== excludeId
    );
  };
  
  // Manipulador para inclusão e alteração
  const onSubmit = (data: EntidadeFormValues) => {
    if (isEditing && editingId) {
      // Modo de edição
      if (isCnpjDuplicado(data.cnpj, editingId)) {
        toast({
          title: "Erro",
          description: "CNPJ já cadastrado para outra entidade.",
          variant: "destructive",
        });
        return;
      }

      setEntidades(entidades.map(entidade => 
        entidade.id === editingId ? {
          id: editingId,
          cnpj: data.cnpj,
          razaoSocial: data.razaoSocial,
          tipoEntidade: data.tipoEntidade,
          rua: data.rua,
          numero: data.numero,
          bairro: data.bairro,
          complemento: data.complemento || "",
          cidade: data.cidade,
          cep: data.cep,
          telefone: data.telefone,
          outrasInformacoes: data.outrasInformacoes || ""
        } : entidade
      ));
      
      toast({
        title: "Sucesso",
        description: "Entidade alterada com sucesso!",
      });
    } else {
      // Modo de inclusão
      if (isCnpjDuplicado(data.cnpj)) {
        toast({
          title: "Erro",
          description: "CNPJ já cadastrado.",
          variant: "destructive",
        });
        return;
      }

      const novaEntidade: Entidade = {
        id: `entity-${Date.now()}`, // Gerar ID único
        cnpj: data.cnpj,
        razaoSocial: data.razaoSocial,
        tipoEntidade: data.tipoEntidade,
        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        complemento: data.complemento || "",
        cidade: data.cidade,
        cep: data.cep,
        telefone: data.telefone,
        outrasInformacoes: data.outrasInformacoes || ""
      };
      
      setEntidades([...entidades, novaEntidade]);
      
      toast({
        title: "Sucesso",
        description: "Entidade incluída com sucesso!",
      });
    }
    
    // Resetar formulário e estado
    resetForm();
    setShowResults(false);
  };
  
  // Resetar formulário
  const resetForm = () => {
    form.reset();
    setIsEditing(false);
    setEditingId(null);
  };
  
  // Editar entidade
  const handleEdit = (entidade: Entidade) => {
    form.reset(entidade);
    setIsEditing(true);
    setEditingId(entidade.id);
    setShowResults(false);
  };
  
  // Excluir entidade
  const handleDelete = (id: string) => {
    setEntidades(entidades.filter(entidade => entidade.id !== id));
    toast({
      title: "Entidade excluída",
      description: "A entidade foi excluída com sucesso.",
    });
  };
  
  // Pesquisar entidades
  const handleSearch = () => {
    setShowResults(true);
  };
  
  // Filtrar entidades na pesquisa
  const filteredEntidades = entidades.filter(entidade => {
    const term = searchTerm.toLowerCase();
    return (
      entidade.cnpj.includes(term) || 
      entidade.razaoSocial.toLowerCase().includes(term) ||
      entidade.tipoEntidade.toLowerCase().includes(term)
    );
  });
  
  // Imprimir relatório
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <PageContainer title="Cadastro de Entidades">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00.000.000/0000-00"
                        {...field}
                        value={cnpjMask(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="razaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Razão Social da Entidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipoEntidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Entidade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="prefeitura">Prefeitura Municipal</SelectItem>
                        <SelectItem value="camara">Câmara Municipal</SelectItem>
                        <SelectItem value="iprem">Iprem Municipal</SelectItem>
                        <SelectItem value="consorcio">Consórcio</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rua"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da rua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="complemento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Complemento (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="00000-000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone da Entidade</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 0000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="outrasInformacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outras Informações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Informações adicionais (opcional)" {...field} />
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
                placeholder="Pesquisar por CNPJ, Razão Social ou Tipo" 
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
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Razão Social</TableHead>
                    <TableHead>Tipo de Entidade</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntidades.length > 0 ? (
                    filteredEntidades.map((entidade) => (
                      <TableRow key={entidade.id}>
                        <TableCell>{entidade.cnpj}</TableCell>
                        <TableCell>{entidade.razaoSocial}</TableCell>
                        <TableCell>{entidade.tipoEntidade}</TableCell>
                        <TableCell>{entidade.cidade}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(entidade)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(entidade.id)}
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
                        Nenhuma entidade encontrada.
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

export default CadastroEntidades;
