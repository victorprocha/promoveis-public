import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import Dashboard from '@/components/Modules/Dashboard';
import ProjectRegistration from '@/pages/ProjectRegistration';
import ProjectDetails from '@/pages/ProjectDetails';
import ProjectList from '@/components/Modules/ProjectRegistration';
import PortfolioTracking from '@/components/Modules/PortfolioTracking';
import ProjectBoard from '@/components/Modules/ProjectBoard';
import Sales from '@/pages/Sales';
import Clients from '@/pages/Clients';
import Specifiers from '@/pages/Specifiers';
import Contracts from '@/pages/Contracts';
import ContractDetails from '@/pages/ContractDetails';
import EnvironmentReview from '@/pages/EnvironmentReview';
import Deliveries from '@/pages/Deliveries';
import Assembly from '@/pages/Assembly';
import TechnicalAssistance from '@/pages/TechnicalAssistance';
import Colaboradores from '@/pages/Colaboradores';
import NovoColaborador from '@/pages/NovoColaborador';
import ClientDetails from '@/pages/ClientDetails';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [showProjectRegistration, setShowProjectRegistration] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showNovoColaborador, setShowNovoColaborador] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showContractDetails, setShowContractDetails] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    setShowProjectRegistration(false);
    setShowProjectDetails(false);
    setSelectedProjectId(null);
    setShowNovoColaborador(false);
    setShowClientDetails(false);
    setSelectedClientId(null);
    setShowContractDetails(false);
    setSelectedContractId(null);
    // Close sidebar on mobile when selecting a module
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleNewProject = () => {
    setShowProjectRegistration(true);
    setShowProjectDetails(false);
  };

  const handleBackFromProjectRegistration = () => {
    setShowProjectRegistration(false);
  };

  const handleViewProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowProjectDetails(true);
    setShowProjectRegistration(false);
  };

  const handleBackFromProjectDetails = () => {
    setShowProjectDetails(false);
    setSelectedProjectId(null);
  };

  const handleNewColaborador = () => {
    setShowNovoColaborador(true);
  };

  const handleBackFromNovoColaborador = () => {
    setShowNovoColaborador(false);
  };

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowClientDetails(true);
  };

  const handleBackFromClientDetails = () => {
    setShowClientDetails(false);
    setSelectedClientId(null);
  };

  const handleViewContract = (contractId: string) => {
    setSelectedContractId(contractId);
    setShowContractDetails(true);
  };

  const handleBackFromContractDetails = () => {
    setShowContractDetails(false);
    setSelectedContractId(null);
  };

  const renderModule = () => {
    if (showProjectRegistration) {
      return <ProjectRegistration onBack={handleBackFromProjectRegistration} />;
    }

    if (showProjectDetails) {
      return <ProjectDetails projectId={selectedProjectId} onBack={handleBackFromProjectDetails} />;
    }

    if (showNovoColaborador) {
      return <NovoColaborador onBack={handleBackFromNovoColaborador} />;
    }

    if (showClientDetails) {
      return <ClientDetails clientId={selectedClientId} onBack={handleBackFromClientDetails} />;
    }

    if (showContractDetails) {
      return <ContractDetails contractId={selectedContractId} onBack={handleBackFromContractDetails} />;
    }

    switch (activeModule) {
      // Quick Access
      case 'projetos':
        return <ProjectList onNewProject={handleNewProject} onViewProject={handleViewProject} />;
      case 'carteira':
      case 'acompanhamento-carteira':
        return <PortfolioTracking />;
      case 'painel-projetos':
      case 'painel-projetos-enterprise':
        return <ProjectBoard onNewProject={handleNewProject} />;
      
      // Comercial
      case 'vendas':
        return <Sales />;
      case 'clientes':
        return <Clients />;
      case 'especificadores':
        return <Specifiers />;
      case 'projetos-comercial':
        return <ProjectList onNewProject={handleNewProject} onViewProject={handleViewProject} />;
      case 'contratos':
        return <Contracts onViewContract={handleViewContract} />;
      
      // Pós-Venda
      case 'revisao-ambientes':
        return <EnvironmentReview />;
      case 'entregas':
        return <Deliveries />;
      case 'montagem':
        return <Assembly />;
      case 'assistencias':
      case 'assistencias-relatorio':
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
        return <Colaboradores onNewColaborador={handleNewColaborador} />;
      
      // Treinamentos
      case 'comercial-treinamento':
        return <div className="p-6"><h1 className="text-2xl font-bold">Treinamento Comercial</h1></div>;
      case 'treinamento-comercial':
        return <div className="p-6"><h1 className="text-2xl font-bold">Treinamento Comercial</h1></div>;
      
      case 'dashboard':
      default:
        return <Dashboard onModuleChange={handleModuleChange} />;
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
