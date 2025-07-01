
import React, { useState } from 'react';
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
import NewClientDialog from './NewClientDialog';

interface Client {
  id: string;
  nome: string;
  nomeFantasia?: string;
  cpfcnpj: string;
  nomeConjuge?: string;
}

interface ClientSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientSelect: (client: Client) => void;
}

const ClientSelectionDialog: React.FC<ClientSelectionDialogProps> = ({ 
  open, 
  onOpenChange, 
  onClientSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data - em produção seria vindo de uma API
  const [clients] = useState<Client[]>([
    {
      id: '1',
      nome: 'João Silva Santos',
      nomeFantasia: 'Silva Ltda',
      cpfcnpj: '123.456.789-00',
      nomeConjuge: 'Maria Silva'
    },
    {
      id: '2',
      nome: 'Empresa ABC Ltda',
      nomeFantasia: 'ABC Corp',
      cpfcnpj: '12.345.678/0001-90',
      nomeConjuge: ''
    },
    {
      id: '3',
      nome: 'Pedro Oliveira',
      nomeFantasia: '',
      cpfcnpj: '987.654.321-00',
      nomeConjuge: 'Ana Oliveira'
    }
  ]);

  const itemsPerPage = 5;
  const totalItems = clients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentClients = clients.slice(startIndex, endIndex);

  const handleSearch = () => {
    console.log('Pesquisando por:', searchTerm);
    // Aqui seria feita a chamada para a API
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClientSelect = (client: Client) => {
    onClientSelect(client);
    onOpenChange(false);
  };

  const handleNewClientCreated = () => {
    setShowNewClientDialog(false);
    // Aqui seria atualizada a lista de clientes
  };

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
            {/* Barra de Busca */}
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

            {/* Tabela de Clientes */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nome Fantasia</TableHead>
                    <TableHead className="font-semibold text-gray-700">CPF/CNPJ</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nome do Cônjuge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleClientSelect(client)}
                    >
                      <TableCell>
                        <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left">
                          {client.nome}
                        </button>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {client.nomeFantasia || '-'}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {client.cpfcnpj}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {client.nomeConjuge || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
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
              {/* Contador */}
              <span className="text-sm text-gray-600">
                {startIndex + 1}-{endIndex} de {totalItems}
              </span>

              {/* Paginação */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                PESQUISAR
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NewClientDialog 
        open={showNewClientDialog} 
        onOpenChange={(open) => {
          setShowNewClientDialog(open);
          if (!open) handleNewClientCreated();
        }}
      />
    </>
  );
};

export default ClientSelectionDialog;
