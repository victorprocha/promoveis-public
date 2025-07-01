import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Users, Calendar, AlertCircle, Clock, Package, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './ProjectBoard/KanbanColumn';
import ProjectCard from './ProjectBoard/ProjectCard';
import { projectService } from '@/services/projectService';
import { KanbanColumn as KanbanColumnType, Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

interface ProjectBoardProps {
  onNewProject?: () => void;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ onNewProject }) => {
  const [columns, setColumns] = useState<KanbanColumnType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const kanbanData = await projectService.getKanbanProjects();
        setColumns(kanbanData);
      } catch (error) {
        toast({
          title: "Erro ao carregar projetos",
          description: "Ocorreu um erro ao carregar os projetos. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data) {
      setActiveProject(event.active.data.current as Project);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveProject(null);

    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      try {
        await projectService.updateProjectStatus(activeId, overId);

        setColumns(prevColumns => {
          const newColumns = prevColumns.map(column => ({
            ...column,
            projects: column.projects.filter(project => project.id !== activeId)
          }));

          const targetColumn = newColumns.find(column => column.id === overId);
          const projectToMove = prevColumns
            .flatMap(column => column.projects)
            .find(project => project.id === activeId);

          if (targetColumn && projectToMove) {
            targetColumn.projects.push(projectToMove);
          }

          return newColumns;
        });

        toast({
          title: "Status do projeto atualizado",
          description: "O status do projeto foi atualizado com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro ao atualizar status do projeto",
          description: "Ocorreu um erro ao atualizar o status do projeto. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewProject = () => {
    if (onNewProject) {
      onNewProject();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-[#2A3F54]">Painel de Projetos</h1>
            </div>
            <Button 
              onClick={handleNewProject}
              className="bg-[#28A745] hover:bg-[#218838] text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Projeto
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projetos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-[#2A3F54]">Painel de Projetos</h1>
          </div>
          <Button 
            onClick={handleNewProject}
            className="bg-[#28A745] hover:bg-[#218838] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-4">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto">
            {columns.map((column) => (
              <div key={column.id} className="w-64">
                <KanbanColumn id={column.id} title={column.title}>
                  <SortableContext
                    id={column.id}
                    items={column.projects.map(project => project.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {column.projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </SortableContext>
                </KanbanColumn>
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeProject ? <ProjectCard project={activeProject} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default ProjectBoard;
