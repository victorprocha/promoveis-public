
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const SaleForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    product_description: '',
    quantity: '',
    unit_price: '',
    total_amount: '',
    sale_date: '',
    notes: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('sales')
        .insert([
          {
            ...formData,
            quantity: formData.quantity ? parseInt(formData.quantity) : null,
            unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
            total_amount: formData.total_amount ? parseFloat(formData.total_amount) : null,
            user_id: user.id,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Venda registrada com sucesso!",
        description: "A nova venda foi adicionada ao sistema.",
      });

      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        product_description: '',
        quantity: '',
        unit_price: '',
        total_amount: '',
        sale_date: '',
        notes: '',
      });
    } catch (error: any) {
      toast({
        title: "Erro ao registrar venda",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate total amount
    if (name === 'quantity' || name === 'unit_price') {
      const quantity = name === 'quantity' ? parseFloat(value) || 0 : parseFloat(formData.quantity) || 0;
      const unitPrice = name === 'unit_price' ? parseFloat(value) || 0 : parseFloat(formData.unit_price) || 0;
      const total = quantity * unitPrice;
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        total_amount: total > 0 ? total.toFixed(2) : ''
      }));
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Venda</CardTitle>
          <CardDescription>
            Registre uma nova venda no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_name">Nome do Cliente</Label>
                <Input
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="Digite o nome do cliente"
                  required
                />
              </div>

              <div>
                <Label htmlFor="client_email">Email do Cliente</Label>
                <Input
                  id="client_email"
                  name="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={handleChange}
                  placeholder="cliente@email.com"
                />
              </div>

              <div>
                <Label htmlFor="client_phone">Telefone do Cliente</Label>
                <Input
                  id="client_phone"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="sale_date">Data da Venda</Label>
                <Input
                  id="sale_date"
                  name="sale_date"
                  type="date"
                  value={formData.sale_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="unit_price">Preço Unitário</Label>
                <Input
                  id="unit_price"
                  name="unit_price"
                  type="number"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="total_amount">Valor Total</Label>
                <Input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  step="0.01"
                  value={formData.total_amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  readOnly
                />
              </div>
            </div>

            <div>
              <Label htmlFor="product_description">Descrição do Produto</Label>
              <Textarea
                id="product_description"
                name="product_description"
                value={formData.product_description}
                onChange={handleChange}
                placeholder="Descreva o produto vendido"
                required
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Observações adicionais (opcional)"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#28A745] hover:bg-[#218838]"
            >
              {isLoading ? "Registrando..." : "Registrar Venda"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleForm;
