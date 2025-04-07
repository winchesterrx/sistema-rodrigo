
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Save, Search, Trash2, Edit, X } from "lucide-react";
import { toast } from "sonner";

interface FormActionsProps {
  onIncluir: () => void;
  onAlterar?: () => void;
  onExcluir?: () => void;
  onPesquisar?: () => void;
  onImprimir?: () => void;
  onCancelar?: () => void;
  isEditing?: boolean;
  isSaving?: boolean;
}

const FormActions = ({
  onIncluir,
  onAlterar,
  onExcluir,
  onPesquisar,
  onImprimir,
  onCancelar,
  isEditing = false,
  isSaving = false
}: FormActionsProps) => {
  
  // Function to show success toast when saving
  const handleIncluir = () => {
    onIncluir();
    if (isEditing) {
      toast.success("Registro gravado com sucesso!");
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2 mt-6 justify-end">
      {isEditing ? (
        <Button disabled={isSaving} onClick={handleIncluir}>
          <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      ) : (
        <Button onClick={onIncluir}>
          <Save className="mr-2 h-4 w-4" /> Incluir
        </Button>
      )}
      
      {onAlterar && (
        <Button variant="secondary" onClick={onAlterar}>
          <Edit className="mr-2 h-4 w-4" /> Alterar
        </Button>
      )}
      
      {onExcluir && (
        <Button variant="destructive" onClick={onExcluir}>
          <Trash2 className="mr-2 h-4 w-4" /> Excluir
        </Button>
      )}
      
      {onPesquisar && (
        <Button variant="outline" onClick={onPesquisar}>
          <Search className="mr-2 h-4 w-4" /> Pesquisar
        </Button>
      )}
      
      {onImprimir && (
        <Button variant="ghost" onClick={onImprimir}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir
        </Button>
      )}
      
      {onCancelar && (
        <Button variant="outline" onClick={onCancelar}>
          <X className="mr-2 h-4 w-4" /> Cancelar
        </Button>
      )}
    </div>
  );
};

export default FormActions;
