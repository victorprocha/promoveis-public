
import React, { useState, useEffect } from 'react';
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
import { useClients } from '@/hooks/useClients';
import { useSpecifiers } from '@/hooks/useSpecifiers';
import { useAuth } from '@/hooks/useAuth';
import { projectService } from '@/services/projectService';
import { useProjectContext } from '@/contexts/ProjectContext';
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
  onProjectCreated?: () => void;
}

const NewProjectWithClientDialog: React.FC<NewProjectWithClientDialogProps> = ({ 
  open, 
  onOpenChange, 
  onProjectCreated 
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    consultant: '',
    environments: '',
    priority: 'Normal',
    deliveryDeadline: '',
    specifierId: ''
  });
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientSelection, setShowClientSelection] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: clientsData } = useClients();
  const { specifiers } = useSpecifiers();
  const { refetch } = useProjectContext();

  // Set default consultant to authenticated user's name
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, consultant: user.name }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setShowClientSelection(false);
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

    if (!selectedClient) {
      toast({
        title: "Erro de validação",
        description: "Selecione um cliente para o projeto.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Cliente selecionado no dialog:', selectedClient);
      
      await projectService.createProject({
        title: formData.projectName,
        clientId: selectedClient.id,
        description: formData.description,
        priority: formData.priority as any,
        consultant: formData.consultant,
        environments: formData.environments,
        deliveryDeadline: formData.deliveryDeadline || undefined,
        specifierId: formData.specifierId || undefined
      });

      toast({
        title: "Projeto criado com sucesso!",
        description: `O projeto "${formData.projectName}" foi criado para o cliente ${selectedClient.nome || selectedClient.name}.`,
      });

      // Reset form and close dialog
      setFormData({
        projectName: '',
        description: '',
        consultant: user?.name || '',
        environments: '',
        priority: 'Normal',
        deliveryDeadline: '',
        specifierId: ''
      });
      setSelectedClient(null);
      
      // Atualizar a lista de projetos imediatamente
      await refetch();
      
      // Notificar o componente pai para atualizar a lista
      if (onProjectCreated) {
        onProjectCreated();
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: error.message || "Ocorreu um erro ao criar o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = formData.projectName || formData.description || 
                      formData.environments || selectedClient || formData.priority !== 'Normal' ||
                      formData.consultant !== (user?.name || '') || formData.deliveryDeadline ||
                      formData.specifierId;
    
    if (hasChanges) {
      if (window.confirm('Deseja descartar as alterações?')) {
        setFormData({
          projectName: '',
          description: '',
          consultant: user?.name || '',
          environments: '',
          priority: 'Normal',
          deliveryDeadline: '',
          specifierId: ''
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
                    <p className="font-medium text-gray-800">{selectedClient.nome || selectedClient.name}</p>
                    <p className="text-sm text-gray-600">{selectedClient.email || 'Email não informado'}</p>
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
                  Consultor Executor <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="consultant"
                    value={formData.consultant}
                    readOnly
                    className="border-gray-300 bg-gray-50 text-gray-700 rounded-md cursor-not-allowed"
                  />
                </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-base font-medium text-gray-700">
                  Prioridade
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDeadline" className="text-base font-medium text-gray-700">
                  Prazo de Entrega
                </Label>
                <Input
                  id="deliveryDeadline"
                  type="date"
                  value={formData.deliveryDeadline}
                  onChange={(e) => handleInputChange('deliveryDeadline', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifierId" className="text-base font-medium text-gray-700">
                Especificador
              </Label>
              <Select value={formData.specifierId} onValueChange={(value) => handleInputChange('specifierId', value)}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                  <SelectValue placeholder="Selecione um especificador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum especificador</SelectItem>
                  {specifiers.map((specifier) => (
                    <SelectItem key={specifier.id} value={specifier.id}>
                      {specifier.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleCancel}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                disabled={loading}
              >
                CANCELAR
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'CRIANDO...' : 'CONFIRMAR'}
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
