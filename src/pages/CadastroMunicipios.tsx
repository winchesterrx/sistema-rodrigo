
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cnpjMask, validateCNPJ } from "@/utils/validations";
import PageContainer from "@/components/PageContainer";
import FormActions from "@/components/FormActions";

// Definir o tipo de município
interface Municipio {
  id: string;
  nome: string;
  codigoIBGE: string;
  quantidadeHabitantes: number;
  distanciaKM: number;
  observacoes: string;
  entidadesVinculadas: EntidadeVinculada[];
}

// Definir o tipo de entidade vinculada
interface EntidadeVinculada {
  id: string;
  cnpj: string;
  razaoSocial: string;
  tipoEntidade: string;
}

// Schema de validação com Zod para Município
const municipioSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  codigoIBGE: z.string().min(7, "Código IBGE inválido"),
  quantidadeHabitantes: z.coerce.number().min(1, "Informe a quantidade de habitantes"),
  distanciaKM: z.coerce.number().min(0, "Informe a distância em KM"),
  observacoes: z.string().optional(),
});

// Schema de validação com Zod para Entidade Vinculada
const entidadeVinculadaSchema = z.object({
  cnpj: z.string().min(18, "CNPJ inválido").refine(
    (val) => validateCNPJ(val.replace(/\D/g, '')),
    { message: "CNPJ inválido" }
  ),
  razaoSocial: z.string().min(3, "A razão social deve ter pelo menos 3 caracteres"),
  tipoEntidade: z.string().min(1, "Selecione um tipo de entidade"),
});

type MunicipioFormValues = z.infer<typeof municipioSchema>;
type EntidadeVinculadaFormValues = z.infer<typeof entidadeVinculadaSchema>;

const CadastroMunicipios = () => {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showVinculacao, setShowVinculacao] = useState(false);
  const [currentMunicipio, setCurrentMunicipio] = useState<Municipio | null>(null);
  
  const navigate = useNavigate();
  
  // Formulário principal
  const form = useForm<MunicipioFormValues>({
    resolver: zodResolver(municipioSchema),
    defaultValues: {
      nome: "",
      codigoIBGE: "",
      quantidadeHabitantes: 0,
      distanciaKM: 0,
      observacoes: "",
    },
  });
  
  // Formulário de entidade vinculada
  const vinculacaoForm = useForm<EntidadeVinculadaFormValues>({
    resolver: zodResolver(entidadeVinculadaSchema),
    defaultValues: {
      cnpj: "",
      razaoSocial: "",
      tipoEntidade: "",
    },
  });
  
  // Verificar código IBGE duplicado
  const isCodigoIBGEDuplicado = (codigo: string, excludeId?: string): boolean => {
    return municipios.some(municipio => 
      municipio.codigoIBGE === codigo && 
      municipio.id !== excludeId
    );
  };
  
  // Verificar CNPJ duplicado nas entidades vinculadas
  const isCnpjVinculadoDuplicado = (cnpj: string, municipioId: string, entidadeId?: string): boolean => {
    const municipio = municipios.find(m => m.id === municipioId);
    if (!municipio) return false;
    
    const formattedCnpj = cnpj.replace(/\D/g, '');
    return municipio.entidadesVinculadas.some(entidade => 
      entidade.cnpj.replace(/\D/g, '') === formattedCnpj && 
      entidade.id !== entidadeId
    );
  };
  
  // Manipulador para inclusão e alteração de município
  const onSubmit = (data: MunicipioFormValues) => {
    if (isEditing && editingId) {
      // Modo de edição
      if (isCodigoIBGEDuplicado(data.codigoIBGE, editingId)) {
        toast({
          title: "Erro",
          description: "Código IBGE já cadastrado para outro município.",
          variant: "destructive",
        });
        return;
      }

      setMunicipios(municipios.map(municipio => {
        if (municipio.id === editingId) {
          return {
            ...municipio,
            nome: data.nome,
            codigoIBGE: data.codigoIBGE,
            quantidadeHabitantes: data.quantidadeHabitantes,
            distanciaKM: data.distanciaKM,
            observacoes: data.observacoes || ""
          };
        }
        return municipio;
      }));
      
      toast({
        title: "Sucesso",
        description: "Município alterado com sucesso!",
      });
    } else {
      // Modo de inclusão
      if (isCodigoIBGEDuplicado(data.codigoIBGE)) {
        toast({
          title: "Erro",
          description: "Código IBGE já cadastrado.",
          variant: "destructive",
        });
        return;
      }

      const novoMunicipio: Municipio = {
        id: `municipio-${Date.now()}`, // Gerar ID único
        nome: data.nome,
        codigoIBGE: data.codigoIBGE,
        quantidadeHabitantes: data.quantidadeHabitantes,
        distanciaKM: data.distanciaKM,
        observacoes: data.observacoes || "",
        entidadesVinculadas: [],
      };
      
      setMunicipios([...municipios, novoMunicipio]);
      
      toast({
        title: "Sucesso",
        description: "Município incluído com sucesso!",
      });
      
      // Configurar vinculação após inclusão
      setCurrentMunicipio(novoMunicipio);
      setShowVinculacao(true);
    }
    
    resetForm();
    setShowResults(false);
  };
  
  // Manipulador para inclusão de entidade vinculada
  const onSubmitVinculacao = (data: EntidadeVinculadaFormValues) => {
    if (!currentMunicipio) {
      toast({
        title: "Erro",
        description: "Nenhum município selecionado para vinculação.",
        variant: "destructive",
      });
      return;
    }

    if (isCnpjVinculadoDuplicado(data.cnpj, currentMunicipio.id)) {
      toast({
        title: "Erro",
        description: "CNPJ já vinculado a este município.",
        variant: "destructive",
      });
      return;
    }

    const novaEntidade: EntidadeVinculada = {
      id: `entidade-vinculada-${Date.now()}`,
      cnpj: data.cnpj,
      razaoSocial: data.razaoSocial,
      tipoEntidade: data.tipoEntidade,
    };
    
    setMunicipios(municipios.map(municipio => {
      if (municipio.id === currentMunicipio.id) {
        return {
          ...municipio,
          entidadesVinculadas: [...municipio.entidadesVinculadas, novaEntidade],
        };
      }
      return municipio;
    }));
    
    vinculacaoForm.reset();
    
    toast({
      title: "Sucesso",
      description: "Entidade vinculada com sucesso!",
    });
  };
  
  // Resetar formulário
  const resetForm = () => {
    form.reset();
    setIsEditing(false);
    setEditingId(null);
  };
  
  // Editar município
  const handleEdit = (municipio: Municipio) => {
    form.reset({
      nome: municipio.nome,
      codigoIBGE: municipio.codigoIBGE,
      quantidadeHabitantes: municipio.quantidadeHabitantes,
      distanciaKM: municipio.distanciaKM,
      observacoes: municipio.observacoes,
    });
    setIsEditing(true);
    setEditingId(municipio.id);
    setShowResults(false);
  };
  
  // Excluir município
  const handleDelete = (id: string) => {
    setMunicipios(municipios.filter(municipio => municipio.id !== id));
    toast({
      title: "Município excluído",
      description: "O município foi excluído com sucesso.",
    });
  };
  
  // Pesquisar municípios
  const handleSearch = () => {
    setShowResults(true);
  };
  
  // Filtrar municípios na pesquisa
  const filteredMunicipios = municipios.filter(municipio => {
    const term = searchTerm.toLowerCase();
    return (
      municipio.nome.toLowerCase().includes(term) || 
      municipio.codigoIBGE.includes(term)
    );
  });
  
  // Imprimir relatório
  const handlePrint = () => {
    window.print();
  };
  
  // Configurar vinculação para um município
  const setupVinculacao = (municipio: Municipio) => {
    setCurrentMunicipio(municipio);
    setShowVinculacao(true);
  };
  
  // Excluir entidade vinculada
  const handleDeleteVinculada = (municipioId: string, entidadeId: string) => {
    setMunicipios(municipios.map(municipio => {
      if (municipio.id === municipioId) {
        return {
          ...municipio,
          entidadesVinculadas: municipio.entidadesVinculadas.filter(
            entidade => entidade.id !== entidadeId
          ),
        };
      }
      return municipio;
    }));
    
    toast({
      title: "Entidade desvinculada",
      description: "A entidade foi desvinculada com sucesso.",
    });
  };
  
  return (
    <PageContainer title="Cadastro de Municípios">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Município</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do município" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="codigoIBGE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código IBGE</FormLabel>
                    <FormControl>
                      <Input placeholder="0000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quantidadeHabitantes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Habitantes</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="distanciaKM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distância em KM p/ viagem</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
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
        
        {/* Área de vinculação de entidades */}
        {showVinculacao && currentMunicipio && (
          <div className="mt-8 border rounded-md p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Vinculação de Entidades - {currentMunicipio.nome}
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowVinculacao(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Form {...vinculacaoForm}>
              <form onSubmit={vinculacaoForm.handleSubmit(onSubmitVinculacao)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={vinculacaoForm.control}
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
                    control={vinculacaoForm.control}
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
                    control={vinculacaoForm.control}
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
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Entidade
                  </Button>
                </div>
              </form>
            </Form>
            
            {/* Lista de entidades vinculadas */}
            <div className="mt-4 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Razão Social</TableHead>
                    <TableHead>Tipo de Entidade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMunicipio.entidadesVinculadas.length > 0 ? (
                    currentMunicipio.entidadesVinculadas.map((entidade) => (
                      <TableRow key={entidade.id}>
                        <TableCell>{entidade.cnpj}</TableCell>
                        <TableCell>{entidade.razaoSocial}</TableCell>
                        <TableCell>{entidade.tipoEntidade}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVinculada(currentMunicipio.id, entidade.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhuma entidade vinculada.
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
                placeholder="Pesquisar por Nome ou Código IBGE" 
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
                    <TableHead>Código IBGE</TableHead>
                    <TableHead>Habitantes</TableHead>
                    <TableHead>Distância KM</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMunicipios.length > 0 ? (
                    filteredMunicipios.map((municipio) => (
                      <TableRow key={municipio.id}>
                        <TableCell>{municipio.nome}</TableCell>
                        <TableCell>{municipio.codigoIBGE}</TableCell>
                        <TableCell>{municipio.quantidadeHabitantes.toLocaleString()}</TableCell>
                        <TableCell>{municipio.distanciaKM}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(municipio)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setupVinculacao(municipio)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(municipio.id)}
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
                        Nenhum município encontrado.
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

export default CadastroMunicipios;
