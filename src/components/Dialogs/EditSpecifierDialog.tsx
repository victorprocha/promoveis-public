
import React, { useState, useEffect } from 'react';
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
import { Edit } from 'lucide-react';

interface SpecifierFormData {
  nome: string;
  contato: string;
  especialidade: string;
  email: string;
}

interface Specifier {
  id: string;
  nome: string;
  contato: string | null;
  especialidade: string | null;
  email: string;
}

interface EditSpecifierDialogProps {
  specifier: Specifier;
  onUpdate: (id: string, data: SpecifierFormData) => Promise<void>;
}

const EditSpecifierDialog: React.FC<EditSpecifierDialogProps> = ({ specifier, onUpdate }) => {
  const [formData, setFormData] = useState<SpecifierFormData>({
    nome: specifier.nome,
    contato: specifier.contato || '',
    especialidade: specifier.especialidade || '',
    email: specifier.email,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      nome: specifier.nome,
      contato: specifier.contato || '',
      especialidade: specifier.especialidade || '',
      email: specifier.email,
    });
  }, [specifier]);

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
      await onUpdate(specifier.id, formData);
      
      setOpen(false);
      
      toast({
        title: "Especificador atualizado",
        description: "O especificador foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar especificador:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar especificador. Tente novamente.",
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
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Especificador</DialogTitle>
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
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpecifierDialog;
