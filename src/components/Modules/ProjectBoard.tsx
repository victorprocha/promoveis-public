
import React, { useState } from 'react';
import { Search, MoreVertical, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import KanbanColumn from './ProjectBoard/KanbanColumn';
import ProjectCard from './ProjectBoard/ProjectCard';

interface Project {
  id: string;
  title: string;
  client: string;
  projectNumber: string;
  status: 'Normal' | 'Pendente' | 'Atrasado';
  itemsCount: string;
  columnId: string;
}

interface Column {
  id: string;
  title: string;
  projects: Project[];
}

const ProjectBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlow, setSelectedFlow] = useState('padrao');
  const [activeId, setActiveId] = useState<string | null>(null);

  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'assinatura',
      title: 'Assinatura do Contrato',
      projects: [
        {
          id: 'proj-1',
          title: 'Maria Silva',
          client: 'Maria Silva',
          projectNumber: '12345',
          status: 'Normal',
          itemsCount: '0/1',
          columnId: 'assinatura'
        },
        {
          id: 'proj-2',
          title: 'João Santos',
          client: 'João Santos',
          projectNumber: '12346',
          status: 'Pendente',
          itemsCount: '0/3',
          columnId: 'assinatura'
        }
      ]
    },
    {
      id: 'medicao',
      title: 'Medição dos Ambientes',
      projects: [
        {
          id: 'proj-3',
          title: 'Ana Costa',
          client: 'Ana Costa',
          projectNumber: '12347',
          status: 'Normal',
          itemsCount: '2/8',
          columnId: 'medicao'
        }
      ]
    },
    {
      id: 'revisao',
      title: 'Revisão dos Ambientes',
      projects: [
        {
          id: 'proj-4',
          title: 'Carlos Lima',
          client: 'Carlos Lima',
          projectNumber: '12348',
          status: 'Atrasado',
          itemsCount: '1/5',
          columnId: 'revisao'
        }
      ]
    },
    {
      id: 'compra',
      title: 'Compra dos Itens dos Ambientes',
      projects: []
    },
    {
      id: 'entrega',
      title: 'Entrega dos Ambientes',
      projects: []
    },
    {
      id: 'montagem',
      title: 'Montagem',
      projects: []
    }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find(col => 
      col.projects.some(project => project.id === activeId)
    );
    const overColumn = columns.find(col => 
      col.id === overId || col.projects.some(project => project.id === overId)
    );

    if (!activeColumn || !overColumn) return;
    if (activeColumn.id === overColumn.id) return;

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const activeColumnIndex = newColumns.findIndex(col => col.id === activeColumn.id);
      const overColumnIndex = newColumns.findIndex(col => col.id === overColumn.id);

      const activeProject = activeColumn.projects.find(project => project.id === activeId);
      if (!activeProject) return prevColumns;

      // Remove from active column
      newColumns[activeColumnIndex].projects = activeColumn.projects.filter(
        project => project.id !== activeId
      );

      // Add to over column
      const updatedProject = { ...activeProject, columnId: overColumn.id };
      newColumns[overColumnIndex].projects = [...overColumn.projects, updatedProject];

      return newColumns;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  const activeProject = activeId ? 
    columns.flatMap(col => col.projects).find(project => project.id === activeId) : null;

  return (
    <div className="flex flex-col h-full bg-[#ECF0F5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-[#007BFF] rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Painel de Projetos</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedFlow} onValueChange={setSelectedFlow}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Fluxo de venda padrão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="padrao">Fluxo de venda padrão</SelectItem>
              <SelectItem value="express">Fluxo express</SelectItem>
              <SelectItem value="premium">Fluxo premium</SelectItem>
            </SelectContent>
          </Select>
          
          <Button size="icon" variant="outline" className="text-[#007BFF] border-[#007BFF]">
            <Search className="h-4 w-4" />
          </Button>
          
          <Button size="icon" variant="outline">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="h-full overflow-x-auto overflow-y-hidden">
            <div className="flex gap-6 p-6 min-w-max h-full">
              {columns.map((column) => (
                <SortableContext key={column.id} items={column.projects.map(p => p.id)}>
                  <KanbanColumn
                    column={column}
                    projects={column.projects}
                  />
                </SortableContext>
              ))}
            </div>
          </div>
          
          <DragOverlay>
            {activeProject && <ProjectCard project={activeProject} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default ProjectBoard;
