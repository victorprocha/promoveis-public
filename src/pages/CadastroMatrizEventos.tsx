import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Settings, MoreHorizontal } from 'lucide-react';

interface CadastroMatrizEventosProps {
  onFluxoPadraoClick?: () => void;
}

const CadastroMatrizEventos: React.FC<CadastroMatrizEventosProps> = ({ onFluxoPadraoClick }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Matriz de Eventos</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Pesquisar" 
              className="pl-10 w-64"
            />
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Matriz de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Data Inicial</TableHead>
                <TableHead>Data Final</TableHead>
                <TableHead>Fluxo de Trabalho</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={onFluxoPadraoClick}
              >
                <TableCell className="font-medium text-blue-600 hover:underline">
                  FLUXO PADRÃO
                </TableCell>
                <TableCell>01/01/2000</TableCell>
                <TableCell>31/12/9999</TableCell>
                <TableCell>
                  <Badge variant="secondary">Fluxo de venda padrão</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm text-gray-500">Limites por Página:</span>
                    <select className="text-sm border rounded px-2 py-1">
                      <option>50</option>
                      <option>100</option>
                    </select>
                    <span className="text-sm text-gray-500">1 a 50 de 1</span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" disabled>«</Button>
                      <Button variant="outline" size="sm" disabled>‹</Button>
                      <Button variant="outline" size="sm" disabled>›</Button>
                      <Button variant="outline" size="sm" disabled>»</Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroMatrizEventos;