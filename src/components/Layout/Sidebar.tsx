
import React from 'react';
import { 
  Home, 
  FolderPlus, 
  Briefcase, 
  Users, 
  UserPlus, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings, 
  Package, 
  GraduationCap,
  Plus,
  Truck,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  isOpen: boolean;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeModule, onModuleChange }) => {
  const [openSections, setOpenSections] = React.useState<{ [key: string]: boolean }>({
    dashboard: true,
    quickAccess: true,
    commercial: false,
    postSale: false,
    schedules: false,
    statistics: false,
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
      section: 'dashboard',
      title: 'Dashboard',
      icon: Home,
      items: [
        { id: 'dashboard', label: 'Visão Geral', icon: Home },
      ]
    },
    {
      section: 'quickAccess',
      title: 'Acesso Rápido',
      icon: FolderPlus,
      items: [
        { id: 'novo-projeto', label: 'Novo Projeto', icon: Plus },
        { id: 'acompanhamento-carteira', label: 'Acompanhamento Carteira', icon: Briefcase },
        { id: 'painel-projetos-enterprise', label: 'Painel Projetos Enterprise', icon: BarChart3 },
      ]
    },
    {
      section: 'commercial',
      title: 'Comercial',
      icon: Briefcase,
      items: [
        { id: 'nova-venda', label: 'Nova Venda', icon: Plus },
        { id: 'adicionar-cliente', label: 'Adicionar Cliente', icon: UserPlus },
        { id: 'novo-especificador', label: 'Novo Especificador', icon: Plus },
        { id: 'projetos-comercial', label: 'Projetos', icon: FolderPlus },
        { id: 'novo-contrato', label: 'Novo Contrato', icon: Plus },
      ]
    },
    {
      section: 'postSale',
      title: 'Pós-Venda',
      icon: Settings,
      items: [
        { id: 'revisao-ambientes', label: 'Revisão de Ambientes', icon: Settings },
        { id: 'nova-entrega', label: 'Nova Entrega', icon: Plus },
        { id: 'nova-montagem', label: 'Nova Montagem', icon: Plus },
        { id: 'nova-assistencia', label: 'Nova Assistência', icon: Plus },
        { id: 'previsao-embarque', label: 'Previsão de Embarque', icon: Truck },
      ]
    },
    {
      section: 'schedules',
      title: 'Agendas',
      icon: Calendar,
      items: [
        { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
        { id: 'compromissos', label: 'Compromissos', icon: Calendar },
        { id: 'historicos', label: 'Históricos', icon: FileText },
        { id: 'permissoes-acesso', label: 'Permissões de Acesso', icon: Settings },
      ]
    },
    {
      section: 'statistics',
      title: 'Estatísticas',
      icon: BarChart3,
      items: [
        { id: 'vendas-stats', label: 'Vendas', icon: BarChart3 },
        { id: 'projetos-stats', label: 'Projetos', icon: BarChart3 },
        { id: 'financeiro-stats', label: 'Financeiro', icon: BarChart3 },
      ]
    },
    {
      section: 'enterprise',
      title: 'Enterprise',
      icon: Package,
      items: [
        { id: 'cadastro-produtos', label: 'Cadastro de Produtos', icon: Package },
      ]
    },
    {
      section: 'system',
      title: 'Sistema',
      icon: Settings,
      items: [
        { id: 'usuarios', label: 'Usuários', icon: Users },
        { id: 'colaborador', label: 'Colaborador', icon: Users },
      ]
    },
    {
      section: 'training',
      title: 'Treinamentos',
      icon: GraduationCap,
      items: [
        { id: 'comercial-treinamento', label: 'Comercial', icon: GraduationCap },
        { id: 'treinamento-comercial', label: 'Treinamento Comercial', icon: GraduationCap },
      ]
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {}} 
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {menuItems.map((section) => (
              <Collapsible 
                key={section.section}
                open={openSections[section.section]}
                onOpenChange={() => toggleSection(section.section)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-medium text-gray-700 hover:text-[#007BFF] hover:bg-gray-50"
                  >
                    <section.icon className="h-4 w-4 mr-2" />
                    {section.title}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 ml-6">
                  {section.items.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => onModuleChange(item.id)}
                      className={`
                        w-full justify-start text-sm transition-colors
                        ${activeModule === item.id 
                          ? 'bg-[#007BFF] text-white hover:bg-[#0056b3]' 
                          : 'text-gray-600 hover:text-[#007BFF] hover:bg-gray-50'
                        }
                      `}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
