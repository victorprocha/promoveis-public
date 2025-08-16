import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface BillingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: {
    id: string;
    order_number: number;
    total_amount: number;
  };
  onBill: (billingData: {
    reference: string;
    bank: string;
    payment_condition: string;
    installments?: number;
    payment_method: string;
    billing_date: string;
    total_amount: number;
  }) => void;
  loading: boolean;
}

const BillingDialog: React.FC<BillingDialogProps> = ({ 
  open, 
  onOpenChange, 
  orderData, 
  onBill, 
  loading 
}) => {
  const [reference, setReference] = useState(`Pedido de Compra ${orderData.order_number}`);
  const [bank, setBank] = useState('');
  const [paymentCondition, setPaymentCondition] = useState('');
  const [installments, setInstallments] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [billingDate, setBillingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [totalAmount, setTotalAmount] = useState(orderData.total_amount.toString());

  // Update total amount when orderData changes
  useEffect(() => {
    setTotalAmount(orderData.total_amount.toString());
  }, [orderData.total_amount]);

  const handleSubmit = () => {
    if (!paymentCondition || !paymentMethod) {
      return;
    }

    const parsedAmount = parseFloat(totalAmount) || 0;

    onBill({
      reference,
      bank,
      payment_condition: paymentCondition,
      installments: paymentCondition === 'a_prazo' ? installments : undefined,
      payment_method: paymentMethod,
      billing_date: billingDate,
      total_amount: parsedAmount,
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Faturar Pedido Entrada Almoxarifado</DialogTitle>  
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reference">Referente a</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bank">Escolha seu banco</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banco_brasil">Banco do Brasil</SelectItem>
                <SelectItem value="caixa">Caixa Econômica</SelectItem>
                <SelectItem value="bradesco">Bradesco</SelectItem>
                <SelectItem value="itau">Itaú</SelectItem>
                <SelectItem value="santander">Santander</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="total">Total R$</Label>
            <Input
              id="total" 
              type="number"
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="payment-condition">Condição de pagamento:</Label>
            <Select value={paymentCondition} onValueChange={setPaymentCondition}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="A vista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a_vista">À vista</SelectItem>
                <SelectItem value="a_prazo">A prazo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentCondition === 'a_prazo' && (
            <div>
              <Label htmlFor="installments">Parcelar em</Label>
              <Input
                id="installments"
                type="number"
                min="2"
                max="12"
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={billingDate}
              onChange={(e) => setBillingDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="payment-method">Forma de pagamento</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Dinheiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="deposito">Depósito em C/C</SelectItem>
                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !paymentCondition || !paymentMethod}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Faturando...' : 'Faturar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingDialog;