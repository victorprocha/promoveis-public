
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { projectService } from '@/services/projectService';

interface NewProjectDialogProps {
  children: React.ReactNode;
  onProjectCreated?: () => void;
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ children, onProjectCreated }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    description: '',
    consultant: '',
    environments: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do projeto é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.clientName.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do cliente é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Create a simple project without client ID for now
      await projectService.createSimpleProject({
        title: formData.projectName,
        clientName: formData.clientName,
        description: formData.description,
        consultant: formData.consultant,
        environments: formData.environments,
        priority: formData.priority as any
      });

      toast({
        title: "Projeto criado com sucesso!",
        description: `O projeto "${formData.projectName}" foi criado.`,
      });

      // Reset form and close dialog
      setFormData({
        projectName: '',
        clientName: '',
        description: '',
        consultant: '',
        environments: '',
        priority: 'normal'
      });
      setOpen(false);
      
      // Call callback if provided
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar projeto",
        description: error.message || "Ocorreu um erro ao criar o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Nome do Projeto *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Digite o nome do projeto"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Nome do cliente"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição do projeto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consultant">Consultor</Label>
              <Input
                id="consultant"
                value={formData.consultant}
                onChange={(e) => handleInputChange('consultant', e.target.value)}
                placeholder="Nome do consultor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="environments">Ambientes</Label>
              <Input
                id="environments"
                value={formData.environments}
                onChange={(e) => handleInputChange('environments', e.target.value)}
                placeholder="Quantidade de ambientes"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#28A745] hover:bg-[#218838]" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Projeto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
