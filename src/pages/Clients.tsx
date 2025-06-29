
import React, { useState, useMemo } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import NewClientDialog from '@/components/Dialogs/NewClientDialog';
import { useClients } from '@/hooks/useClients';
import { ClientFilters } from '@/types/client';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState('30');
  const [currentPage, setCurrentPage] = useState(1);

  // Criar filtros para o hook
  const filters = useMemo<ClientFilters>(() => ({
    search: searchTerm || undefined,
    page: currentPage,
    limit: parseInt(itemsPerPage)
  }), [searchTerm, currentPage, itemsPerPage]);

  const { data, loading, error, fetchClients, deleteClient } = useClients(filters);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset para primeira página ao pesquisar
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedClients([]);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.data) {
      setSelectedClients(data.data.map(client => client.id));
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

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${clientName}"?`)) {
      try {
        await deleteClient(clientId);
      } catch (error) {
        // Error já é tratado no hook
      }
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Loading skeleton
  if (loading === 'loading' && !data) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-6 w-6 text-[#2A3F54]" />
              <h1 className="text-xl font-semibold text-[#2A3F54]">Clientes</h1>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-[#2A3F54]" />
            <h1 className="text-xl font-semibold text-[#2A3F54]">Clientes</h1>
          </div>
        </div>
        
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar clientes: {error}</p>
            <Button onClick={() => fetchClients()}>Tentar Novamente</Button>
          </div>
        </div>
      </div>
    );
  }

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
                onChange={(e) => handleSearch(e.target.value)}
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
          {loading === 'loading' ? (
            <div className="p-6">
              <div className="animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedClients.length === (data?.data.length || 0) && (data?.data.length || 0) > 0}
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
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((client) => (
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
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <button className="text-[#007BFF] hover:text-[#0056b3] hover:underline font-medium">
                          {client.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-gray-600">{client.birthFoundation}</TableCell>
                      <TableCell className="text-gray-600">{client.type}</TableCell>
                      <TableCell className="text-gray-600">{client.phone}</TableCell>
                      <TableCell className="text-gray-600">{client.email}</TableCell>
                      <TableCell className="text-gray-600">{client.consultantName}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Visualizar</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteClient(client.id, client.name)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
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
                  {data && (
                    <span className="ml-4">
                      Mostrando {((currentPage - 1) * parseInt(itemsPerPage)) + 1} - {Math.min(currentPage * parseInt(itemsPerPage), data.total)} de {data.total} clientes
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
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <span className="text-lg">‹</span>
                    </Button>
                    <span className="text-sm text-gray-600">
                      {currentPage} / {data?.totalPages || 1}
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={handleNextPage}
                      disabled={!data || currentPage >= data.totalPages}
                    >
                      <span className="text-lg">›</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
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
