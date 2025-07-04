
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useClients } from '@/hooks/useClients';
import { Skeleton } from '@/components/ui/skeleton';
import NewClientDialog from './NewClientDialog';

interface ClientSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientSelect: (client: any) => void;
}

const ClientSelectionDialog: React.FC<ClientSelectionDialogProps> = ({ 
  open, 
  onOpenChange, 
  onClientSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use real clients data with search and pagination
  const { data: clientsData, loading, fetchClients } = useClients({
    search: searchTerm,
    page: currentPage,
    limit: 5
  });

  // Reload when dialog opens or filters change
  useEffect(() => {
    if (open) {
      fetchClients({
        search: searchTerm,
        page: currentPage,
        limit: 5
      });
    }
  }, [open, searchTerm, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchClients({
      search: searchTerm,
      page: 1,
      limit: 5
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClientSelect = (client: any) => {
    onClientSelect(client);
    onOpenChange(false);
  };

  const handleNewClientCreated = () => {
    setShowNewClientDialog(false);
    // Reload clients list after creating new client
    fetchClients({
      search: searchTerm,
      page: currentPage,
      limit: 5
    });
  };

  const totalPages = clientsData?.totalPages || 1;
  const total = clientsData?.total || 0;
  const clients = clientsData?.data || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Selecione o cliente para iniciar o projeto
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Digite aqui e pressione ENTER para pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                onClick={handleSearch}
              />
            </div>

            {/* Clients Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                    <TableHead className="font-semibold text-gray-700">E-mail</TableHead>
                    <TableHead className="font-semibold text-gray-700">Telefone</TableHead>
                    <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading === 'loading' ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : clients.length > 0 ? (
                    clients.map((client) => (
                      <TableRow 
                        key={client.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleClientSelect(client)}
                      >
                        <TableCell>
                          <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left">
                            {client.name}
                          </button>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {client.email || '-'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {client.phone || '-'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {client.type}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'Nenhum cliente encontrado para esta pesquisa.' : 'Nenhum cliente cadastrado.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                CANCELAR
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowNewClientDialog(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                CRIAR CLIENTE
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {/* Counter */}
              <span className="text-sm text-gray-600">
                {clients.length > 0 ? `${((currentPage - 1) * 5) + 1}-${Math.min(currentPage * 5, total)} de ${total}` : '0 de 0'}
              </span>

              {/* Pagination */}
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

              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                disabled={loading === 'loading'}
              >
                {loading === 'loading' ? 'PESQUISANDO...' : 'PESQUISAR'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NewClientDialog 
        open={showNewClientDialog} 
        onOpenChange={setShowNewClientDialog}
        onClientCreated={handleNewClientCreated}
      />
    </>
  );
};

export default ClientSelectionDialog;
