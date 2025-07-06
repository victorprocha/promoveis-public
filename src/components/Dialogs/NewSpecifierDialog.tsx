
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
import { useToast } from '@/hooks/use-toast';

interface SpecifierFormData {
  nome: string;
  contato: string;
  especialidade: string;
  email: string;
}

interface NewSpecifierDialogProps {
  onAdd: (specifier: SpecifierFormData) => Promise<void>;
  children: React.ReactNode;
}

const NewSpecifierDialog: React.FC<NewSpecifierDialogProps> = ({ onAdd, children }) => {
  const [formData, setFormData] = useState<SpecifierFormData>({
    nome: '',
    contato: '',
    especialidade: '',
    email: '',
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!formData.nome || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e e-mail são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await onAdd(formData);
      
      setFormData({
        nome: '',
        contato: '',
        especialidade: '',
        email: '',
      });
      setOpen(false);
      
      toast({
        title: "Especificador adicionado",
        description: "O especificador foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao adicionar especificador:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar especificador. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SpecifierFormData, value: string) => {
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
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contato">Contato</Label>
            <Input
              id="contato"
              value={formData.contato}
              onChange={(e) => handleInputChange('contato', e.target.value)}
              placeholder="Ex: (11) 99999-1234"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="especialidade">Especialidade</Label>
            <Input
              id="especialidade"
              value={formData.especialidade}
              onChange={(e) => handleInputChange('especialidade', e.target.value)}
              placeholder="Ex: Arquitetura Residencial"
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!formData.nome || !formData.email || loading}>
            {loading ? 'Adicionando...' : 'Adicionar Especificador'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSpecifierDialog;
