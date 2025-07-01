
import React from 'react';
import { GripVertical, FileText } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';

interface KanbanColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, children }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col w-80 bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-800 text-sm leading-tight">{title}</h3>
          <span className="bg-[#E3F2FD] text-[#007BFF] text-xs px-2 py-1 rounded-full font-medium">
            {React.Children.count(children)}
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
        {React.Children.count(children) === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Nenhum registro encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
