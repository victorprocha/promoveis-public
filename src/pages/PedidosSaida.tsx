import React, { useState } from 'react';
import PageTemplate from '@/components/Layout/PageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePedidosSaida } from '@/hooks/usePedidosSaida';

interface PedidosSaidaProps {
  onAddPedidoSaida: () => void;
}

export default function PedidosSaida({ onAddPedidoSaida }: PedidosSaidaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const { pedidos, loading, deletePedido } = usePedidosSaida();

  // Filter pedidos based on search term and status
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.numero_pedido.toString().includes(searchTerm) ||
                         pedido.responsavel_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.cliente_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || 
                         pedido.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'Em Edição': 'default',
      'Finalizado': 'secondary',
      'Cancelado': 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const handleDeletePedido = async (pedidoId: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await deletePedido(pedidoId);
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
      }
    }
  };

  return (
    <PageTemplate title="Pedidos de Saída" icon={Package}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Button onClick={onAddPedidoSaida} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Pedido
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquise pelo nome do responsável ou código do pedido"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="em edição">Em Edição</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data saída de</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data saída até</label>
                <Input type="date" />
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Pesquisar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos de Saída</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredPedidos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Nenhum pedido cadastrado</p>
                <Button onClick={onAddPedidoSaida}>
                  Adicionar Primeiro Pedido
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Código</th>
                      <th className="text-left p-2 font-medium">Data de Saída</th>
                      <th className="text-left p-2 font-medium">Responsável</th>
                      <th className="text-left p-2 font-medium">Cliente</th>
                      <th className="text-left p-2 font-medium">Tipo</th>
                      <th className="text-left p-2 font-medium">Referência OS</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPedidos.map((pedido) => (
                      <tr key={pedido.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">PS{pedido.numero_pedido.toString().padStart(3, '0')}</td>
                        <td className="p-2">{new Date(pedido.data_saida).toLocaleDateString('pt-BR')}</td>
                        <td className="p-2">{pedido.responsavel_id}</td>
                        <td className="p-2">{pedido.cliente_id}</td>
                        <td className="p-2">Material</td>
                        <td className="p-2">{pedido.referencia_contrato || '-'}</td>
                        <td className="p-2">{getStatusBadge(pedido.status)}</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Visualizar
                            </Button>
                            <Button size="sm" variant="outline">
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeletePedido(pedido.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}