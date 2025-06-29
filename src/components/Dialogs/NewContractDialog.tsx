
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Contract {
  id: string;
  cliente: string;
  projeto: string;
  dataAssinatura: string;
  status: string;
  valor: string;
}

interface NewContractDialogProps {
  onAdd: (contract: Omit<Contract, 'id'>) => void;
  children: React.ReactNode;
}

const NewContractDialog: React.FC<NewContractDialogProps> = ({ onAdd, children }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    projeto: '',
    dataAssinatura: '',
    status: 'Em Análise',
    valor: '',
  });
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (formData.cliente && formData.projeto && formData.valor) {
      onAdd(formData);
      setFormData({
        cliente: '',
        projeto: '',
        dataAssinatura: '',
        status: 'Em Análise',
        valor: '',
      });
      setOpen(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Contrato</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente *</Label>
            <Input
              id="cliente"
              value={formData.cliente}
              onChange={(e) => handleInputChange('cliente', e.target.value)}
              placeholder="Ex: João Silva"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projeto">Projeto *</Label>
            <Input
              id="projeto"
              value={formData.projeto}
              onChange={(e) => handleInputChange('projeto', e.target.value)}
              placeholder="Ex: Cozinha Modulada"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataAssinatura">Data de Assinatura</Label>
            <Input
              id="dataAssinatura"
              type="date"
              value={formData.dataAssinatura}
              onChange={(e) => handleInputChange('dataAssinatura', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valor">Valor *</Label>
            <Input
              id="valor"
              value={formData.valor}
              onChange={(e) => handleInputChange('valor', e.target.value)}
              placeholder="Ex: R$ 25.000,00"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!formData.cliente || !formData.projeto || !formData.valor}>
            Criar Contrato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewContractDialog;
