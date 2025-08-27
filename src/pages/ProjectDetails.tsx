
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Edit, Upload, Plus, Receipt, Calendar, Users, Paperclip, TrendingUp, Save, X, CalendarIcon, FileText, CheckCircle2, Trash2 } from 'lucide-react';
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
import { ImportPromobXMLDialog } from '@/components/Dialogs/ImportPromobXMLDialog';
import { orcamentoService } from '@/services/orcamentoService';

interface ProjectDetailsProps {
  projectId?: string;
  onBack?: () => void;
}

// Interface para os dados retornados pelo n8n
interface N8nResponse {
  dadosCliente: {
    numeroCliente: string;
    descricao: string;
    data: string;
    logo: string;
  };
  resumoFinanceiro: {
    ipi: number;
    descontos: number;
    total: number;
  };
  ambientes: Array<{
    descricao: string;
    uniqueId: string;
    valorAmbiente: number;
    itens: Array<{
      descricao: string;
      quantidade: number;
      preco: number;
    }>;
  }>;
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
  const [xmlData, setXmlData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [n8nData, setN8nData] = useState<N8nResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

        // Buscar dados XML do projeto se existir
        const { data: xmlDataResult, error: xmlError } = await supabase
          .from('project_xml_data')
          .select('*')
          .eq('project_id', id)
          .maybeSingle();

        if (xmlError && xmlError.code !== 'PGRST116') {
          console.error('Erro ao buscar dados XML:', xmlError);
        } else if (xmlDataResult) {
          setXmlData(xmlDataResult);
        }

        // Buscar orçamentos do Promob
        await fetchOrcamentos();

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const fetchOrcamentos = async () => {
    if (!id) return;
    
    try {
      const orcamentosData = await orcamentoService.getOrcamentosByProject(id);
      setOrcamentos(orcamentosData || []);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
    }
  };

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

  const sendFileToN8N = async (file: File): Promise<N8nResponse> => {
    console.log('[N8N] Enviando arquivo para n8n webhook...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('[N8N] Enviando FormData com arquivo:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const response = await fetch('https://victorprocha.app.n8n.cloud/webhook-test/leitorxml', {
        method: 'POST',
        body: formData,
      });

      console.log('[N8N] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[N8N] Erro na resposta:', errorText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData: N8nResponse = await response.json();
      console.log('[N8N] Dados recebidos do n8n:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('[N8N] Erro ao conectar com n8n:', error);
      throw error;
    }
  };

  const fillProjectDataFromN8N = (data: N8nResponse) => {
    console.log('[ProjectDetails] Preenchendo campos com dados do n8n:', data);
    
    // Converter data do formato DD/MM/YYYY para YYYY-MM-DD
    const convertDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const updatedProject = {
      ...editedProject,
      name: data.dadosCliente.descricao,
      client_name: data.dadosCliente.numeroCliente,
      delivery_deadline: convertDate(data.dadosCliente.data),
      // Adicionar campos do resumo financeiro ao projeto
      ipi: data.resumoFinanceiro.ipi,
      descontos: data.resumoFinanceiro.descontos,
      total_projeto: data.resumoFinanceiro.total
    };

    setEditedProject(updatedProject);
    setN8nData(data);
    
    toast({
      title: "Sucesso",
      description: "Dados do projeto preenchidos automaticamente!",
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.xml')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo XML válido.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      console.log('[ProjectDetails] Iniciando upload do arquivo XML...');
      
      // Enviar arquivo para o n8n e receber dados processados
      const n8nResponse = await sendFileToN8N(file);
      
      // Preencher campos automaticamente com os dados retornados
      fillProjectDataFromN8N(n8nResponse);
      
      // Upload do arquivo para o storage (mantendo funcionalidade existente)
      const fileName = `${user?.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) {
        console.warn('[ProjectDetails] Erro no upload do storage, mas dados já foram processados:', uploadError);
      } else {
        // Obter URL pública do arquivo
        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(fileName);

        console.log('[ProjectDetails] Arquivo salvo no storage:', publicUrl);
      }

    } catch (error) {
      console.error('[ProjectDetails] Erro ao processar arquivo:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar arquivo XML.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportSuccess = () => {
    setShowImportDialog(false);
    fetchOrcamentos();
  };

  const handleDeleteOrcamento = async (orcamentoId: string) => {
    try {
      await orcamentoService.deleteOrcamento(orcamentoId);
      toast({
        title: "Sucesso",
        description: "Orçamento excluído com sucesso!"
      });
      fetchOrcamentos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir orçamento.",
        variant: "destructive"
      });
    }
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
                        <Select value={editedProject?.consultor_responsavel || user?.name || 'none'} onValueChange={(value) => handleInputChange('consultor_responsavel', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um consultor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhum consultor</SelectItem>
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
                        <Select value={editedProject?.consultor_executor || user?.name || 'none'} onValueChange={(value) => handleInputChange('consultor_executor', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um consultor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhum consultor</SelectItem>
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
                        <Select value={editedProject?.projetista || user?.name || 'none'} onValueChange={(value) => handleInputChange('projetista', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um projetista" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhum projetista</SelectItem>
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
                        <Select value={editedProject?.specifier_id || 'none'} onValueChange={(value) => handleInputChange('specifier_id', value === 'none' ? null : value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um especificador" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhum especificador</SelectItem>
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

                  {/* Resumo Financeiro */}
                  {n8nData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IPI</label>
                        <div className="p-3 bg-white rounded-md font-semibold text-blue-600">
                          R$ {n8nData.resumoFinanceiro.ipi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descontos</label>
                        <div className="p-3 bg-white rounded-md font-semibold text-red-600">
                          R$ {n8nData.resumoFinanceiro.descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total do Projeto</label>
                        <div className="p-3 bg-white rounded-md font-semibold text-green-600">
                          R$ {n8nData.resumoFinanceiro.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  )}

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
                  
                  {/* Import Promob XML Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Importar Arquivo do Projeto (Promob)
                    </label>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xml"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    
                    <div 
                      onClick={handleDropZoneClick}
                      className={`border-2 border-dashed ${uploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'} rounded-lg p-8 text-center transition-colors cursor-pointer`}
                    >
                      {uploading ? (
                        <>
                          <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
                          <p className="text-blue-600 font-medium">Processando arquivo XML...</p>
                          <p className="text-sm text-blue-500 mt-1">Enviando para processamento no n8n</p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">Importar Arquivo XML do Promob</p>
                          <p className="text-sm text-gray-500 mt-1">Clique para selecionar arquivo XML exportado do Promob</p>
                        </>
                      )}
                    </div>
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
                  {n8nData && n8nData.ambientes.length > 0 ? (
                    <div className="p-6">
                      {n8nData.ambientes.map((ambiente, index) => (
                        <div key={ambiente.uniqueId || index} className="mb-6 border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{ambiente.descricao}</h3>
                              <p className="text-sm text-gray-600">
                                {ambiente.itens.length} item(s) no ambiente
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600 text-lg">
                                R$ {ambiente.valorAmbiente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                            </div>
                          </div>
                          
                          {ambiente.itens && ambiente.itens.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-medium mb-3">Itens do Ambiente</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead>Preço</TableHead>
                                    <TableHead>Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {ambiente.itens.map((item, itemIndex) => (
                                    <TableRow key={itemIndex}>
                                      <TableCell className="font-medium">{item.descricao}</TableCell>
                                      <TableCell>{item.quantidade}</TableCell>
                                      <TableCell>R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                      <TableCell className="font-semibold text-green-600">
                                        R$ {(item.quantidade * item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : orcamentos.length > 0 ? (
                    <div className="p-6">
                      {orcamentos.map((orcamento) => (
                        <div key={orcamento.id} className="mb-6 border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{orcamento.ambiente_principal}</h3>
                              <p className="text-sm text-gray-600">
                                Criado em {new Date(orcamento.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div className="font-bold text-green-600 text-lg">
                                  R$ {orcamento.valor_orcamento?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {orcamento.ambientes?.length || 0} ambiente(s)
                                </div>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir Orçamento</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta ação não pode ser desfeita. Tem certeza que deseja excluir este orçamento?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteOrcamento(orcamento.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          
                          {orcamento.ambientes && orcamento.ambientes.length > 0 && (
                            <div className="space-y-3">
                              {orcamento.ambientes.map((ambiente: any) => (
                                <div key={ambiente.id} className="bg-gray-50 p-3 rounded">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">{ambiente.descricao}</h4>
                                      <p className="text-sm text-gray-600">
                                        {ambiente.categorias?.length || 0} categoria(s)
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold text-green-600">
                                        R$ {ambiente.total_orcamento?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum ambiente encontrado. Importe um arquivo XML do Promob para visualizar os dados.
                    </div>
                  )}
                  
                  <div className="p-4 bg-green-50 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">TOTAL DOS AMBIENTES</span>
                      <span className="text-green-600 font-bold text-lg">
                        {n8nData ? (
                          `R$ ${n8nData.resumoFinanceiro.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        ) : (
                          `R$ ${orcamentos.reduce((total, orc) => total + (orc.valor_orcamento || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        )}
                      </span>
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

      {/* Import Dialog */}
      <ImportPromobXMLDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        projectId={id!}
        onImportSuccess={handleImportSuccess}
      />

      {/* Bottom spacing to avoid fixed bar overlap */}
      <div className="h-20"></div>
    </div>
  );
};

export default ProjectDetails;
