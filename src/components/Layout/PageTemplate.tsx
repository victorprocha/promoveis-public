
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
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Page Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60 px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-sm">
              <Icon className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
              <p className="text-sm text-slate-500 mt-0.5">Gerencie seus {title.toLowerCase()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-72 border-slate-200/60 bg-white/80 backdrop-blur-sm focus:bg-white transition-all duration-200 shadow-sm"
              />
            </div>
            
            {customAddButton || (
              <Button
                onClick={onAddClick}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 border-amber-400 text-white rounded-lg w-11 h-11 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageTemplate;
