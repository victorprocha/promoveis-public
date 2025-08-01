import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Collaborator {
  id: string;
  user_id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export const useCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCollaborators = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollaborators(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar colaboradores');
      toast({
        title: "Erro",
        description: "Erro ao carregar colaboradores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const addCollaborator = useCallback(async (collaboratorData: Omit<Collaborator, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('collaborators')
        .insert({
          ...collaboratorData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setCollaborators(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Colaborador adicionado com sucesso",
      });
      return data;
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar colaborador",
        variant: "destructive",
      });
      throw err;
    }
  }, [user, toast]);

  const updateCollaborator = useCallback(async (id: string, updates: Partial<Omit<Collaborator, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('collaborators')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCollaborators(prev => prev.map(collab => 
        collab.id === id ? data : collab
      ));
      toast({
        title: "Sucesso",
        description: "Colaborador atualizado com sucesso",
      });
      return data;
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar colaborador",
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const deleteCollaborator = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCollaborators(prev => prev.filter(collab => collab.id !== id));
      toast({
        title: "Sucesso",
        description: "Colaborador removido com sucesso",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao remover colaborador",
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  const refetch = useCallback(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  return {
    collaborators,
    loading,
    error,
    refetch,
    addCollaborator,
    updateCollaborator,
    deleteCollaborator
  };
};