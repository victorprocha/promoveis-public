
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Mail, Plus, Calendar, Edit, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useClient } from '@/hooks/useClients';
import NewProjectWithClientDialog from '@/components/Dialogs/NewProjectWithClientDialog';

interface ClientDetailsProps {
  clientId?: string;
  onBack?: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ clientId, onBack }) => {
  const { client, loading, error } = useClient(clientId || '');
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  if (loading === 'loading') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="text-sm text-gray-500">
            Clientes &gt; Ficha do Cliente
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="text-sm text-gray-500">
            Clientes &gt; Ficha do Cliente
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Cliente não encontrado</h2>
            <p className="text-gray-600 mb-4">O cliente solicitado não foi encontrado.</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="text-sm text-gray-500">
          Clientes &gt; Ficha do Cliente
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Column - Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Client Header */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#007BFF] rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-[#2A3F54] mb-1">{client.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      {client.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          {client.phone}
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button size="icon" variant="outline" className="text-[#007BFF] border-[#007BFF]">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Client Data */}
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg text-[#2A3F54]">Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Endereço</label>
                    <p className="text-gray-900">{client.address || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cidade</label>
                    <p className="text-gray-900">{client.city || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <p className="text-gray-900">{client.state || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">CEP</label>
                    <p className="text-gray-900">{client.zipCode || 'Não informado'}</p>
                  </div>
                  {client.company && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Empresa</label>
                      <p className="text-gray-900">{client.company}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data de Cadastro</label>
                    <p className="text-gray-900">{client.birthFoundation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-[#007BFF]" />
                    <CardTitle className="text-lg text-[#2A3F54]">
                      Projetos de {client.name}
                    </CardTitle>
                  </div>
                  <Button 
                    size="icon" 
                    className="bg-[#28A745] hover:bg-[#218838] rounded-full"
                    onClick={() => setShowNewProjectDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum projeto encontrado para este cliente.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowNewProjectDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Projeto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Info Cards */}
        <div className="w-80 p-6 space-y-4">
          {/* Sales History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-1">
                HISTÓRICO DE VENDAS
                <div className="w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center">
                  ?
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-white font-bold text-lg">0</span>
                  </div>
                  <div className="text-xs text-gray-600">ORÇAMENTOS</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-white font-bold text-lg">0</span>
                  </div>
                  <div className="text-xs text-gray-600">VENDAS</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t">
                <div className="text-2xl font-bold text-pink-500">R$0,00</div>
                <div className="text-xs text-gray-600">TOTAL VENDIDO</div>
              </div>
            </CardContent>
          </Card>

          {/* Phones */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-pink-500" />
                  Telefones
                </CardTitle>
                <Button size="icon" className="bg-pink-500 hover:bg-pink-600 rounded-full w-6 h-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {client.phone ? (
                <div className="mb-2">
                  <div className="text-xs text-gray-500">Principal</div>
                  <div className="text-sm text-[#007BFF] font-medium">{client.phone}</div>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  Nenhum telefone cadastrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Agenda */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">Agenda do Cliente</CardTitle>
                <Button size="icon" className="bg-purple-500 hover:bg-purple-600 rounded-full w-6 h-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 text-sm">
                Nenhuma agenda cadastrada
              </div>
            </CardContent>
          </Card>

          {/* Client Attachments */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">📎</span>
                  </div>
                  Anexos do Cliente
                </CardTitle>
                <Button size="icon" className="bg-gray-500 hover:bg-gray-600 rounded-full w-6 h-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 text-sm">
                Nenhum anexo cadastrado
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          VOLTAR
        </Button>
        
        <div className="flex items-center gap-4">
          <Button variant="link" className="text-[#007BFF]">VER FICHA COMPLETA</Button>
          <Button variant="outline" className="text-red-600 border-red-600">EXCLUIR</Button>
          <Button className="bg-[#007BFF] hover:bg-[#0056b3]">EDITAR</Button>
        </div>
      </div>

      <NewProjectWithClientDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
      />
    </div>
  );
};

export default ClientDetails;
