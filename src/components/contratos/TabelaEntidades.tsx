
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Entidade {
  id: number;
  nome: string;
  cnpj: string;
  tipo: string;
}

interface TabelaEntidadesProps {
  entidades: Entidade[];
  isEditing: boolean;
}

const TabelaEntidades: React.FC<TabelaEntidadesProps> = ({ entidades, isEditing }) => {
  return (
    <div className="p-4 border rounded-md mt-2">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Entidades Vinculadas ao Contrato</h3>
        <div className="space-x-2">
          <Button 
            type="button" 
            size="sm" 
            onClick={() => toast("Adicionar entidade")}
            disabled={!isEditing}
          >
            Incluir
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="secondary"
            onClick={() => toast("Importar entidades")}
            disabled={!isEditing}
          >
            Importar Entidades
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entidades.map((entidade) => (
              <TableRow key={entidade.id}>
                <TableCell>{entidade.id}</TableCell>
                <TableCell>{entidade.nome}</TableCell>
                <TableCell>{entidade.cnpj}</TableCell>
                <TableCell>{entidade.tipo}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toast("Editar entidade")}
                    disabled={!isEditing}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => toast("Excluir entidade")}
                    disabled={!isEditing}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TabelaEntidades;
