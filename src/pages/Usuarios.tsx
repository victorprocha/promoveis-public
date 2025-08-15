import React, { useState, useEffect } from 'react';
import { Users, Pencil, Trash2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Usuario {
  id: string;
  name: string;
  email: string;
  permission: string;
  phone?: string;
  mobile?: string;
  created_at: string;
}

interface UsuariosProps {
  onNavigate?: (module: string) => void;
}

const Usuarios: React.FC<UsuariosProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from database
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    if (onNavigate) {
      onNavigate('cadastro-usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover usuário",
        variant: "destructive"
      });
    }
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
          
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddUser}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">
                Carregando usuários...
              </div>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Usuarios;