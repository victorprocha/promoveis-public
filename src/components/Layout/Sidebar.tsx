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
  Clock,
  Home
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

interface SubmenuItem {
  id: string;
  label: string;
}

interface SubmenuCategory {
  title: string;
  items: SubmenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  hasSubmenu?: boolean;
  submenuCategories?: SubmenuCategory[];
}

interface FlyoutPosition {
  top: number;
  left: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeModule, onModuleChange }) => {
  const { user } = useAuth();
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const [flyoutPosition, setFlyoutPosition] = useState<FlyoutPosition>({ top: 0, left: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  const quickAccessItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
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
      submenuCategories: [
        {
          title: 'VENDAS',
          items: [
            { id: 'clientes', label: 'Clientes' },
            { id: 'especificadores', label: 'Especificadores' },
            { id: 'projetos-comercial', label: 'Projetos' },
            { id: 'contratos', label: 'Contratos' }
          ]
        },
        {
          title: 'RELATÓRIOS',
          items: [{ id: 'acompanhamento-carteira', label: 'Acompanhamento de Carteira' }]
        }
      ]
    },
    {
      id: 'pos-venda',
      label: 'Pós-Venda',
      icon: Truck,
      hasSubmenu: true,
      submenuCategories: [
        {
          title: 'REVISÕES',
          items: [
            { id: 'distribuicao-revisoes', label: 'Distribuição de Revisões' },
            { id: 'revisao-ambientes', label: 'Revisão de Ambientes' },
            { id: 'liberacao-revisao', label: 'Liberação de Revisão' },
            { id: 'manutencao-ambientes', label: 'Manutenção de Ambientes' }
          ]
        },
        {
          title: 'ENTREGA & MONTAGEM',
          items: [
            { id: 'entregas-montagem', label: 'Entregas e Montagem' },
            { id: 'consultar-agendado-fabrica', label: 'Consultar Agendado na Fábrica' }
          ]
        },
        {
          title: 'ASSISTÊNCIA TÉCNICA',
          items: [{ id: 'assistencias', label: 'Assistências' }]
        },
        {
          title: 'RELATÓRIOS',
          items: [
            { id: 'revisao-embarque', label: 'Revisão de Embarque' },
            { id: 'previsoes-entrega', label: 'Previsões de Entrega' },
            { id: 'relatorio-assistencias', label: 'Relatório de Assistências' },
            { id: 'relatorio-revisoes', label: 'Relatório de Revisões' },
            { id: 'relatorio-contratos', label: 'Relatório de Contratos' }
          ]
        },
        {
          title: 'GESTÃO',
          items: [
            { id: 'tipos-ocorrencia', label: 'Tipos de Ocorrência' },
            { id: 'tipos-montagem', label: 'Tipos de Montagem' }
          ]
        }
      ]
    },
    {
      id: 'agendas',
      label: 'Agendas',
      icon: Calendar,
      hasSubmenu: true,
      submenuCategories: [
        {
          title: 'AGENDAMENTOS',
          items: [{ id: 'agendamentos', label: 'Agendamentos' }]
        },
        {
          title: 'COMPROMISSOS',
          items: [{ id: 'compromissos', label: 'Compromissos' }]
        },
        {
          title: 'HISTÓRICOS',
          items: [{ id: 'historicos', label: 'Históricos' }]
        },
        {
          title: 'CONFIGURAÇÕES',
          items: [{ id: 'permissoes-acesso', label: 'Permissões de Acesso' }]
        }
      ]
    },
    {
      id: 'estatisticas',
      label: 'Estatísticas',
      icon: TrendingUp,
      hasSubmenu: true,
      submenuCategories: [
        {
          title: 'GERAL',
          items: [
            { id: 'vendas-stats', label: 'Vendas' },
            { id: 'projetos-stats', label: 'Projetos' },
            { id: 'financeiro-stats', label: 'Financeiro' }
          ]
        }
      ]
    },
    {
      id: 'enterprise',
      label: 'Enterprise',
      icon: Building,
      hasSubmenu: true,
      submenuCategories: [
        {
          title: 'CADASTROS',
          items: [{ id: 'cadastro-produtos', label: 'Cadastro de Produtos' }]
        },
        {
          title: 'GERENCIAMENTO',
          items: [{ id: 'painel-projetos-enterprise', label: 'Painel de Projetos' }]
        }
      ]
    },
    {
      id: 'sistema',
      label: 'Sistema',
      icon: Settings,
      hasSubmenu: true,
      submenuCategories: [
        {
          title: 'ACESSO',
          items: [{ id: 'usuarios', label: 'Usuários' }]
        },
        {
          title: 'EQUIPE',
          items: [{ id: 'colaborador', label: 'Colaborador' }]
        }
      ]
    },
    {
      id: 'treinamentos',
      label: 'Treinamentos',
      icon: GraduationCap,
      hasSubmenu: true,
      submenuCategories: [
        {
          title: 'TREINAMENTOS',
          items: [
            { id: 'comercial-treinamento', label: 'Comercial' },
            { id: 'treinamento-comercial', label: 'Treinamento Comercial' }
          ]
        }
      ]
    }
  ];

  // Check if current module belongs to a main navigation item
  const getActiveMainItem = () => {
    for (const item of navigationItems) {
      if (item.submenuCategories) {
        for (const category of item.submenuCategories) {
          for (const subItem of category.items) {
            if (subItem.id === activeModule) {
              return item.id;
            }
          }
        }
      }
    }
    return null;
  };

  const activeMainItem = getActiveMainItem();

  const handleItemClick = (item: MenuItem, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (item.hasSubmenu) {
      const rect = event.currentTarget.getBoundingClientRect();
      const sidebarRect = sidebarRef.current?.getBoundingClientRect();
      
      setFlyoutPosition({
        top: rect.top - (sidebarRect?.top || 0),
        left: 256
      });
      
      if (activeFlyout === item.id) {
        setActiveFlyout(null);
      } else {
        setActiveFlyout(item.id);
      }
    } else {
      onModuleChange(item.id);
      setActiveFlyout(null);
    }
  };

  const handleSubmenuItemClick = (itemId: string) => {
    onModuleChange(itemId);
    setActiveFlyout(null);
  };

  const closeFlyouts = () => {
    setActiveFlyout(null);
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

  const renderFlyout = () => {
    if (!activeFlyout) return null;

    const activeItem = navigationItems.find(item => item.id === activeFlyout);
    if (!activeItem?.submenuCategories) return null;

    return (
      <div
        ref={flyoutRef}
        className="fixed bg-[#1E2226] border border-[#3A4F64] shadow-2xl z-50 
                   rounded-lg overflow-hidden flyout-enter"
        style={{
          top: '80px',
          left: '280px',
          right: '20px',
          bottom: '20px',
          width: 'calc(100vw - 300px)',
          height: 'calc(100vh - 100px)',
          maxWidth: 'none',
          maxHeight: 'none'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#3A4F64] bg-[#2A3F54]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <activeItem.icon className="h-6 w-6" />
                {activeItem.label}
              </h2>
              <button
                onClick={() => setActiveFlyout(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 h-full">
              {activeItem.submenuCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-[#3A4F64]">
                    {category.title}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSubmenuItemClick(item.id)}
                        className="block w-full text-left text-sm text-gray-200 hover:text-white 
                                 hover:bg-[#2A3F54] rounded-lg px-4 py-3 transition-all duration-200
                                 border border-transparent hover:border-[#007BFF]/30
                                 hover:shadow-lg hover:scale-105"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-[#2A3F54] text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 custom-scrollbar overflow-y-auto
          w-64 sm:w-72 lg:w-80 xl:w-64
          flex flex-col
        `}
      >
        {/* User Profile Section */}
        <div className="p-4 border-b border-[#1A2332]">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-[#007BFF] text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
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
              const isActive = activeMainItem === item.id;
              
              return (
                <div key={item.id}>
                  <button
                    onClick={(e) => handleItemClick(item, e)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors
                      ${isActive 
                        ? 'bg-[#007BFF] text-white' 
                        : 'text-gray-300 hover:bg-[#3A4F64] hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    {item.hasSubmenu && <ChevronRight className="h-3 w-3" />}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Render flyout */}
      {renderFlyout()}
    </>
  );
};

export default Sidebar;
