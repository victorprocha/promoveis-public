
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Home, FolderPlus, BarChart3, Kanban, ShoppingCart, Users, UserCheck, FileText, ClipboardCheck, Truck, Wrench, Tool, Calendar, TrendingUp, Package, Settings, GraduationCap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  isOpen: boolean;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeModule, onModuleChange }) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    dashboard: false,
    quickAccess: false,
    commercial: false,
    postSale: false,
    schedule: false,
    stats: false,
    enterprise: false,
    system: false,
    training: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: Home,
      items: [
        { key: 'dashboard', title: 'Visão Geral', icon: BarChart3 }
      ]
    },
    {
      key: 'quickAccess',
      title: 'Acesso Rápido',
      icon: FolderPlus,
      items: [
        { key: 'novo-projeto', title: 'PROJETOS', icon: Plus, action: 'NOVO' },
        { key: 'acompanhamento-carteira', title: 'Acompanhamento de Carteira', icon: BarChart3 },
        { key: 'painel-projetos', title: 'Painel de Projetos', icon: Kanban },
        { key: 'painel-projetos-enterprise', title: 'Painel de Projetos Enterprise', icon: Kanban }
      ]
    },
    {
      key: 'commercial',
      title: 'Comercial',
      icon: ShoppingCart,
      items: [
        { key: 'nova-venda', title: 'VENDAS', icon: Plus, action: 'NOVA VENDA' },
        { key: 'adicionar-cliente', title: 'CLIENTES', icon: Plus, action: 'ADICIONAR CLIENTE' },
        { key: 'novo-especificador', title: 'ESPECIFICADORES', icon: Plus, action: 'NOVO ESPECIFICADOR' },
        { key: 'projetos-comercial', title: 'PROJETOS', icon: FileText },
        { key: 'novo-contrato', title: 'CONTRATOS', icon: Plus, action: 'NOVO CONTRATO' }
      ]
    },
    {
      key: 'postSale',
      title: 'Pós-Venda',
      icon: ClipboardCheck,
      items: [
        { key: 'revisao-ambientes', title: 'Revisão de Ambientes', icon: ClipboardCheck },
        { key: 'nova-entrega', title: 'ENTREGAS', icon: Plus, action: 'NOVA ENTREGA' },
        { key: 'nova-montagem', title: 'MONTAGEM', icon: Plus, action: 'NOVA MONTAGEM' },
        { key: 'nova-assistencia', title: 'ASSISTÊNCIAS', icon: Plus, action: 'NOVA ASSISTÊNCIA' },
        { key: 'assistencias-relatorio', title: 'Relatório de Assistências', icon: FileText },
        { key: 'previsao-embarque', title: 'Previsão de Embarque', icon: Truck }
      ]
    },
    {
      key: 'schedule',
      title: 'Agendas',
      icon: Calendar,
      items: [
        { key: 'agendamentos', title: 'Agendamentos', icon: Calendar },
        { key: 'compromissos', title: 'Compromissos', icon: Calendar },
        { key: 'historicos', title: 'Históricos', icon: FileText },
        { key: 'permissoes-acesso', title: 'Permissões de Acesso', icon: Settings }
      ]
    },
    {
      key: 'stats',
      title: 'Estatísticas',
      icon: TrendingUp,
      items: [
        { key: 'vendas-stats', title: 'Vendas', icon: ShoppingCart },
        { key: 'projetos-stats', title: 'Projetos', icon: FolderPlus },
        { key: 'financeiro-stats', title: 'Financeiro', icon: TrendingUp }
      ]
    },
    {
      key: 'enterprise',
      title: 'Enterprise',
      icon: Package,
      items: [
        { key: 'cadastro-produtos', title: 'Cadastro de Produtos', icon: Package }
      ]
    },
    {
      key: 'system',
      title: 'Sistema',
      icon: Settings,
      items: [
        { key: 'usuarios', title: 'Usuários', icon: Users },
        { key: 'colaborador', title: 'Colaborador', icon: UserCheck }
      ]
    },
    {
      key: 'training',
      title: 'Treinamentos',
      icon: GraduationCap,
      items: [
        { key: 'comercial-treinamento', title: 'Comercial', icon: ShoppingCart },
        { key: 'treinamento-comercial', title: 'Treinamento Comercial', icon: GraduationCap }
      ]
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {}}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-4 space-y-2">
          {menuItems.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = openSections[section.key];
            
            return (
              <Collapsible 
                key={section.key} 
                open={isExpanded} 
                onOpenChange={() => toggleSection(section.key)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto text-left font-medium hover:bg-[#007BFF]/10"
                  >
                    <div className="flex items-center gap-3">
                      <SectionIcon className="h-4 w-4 text-[#007BFF]" />
                      <span className="text-sm">{section.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-1 ml-4 mt-1">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = activeModule === item.key;
                    
                    return (
                      <Button
                        key={item.key}
                        variant="ghost"
                        onClick={() => onModuleChange(item.key)}
                        className={`
                          w-full justify-start p-2 h-auto text-left text-xs
                          ${isActive 
                            ? 'bg-[#007BFF] text-white hover:bg-[#0056b3]' 
                            : 'hover:bg-gray-100 text-gray-700'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <ItemIcon className="h-3 w-3 flex-shrink-0" />
                          <span className="flex-1 break-words leading-tight">
                            {item.action ? (
                              <span className="font-medium">{item.title} → {item.action}</span>
                            ) : (
                              item.title
                            )}
                          </span>
                        </div>
                      </Button>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
