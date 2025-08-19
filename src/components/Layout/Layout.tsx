import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ProjectProvider } from '@/contexts/ProjectContext';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-[#ECF0F5] w-full">
        <Header onToggleSidebar={toggleSidebar} />
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggleSidebar={toggleSidebar}
        />
        
        <main className="lg:ml-64 pt-16 min-h-screen">
          {children}
        </main>
        
        <Toaster />
      </div>
    </ProjectProvider>
  );
};

export default Layout;