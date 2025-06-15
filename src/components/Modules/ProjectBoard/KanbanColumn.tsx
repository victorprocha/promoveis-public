
import React from 'react';
import { GripVertical, FileText } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import ProjectCard from './ProjectCard';

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

interface KanbanColumnProps {
  column: Column;
  projects: Project[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, projects }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col w-80 bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-800 text-sm leading-tight">{column.title}</h3>
          <span className="bg-[#E3F2FD] text-[#007BFF] text-xs px-2 py-1 rounded-full font-medium">
            {projects.length}
          </span>
        </div>
        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className="flex-1 p-4 overflow-y-auto custom-scrollbar"
        style={{ minHeight: '400px' }}
      >
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Nenhum registro encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
