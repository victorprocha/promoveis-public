
import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderOpen, 
  BarChart3, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Kanban,
  Users,
  Building,
  Package,
  Wrench,
  Calendar,
  TrendingUp,
  Settings,
  GraduationCap,
  ShoppingCart,
  Truck,
  FileText,
  User,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  isOpen: boolean;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  hasSubmenu?: boolean;
  submenu?: MenuItem[];
}

interface SubmenuState {
  [key: string]: boolean;
}

interface FlyoutPosition {
  top: number;
  left: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeModule, onModuleChange }) => {
  const [openSubmenus, setOpenSubmenus] = useState<SubmenuState>({});
  const [flyoutPosition, setFlyoutPosition] = useState<FlyoutPosition>({ top: 0, left: 0 });
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  const quickAccessItems = [
    { id: 'projetos', label: 'Projetos', icon: FolderOpen },
    { id: 'carteira', label: 'Acompanhamento de Carteira', icon: BarChart3 },
    { id: 'painel-projetos', label: 'Painel de Projetos', icon: Kanban },
  ];

  const navigationItems: MenuItem[] = [
    {
      id: 'comercial',
      label: 'Comercial',
      icon: ShoppingCart,
      hasSubmenu: true,
      submenu: [
        { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'especificadores', label: 'Especificadores', icon: User },
        { id: 'projetos-comercial', label: 'Projetos', icon: FolderOpen },
        { id: 'contratos', label: 'Contratos', icon: FileText },
        {
          id: 'relatorios-comercial',
          label: 'Relatórios',
          icon: FileText,
          hasSubmenu: true,
          submenu: [
            { id: 'acompanhamento-carteira', label: 'Acompanhamento de Carteira', icon: BarChart3 }
          ]
        }
      ]
    },
    {
      id: 'pos-venda',
      label: 'Pós-Venda',
      icon: Truck,
      hasSubmenu: true,
      submenu: [
        {
          id: 'revisoes',
          label: 'Revisões',
          icon: Search,
          hasSubmenu: true,
          submenu: [
            { id: 'revisao-ambientes', label: 'Revisão de Ambientes', icon: Building }
          ]
        },
        {
          id: 'entrega-montagem',
          label: 'Entrega e Montagem',
          icon: Package,
          hasSubmenu: true,
          submenu: [
            { id: 'entregas', label: 'Entregas', icon: Truck },
            { id: 'montagem', label: 'Montagem', icon: Wrench }
          ]
        },
        {
          id: 'assistencia-tecnica',
          label: 'Assistência Técnica',
          icon: Wrench,
          hasSubmenu: true,
          submenu: [
            { id: 'assistencias', label: 'Assistências', icon: Wrench }
          ]
        },
        {
          id: 'relatorios-pos-venda',
          label: 'Relatórios',
          icon: FileText,
          hasSubmenu: true,
          submenu: [
            { id: 'previsao-embarque', label: 'Previsão de Embarque', icon: Truck },
            { id: 'assistencias-relatorio', label: 'Assistências', icon: Wrench }
          ]
        }
      ]
    },
    {
      id: 'agendas',
      label: 'Agendas',
      icon: Calendar,
      hasSubmenu: true,
      submenu: [
        { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
        { id: 'compromissos', label: 'Compromissos', icon: Clock },
        { id: 'historicos', label: 'Históricos', icon: FileText },
        {
          id: 'configuracoes-agenda',
          label: 'Configurações',
          icon: Settings,
          hasSubmenu: true,
          submenu: [
            { id: 'permissoes-acesso', label: 'Permissões de Acesso', icon: Users }
          ]
        }
      ]
    },
    {
      id: 'estatisticas',
      label: 'Estatísticas',
      icon: TrendingUp,
      hasSubmenu: true,
      submenu: [
        { id: 'vendas-stats', label: 'Vendas', icon: ShoppingCart },
        { id: 'projetos-stats', label: 'Projetos', icon: FolderOpen },
        { id: 'financeiro-stats', label: 'Financeiro', icon: BarChart3 }
      ]
    },
    {
      id: 'enterprise',
      label: 'Enterprise',
      icon: Building,
      hasSubmenu: true,
      submenu: [
        { id: 'cadastro-produtos', label: 'Cadastro de Produtos', icon: Package },
        { id: 'painel-projetos-enterprise', label: 'Painel de Projetos', icon: Kanban }
      ]
    },
    {
      id: 'sistema',
      label: 'Sistema',
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { id: 'usuarios', label: 'Usuários', icon: Users },
        { id: 'colaborador', label: 'Colaborador', icon: User }
      ]
    },
    {
      id: 'treinamentos',
      label: 'Treinamentos',
      icon: GraduationCap,
      hasSubmenu: true,
      submenu: [
        { id: 'comercial-treinamento', label: 'Comercial', icon: ShoppingCart },
        { id: 'treinamento-comercial', label: 'Treinamento Comercial', icon: GraduationCap }
      ]
    }
  ];

  const handleItemClick = (item: MenuItem, event: React.MouseEvent, level: number = 0) => {
    event.stopPropagation();
    
    if (item.hasSubmenu) {
      const rect = event.currentTarget.getBoundingClientRect();
      const sidebarRect = sidebarRef.current?.getBoundingClientRect();
      
      setFlyoutPosition({
        top: rect.top - (sidebarRect?.top || 0),
        left: level === 0 ? 256 : rect.right - (sidebarRect?.left || 0)
      });
      setActiveFlyout(item.id);
    } else {
      // Navigate to the selected module
      onModuleChange(item.id);
      setActiveFlyout(null);
      setOpenSubmenus({});
    }
  };

  const handleSubmenuItemClick = (item: MenuItem, event: React.MouseEvent) => {
    handleItemClick(item, event, 1);
  };

  const closeFlyouts = () => {
    setActiveFlyout(null);
    setOpenSubmenus({});
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        flyoutRef.current &&
        !flyoutRef.current.contains(event.target as Node)
      ) {
        closeFlyouts();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderFlyout = (items: MenuItem[], parentId: string) => {
    if (activeFlyout !== parentId) return null;

    return (
      <div
        ref={flyoutRef}
        className="fixed bg-[#1E2226] border-l border-[#3A4F64] shadow-lg z-50 min-w-[200px] max-h-[400px] overflow-y-auto custom-scrollbar"
        style={{
          top: `${flyoutPosition.top + 64}px`,
          left: `${flyoutPosition.left}px`,
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={(e) => handleSubmenuItemClick(item, e)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-200 hover:bg-[#2A3F54] hover:text-white transition-colors border-b border-[#333] last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
              {item.hasSubmenu && <ChevronRight className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
    );
  };

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
        ref={sidebarRef}
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
                    onClick={(e) => handleItemClick(item, e)}
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

      {/* Render flyouts */}
      {activeFlyout && navigationItems.map((item) => 
        item.submenu && renderFlyout(item.submenu, item.id)
      )}

      {/* Render nested flyouts */}
      {activeFlyout && navigationItems.map((parentItem) =>
        parentItem.submenu?.map((subItem) =>
          subItem.submenu && activeFlyout === subItem.id && renderFlyout(subItem.submenu, subItem.id)
        )
      )}
    </>
  );
};

export default Sidebar;
