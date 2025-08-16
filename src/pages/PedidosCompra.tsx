import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PedidoCompra {
  id: string;
  codigo: string;
  data_pedido: string;
  fornecedor: string;
  favoravel: string;
  tipo: string;
  valor: number;
}

interface PedidosCompraProps {
  onAddPedido: () => void;
}

const PedidosCompra: React.FC<PedidosCompraProps> = ({ onAddPedido }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pedidos] = useState<PedidoCompra[]>([]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-foreground">Pedidos de Compra</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquise pelo código do pedido"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button 
            onClick={onAddPedido}
            className="bg-success hover:bg-success/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Pedido
          </Button>
          <Button variant="outline" className="bg-primary hover:bg-primary/90 text-white border-primary">
            Importar XML de Pedido
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-6 bg-muted/30">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtros:</span>
        </div>
        <select className="px-3 py-2 border rounded-md bg-background">
          <option>Todos</option>
        </select>
        <Input
          placeholder="Data pedido de"
          type="date"
          className="w-40"
        />
        <Input
          placeholder="Data pedido até"
          type="date"
          className="w-40"
        />
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-muted-foreground mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum pedido Cadastrado</h3>
            <p className="text-muted-foreground mb-4">Comece adicionando seu primeiro pedido de compra</p>
            <Button 
              onClick={onAddPedido}
              className="bg-success hover:bg-success/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Pedido
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Data do Pedido</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Favorável</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.codigo}</TableCell>
                    <TableCell>{pedido.data_pedido}</TableCell>
                    <TableCell>{pedido.fornecedor}</TableCell>
                    <TableCell>{pedido.favoravel}</TableCell>
                    <TableCell>{pedido.tipo}</TableCell>
                    <TableCell>R$ {pedido.valor.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-success hover:text-success/80">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosCompra;