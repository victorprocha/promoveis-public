
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Edit, Upload, Plus, Receipt, Calendar, Users, Paperclip, TrendingUp, Save, X, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProjectDetailsProps {
  projectId?: string;
  onBack?: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, onBack }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dados-projeto');
  const [project, setProject] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [specifier, setSpecifier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<any>(null);
  const [specifiers, setSpecifiers] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  
  const id = projectId || params.id;

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      
      try {
        // Buscar dados do projeto com especificador
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            *,
            specifiers!projects_specifier_id_fkey (
              id,
              nome,
              email,
              especialidade
            )
          `)
          .eq('id', id)
          .single();

        if (projectError) {
          console.error('Erro ao buscar projeto:', projectError);
        } else {
          setProject(projectData);
          setEditedProject(projectData);
          
          if (projectData?.specifiers) {
            setSpecifier(projectData.specifiers);
          }
          
          // Buscar dados do cliente usando client_name
          if (projectData?.client_name) {
            const { data: clientData, error: clientError } = await supabase
              .from('clients')
              .select('*')
              .eq('name', projectData.client_name)
              .single();

            if (clientError) {
              console.error('Erro ao buscar cliente:', clientError);
            } else {
              setClient(clientData);
            }
          }
        }

        // Buscar especificadores para dropdown
        const { data: specifiersData, error: specifiersError } = await supabase
          .from('specifiers')
          .select('*')
          .order('nome');

        if (specifiersError) {
          console.error('Erro ao buscar especificadores:', specifiersError);
        } else {
          setSpecifiers(specifiersData || []);
        }

        // Buscar colaboradores para dropdown
        const { data: collaboratorsData, error: collaboratorsError } = await supabase
          .from('collaborators')
          .select('*')
          .order('name');

        if (collaboratorsError) {
          console.error('Erro ao buscar colaboradores:', collaboratorsError);
        } else {
          setCollaborators(collaboratorsData || []);
        }

        // Buscar clientes para dropdown
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .order('name');

        if (clientsError) {
          console.error('Erro ao buscar clientes:', clientsError);
        } else {
          setClients(clientsData || []);
        }

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const navigationItems = [
    { id: 'dados-projeto', label: 'Dados do Projeto', icon: Edit },
    { id: 'ambientes', label: 'Ambientes', icon: Edit },
    { id: 'itens-avulsos', label: 'Itens Avulsos', icon: Receipt },
    { id: 'orcamentos', label: 'Orçamentos', icon: Receipt },
    { id: 'contratos', label: 'Contratos', icon: Receipt },
    { id: 'pedidos-compra', label: 'Pedidos de Compra', icon: Receipt },
    { id: 'assistencias', label: 'Assistências Técnicas', icon: Users },
    { id: 'agendas', label: 'Agendas do Projeto', icon: Calendar },
    { id: 'envolvidos', label: 'Envolvidos', icon: Users },
    { id: 'anexos', label: 'Anexos', icon: Paperclip },
    { id: 'concorrentes', label: 'Concorrentes', icon: TrendingUp }
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => item.id);
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProject(project);
  };

  const handleSaveEdit = async () => {
    try {
      // Preparar dados para atualização
      const updateData: any = {
        name: editedProject.name,
        description: editedProject.description,
        delivery_deadline: editedProject.delivery_deadline
      };

      // Se o especificador foi alterado
      if (editedProject.specifier_id !== project.specifier_id) {
        updateData.specifier_id = editedProject.specifier_id;
      }

      // Se o cliente foi alterado, atualizar client_name
      if (editedProject.client_name !== project.client_name) {
        updateData.client_name = editedProject.client_name;
        
        // Buscar dados do novo cliente
        const selectedClient = clients.find(c => c.name === editedProject.client_name);
        if (selectedClient) {
          updateData.client_email = selectedClient.email;
          updateData.client_phone = selectedClient.phone;
          setClient(selectedClient);
        }
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', project.id);

      if (error) {
        throw error;
      }

      // Atualizar especificador se foi alterado
      if (editedProject.specifier_id !== project.specifier_id) {
        const selectedSpecifier = specifiers.find(s => s.id === editedProject.specifier_id);
        setSpecifier(selectedSpecifier);
      }

      setProject(editedProject);
      setIsEditing(false);
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso!"
      });
      
      handleBack();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir projeto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProject((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECF0F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#ECF0F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Projeto não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECF0F5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Cadastro de Projetos</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            Detalhes do Projeto
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Main Content - Left Column */}
        <div className="flex-1 p-6 pr-3">
          <div className="space-y-6">
            {/* Client Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{project.client_name}</h3>
                      <p className="text-gray-600">{client?.phone || project.client_phone || 'Telefone não informado'}</p>
                      <p className="text-gray-600">{client?.email || project.client_email || 'Email não informado'}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Project Data Section */}
            <section id="dados-projeto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Dados do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing && (
                    <div className="flex items-center justify-end gap-2 mb-4">
                      <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                      {isEditing ? (
                        <Input
                          value={editedProject?.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">{project.name}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                      {isEditing ? (
                        <Select value={editedProject?.client_name || ''} onValueChange={(value) => handleInputChange('client_name', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.name}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">{project.client_name}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consultor Responsável</label>
                      {isEditing ? (
                        <Select value={editedProject?.consultor_responsavel || user?.name || ''} onValueChange={(value) => handleInputChange('consultor_responsavel', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um consultor" />
                          </SelectTrigger>
                          <SelectContent>
                            {collaborators.map((collaborator) => (
                              <SelectItem key={collaborator.id} value={collaborator.name}>
                                {collaborator.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">{editedProject?.consultor_responsavel || user?.name || 'Usuário'}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consultor Executor</label>
                      {isEditing ? (
                        <Select value={editedProject?.consultor_executor || user?.name || ''} onValueChange={(value) => handleInputChange('consultor_executor', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um consultor" />
                          </SelectTrigger>
                          <SelectContent>
                            {collaborators.map((collaborator) => (
                              <SelectItem key={collaborator.id} value={collaborator.name}>
                                {collaborator.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">{editedProject?.consultor_executor || user?.name || 'Usuário'}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Projetista</label>
                      {isEditing ? (
                        <Select value={editedProject?.projetista || user?.name || ''} onValueChange={(value) => handleInputChange('projetista', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um projetista" />
                          </SelectTrigger>
                          <SelectContent>
                            {collaborators.map((collaborator) => (
                              <SelectItem key={collaborator.id} value={collaborator.name}>
                                {collaborator.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">{editedProject?.projetista || user?.name || 'Usuário'}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Especificador</label>
                      {isEditing ? (
                        <Select value={editedProject?.specifier_id || ''} onValueChange={(value) => handleInputChange('specifier_id', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um especificador" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Nenhum especificador</SelectItem>
                            {specifiers.map((spec) => (
                              <SelectItem key={spec.id} value={spec.id}>
                                {spec.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">{specifier?.nome || 'Não informado'}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prazo de Entrega</label>
                      {isEditing ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !editedProject?.delivery_deadline && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editedProject?.delivery_deadline ? 
                                format(new Date(editedProject.delivery_deadline), "dd/MM/yyyy") : 
                                "Selecione uma data"
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={editedProject?.delivery_deadline ? new Date(editedProject.delivery_deadline) : undefined}
                              onSelect={(date) => handleInputChange('delivery_deadline', date ? date.toISOString().split('T')[0] : '')}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">
                          {project.delivery_deadline ? new Date(project.delivery_deadline).toLocaleDateString('pt-BR') : 'Não definido'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                      {isEditing ? (
                        <Input
                          value={editedProject?.endereco_entrega || client?.address || ''}
                          onChange={(e) => handleInputChange('endereco_entrega', e.target.value)}
                          placeholder="Digite o endereço de entrega"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">
                          {editedProject?.endereco_entrega || client?.address ? 
                            `${editedProject?.endereco_entrega || client?.address}, ${client?.city || ''} - ${client?.state || ''}` : 
                            'Endereço não informado'
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    {isEditing ? (
                      <Textarea
                        value={editedProject?.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{project.description || 'Nenhuma observação'}</div>
                    )}
                  </div>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Importar Arquivo do Projeto</p>
                    <p className="text-sm text-gray-500">Arraste o arquivo ou clique para selecionar</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Environments Section */}
            <section id="ambientes">
              <Card>
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Ambientes
                    </CardTitle>
                    <Button size="icon" className="bg-green-600 hover:bg-green-700 rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Ambiente</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Situação</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Última alteração em</TableHead>
                        <TableHead>Valor Bruto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Nenhum registro encontrado
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="p-4 bg-green-50 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">TOTAL DOS AMBIENTES</span>
                      <span className="text-green-600 font-bold text-lg">R$ 0,00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Other sections with similar structure */}
            {navigationItems.slice(2).map((item) => (
              <section key={item.id} id={item.id}>
                <Card>
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </CardTitle>
                      <Button size="icon" className="bg-green-600 hover:bg-green-700 rounded-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-center py-8 text-gray-500">
                      Nenhum registro encontrado
                    </div>
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>
        </div>

        {/* Right Navigation Column */}
        <div className="w-64 p-6 pl-3">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Navegação</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar - Adjusted for sidebar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center justify-center max-w-full">
          <div className="flex items-center justify-between w-full max-w-6xl">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                VOLTAR
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <button className="text-blue-600 hover:underline">TROCAR CLIENTE</button>
                <span className="text-gray-400">|</span>
                <button className="text-blue-600 hover:underline">HISTÓRICO</button>
                <span className="text-gray-400">|</span>
                <button className="text-blue-600 hover:underline">CANCELAR PROJETO</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    EXCLUIR
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Projeto</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não poderá ser desfeita. Tem certeza que deseja excluir este projeto permanentemente?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Sim, excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button 
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                EDITAR
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing to avoid fixed bar overlap */}
      <div className="h-20"></div>
    </div>
  );
};

export default ProjectDetails;
