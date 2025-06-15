
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Home, Users, Calendar, BarChart3, Settings, FileText, ClipboardList, FolderOpen, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'comercial',
    title: 'Comercial',
    icon: Users,
    children: [
      { id: 'projetos', title: 'Cadastro de Projetos', icon: FolderOpen },
      { id: 'carteira', title: 'Acompanhamento de Carteira', icon: ClipboardList },
      { id: 'clientes', title: 'Clientes', icon: Users },
    ]
  },
  {
    id: 'pos-venda',
    title: 'Pós-Venda',
    icon: FileText,
    children: [
      { id: 'pedidos', title: 'Pedidos', icon: FileText },
      { id: 'entregas', title: 'Entregas', icon: FileText },
    ]
  },
  {
    id: 'agendas',
    title: 'Agendas',
    icon: Calendar,
  },
  {
    id: 'estatisticas',
    title: 'Estatísticas',
    icon: BarChart3,
  },
  {
    id: 'sistema',
    title: 'Sistema',
    icon: Settings,
    children: [
      { id: 'usuarios', title: 'Usuários', icon: Users },
      { id: 'configuracoes', title: 'Configurações', icon: Settings },
    ]
  },
];

const quickAccessItems = [
  { id: 'projetos', title: 'Projetos', icon: FolderOpen },
  { id: 'carteira', title: 'Acompanhamento de Carteira', icon: ClipboardList },
  { id: 'dashboard', title: 'Painel de Projetos', icon: BarChart3 },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeModule, onModuleChange }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['comercial']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = activeModule === item.id;

    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left h-auto py-2 px-3 text-white hover:bg-[#3A4F64] rounded-none",
            depth > 0 && "pl-6",
            isActive && "bg-[#007BFF] hover:bg-[#0066CC]"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.id);
            } else {
              onModuleChange(item.id);
            }
          }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.title}</span>
            </div>
            {hasChildren && (
              isExpanded ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => {}}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#2A3F54] border-r border-[#1A2332] z-30 transition-transform duration-300 ease-in-out",
        "w-64 custom-scrollbar overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* User Profile Section */}
        <div className="p-4 border-b border-[#1A2332]">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-[#007BFF] text-white">
                EV
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Enzo Vargas Santos</div>
              <div className="text-gray-300 text-xs">Consultor</div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-300" />
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-[#FFC107]" />
            <span className="text-gray-300 text-xs font-medium uppercase tracking-wide">
              ACESSO RÁPIDO
            </span>
          </div>
          <div className="space-y-1">
            {quickAccessItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-auto py-2 px-3 text-white hover:bg-[#3A4F64] rounded-none",
                  activeModule === item.id && "bg-[#007BFF] hover:bg-[#0066CC]"
                )}
                onClick={() => onModuleChange(item.id)}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.title}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-[#FFC107]" />
            <span className="text-gray-300 text-xs font-medium uppercase tracking-wide">
              NAVEGAÇÃO
            </span>
          </div>
          <div className="space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
