
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
}

const ProjectRegistration: React.FC<ProjectRegistrationProps> = ({ onBack }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientSelection, setShowClientSelection] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [consultant, setConsultant] = useState('Enzo Vargas Santos');
  const { toast } = useToast();

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

    try {
      // Simular chamada de API
      console.log('Criando projeto:', {
        cliente: selectedClient,
        nome: projectName,
        consultor: consultant
      });

      toast({
        title: "Projeto criado com sucesso!",
        description: `O projeto "${projectName}" foi criado para o cliente ${selectedClient.nome}.`,
      });

      // Reset form
      setSelectedClient(null);
      setProjectName('');
      setConsultant('Enzo Vargas Santos');
      
      if (onBack) {
        onBack();
      }
    } catch (error) {
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    const hasChanges = selectedClient || projectName.trim() || consultant !== 'Enzo Vargas Santos';
    
    if (hasChanges) {
      if (window.confirm('Deseja descartar as alterações?')) {
        setSelectedClient(null);
        setProjectName('');
        setConsultant('Enzo Vargas Santos');
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

                <div className="space-y-2">
                  <Label htmlFor="consultant" className="text-base font-medium text-gray-700">
                    Consultor Executor <span className="text-red-500">*</span>
                  </Label>
                  <Select value={consultant} onValueChange={setConsultant}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Selecione o consultor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enzo Vargas Santos">Enzo Vargas Santos</SelectItem>
                      <SelectItem value="Maria Oliveira">Maria Oliveira</SelectItem>
                      <SelectItem value="Carlos Santos">Carlos Santos</SelectItem>
                      <SelectItem value="Roberto Lima">Roberto Lima</SelectItem>
                      <SelectItem value="Fernanda Souza">Fernanda Souza</SelectItem>
                    </SelectContent>
                  </Select>
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
          >
            CANCELAR
          </Button>

          <div className="flex gap-4">
            {!selectedClient && (
              <Button 
                variant="ghost" 
                onClick={() => setShowClientSelection(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
              >
                INFORMAR CLIENTE
              </Button>
            )}
            
            {selectedClient && (
              <Button 
                onClick={handleCreateProject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                CRIAR PROJETO
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
