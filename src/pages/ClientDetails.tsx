import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Mail, Plus, Calendar, Edit, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClient, useClients } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';
import NewProjectWithClientDialog from '@/components/Dialogs/NewProjectWithClientDialog';

interface ClientDetailsProps {
  clientId?: string;
  onBack?: () => void;
  onProjectCreated?: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ clientId, onBack, onProjectCreated }) => {
  const { client, loading, error } = useClient(clientId || '');
  const { deleteClient, updateClient } = useClients();
  const { toast } = useToast();
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleProjectCreated = () => {
    // Fechar o dialog
    setShowNewProjectDialog(false);
    
    // Notificar o componente pai se callback foi fornecido
    if (onProjectCreated) {
      onProjectCreated();
    }
  };

  const handleEdit = () => {
    if (client) {
      setEditFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zipCode: client.zipCode || ''
      });
      setShowEditDialog(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!client) return;

    try {
      await updateClient(client.id, editFormData);
      setShowEditDialog(false);
      // Recarregar a página ou atualizar os dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const handleDelete = async () => {
    if (!client) return;

    try {
      await deleteClient(client.id);
      setShowDeleteDialog(false);
      // Voltar para a lista de clientes
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

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
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="text-[#007BFF] border-[#007BFF]"
                    onClick={handleEdit}
                  >
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
          <Button 
            variant="outline" 
            className="text-red-600 border-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            EXCLUIR
          </Button>
          <Button 
            className="bg-[#007BFF] hover:bg-[#0056b3]"
            onClick={handleEdit}
          >
            EDITAR
          </Button>
        </div>
      </div>

      <NewProjectWithClientDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onProjectCreated={handleProjectCreated}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente <strong>{client?.name}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="Nome do cliente"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={editFormData.company}
                onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                placeholder="Rua, número, bairro"
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={editFormData.city}
                onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                placeholder="Cidade"
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={editFormData.state}
                onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                placeholder="Estado"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={editFormData.zipCode}
                onChange={(e) => setEditFormData({ ...editFormData, zipCode: e.target.value })}
                placeholder="00000-000"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#007BFF] hover:bg-[#0056b3]">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetails;
