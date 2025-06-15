
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import Dashboard from '@/components/Modules/Dashboard';
import ProjectRegistration from '@/components/Modules/ProjectRegistration';
import PortfolioTracking from '@/components/Modules/PortfolioTracking';
import ProjectBoard from '@/components/Modules/ProjectBoard';

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
    </div>
  );
};

export default Index;
