
import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LucideIcon } from 'lucide-react';

interface PageTemplateProps {
  title: string;
  icon: LucideIcon;
  searchPlaceholder?: string;
  addButtonText?: string;
  onAddClick?: () => void;
  customAddButton?: React.ReactNode;
  children: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  icon: Icon,
  searchPlaceholder = "Pesquisar...",
  addButtonText = "NOVO ITEM",
  onAddClick,
  customAddButton,
  children
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {customAddButton || (
              <Button
                onClick={onAddClick}
                className="bg-[#28A745] hover:bg-[#218838] text-white font-medium px-4 py-2 rounded-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className="bg-[#FFC107] border-[#FFC107] hover:bg-[#E0A800] rounded-full w-10 h-10"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;
