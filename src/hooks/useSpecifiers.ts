
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Specifier {
  id: string;
  nome: string;
  contato: string | null;
  especialidade: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export const useSpecifiers = () => {
  const { user } = useAuth();
  const [specifiers, setSpecifiers] = useState<Specifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecifiers = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('specifiers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSpecifiers(data || []);
    } catch (err) {
      console.error('Error fetching specifiers:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar especificadores');
    } finally {
      setLoading(false);
    }
  };

  const addSpecifier = async (specifierData: Omit<Specifier, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('specifiers')
        .insert([{
          ...specifierData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setSpecifiers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding specifier:', err);
      throw err;
    }
  };

  const updateSpecifier = async (id: string, updates: Partial<Omit<Specifier, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('specifiers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSpecifiers(prev => prev.map(spec => spec.id === id ? data : spec));
      return data;
    } catch (err) {
      console.error('Error updating specifier:', err);
      throw err;
    }
  };

  const deleteSpecifier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('specifiers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSpecifiers(prev => prev.filter(spec => spec.id !== id));
    } catch (err) {
      console.error('Error deleting specifier:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSpecifiers();
  }, [user]);

  return {
    specifiers,
    loading,
    error,
    addSpecifier,
    updateSpecifier,
    deleteSpecifier,
    refetch: fetchSpecifiers
  };
};
