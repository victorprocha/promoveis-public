
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import Dashboard from '@/components/Modules/Dashboard';
import ProjectRegistration from '@/components/Modules/ProjectRegistration';
import PortfolioTracking from '@/components/Modules/PortfolioTracking';
import ProjectBoard from '@/components/Modules/ProjectBoard';
import Sales from '@/pages/Sales';
import Specifiers from '@/pages/Specifiers';
import Contracts from '@/pages/Contracts';
import EnvironmentReview from '@/pages/EnvironmentReview';
import Deliveries from '@/pages/Deliveries';
import Assembly from '@/pages/Assembly';
import TechnicalAssistance from '@/pages/TechnicalAssistance';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

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
      case 'projetos':
        return <ProjectRegistration />;
      case 'carteira':
        return <PortfolioTracking />;
      case 'painel-projetos':
        return <ProjectBoard />;
      case 'vendas':
        return <Sales />;
      case 'especificadores':
        return <Specifiers />;
      case 'contratos':
        return <Contracts />;
      case 'revisao-ambientes':
        return <EnvironmentReview />;
      case 'entregas':
        return <Deliveries />;
      case 'montagem':
        return <Assembly />;
      case 'assistencias':
        return <TechnicalAssistance />;
      case 'dashboard':
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
