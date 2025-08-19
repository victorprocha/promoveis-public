
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSpecifiers } from '@/hooks/useSpecifiers';
import { projectService } from '@/services/projectService';
import { useProjectContext } from '@/contexts/ProjectContext';
import ClientSelectionDialog from '@/components/Dialogs/ClientSelectionDialog';

interface Client {
  id: string;
  nome: string;
  nomeFantasia?: string;
  cpfcnpj: string;
  nomeConjuge?: string;
}

interface ProjectRegistrationProps {
  onBack?: () => void;
  onProjectCreated?: () => void;
}

const ProjectRegistration: React.FC<ProjectRegistrationProps> = ({ onBack, onProjectCreated }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientSelection, setShowClientSelection] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [description, setDescription] = useState('');
  const [deliveryDeadline, setDeliveryDeadline] = useState('');
  const [specifierId, setSpecifierId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { specifiers } = useSpecifiers();
  const { refetch } = useProjectContext();

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const handleCreateProject = async () => {
    if (!selectedClient) {
      toast({
        title: "Erro de validação",
        description: "Selecione um cliente para o projeto.",
        variant: "destructive",
      });
      return;
    }

    if (!projectName.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do projeto é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      console.log('Cliente selecionado:', selectedClient);
      
      const result = await projectService.createSimpleProject({
        title: projectName.trim(),
        clientName: selectedClient.nome,
        description: description.trim() || undefined,
        consultant: user?.name || 'Usuário',
        environments: '1',
        priority: priority,
        deliveryDeadline: deliveryDeadline || undefined,
        specifierId: specifierId || undefined
      });

      if (result.success) {
        toast({
          title: "Projeto criado com sucesso!",
          description: `O projeto "${projectName}" foi criado para o cliente ${selectedClient.nome}.`,
        });

        // Reset form
        setSelectedClient(null);
        setProjectName('');
        setPriority('Normal');
        setDescription('');
        setDeliveryDeadline('');
        setSpecifierId('');
        
        // Atualizar a lista de projetos imediatamente
        await refetch();
        
        // Notificar o componente pai
        if (onProjectCreated) {
          onProjectCreated();
        }
        
        if (onBack) {
          onBack();
        }
      }
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = selectedClient || projectName.trim() || description.trim() || 
                      priority !== 'Normal' || deliveryDeadline || specifierId;
    
    if (hasChanges) {
      if (window.confirm('Deseja descartar as alterações?')) {
        setSelectedClient(null);
        setProjectName('');
        setPriority('Normal');
        setDescription('');
        setDeliveryDeadline('');
        setSpecifierId('');
        if (onBack) {
          onBack();
        }
      }
    } else {
      if (onBack) {
        onBack();
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Cadastro de Projetos
          </button>
          <span className="text-gray-500">{'>'}</span>
          <span className="text-gray-800">Novo Projeto</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Client Selection Section */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              {!selectedClient ? (
                <div 
                  className="flex items-center gap-6 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                  onClick={() => setShowClientSelection(true)}
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <button className="text-xl text-blue-600 hover:text-blue-800 hover:underline font-medium">
                      Clique aqui para informar o Cliente
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{selectedClient.nome}</h3>
                      <p className="text-gray-600">{selectedClient.cpfcnpj}</p>
                      {selectedClient.nomeFantasia && (
                        <p className="text-sm text-gray-500">{selectedClient.nomeFantasia}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowClientSelection(true)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Alterar Cliente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Data Section */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Dados do Projeto</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-base font-medium text-gray-700">
                    Nome do Projeto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Digite o nome do projeto"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-base font-medium text-gray-700">
                      Prioridade
                    </Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                      value={deliveryDeadline}
                      onChange={(e) => setDeliveryDeadline(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium text-gray-700">
                    Descrição
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Digite uma descrição opcional para o projeto"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consultant" className="text-base font-medium text-gray-700">
                      Consultor Executor <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="consultant"
                      value={user?.name || 'Usuário'}
                      readOnly
                      className="border-gray-300 bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specifier" className="text-base font-medium text-gray-700">
                      Especificador
                    </Label>
                    <Select value={specifierId} onValueChange={setSpecifierId}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Action Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            disabled={isCreating}
          >
            CANCELAR
          </Button>

          <div className="flex gap-4">
            {!selectedClient && (
              <Button 
                variant="ghost" 
                onClick={() => setShowClientSelection(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                disabled={isCreating}
              >
                INFORMAR CLIENTE
              </Button>
            )}
            
            {selectedClient && (
              <Button 
                onClick={handleCreateProject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                disabled={isCreating}
              >
                {isCreating ? 'CRIANDO...' : 'CRIAR PROJETO'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <ClientSelectionDialog
        open={showClientSelection}
        onOpenChange={setShowClientSelection}
        onClientSelect={handleClientSelect}
      />
    </div>
  );
};

export default ProjectRegistration;
