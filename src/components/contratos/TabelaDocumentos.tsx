
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, FileText, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export interface Documento {
  id: number | string;
  data: string;
  historico: string;
  nomeArquivo?: string;
  tipoArquivo?: string;
  tamanhoArquivo?: number;
}

interface TabelaDocumentosProps {
  documentos: Documento[];
  isEditing: boolean;
  contratoId?: string;
}

const TabelaDocumentos: React.FC<TabelaDocumentosProps> = ({
  documentos = [],
  isEditing,
  contratoId,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documento, setDocumento] = useState<Partial<Documento>>({
    data: format(new Date(), "yyyy-MM-dd"),
    historico: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Only allow PDF and DOC/DOCX files
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setSelectedFile(file);
      } else {
        toast.error("Formato de arquivo inválido! Somente PDF e Word são aceitos.");
        e.target.value = "";
      }
    }
  };

  const handleAddDocument = () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo para anexar.");
      return;
    }

    if (!documento.historico) {
      toast.error("Informe o histórico do documento.");
      return;
    }

    // Here you would typically upload the file to Supabase storage
    // and then save the document metadata to the database
    toast.success("Documento anexado com sucesso!");
    setOpenDialog(false);
    setSelectedFile(null);
    setDocumento({
      data: format(new Date(), "yyyy-MM-dd"),
      historico: "",
    });
  };

  const handleDeleteDocument = (id: number | string) => {
    // Here you would typically delete the document from the database
    // and also delete the file from storage
    toast.success("Documento excluído com sucesso!");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocumento({ ...documento, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Documentos do Contrato</h3>
        {isEditing && (
          <Button
            onClick={() => setOpenDialog(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Anexar Documento
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Histórico</TableHead>
            <TableHead>Arquivo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                Nenhum documento anexado.
              </TableCell>
            </TableRow>
          ) : (
            documentos.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{format(new Date(doc.data), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell>{doc.historico}</TableCell>
                <TableCell>
                  {doc.nomeArquivo && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{doc.nomeArquivo}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download"
                      className="h-8 w-8"
                    >
                      <Upload className="h-4 w-4 rotate-180" />
                    </Button>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Excluir"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Anexar Documento</DialogTitle>
            <DialogDescription>
              Adicione documentos ao contrato. Apenas arquivos PDF e Word são aceitos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="data">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !documento.data && "text-muted-foreground"
                    )}
                  >
                    {documento.data ? (
                      format(new Date(documento.data), "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={documento.data ? new Date(documento.data) : undefined}
                    onSelect={(date) => setDocumento({ ...documento, data: date ? format(date, "yyyy-MM-dd") : "" })}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="historico">Histórico</Label>
              <Input
                id="historico"
                name="historico"
                value={documento.historico}
                onChange={handleInputChange}
                placeholder="Descreva o documento..."
              />
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="arquivo">Arquivo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="arquivo"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              {selectedFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Arquivo selecionado: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddDocument}>Anexar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TabelaDocumentos;
