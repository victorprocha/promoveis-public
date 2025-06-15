
import React from 'react';
import { ArrowRight, Camera, CheckSquare } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  title: string;
  client: string;
  projectNumber: string;
  status: 'Normal' | 'Pendente' | 'Atrasado';
  itemsCount: string;
  columnId: string;
}

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Atrasado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getItemIcon = () => {
    // Alternating between camera and checklist icons for variety
    return project.id.includes('1') || project.id.includes('3') ? Camera : CheckSquare;
  };

  const ItemIcon = getItemIcon();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      {/* Status Tag */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Project Info */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">#{project.projectNumber}</p>
        <p className="font-medium text-gray-800 text-sm leading-tight">{project.title}</p>
      </div>

      {/* Items Counter and Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-500">
          <ItemIcon className="h-4 w-4" />
          <span className="text-xs">{project.itemsCount}</span>
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-[#28A745] hover:bg-green-50"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Move project or view details:', project.id);
          }}
        >
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
