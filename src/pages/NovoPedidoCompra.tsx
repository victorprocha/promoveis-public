import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrders";
import { useToast } from "@/hooks/use-toast";

interface NovoPedidoCompraProps {
  onBack: () => void;
  onOrderCreated: (orderId: string) => void;
}

const NovoPedidoCompra: React.FC<NovoPedidoCompraProps> = ({ onBack, onOrderCreated }) => {
  const [dataPedido, setDataPedido] = useState<Date>();
  const [fornecedor, setFornecedor] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const { createPurchaseOrder, loading } = usePurchaseOrders();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataPedido || !fornecedor || !responsavel) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const order = await createPurchaseOrder({
      order_date: format(dataPedido, "yyyy-MM-dd"),
      supplier: fornecedor,
      responsible: responsavel,
    });

    if (order) {
      toast({
        title: "Sucesso",
        description: "Pedido de compra criado com sucesso!",
      });
      onOrderCreated(order.id);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao criar pedido de compra.",
        variant: "destructive",
      });
    }
  };

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
        <h1 className="text-2xl font-semibold text-foreground">Pedido de Compra do Armazenado</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-medium text-foreground mb-6">Detalhes do pedido</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Data do Pedido */}
                <div className="space-y-2">
                  <Label htmlFor="data-pedido" className="text-sm font-medium">
                    Data do Pedido*
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataPedido && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataPedido ? format(dataPedido, "dd/MM/yyyy") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataPedido}
                        onSelect={setDataPedido}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Fornecedor */}
                <div className="space-y-2">
                  <Label htmlFor="fornecedor" className="text-sm font-medium">
                    Fornecedor*
                  </Label>
                  <Select value={fornecedor} onValueChange={setFornecedor}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fornecedor1">Fornecedor 1</SelectItem>
                      <SelectItem value="fornecedor2">Fornecedor 2</SelectItem>
                      <SelectItem value="fornecedor3">Fornecedor 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Responsável */}
                <div className="space-y-2">
                  <Label htmlFor="responsavel" className="text-sm font-medium">
                    Responsável*
                  </Label>
                  <Select value={responsavel} onValueChange={setResponsavel}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="responsavel1">Responsável 1</SelectItem>
                      <SelectItem value="responsavel2">Responsável 2</SelectItem>
                      <SelectItem value="responsavel3">Responsável 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="px-8"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-success hover:bg-success/90 text-white px-8"
                >
                  {loading ? 'Salvando...' : 'Continuar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovoPedidoCompra;