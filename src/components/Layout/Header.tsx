
import React from 'react';
import { Bell, MessageCircle, Plus, Menu, LogOut } from 'lucide-react';
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
import NewProjectDialog from '@/components/Dialogs/NewProjectDialog';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[#2A3F54] border-b border-[#1A2332] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-white hover:bg-[#3A4F64] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-white">
            FOCCO<span className="text-[#007BFF]">LOJAS</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NewProjectDialog>
          <Button className="bg-[#28A745] hover:bg-[#218838] text-white font-medium px-4 py-2 rounded-md">
            <Plus className="h-4 w-4 mr-2" />
            NOVO
          </Button>
        </NewProjectDialog>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#3A4F64] relative"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#3A4F64] relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              5
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-[#3A4F64] px-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-[#007BFF] text-white">
                      EV
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-medium">Enzo Vargas Santos</div>
                    <div className="text-xs text-gray-300">Loja Principal</div>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Alterar Senha</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
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
  );
};

export default Header;
