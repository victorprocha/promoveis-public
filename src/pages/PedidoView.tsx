import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePurchaseOrders, PurchaseOrder, PurchaseOrderItem } from "@/hooks/usePurchaseOrders";

interface PedidoViewProps {
  orderId: string;
}

const PedidoView: React.FC<PedidoViewProps> = ({ orderId }) => {
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const { getPurchaseOrder, getPurchaseOrderItems } = usePurchaseOrders();

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    const orderData = await getPurchaseOrder(orderId);
    if (orderData) {
      setOrder(orderData);
      const itemsData = await getPurchaseOrderItems(orderId);
      setItems(itemsData);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Print Button - Hidden in print */}
      <div className="fixed top-4 right-4 print:hidden">
        <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      {/* Document Content */}
      <div className="max-w-4xl mx-auto p-8 print:p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">SEU LOGO<br />AQUI</span>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p className="font-bold text-lg text-black">Nome da sua empresa</p>
            <p>00.000.000/0001-00</p>
            <p>Rua São João, nº 123 A Tupi - Natal - RN</p>
            <p>E-mail: email@gmail.com - Fone: 0000-0000</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold">PEDIDO DE COMPRA ALMOXARIFADO N°{order.order_number}</h1>
        </div>

        {/* Supplier and Responsible */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-2">Fornecedor</h3>
            <div className="text-sm">
              <p className="font-semibold">{order.supplier}</p>
              <p>1 - 1</p>
              <p>2 - 1</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Responsável</h3>
            <div className="text-sm">
              <p>{order.responsible}</p>
              <p>Telefone: -</p>
              <p>Email: {order.responsible.toLowerCase()}@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-8">
          <h3 className="font-bold mb-4">Lista dos produtos</h3>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-2 text-left">Produto</th>
                <th className="border border-gray-400 p-2 text-center">Quantidade</th>
                <th className="border border-gray-400 p-2 text-right">Sub-total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-400 p-2">{item.product_name}</td>
                  <td className="border border-gray-400 p-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-400 p-2 text-right">R$ {item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
              {/* Empty rows for spacing */}
              {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, index) => (
                <tr key={`empty-${index}`}>
                  <td className="border border-gray-400 p-2 h-8">&nbsp;</td>
                  <td className="border border-gray-400 p-2">&nbsp;</td>
                  <td className="border border-gray-400 p-2">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Total */}
          <div className="flex justify-between items-center mt-4">
            <div></div>
            <div className="text-right">
              <p className="text-sm">Total: R$ {order.total_amount?.toFixed(2) || '0.00'}</p>
              <p className="text-lg font-bold mt-2">Valor Total: R$ {order.total_amount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="text-left text-sm text-gray-600">
          <p>Natal, {format(new Date(order.order_date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.</p>
        </div>
      </div>
    </div>
  );
};

export default PedidoView;