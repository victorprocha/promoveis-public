
import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, FolderOpen, Info, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NewClientDialog from '@/components/Dialogs/NewClientDialog';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  birthFoundation: string;
  type: 'Pessoa Física' | 'Pessoa Jurídica';
  phone: string;
  email: string;
  consultant: string;
}

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState('30');
  const { toast } = useToast();

  // Mock data for clients
  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'João Silva Santos',
      birthFoundation: '15/03/1985',
      type: 'Pessoa Física',
      phone: '(11) 99999-9999',
      email: 'joao.silva@email.com',
      consultant: 'Maria Oliveira'
    },
    {
      id: '2',
      name: 'Empresa ABC Ltda',
      birthFoundation: '10/05/2010',
      type: 'Pessoa Jurídica',
      phone: '(11) 3333-4444',
      email: 'contato@empresaabc.com.br',
      consultant: 'Carlos Santos'
    },
    {
      id: '3',
      name: 'Ana Paula Ferreira',
      birthFoundation: '22/08/1992',
      type: 'Pessoa Física',
      phone: '(11) 88888-7777',
      email: 'ana.paula@email.com',
      consultant: 'Roberto Lima'
    },
    {
      id: '4',
      name: 'Tecnologia XYZ S.A.',
      birthFoundation: '03/12/2015',
      type: 'Pessoa Jurídica',
      phone: '(11) 2222-3333',
      email: 'contato@tecnologiaxyz.com.br',
      consultant: 'Maria Oliveira'
    },
    {
      id: '5',
      name: 'Pedro Henrique Costa',
      birthFoundation: '07/11/1978',
      type: 'Pessoa Física',
      phone: '(11) 77777-6666',
      email: 'pedro.costa@email.com',
      consultant: 'Fernanda Souza'
    }
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.consultant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(filteredClients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedClients([]);
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    });
  };

  const handleClientClick = (clientName: string) => {
    toast({
      title: "Visualizar cliente",
      description: `Abrindo detalhes de ${clientName}`,
    });
  };

  const handleInfoClick = (clientName: string) => {
    toast({
      title: "Informações do cliente",
      description: `Exibindo informações rápidas de ${clientName}`,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-[#2A3F54]" />
            <h1 className="text-xl font-semibold text-[#2A3F54]">Clientes</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="text-[#28A745] hover:text-[#218838] px-2"
            >
              LIMPAR FILTROS
            </Button>
            
            <NewClientDialog>
              <Button
                size="icon"
                className="bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-full w-10 h-10"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </NewClientDialog>
            
            <Button
              variant="outline"
              size="icon"
              className="bg-[#FFC107] border-[#FFC107] hover:bg-[#E0A800] rounded-full w-10 h-10"
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 rounded-full w-10 h-10"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Exportar Lista (CSV)</DropdownMenuItem>
                <DropdownMenuItem>Exportar Lista (Excel)</DropdownMenuItem>
                <DropdownMenuItem>Importar Clientes</DropdownMenuItem>
                <DropdownMenuItem>Configurar Colunas</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Table Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">Nome</TableHead>
                <TableHead className="font-semibold">Nasc./Fund.</TableHead>
                <TableHead className="font-semibold">Tipo de Cliente</TableHead>
                <TableHead className="font-semibold">Telefone</TableHead>
                <TableHead className="font-semibold">E-mail</TableHead>
                <TableHead className="font-semibold">Consultor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-[#007BFF]"
                      onClick={() => handleInfoClick(client.name)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleClientClick(client.name)}
                      className="text-[#007BFF] hover:text-[#0056b3] hover:underline font-medium"
                    >
                      {client.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-gray-600">{client.birthFoundation}</TableCell>
                  <TableCell className="text-gray-600">{client.type}</TableCell>
                  <TableCell className="text-gray-600">{client.phone}</TableCell>
                  <TableCell className="text-gray-600">{client.email}</TableCell>
                  <TableCell className="text-gray-600">{client.consultant}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {selectedClients.length > 0 && (
                <span className="font-medium">
                  {selectedClients.length} cliente(s) selecionado(s)
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Linhas por página:</span>
                <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <span className="text-lg">‹</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <span className="text-lg">›</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="bg-white hover:bg-gray-50 text-black rounded-full w-12 h-12 shadow-lg border border-gray-200"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Clients;
