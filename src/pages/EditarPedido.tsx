import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Eye, FileText, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePurchaseOrders, PurchaseOrder, PurchaseOrderItem } from "@/hooks/usePurchaseOrders";
import { useToast } from "@/hooks/use-toast";

interface EditarPedidoProps {
  orderId: string;
  onBack: () => void;
}

const EditarPedido: React.FC<EditarPedidoProps> = ({ orderId, onBack }) => {
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const { 
    getPurchaseOrder, 
    getPurchaseOrderItems, 
    addPurchaseOrderItem, 
    deletePurchaseOrderItem,
    loading 
  } = usePurchaseOrders();
  const { toast } = useToast();

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    const orderData = await getPurchaseOrder(orderId);
    if (orderData) {
      setOrder(orderData);
      const itemsData = await getPurchaseOrderItems(orderId);
      setItems(itemsData);
    } else {
      toast({
        title: "Erro",
        description: "Pedido não encontrado.",
        variant: "destructive",
      });
      onBack();
    }
  };

  const handleAddProduct = async () => {
    if (!newProductName.trim() || !newQuantity.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome do produto e a quantidade.",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(newQuantity);
    if (quantity <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    const newItem = await addPurchaseOrderItem({
      purchase_order_id: orderId,
      product_name: newProductName.trim(),
      quantity: quantity,
      unit_price: 0,
    });

    if (newItem) {
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso!",
      });
      setItems([...items, newItem]);
      setNewProductName('');
      setNewQuantity('');
      // Reload to get updated total
      loadOrderData();
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const success = await deletePurchaseOrderItem(itemId);
    if (success) {
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso!",
      });
      setItems(items.filter(item => item.id !== itemId));
      // Reload to get updated total
      loadOrderData();
    }
  };

  if (!order) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Editar Pedido</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl">
          <div className="bg-card rounded-lg border p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-4">Detalhes do pedido manual</p>
            
            <h2 className="text-xl font-semibold text-foreground mb-6">
              # Pedido de Compra Almoxarifado: {order.order_number}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Data do Pedido */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data do Pedido</Label>
                <Input
                  value={format(new Date(order.order_date), "dd/MM/yyyy", { locale: ptBR })}
                  readOnly
                  className="bg-muted"
                />
              </div>

              {/* Fornecedor */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fornecedor*</Label>
                <Input
                  value={order.supplier}
                  readOnly
                  className="bg-muted"
                />
              </div>

              {/* Responsável */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Responsável*</Label>
                <Input
                  value={order.responsible}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button className="bg-success hover:bg-success/90 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Faturar
              </Button>
              <Button variant="outline" className="bg-primary hover:bg-primary/90 text-white border-primary">
                <Edit className="h-4 w-4 mr-2" />
                Alterar
              </Button>
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                <Eye className="h-4 w-4 mr-2" />
                Visualizar Pedido
              </Button>
              <Button variant="outline" onClick={onBack}>
                Voltar
              </Button>
            </div>

            {/* Product Addition */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Produto</Label>
                <Input
                  placeholder="Digite o nome do produto..."
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quantidade</Label>
                <Input
                  type="number"
                  placeholder="Quantidade"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddProduct}
                  disabled={loading}
                  className="bg-success hover:bg-success/90 text-white w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Products Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Sub-total</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        Nenhum produto adicionado ainda
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>R$ {item.subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Total */}
            <div className="flex justify-end mt-4">
              <div className="text-lg font-semibold">
                Total: R$ {order.total_amount?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarPedido;