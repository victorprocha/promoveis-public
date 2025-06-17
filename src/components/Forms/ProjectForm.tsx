
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ProjectForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    budget: '',
    deadline: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('projects')
        .insert([
          {
            ...formData,
            budget: formData.budget ? parseFloat(formData.budget) : null,
            user_id: user.id,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Projeto criado com sucesso!",
        description: "O novo projeto foi adicionado ao sistema.",
      });

      setFormData({
        name: '',
        description: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        budget: '',
        deadline: '',
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar projeto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo Projeto</CardTitle>
          <CardDescription>
            Adicione um novo projeto ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Projeto</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite o nome do projeto"
                  required
                />
              </div>

              <div>
                <Label htmlFor="client_name">Nome do Cliente</Label>
                <Input
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="Digite o nome do cliente"
                  required
                />
              </div>

              <div>
                <Label htmlFor="client_email">Email do Cliente</Label>
                <Input
                  id="client_email"
                  name="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={handleChange}
                  placeholder="cliente@email.com"
                />
              </div>

              <div>
                <Label htmlFor="client_phone">Telefone do Cliente</Label>
                <Input
                  id="client_phone"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="budget">Orçamento</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.01"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="deadline">Prazo de Entrega</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva os detalhes do projeto"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#007BFF] hover:bg-[#0056b3]"
            >
              {isLoading ? "Criando..." : "Criar Projeto"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectForm;
