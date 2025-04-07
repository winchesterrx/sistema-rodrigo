
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Search } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Validator schema for the form
export const contratoFormSchema = z.object({
  sequencial: z.string().optional(),
  situacao: z.string().min(1, "Situação é obrigatória"),
  tipoContrato: z.string().min(1, "Tipo de contrato é obrigatório"),
  municipio: z.string().min(1, "Município é obrigatório"),
  codigoIBGE: z.string().optional(),
  qtdeHabitantes: z.string().optional(),
  numeroContrato: z.string().min(1, "Número do contrato é obrigatório"),
  dataContrato: z.date({
    required_error: "Data do contrato é obrigatória",
  }),
  anoContrato: z.string()
    .min(4, "O ano deve ter 4 dígitos")
    .max(4, "O ano deve ter 4 dígitos")
    .refine(val => !isNaN(parseInt(val)) && parseInt(val) > 1900 && parseInt(val) <= new Date().getFullYear() + 1, {
      message: "Ano inválido",
    }),
  modalidadeLicitacao: z.string().min(1, "Modalidade de licitação é obrigatória"),
  numeroProcessoLicitatorio: z.string().min(1, "Número do processo licitatório é obrigatório"),
  dataAssinatura: z.date({
    required_error: "Data de assinatura é obrigatória",
  }),
  dataPublicacao: z.date().optional(),
  dataInicioVigencia: z.date({
    required_error: "Data de início da vigência é obrigatória",
  }),
  dataFimVigencia: z.date({
    required_error: "Data de fim da vigência é obrigatória",
  }),
  dataEncerramento: z.date().optional(),
  indiceCorrecao: z.string().optional(),
  mesIndice: z.string().optional(),
  anoIndice: z.string()
    .optional()
    .refine(val => !val || (val && !isNaN(parseInt(val)) && parseInt(val) > 1900 && parseInt(val) <= new Date().getFullYear() + 1), {
      message: "Ano inválido",
    }),
  valorContrato: z.string().min(1, "Valor do contrato é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  nomeResponsavelContratante: z.string().min(1, "Nome do responsável contratante é obrigatório"),
  telefoneFixo: z.string().optional(),
  telefoneCelular: z.string().optional(),
});

export type ContratoFormValues = z.infer<typeof contratoFormSchema>;

interface ContratoFormProps {
  form: ReturnType<typeof useForm<ContratoFormValues>>;
  isEditing: boolean;
}

const ContratoForm: React.FC<ContratoFormProps> = ({ form, isEditing }) => {
  return (
    <div className="space-y-6">
      {/* Top section with main fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="sequencial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sequencial do Contrato</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="situacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação do Contrato</FormLabel>
                <Select 
                  disabled={!isEditing} 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Encerrado">Encerrado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoContrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Contrato</FormLabel>
                <Select 
                  disabled={!isEditing} 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Siafic">Siafic</SelectItem>
                    <SelectItem value="Contratação Direta">Contratação Direta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numeroContrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Contrato</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataContrato"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Contrato</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={!isEditing}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={!isEditing}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anoContrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano do Contrato</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Middle column */}
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <FormField
              control={form.control}
              name="municipio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Município</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input {...field} disabled={!isEditing} className="flex-1" />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2"
                      disabled={!isEditing}
                      onClick={() => toast("Busca de município em desenvolvimento")}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("municipio") && (
              <div className="text-lg font-bold mt-2 text-orange-500">
                {form.watch("municipio")}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-2">
              <FormField
                control={form.control}
                name="codigoIBGE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código IBGE</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-gray-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qtdeHabitantes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtde Habitantes</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-gray-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="modalidadeLicitacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade de Licitação</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input {...field} disabled={!isEditing} className="flex-1" />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2"
                    disabled={!isEditing}
                    onClick={() => toast("Busca de modalidade em desenvolvimento")}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numeroProcessoLicitatorio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Processo Licitatório</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valorContrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Contrato</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input {...field} disabled={!isEditing} className="flex-1" />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2"
                    disabled={!isEditing}
                    onClick={() => toast("Busca de responsável em desenvolvimento")}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dataAssinatura"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Assinatura</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!isEditing}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={!isEditing}
                        locale={ptBR}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataPublicacao"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Publicação</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!isEditing}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={!isEditing}
                        locale={ptBR}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dataInicioVigencia"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Início da Vigência</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!isEditing}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={!isEditing}
                        locale={ptBR}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataFimVigencia"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fim da Vigência</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!isEditing}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={!isEditing}
                        locale={ptBR}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dataEncerramento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Encerramento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={!isEditing || form.watch("situacao") !== "Encerrado"}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={!isEditing || form.watch("situacao") !== "Encerrado"}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <div className="font-medium mb-2">Índice de Correção</div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="indiceCorrecao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Índice</FormLabel>
                    <div className="flex">
                      <FormControl>
                        <Input {...field} disabled={!isEditing} className="flex-1" />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="ml-2"
                        disabled={!isEditing}
                        onClick={() => toast("Busca de índice em desenvolvimento")}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mesIndice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <Select 
                      disabled={!isEditing} 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Janeiro</SelectItem>
                        <SelectItem value="2">Fevereiro</SelectItem>
                        <SelectItem value="3">Março</SelectItem>
                        <SelectItem value="4">Abril</SelectItem>
                        <SelectItem value="5">Maio</SelectItem>
                        <SelectItem value="6">Junho</SelectItem>
                        <SelectItem value="7">Julho</SelectItem>
                        <SelectItem value="8">Agosto</SelectItem>
                        <SelectItem value="9">Setembro</SelectItem>
                        <SelectItem value="10">Outubro</SelectItem>
                        <SelectItem value="11">Novembro</SelectItem>
                        <SelectItem value="12">Dezembro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anoIndice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with responsables */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4">Informações da Contratante</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="nomeResponsavelContratante"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Responsável</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefoneFixo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone Fixo</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefoneCelular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone Celular</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ContratoForm;
