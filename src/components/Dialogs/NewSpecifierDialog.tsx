
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

interface Specifier {
  nome: string;
  contato: string;
  especialidade: string;
  email: string;
}

interface NewSpecifierDialogProps {
  onAdd: (specifier: Specifier) => void;
  children: React.ReactNode;
}

const NewSpecifierDialog: React.FC<NewSpecifierDialogProps> = ({ onAdd, children }) => {
  const [formData, setFormData] = useState<Specifier>({
    nome: '',
    contato: '',
    especialidade: '',
    email: '',
  });
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (formData.nome && formData.email) {
      onAdd(formData);
      setFormData({
        nome: '',
        contato: '',
        especialidade: '',
        email: '',
      });
      setOpen(false);
    }
  };

  const handleInputChange = (field: keyof Specifier, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Especificador</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Arq. Roberto Lima"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contato">Contato</Label>
            <Input
              id="contato"
              value={formData.contato}
              onChange={(e) => handleInputChange('contato', e.target.value)}
              placeholder="Ex: (11) 99999-1234"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="especialidade">Especialidade</Label>
            <Input
              id="especialidade"
              value={formData.especialidade}
              onChange={(e) => handleInputChange('especialidade', e.target.value)}
              placeholder="Ex: Arquitetura Residencial"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Ex: roberto@email.com"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!formData.nome || !formData.email}>
            Adicionar Especificador
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSpecifierDialog;
