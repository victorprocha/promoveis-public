import React from 'react';
import { 
  FolderOpen, 
  BarChart3, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Kanban
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  isOpen: boolean;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const navigationItems = [
  { id: 'clientes', label: 'Clientes', icon: FolderOpen },
  { id: 'fornecedores', label: 'Fornecedores', icon: FolderOpen },
  { id: 'produtos', label: 'Produtos', icon: FolderOpen },
  { id: 'servicos', label: 'Serviços', icon: FolderOpen },
  { id: 'financeiro', label: 'Financeiro', icon: FolderOpen },
  { id: 'relatorios', label: 'Relatórios', icon: FolderOpen },
  { id: 'configuracoes', label: 'Configurações', icon: FolderOpen },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeModule, onModuleChange }) => {
  const quickAccessItems = [
    { id: 'projetos', label: 'Projetos', icon: FolderOpen },
    { id: 'carteira', label: 'Acompanhamento de Carteira', icon: BarChart3 },
    { id: 'painel-projetos', label: 'Painel de Projetos', icon: Kanban },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => onModuleChange(activeModule)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-[#2A3F54] text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 custom-scrollbar overflow-y-auto
        `}
      >
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
              <p className="text-sm font-medium">Enzo Vargas Santos</p>
              <ChevronDown className="h-4 w-4 text-gray-300 mt-1" />
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
            ACESSO RÁPIDO
          </h3>
          <nav className="space-y-1">
            {quickAccessItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onModuleChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                    ${activeModule === item.id 
                      ? 'bg-[#007BFF] text-white' 
                      : 'text-gray-300 hover:bg-[#3A4F64] hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Navigation Section */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-gray-400" />
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              NAVEGAÇÃO
            </h3>
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-[#3A4F64] hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
