import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/Layout/PageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePedidosSaida, PedidoSaida, PedidoSaidaItem } from '@/hooks/usePedidosSaida';
import { useToast } from '@/hooks/use-toast';

interface EditarPedidoSaidaProps {
  pedidoId: string;
  onBack: () => void;
}

export default function EditarPedidoSaida({ pedidoId, onBack }: EditarPedidoSaidaProps) {
  const { toast } = useToast();
  const { 
    fetchPedidoById, 
    fetchPedidoItems, 
    addPedidoItem, 
    updatePedidoItem, 
    deletePedidoItem, 
    updatePedido 
  } = usePedidosSaida();
  
  const [pedido, setPedido] = useState<PedidoSaida | null>(null);
  const [items, setItems] = useState<PedidoSaidaItem[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [newQuantity, setNewQuantity] = useState('1');
  const [loading, setLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    loadPedidoData();
  }, [pedidoId]);

  const loadPedidoData = async () => {
    try {
      setLoading(true);
      const [pedidoData, itemsData] = await Promise.all([
        fetchPedidoById(pedidoId),
        fetchPedidoItems(pedidoId)
      ]);
      
      setPedido(pedidoData);
      setItems(itemsData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do pedido",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newProductName.trim() || !pedido) return;

    setIsAddingItem(true);
    try {
      const newItem = await addPedidoItem({
        pedido_saida_id: pedido.id,
        produto_nome: newProductName.trim(),
        quantidade: parseInt(newQuantity) || 1
      });

      setItems(prev => [...prev, newItem]);
      setNewProductName('');
      setNewQuantity('1');
      
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto",
        variant: "destructive"
      });
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deletePedidoItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover produto",
        variant: "destructive"
      });
    }
  };

  const handleFinalizarPedido = async () => {
    if (!pedido) return;

    try {
      await updatePedido(pedido.id, { status: 'Finalizado' });
      setPedido(prev => prev ? { ...prev, status: 'Finalizado' } : null);
      
      toast({
        title: "Sucesso",
        description: "Pedido finalizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao finalizar pedido",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <PageTemplate title="Carregando..." icon={FileText}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageTemplate>
    );
  }

  if (!pedido) {
    return (
      <PageTemplate title="Pedido não encontrado" icon={FileText}>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Pedido não encontrado</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Editar Pedido" icon={FileText}>
      <div className="space-y-6">
        {/* Success Alert */}
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Pedido criado com sucesso, adicione os produtos
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Editar Pedido
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              #Pedido de Saída Almoxarifado: {pedido.numero_pedido}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Pedido Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data da Saída *</label>
                  <Input
                    type="date"
                    value={pedido.data_saida}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsável *</label>
                  <Select disabled>
                    <SelectTrigger className="bg-muted">
                      <SelectValue placeholder={pedido.responsavel_id} />
                    </SelectTrigger>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cliente *</label>
                  <Select disabled>
                    <SelectTrigger className="bg-muted">
                      <SelectValue placeholder={pedido.cliente_id} />
                    </SelectTrigger>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Referente ao</label>
                  <Input
                    value={pedido.referencia_contrato || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-start gap-3">
                <Button 
                  onClick={handleFinalizarPedido}
                  disabled={pedido.status === 'Finalizado'}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Finalizar Pedido
                </Button>
                <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Alterar
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar Pedido
                </Button>
                <Button variant="outline" onClick={onBack}>
                  Voltar
                </Button>
              </div>

              {/* Products Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Produto</label>
                    <Input
                      placeholder="Digite o nome do produto"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddItem();
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantidade</label>
                    <Input
                      type="number"
                      min="1"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddItem}
                    disabled={!newProductName.trim() || isAddingItem}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isAddingItem ? 'Adicionando...' : 'Adicionar'}
                  </Button>
                </div>

                {/* Products Table */}
                {items.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-medium">Produto</th>
                          <th className="text-left p-3 font-medium">Quantidade</th>
                          <th className="text-left p-3 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3">{item.produto_nome}</td>
                            <td className="p-3">{item.quantidade}</td>
                            <td className="p-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {items.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum produto adicionado ainda
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}