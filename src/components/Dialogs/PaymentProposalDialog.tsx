import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Minus, Calculator, CreditCard } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreatePaymentProposalData } from "@/hooks/usePaymentProposals";

interface PaymentProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreatePaymentProposalData) => Promise<void>;
  totalAmount: number;
  proposalCount: number;
}

export const PaymentProposalDialog: React.FC<PaymentProposalDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  totalAmount,
  proposalCount,
}) => {
  const [proposalName, setProposalName] = useState('');
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [downPaymentEnabled, setDownPaymentEnabled] = useState(false);
  const [downPaymentType, setDownPaymentType] = useState<'percentage' | 'fixed'>('percentage');
  const [downPaymentValue, setDownPaymentValue] = useState('');
  const [installmentsCount, setInstallmentsCount] = useState(1);
  const [installments, setInstallments] = useState<Array<{
    due_date: string;
    amount: number;
    payment_method: string;
    notes: string;
  }>>([]);

  const paymentMethods = [
    'Pix',
    'Boleto',
    'Cartão de Crédito',
    'Cartão de Débito',
    'Transferência Bancária',
    'Dinheiro',
    'Cheque'
  ];

  // Calculate real-time values
  const calculateValues = () => {
    let totalWithDiscount = totalAmount;
    
    if (discountEnabled && discountValue) {
      const discount = parseFloat(discountValue);
      if (discountType === 'percentage') {
        totalWithDiscount = totalAmount * (1 - discount / 100);
      } else {
        totalWithDiscount = totalAmount - discount;
      }
    }

    let downPaymentAmount = 0;
    if (downPaymentEnabled && downPaymentValue) {
      const downPayment = parseFloat(downPaymentValue);
      if (downPaymentType === 'percentage') {
        downPaymentAmount = totalWithDiscount * (downPayment / 100);
      } else {
        downPaymentAmount = downPayment;
      }
    }

    const remainingAmount = totalWithDiscount - downPaymentAmount;
    const installmentAmount = installmentsCount > 0 ? remainingAmount / installmentsCount : 0;

    return {
      totalWithDiscount,
      downPaymentAmount,
      remainingAmount,
      installmentAmount
    };
  };

  const values = calculateValues();

  // Generate installments when count changes
  useEffect(() => {
    const newInstallments = [];
    const { downPaymentAmount, installmentAmount } = values;
    
    // Add down payment if enabled
    if (downPaymentEnabled && downPaymentAmount > 0) {
      newInstallments.push({
        due_date: format(new Date(), 'yyyy-MM-dd'),
        amount: downPaymentAmount,
        payment_method: 'Pix',
        notes: 'Entrada'
      });
    }

    // Add regular installments
    for (let i = 0; i < installmentsCount; i++) {
      const dueDate = addDays(new Date(), (i + 1) * 30); // 30 days apart
      newInstallments.push({
        due_date: format(dueDate, 'yyyy-MM-dd'),
        amount: installmentAmount,
        payment_method: 'Pix',
        notes: ''
      });
    }

    setInstallments(newInstallments);
  }, [installmentsCount, discountEnabled, discountValue, discountType, downPaymentEnabled, downPaymentValue, downPaymentType, totalAmount]);

  // Initialize proposal name
  useEffect(() => {
    if (open) {
      setProposalName(`Proposta ${proposalCount + 1}`);
    }
  }, [open, proposalCount]);

  const handleSave = async () => {
    const proposalData: CreatePaymentProposalData = {
      name: proposalName,
      discount_type: discountEnabled ? discountType : undefined,
      discount_value: discountEnabled ? parseFloat(discountValue) : undefined,
      down_payment_type: downPaymentEnabled ? downPaymentType : undefined,
      down_payment_value: downPaymentEnabled ? parseFloat(downPaymentValue) : undefined,
      installments_count: installmentsCount,
      installments: installments
    };

    await onSave(proposalData);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setProposalName('');
    setDiscountEnabled(false);
    setDiscountValue('');
    setDownPaymentEnabled(false);
    setDownPaymentValue('');
    setInstallmentsCount(1);
    setInstallments([]);
  };

  const updateInstallment = (index: number, field: string, value: any) => {
    setInstallments(prev => 
      prev.map((installment, i) => 
        i === index ? { ...installment, [field]: value } : installment
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Nova Proposta de Pagamento
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="proposalName">Nome da Proposta</Label>
                <Input
                  id="proposalName"
                  value={proposalName}
                  onChange={(e) => setProposalName(e.target.value)}
                  placeholder="Ex: Proposta 1"
                />
              </div>

              {/* Discount Section */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Desconto</CardTitle>
                    <Switch
                      checked={discountEnabled}
                      onCheckedChange={setDiscountEnabled}
                    />
                  </div>
                </CardHeader>
                {discountEnabled && (
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex gap-2">
                      <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="fixed">R$</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder="0"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Down Payment Section */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Entrada</CardTitle>
                    <Switch
                      checked={downPaymentEnabled}
                      onCheckedChange={setDownPaymentEnabled}
                    />
                  </div>
                </CardHeader>
                {downPaymentEnabled && (
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex gap-2">
                      <Select value={downPaymentType} onValueChange={(value: 'percentage' | 'fixed') => setDownPaymentType(value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="fixed">R$</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={downPaymentValue}
                        onChange={(e) => setDownPaymentValue(e.target.value)}
                        placeholder="0"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Installments Count */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Parcelas</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInstallmentsCount(Math.max(1, installmentsCount - 1))}
                      disabled={installmentsCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{installmentsCount}x</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInstallmentsCount(installmentsCount + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Valor Original:</span>
                    <span>R$ {totalAmount.toFixed(2)}</span>
                  </div>
                  {discountEnabled && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto:</span>
                      <span>- R$ {(totalAmount - values.totalWithDiscount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total com Desconto:</span>
                    <span>R$ {values.totalWithDiscount.toFixed(2)}</span>
                  </div>
                  {downPaymentEnabled && (
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>Entrada:</span>
                      <span>R$ {values.downPaymentAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Valor das Parcelas:</span>
                    <span>R$ {values.installmentAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Installments Table */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <h3 className="font-medium">Configuração das Parcelas</h3>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 p-3 border-b">
                <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                  <span>Vencimento</span>
                  <span>Valor (R$)</span>
                  <span>Forma Pagto.</span>
                  <span>Observação</span>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {installments.map((installment, index) => (
                  <div key={index} className="p-2 border-b last:border-b-0">
                    <div className="grid grid-cols-4 gap-2">
                      <Input
                        type="date"
                        value={installment.due_date}
                        onChange={(e) => updateInstallment(index, 'due_date', e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        value={installment.amount}
                        onChange={(e) => updateInstallment(index, 'amount', parseFloat(e.target.value))}
                        step="0.01"
                        className="text-sm"
                      />
                      <Select
                        value={installment.payment_method}
                        onValueChange={(value) => updateInstallment(index, 'payment_method', value)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map(method => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={installment.notes}
                        onChange={(e) => updateInstallment(index, 'notes', e.target.value)}
                        placeholder="Observação"
                        className="text-sm"
                      />
                    </div>
                    {installment.notes === 'Entrada' && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Entrada
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!proposalName.trim()}>
            Salvar Proposta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};