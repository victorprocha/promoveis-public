import React, { useState } from 'react';
import PageTemplate from '@/components/Layout/PageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NovoPedidoSaidaProps {
  onBack: () => void;
}

export default function NovoPedidoSaida({ onBack }: NovoPedidoSaidaProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    dataSaida: '',
    responsavel: '',
    cliente: '',
    referenciaContrato: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dataSaida || !formData.responsavel || !formData.cliente) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would save the data to your database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Sucesso",
        description: "Pedido de saída criado com sucesso!",
        variant: "default"
      });
      
      onBack();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar pedido de saída. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTemplate title="Pedido de Saída do Almoxarifado" icon={FileText}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dataSaida" className="text-sm font-medium">
                    Data da Saída *
                  </label>
                  <Input
                    id="dataSaida"
                    type="date"
                    value={formData.dataSaida}
                    onChange={(e) => handleInputChange('dataSaida', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="responsavel" className="text-sm font-medium">
                    Responsável *
                  </label>
                  <Select onValueChange={(value) => handleInputChange('responsavel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joao-silva">João Silva</SelectItem>
                      <SelectItem value="maria-santos">Maria Santos</SelectItem>
                      <SelectItem value="carlos-oliveira">Carlos Oliveira</SelectItem>
                      <SelectItem value="ana-costa">Ana Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="cliente" className="text-sm font-medium">
                    Cliente *
                  </label>
                  <Select onValueChange={(value) => handleInputChange('cliente', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente-a">Cliente A</SelectItem>
                      <SelectItem value="cliente-b">Cliente B</SelectItem>
                      <SelectItem value="cliente-c">Cliente C</SelectItem>
                      <SelectItem value="cliente-d">Cliente D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="referenciaContrato" className="text-sm font-medium">
                    Referente ao contrato
                  </label>
                  <Input
                    id="referenciaContrato"
                    placeholder="Ex: Contrato n° 15"
                    value={formData.referenciaContrato}
                    onChange={(e) => handleInputChange('referenciaContrato', e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-start gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? 'Salvando...' : 'Continuar'}
                </Button>
                <Button type="button" variant="outline" onClick={onBack}>
                  Voltar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}