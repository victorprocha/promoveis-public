
import React from 'react';
import { Search, Filter, Plus, MoreVertical, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PageTemplateProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  searchPlaceholder?: string;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
  onSearchChange?: (value: string) => void;
  onClearFilters?: () => void;
  children: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  icon: Icon,
  searchPlaceholder = "Pesquisar...",
  showAddButton = true,
  addButtonText = "NOVO",
  onAddClick,
  onSearchChange,
  onClearFilters,
  children
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-[#2A3F54]" />
            <h1 className="text-xl font-semibold text-[#2A3F54]">{title}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="text-gray-600 border-gray-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              LIMPAR FILTROS
            </Button>
            
            {showAddButton && (
              <Button
                onClick={onAddClick}
                className="bg-[#28A745] hover:bg-[#218838] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            )}
            
            <Button variant="outline" size="icon" className="bg-[#FFC107] border-[#FFC107] hover:bg-[#E0A800]">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" className="border-gray-300">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;
