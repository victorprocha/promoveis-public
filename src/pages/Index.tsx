
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import Dashboard from '@/components/Modules/Dashboard';
import ProjectRegistration from '@/components/Modules/ProjectRegistration';
import PortfolioTracking from '@/components/Modules/PortfolioTracking';
import ProjectBoard from '@/components/Modules/ProjectBoard';
import Sales from '@/pages/Sales';
import Clients from '@/pages/Clients';
import Specifiers from '@/pages/Specifiers';
import Contracts from '@/pages/Contracts';
import EnvironmentReview from '@/pages/EnvironmentReview';
import Deliveries from '@/pages/Deliveries';
import Assembly from '@/pages/Assembly';
import TechnicalAssistance from '@/pages/TechnicalAssistance';
import Auth from '@/pages/Auth';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECF0F5]">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    // Close sidebar on mobile when selecting a module
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      // Dashboard
      case 'dashboard':
        return <Dashboard />;
      
      // Quick Access
      case 'projetos':
      case 'novo-projeto':
        return <ProjectRegistration />;
      case 'carteira':
      case 'acompanhamento-carteira':
        return <PortfolioTracking />;
      case 'painel-projetos':
      case 'painel-projetos-enterprise':
        return <ProjectBoard />;
      
      // Comercial
      case 'vendas':
      case 'nova-venda':
        return <Sales />;
      case 'clientes':
      case 'adicionar-cliente':
        return <Clients />;
      case 'especificadores':
      case 'novo-especificador':
        return <Specifiers />;
      case 'projetos-comercial':
        return <ProjectRegistration />;
      case 'contratos':
      case 'novo-contrato':
        return <Contracts />;
      
      // Pós-Venda
      case 'revisao-ambientes':
        return <EnvironmentReview />;
      case 'entregas':
      case 'nova-entrega':
        return <Deliveries />;
      case 'montagem':
      case 'nova-montagem':
        return <Assembly />;
      case 'assistencias':
      case 'assistencias-relatorio':
      case 'nova-assistencia':
        return <TechnicalAssistance />;
      case 'previsao-embarque':
        return <div className="p-6"><h1 className="text-2xl font-bold">Previsão de Embarque</h1></div>;
      
      // Agendas
      case 'agendamentos':
        return <div className="p-6"><h1 className="text-2xl font-bold">Agendamentos</h1></div>;
      case 'compromissos':
        return <div className="p-6"><h1 className="text-2xl font-bold">Compromissos</h1></div>;
      case 'historicos':
        return <div className="p-6"><h1 className="text-2xl font-bold">Históricos</h1></div>;
      case 'permissoes-acesso':
        return <div className="p-6"><h1 className="text-2xl font-bold">Permissões de Acesso</h1></div>;
      
      // Estatísticas
      case 'vendas-stats':
        return <div className="p-6"><h1 className="text-2xl font-bold">Estatísticas de Vendas</h1></div>;
      case 'projetos-stats':
        return <div className="p-6"><h1 className="text-2xl font-bold">Estatísticas de Projetos</h1></div>;
      case 'financeiro-stats':
        return <div className="p-6"><h1 className="text-2xl font-bold">Estatísticas Financeiras</h1></div>;
      
      // Enterprise
      case 'cadastro-produtos':
        return <div className="p-6"><h1 className="text-2xl font-bold">Cadastro de Produtos</h1></div>;
      
      // Sistema
      case 'usuarios':
        return <div className="p-6"><h1 className="text-2xl font-bold">Usuários</h1></div>;
      case 'colaborador':
        return <div className="p-6"><h1 className="text-2xl font-bold">Colaborador</h1></div>;
      
      // Treinamentos
      case 'comercial-treinamento':
        return <div className="p-6"><h1 className="text-2xl font-bold">Treinamento Comercial</h1></div>;
      case 'treinamento-comercial':
        return <div className="p-6"><h1 className="text-2xl font-bold">Treinamento Comercial</h1></div>;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F5] w-full">
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar 
        isOpen={sidebarOpen} 
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
      />
      
      <main className="lg:ml-64 pt-16 min-h-screen">
        {renderModule()}
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
