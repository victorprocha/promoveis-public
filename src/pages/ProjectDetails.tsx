import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { projectService } from '@/services/projectService';
import { useProject, Project } from '@/hooks/useProject';
import { ProjectEnvironment } from '@/types/projectEnvironment';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormEvent } from 'react';
import ImportedXmlData from '@/components/ImportedXmlData';

interface ProjectDetailsProps {
  projectId?: string;
  onBack?: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, onBack }) => {
  const { project, loading, error, refetch } = useProject(projectId || '');
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    status: 'Normal' as 'Normal' | 'Pendente' | 'Atrasado' | 'Concluído',
    environment: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const formatDate = (date: Date | null): string => {
    if (!date) return '—';
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const handleDelete = async () => {
    if (!project) return;

    try {
      await projectService.deleteProject(project.id);
      setShowDeleteDialog(false);
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir projeto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    if (project) {
      setEditFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        environment: project.environment || '',
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
      });
      setShowEditDialog(true);
    }
  };

  const handleSaveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!project) return;

    try {
      const updatedProjectData = {
        name: editFormData.name,
        description: editFormData.description,
        status: editFormData.status,
        environment: editFormData.environment,
        startDate: editFormData.startDate,
        endDate: editFormData.endDate,
      };
      
      await projectService.updateProject(project.id, updatedProjectData);
      setShowEditDialog(false);
      refetch();
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto",
        variant: "destructive",
      });
    }
  };

  if (loading === 'loading') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="text-sm text-gray-500">
            Projetos &gt; Detalhes do Projeto
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <CardTitle>Carregando...</CardTitle>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="text-sm text-gray-500">
            Projetos &gt; Detalhes do Projeto
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Projeto não encontrado</h2>
            <p className="text-gray-600 mb-4">O projeto solicitado não foi encontrado.</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="text-sm text-gray-500">
          Projetos &gt; Detalhes do Projeto
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Project Header */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-[#2A3F54]">{project.name}</h1>
                  <p className="text-sm text-gray-500">{project.description || 'Sem descrição'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      {project.status}
                    </Badge>
                    {project.environment && (
                      <Badge variant="outline">
                        {project.environment}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="text-[#007BFF] border-[#007BFF]"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="text-red-600 border-red-600"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Data */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg text-[#2A3F54]">Informações do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data de Início</Label>
                  <p className="text-gray-900">{formatDate(project.startDate ? new Date(project.startDate) : null)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data de Término</Label>
                  <p className="text-gray-900">{formatDate(project.endDate ? new Date(project.endDate) : null)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <p className="text-gray-900">{project.status || 'Não definido'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Ambiente</Label>
                  <p className="text-gray-900">{project.environment || 'Não definido'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Importados do XML Section */}
          {project?.n8nData && (
            <ImportedXmlData data={project.n8nData} />
          )}

          {/* Environments Section */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-[#2A3F54]">
                  Ambientes do Projeto
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {project.environments && project.environments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.environments.map((env: ProjectEnvironment) => (
                    <div key={env.id} className="bg-white rounded-lg shadow-md p-4">
                      <h3 className="font-semibold text-gray-800">{env.name}</h3>
                      <p className="text-gray-600">{env.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum ambiente cadastrado.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          VOLTAR
        </Button>
      </div>

      {/* Dialogs */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o projeto <strong>{project?.name}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={editFormData.status} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, status: value as 'Normal' | 'Pendente' | 'Atrasado' | 'Concluído' })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Atrasado">Atrasado</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </div>
            <Button type="submit">Salvar Alterações</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetails;
