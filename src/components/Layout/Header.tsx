import React, { useState } from 'react';
import { Bell, MessageCircle, Plus, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import NewClientDialog from '@/components/Dialogs/NewClientDialog';
import NewProjectWithClientDialog from '@/components/Dialogs/NewProjectWithClientDialog';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Erro no logout",
        description: error.message || "Erro ao desconectar",
        variant: "destructive",
      });
    }
  };

  const handleNewClient = () => {
    setShowNewClientDialog(true);
  };

  const handleNewProject = () => {
    console.log('Abrindo dialog de novo projeto');
    setShowNewProjectDialog(true);
  };

  const handleProjectCreated = () => {
    // Callback quando projeto é criado com sucesso
    console.log('Projeto criado com sucesso');
  };

  return (
    <>
      <header className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40 shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-white hover:bg-white/10 lg:hidden transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              PRO<span className="text-blue-400">MÓVEIS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                NOVO
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
              <DropdownMenuItem 
                className="hover:bg-slate-100/80 cursor-pointer"
                onClick={handleNewClient}
              >
                Cliente
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-slate-100/80 cursor-pointer"
                onClick={handleNewProject}
              >
                Projeto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 relative transition-all duration-200 rounded-xl"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                2
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 relative transition-all duration-200 rounded-xl"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                5
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-white/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <div className="text-sm font-medium">{user?.name || 'Usuário'}</div>
                      <div className="text-xs text-blue-200">Promóveis</div>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
                <DropdownMenuLabel className="text-slate-700">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200/50" />
                <DropdownMenuItem className="hover:bg-slate-100/80">
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200/50" />
                <DropdownMenuItem className="hover:bg-slate-100/80">Perfil</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-100/80">Configurações</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200/50" />
                <DropdownMenuItem 
                  className="text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <NewClientDialog 
        open={showNewClientDialog} 
        onOpenChange={setShowNewClientDialog}
      />
      
      <NewProjectWithClientDialog 
        open={showNewProjectDialog} 
        onOpenChange={setShowNewProjectDialog}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
};

export default Header;
