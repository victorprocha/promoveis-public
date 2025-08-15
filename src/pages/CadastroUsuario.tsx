import React, { useState } from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserFormData {
  name: string;
  rg: string;
  cpf: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  email: string;
  password: string;
  phone: string;
  mobile: string;
  permission: string;
}

const CadastroUsuario: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    rg: '',
    cpf: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    email: '',
    password: '',
    phone: '',
    mobile: '',
    permission: ''
  });

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.permission) {
      toast({
        title: "Erro",
        description: "Nome, email, senha e permissão são obrigatórios",
        variant: "destructive"
      });
      return;
    }

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

      // Hash da senha (em produção use uma biblioteca adequada)
      const passwordHash = btoa(formData.password); // Método simples para demonstração

      const { error } = await supabase
        .from('users')
        .insert([{
          user_id: user.id,
          name: formData.name,
          rg: formData.rg || null,
          cpf: formData.cpf || null,
          street: formData.street || null,
          number: formData.number || null,
          neighborhood: formData.neighborhood || null,
          city: formData.city || null,
          state: formData.state || null,
          email: formData.email,
          password_hash: passwordHash,
          phone: formData.phone || null,
          mobile: formData.mobile || null,
          permission: formData.permission
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Usuário cadastrado com sucesso!"
      });

      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar usuário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/usuarios')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Cadastro de Usuário</h1>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Dados do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    value={formData.rg}
                    onChange={(e) => handleInputChange('rg', e.target.value)}
                    placeholder="Digite o RG"
                  />
                </div>

                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="Digite o CPF"
                  />
                </div>

                <div>
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    placeholder="Digite o endereço"
                  />
                </div>

                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    placeholder="Digite o número"
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    placeholder="Digite o bairro"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Digite a cidade"
                  />
                </div>

                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Digite o estado"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Digite o e-mail"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Digite a senha"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Digite o telefone"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile">Celular</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="Digite o celular"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="permission">Permissões *</Label>
                  <Select onValueChange={(value) => handleInputChange('permission', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a permissão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                      <SelectItem value="Vendedor">Vendedor</SelectItem>
                      <SelectItem value="Estoque">Estoque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-6">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => navigate('/usuarios')}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroUsuario;