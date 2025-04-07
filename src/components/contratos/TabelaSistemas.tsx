
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

export interface Sistema {
  id: number;
  sigla: string;
  nome: string;
  valor: number;
  implantado: string;
  dataImplantacao: string | null;
  status: string;
}

interface TabelaSistemasProps {
  sistemas: Sistema[];
  isEditing: boolean;
}

const TabelaSistemas: React.FC<TabelaSistemasProps> = ({ sistemas, isEditing }) => {
  return (
    <div className="p-4 border rounded-md mt-2">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Sistemas Licitados</h3>
        <div className="space-x-2">
          <Button 
            type="button" 
            size="sm" 
            onClick={() => toast("Adicionar sistema")}
            disabled={!isEditing}
          >
            Incluir
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sigla</TableHead>
              <TableHead>Nome do Sistema</TableHead>
              <TableHead>Valor (R$)</TableHead>
              <TableHead>Implantado</TableHead>
              <TableHead>Data Implantação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sistemas.map((sistema) => (
              <TableRow key={sistema.id}>
                <TableCell>{sistema.sigla}</TableCell>
                <TableCell>{sistema.nome}</TableCell>
                <TableCell>{sistema.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>{sistema.implantado}</TableCell>
                <TableCell>{sistema.dataImplantacao ? new Date(sistema.dataImplantacao).toLocaleDateString('pt-BR') : '-'}</TableCell>
                <TableCell>{sistema.status}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toast("Editar sistema")}
                    disabled={!isEditing}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => toast("Excluir sistema")}
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

export default TabelaSistemas;
