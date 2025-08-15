import React, { useState } from 'react';
import { Users, Pencil, Trash2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Usuario {
  id: string;
  name: string;
  email: string;
  permission: string;
}

const Usuarios: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<Usuario[]>([
    {
      id: '1',
      name: 'admin',
      email: 'anderson@andersonriosconsultor.com',
      permission: 'Administrador'
    },
    {
      id: '2',
      name: 'Isadora Monteiro Rios',
      email: 'isadoramonteiroritos@gmail.com',
      permission: 'Administrador'
    },
    {
      id: '3',
      name: 'Glecia Monteiro Rios',
      email: 'gleciamonteiro@gmail.com',
      permission: 'Administrador'
    },
    {
      id: '4',
      name: 'Yvan Fortori',
      email: 'yvan.eng@outlook.com',
      permission: 'Administrador'
    },
    {
      id: '5',
      name: 'Maria Carolina de Jesus Sousa',
      email: 'adm@muzitare.com',
      permission: 'Vendedor'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    permission: ''
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.permission) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const usuario: Usuario = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      permission: newUser.permission
    };

    setUsers([...users, usuario]);
    setNewUser({ name: '', email: '', permission: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Usuário adicionado com sucesso!"
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Sucesso",
      description: "Usuário removido com sucesso!"
    });
  };

  const getPermissionBadgeVariant = (permission: string) => {
    switch (permission) {
      case 'Administrador':
        return 'default';
      case 'Vendedor':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Usuários</h1>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Digite o endereço de email"
                  />
                </div>
                <div>
                  <Label htmlFor="permission">Permissão</Label>
                  <Select onValueChange={(value) => setNewUser({...newUser, permission: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a permissão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                      <SelectItem value="Vendedor">Vendedor</SelectItem>
                      <SelectItem value="Usuário">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddUser}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nome</TableHead>
                    <TableHead className="w-[300px]">Email</TableHead>
                    <TableHead className="w-[150px]">Permissão</TableHead>
                    <TableHead className="w-[120px] text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getPermissionBadgeVariant(user.permission)}
                          className="capitalize"
                        >
                          {user.permission}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-blue-50 border-blue-200 hover:bg-blue-100"
                          >
                            <Pencil className="h-3 w-3 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-red-50 border-red-200 hover:bg-red-100"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                Nenhum usuário encontrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Usuarios;