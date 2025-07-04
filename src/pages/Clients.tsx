
import React, { useState } from 'react';
import { Users, Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import NewClientDialog from '@/components/Dialogs/NewClientDialog';
import ClientDetails from './ClientDetails';
import { useClients } from '@/hooks/useClients';

const Clients: React.FC = () => {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  // Use real clients data
  const { data: clientsData, loading, fetchClients } = useClients({
    search: searchTerm,
    page: currentPage,
    limit: 10
  });

  const handleSearch = () => {
    setCurrentPage(1);
    fetchClients({
      search: searchTerm,
      page: 1,
      limit: 10
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClientCreated = () => {
    setShowNewClientDialog(false);
    fetchClients({
      search: searchTerm,
      page: currentPage,
      limit: 10
    });
  };

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleBackToList = () => {
    setSelectedClientId(null);
  };

  // If a client is selected, show the details page
  if (selectedClientId) {
    return <ClientDetails clientId={selectedClientId} onBack={handleBackToList} />;
  }

  const totalPages = clientsData?.totalPages || 1;
  const total = clientsData?.total || 0;
  const clients = clientsData?.data || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-[#2A3F54]">Clientes</h1>
          </div>
          <Button 
            onClick={() => setShowNewClientDialog(true)}
            className="bg-[#28A745] hover:bg-[#218838] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-[#2A3F54]">Lista de Clientes</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Pesquisar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10 w-64"
                  />
                  <Search 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                    onClick={handleSearch}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-hidden border-t">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Nome</TableHead>
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold">Telefone</TableHead>
                    <TableHead className="font-semibold">E-mail</TableHead>
                    <TableHead className="font-semibold">Cidade</TableHead>
                    <TableHead className="font-semibold">Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading === 'loading' ? (
                    [...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : clients.length > 0 ? (
                    clients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-gray-50">
                        <TableCell>
                          <button
                            onClick={() => handleClientClick(client.id)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                          >
                            {client.name}
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge variant={client.type === 'Pessoa Física' ? 'default' : 'secondary'}>
                            {client.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {client.phone || '-'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {client.email || '-'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {client.city || '-'}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {client.birthFoundation}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        {searchTerm ? 'Nenhum cliente encontrado para esta pesquisa.' : 'Nenhum cliente cadastrado ainda.'}
                        <div className="mt-2">
                          <Button 
                            onClick={() => setShowNewClientDialog(true)}
                            variant="outline"
                            className="text-blue-600"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Criar primeiro cliente
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {clients.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  Mostrando {((currentPage - 1) * 10) + 1} a {Math.min(currentPage * 10, total)} de {total} clientes
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading === 'loading'}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm px-3 py-1 bg-white border rounded">
                    {currentPage} de {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading === 'loading'}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NewClientDialog 
        open={showNewClientDialog} 
        onOpenChange={setShowNewClientDialog}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
};

export default Clients;
