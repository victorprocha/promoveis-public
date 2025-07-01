
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ClientSelectionDialog from './ClientSelectionDialog';

interface Client {
  id: string;
  nome: string;
  nomeFantasia?: string;
  cpfcnpj: string;
  nomeConjuge?: string;
}

interface NewProjectWithClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewProjectWithClientDialog: React.FC<NewProjectWithClientDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    consultant: '',
    environments: '',
    priority: 'normal'
  });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientSelection, setShowClientSelection] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do projeto é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedClient) {
      toast({
        title: "Erro de validação",
        description: "Selecione um cliente para o projeto.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Criando novo projeto:', { 
      ...formData, 
      cliente: selectedClient 
    });
    
    toast({
      title: "Projeto criado com sucesso!",
      description: `O projeto "${formData.projectName}" foi criado para o cliente ${selectedClient.nome}.`,
    });

    // Reset form and close dialog
    setFormData({
      projectName: '',
      description: '',
      consultant: '',
      environments: '',
      priority: 'normal'
    });
    setSelectedClient(null);
    onOpenChange(false);
  };

  const handleCancel = () => {
    const hasChanges = formData.projectName || formData.description || formData.consultant || 
                      formData.environments || selectedClient || formData.priority !== 'normal';
    
    if (hasChanges) {
      if (window.confirm('Deseja descartar as alterações?')) {
        setFormData({
          projectName: '',
          description: '',
          consultant: '',
          environments: '',
          priority: 'normal'
        });
        setSelectedClient(null);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="text-sm text-gray-500">
              <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => onOpenChange(false)}>
                Projetos
              </span>
              {' > '}
              <span>Novo Projeto</span>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Dados do Projeto
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção de Cliente */}
            <div className="space-y-2">
              <Label className="text-base font-medium text-gray-700">
                Cliente <span className="text-red-500">*</span>
              </Label>
              {selectedClient ? (
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-800">{selectedClient.nome}</p>
                    <p className="text-sm text-gray-600">{selectedClient.cpfcnpj}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowClientSelection(true)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Alterar
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowClientSelection(true)}
                  className="w-full p-4 h-auto text-blue-600 border-dashed border-2 border-blue-300 hover:bg-blue-50"
                >
                  Clique aqui para informar o Cliente
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-base font-medium text-gray-700">
                Nome do Projeto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Digite o nome do projeto"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium text-gray-700">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrição do projeto"
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consultant" className="text-base font-medium text-gray-700">
                  Consultor
                </Label>
                <Input
                  id="consultant"
                  value={formData.consultant}
                  onChange={(e) => handleInputChange('consultant', e.target.value)}
                  placeholder="Nome do consultor"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environments" className="text-base font-medium text-gray-700">
                  Ambientes
                </Label>
                <Input
                  id="environments"
                  value={formData.environments}
                  onChange={(e) => handleInputChange('environments', e.target.value)}
                  placeholder="Quantidade de ambientes"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-base font-medium text-gray-700">
                Prioridade
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
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

      <ClientSelectionDialog
        open={showClientSelection}
        onOpenChange={setShowClientSelection}
        onClientSelect={handleClientSelect}
      />
    </>
  );
};

export default NewProjectWithClientDialog;
