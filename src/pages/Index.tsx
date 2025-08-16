import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import Dashboard from '@/components/Modules/Dashboard';
import ProjectDetails from '@/pages/ProjectDetails';
import ProjectList from '@/components/Modules/ProjectRegistration';
import PortfolioTracking from '@/components/Modules/PortfolioTracking';
import PainelProjetos from '@/components/Modules/PainelProjetos';
import Sales from '@/pages/Sales';
import Clients from '@/pages/Clients';
import Specifiers from '@/pages/Specifiers';
import Contracts from '@/pages/Contracts';
import ContractDetails from '@/pages/ContractDetails';
import EnvironmentReview from '@/pages/EnvironmentReview';
import Deliveries from '@/pages/Deliveries';
import Assembly from '@/pages/Assembly';
import DeliveriesAndAssembly from '@/pages/DeliveriesAndAssembly';
import Compromissos from '@/pages/Compromissos';
import TechnicalAssistance from '@/pages/TechnicalAssistance';
import Colaboradores from '@/pages/Colaboradores';
import NovoColaborador from '@/pages/NovoColaborador';
import AgendaEntrega from '@/pages/AgendaEntrega';
import ClientDetails from '@/pages/ClientDetails';
import CadastroMatrizEventos from '@/pages/CadastroMatrizEventos';
import FluxoPadraoDetalhes from '@/pages/FluxoPadraoDetalhes';
import MinhaEmpresa from '@/pages/MinhaEmpresa';
import EmitenteNFe from '@/pages/EmitenteNFe';
import Usuarios from '@/pages/Usuarios';
import CadastroUsuario from '@/pages/CadastroUsuario';
import ContratoEditor from '@/pages/ContratoEditor';
import Estoque from '@/pages/Estoque';
import CadastroProduto from '@/pages/CadastroProduto';
import HistoricoLancamentos from '@/pages/HistoricoLancamentos';
import PedidosCompra from '@/pages/PedidosCompra';
import NovoPedidoCompra from '@/pages/NovoPedidoCompra';
import { Toaster } from '@/components/ui/toaster';
import { ProjectProvider } from '@/contexts/ProjectContext';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showNovoColaborador, setShowNovoColaborador] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showContractDetails, setShowContractDetails] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [showMatrizEventos, setShowMatrizEventos] = useState(false);
  const [showFluxoPadrao, setShowFluxoPadrao] = useState(false);
  const [showContrato, setShowContrato] = useState(false);
  const [showCadastroUsuario, setShowCadastroUsuario] = useState(false);
  const [showCadastroProduto, setShowCadastroProduto] = useState(false);
  const [showHistoricoLancamentos, setShowHistoricoLancamentos] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showNovoPedidoCompra, setShowNovoPedidoCompra] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    setShowProjectDetails(false);
    setShowNovoColaborador(false);
    setShowClientDetails(false);
    setShowContractDetails(false);
    setShowMatrizEventos(false);
    setShowFluxoPadrao(false);
    setShowCadastroUsuario(false);
    setShowContrato(false);
    setShowCadastroProduto(false);
    setShowHistoricoLancamentos(false);
    setShowNovoPedidoCompra(false);
    setSelectedProjectId(null);
    setSelectedClientId(null);
    setSelectedContractId(null);
    setSelectedProductId(null);
    
    // Handle special navigation cases
    if (module === 'configuracao-matriz') {
      setShowMatrizEventos(true);
    } else if (module === 'contrato') {
      setShowContrato(true);
    } else if (module === 'cadastro-usuario') {
      setShowCadastroUsuario(true);
    }
    
    // Close sidebar on mobile when selecting a module
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleViewProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowProjectDetails(true);
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

  const handleFluxoPadraoClick = () => {
    setShowFluxoPadrao(true);
    setShowMatrizEventos(false);
  };

  const handleBackFromFluxoPadrao = () => {
    setShowFluxoPadrao(false);
    setShowMatrizEventos(true);
  };

  const handleBackFromMatrizEventos = () => {
    setShowMatrizEventos(false);
  };

  const handleBackFromContrato = () => {
    setShowContrato(false);
  };

  const handleAddProduct = () => {
    setShowCadastroProduto(true);
  };

  const handleBackFromCadastroProduto = () => {
    setShowCadastroProduto(false);
  };

  const handleViewHistoricoLancamentos = (productId: string) => {
    setSelectedProductId(productId);
    setShowHistoricoLancamentos(true);
  };

  const handleBackFromHistoricoLancamentos = () => {
    setShowHistoricoLancamentos(false);
    setSelectedProductId(null);
  };

  const handleAddPedidoCompra = () => {
    setShowNovoPedidoCompra(true);
  };

  const handleBackFromNovoPedidoCompra = () => {
    setShowNovoPedidoCompra(false);
  };

  const renderModule = () => {
    if (showNovoPedidoCompra) {
      return <NovoPedidoCompra onBack={handleBackFromNovoPedidoCompra} />;
    }

    if (showHistoricoLancamentos) {
      return <HistoricoLancamentos productId={selectedProductId} onBack={handleBackFromHistoricoLancamentos} />;
    }

    if (showCadastroProduto) {
      return <CadastroProduto onBack={handleBackFromCadastroProduto} />;
    }

    if (showContrato) {
      return <ContratoEditor onBack={handleBackFromContrato} />;
    }

    if (showCadastroUsuario) {
      return <CadastroUsuario onNavigate={handleModuleChange} />;
    }

    if (showFluxoPadrao) {
      return <FluxoPadraoDetalhes onBack={handleBackFromFluxoPadrao} />;
    }

    if (showMatrizEventos) {
      return <CadastroMatrizEventos onFluxoPadraoClick={handleFluxoPadraoClick} />;
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
        return <ProjectList onViewProject={handleViewProject} />;
      case 'carteira':
      case 'acompanhamento-carteira':
        return <PortfolioTracking />;
      case 'painel-projetos':
      case 'painel-projetos-enterprise':
        return <PainelProjetos />;
      
      // Comercial
      case 'vendas':
        return <Sales />;
      case 'clientes':
        return <Clients />;
      case 'especificadores':
        return <Specifiers />;
      case 'projetos-comercial':
        return <ProjectList onViewProject={handleViewProject} />;
      case 'contratos':
        return <Contracts onViewContract={handleViewContract} />;
      
      // Pós-Venda
      case 'revisao-ambientes':
        return <EnvironmentReview />;
      case 'entregas':
        return <Deliveries />;
      case 'montagem':
        return <Assembly />;
        case 'entregas-montagens':
          return <DeliveriesAndAssembly />;
      case 'compromissos':
        return <Compromissos onNavigate={handleModuleChange} />;
      case 'assistencias':
      case 'assistencias-relatorio':
        return <TechnicalAssistance />;
      case 'previsao-embarque':
        return <div className="p-6"><h1 className="text-2xl font-bold">Previsão de Embarque</h1></div>;
      
      // Agendas
      case 'agendamentos':
        return <div className="p-6"><h1 className="text-2xl font-bold">Agendamentos</h1></div>;
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
      
      // Compras
      case 'estoque':
        return <Estoque onAddProduct={handleAddProduct} onViewHistory={handleViewHistoricoLancamentos} />;
      case 'pedidos-compra':
        return <PedidosCompra onAddPedido={handleAddPedidoCompra} />;
      
      // Sistema
      case 'usuarios':
        return <div className="p-6"><h1 className="text-2xl font-bold">Usuários</h1></div>;
      case 'colaborador':
        return <Colaboradores onNewColaborador={handleNewColaborador} />;
      case 'agenda-entrega':
        return <AgendaEntrega />;
      case 'minha-empresa':
        return <MinhaEmpresa />;
        case 'emitente-nfe':
          return <EmitenteNFe />;
        case 'usuario':
          return <Usuarios onNavigate={handleModuleChange} />;
        case 'cadastro-usuario':
          return <CadastroUsuario onNavigate={handleModuleChange} />;
      
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
    <ProjectProvider>
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
    </ProjectProvider>
  );
};

export default Index;
