
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

export interface Aditivo {
  id: number;
  numero: string;
  dataInscricao: string;
  dataAssinatura: string;
  dataInicioVigencia: string;
  dataFimVigencia: string;
  tipo: string;
  indiceCorrecao: string;
  valorComplemento: string;
}

interface TabelaAditivosProps {
  aditivos: Aditivo[];
  isEditing: boolean;
}

const TabelaAditivos: React.FC<TabelaAditivosProps> = ({ aditivos, isEditing }) => {
  return (
    <div className="p-4 border rounded-md mt-2">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Controle de Aditamentos</h3>
        <div className="space-x-2">
          <Button 
            type="button" 
            size="sm" 
            onClick={() => toast("Adicionar aditivo")}
            disabled={!isEditing}
          >
            Incluir
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="secondary"
            onClick={() => toast("Importar entidades aditivo")}
            disabled={!isEditing}
          >
            Importar Entidades
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="secondary"
            onClick={() => toast("Vincular sistemas aditivo")}
            disabled={!isEditing}
          >
            Vincular Sistemas
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Data Inscrição</TableHead>
              <TableHead>Data Assinatura</TableHead>
              <TableHead>Início Vigência</TableHead>
              <TableHead>Fim Vigência</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor (R$)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aditivos.map((aditivo) => (
              <TableRow key={aditivo.id}>
                <TableCell>{aditivo.numero}</TableCell>
                <TableCell>{new Date(aditivo.dataInscricao).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{new Date(aditivo.dataAssinatura).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{new Date(aditivo.dataInicioVigencia).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{new Date(aditivo.dataFimVigencia).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{aditivo.tipo}</TableCell>
                <TableCell>{parseFloat(aditivo.valorComplemento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toast("Editar aditivo")}
                    disabled={!isEditing}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => toast("Excluir aditivo")}
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

export default TabelaAditivos;
