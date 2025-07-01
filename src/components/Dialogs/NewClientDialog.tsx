
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

interface NewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewClientDialog: React.FC<NewClientDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    tipoPessoa: 'pessoa-fisica',
    nome: '',
    email: '',
    telefone: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "O campo Nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.tipoPessoa) {
      toast({
        title: "Erro de validação",
        description: "Selecione o tipo de pessoa.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Criando novo cliente:', formData);
    
    toast({
      title: "Cliente cadastrado com sucesso!",
      description: `O cliente "${formData.nome}" foi cadastrado.`,
    });

    // Reset form and close dialog
    setFormData({
      tipoPessoa: 'pessoa-fisica',
      nome: '',
      email: '',
      telefone: ''
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    const hasChanges = formData.nome || formData.email || formData.telefone || formData.tipoPessoa !== 'pessoa-fisica';
    
    if (hasChanges) {
      if (window.confirm('Deseja descartar as alterações?')) {
        setFormData({
          tipoPessoa: 'pessoa-fisica',
          nome: '',
          email: '',
          telefone: ''
        });
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="text-sm text-gray-500">
            <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => onOpenChange(false)}>
              Clientes
            </span>
            {' > '}
            <span>Novo Cliente</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Dados do Cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-700">
                Tipo de Pessoa <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.tipoPessoa}
                onValueChange={(value) => handleInputChange('tipoPessoa', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="pessoa-fisica" 
                    id="pessoa-fisica"
                    className="border-gray-300 text-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="pessoa-fisica" className="text-gray-700 cursor-pointer">
                    Pessoa Física
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="pessoa-juridica" 
                    id="pessoa-juridica"
                    className="border-gray-300 text-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="pessoa-juridica" className="text-gray-700 cursor-pointer">
                    Pessoa Jurídica
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome" className="text-base font-medium text-gray-700">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite o nome completo"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium text-gray-700">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="exemplo@email.com"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2">
                Contato
              </h3>
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-base font-medium text-gray-700">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              CANCELAR
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              CONFIRMAR
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientDialog;
