import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Budget {
  id: string;
  user_id: string;
  client_id?: string;
  client_name: string;
  initial_date?: string;
  created_at: string;
  updated_at: string;
  budget_observations?: string;
  final_considerations?: string;
}

export interface BudgetEnvironment {
  id: string;
  budget_id: string;
  environment_name: string;
  environment_description?: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetData {
  client_name: string;
  client_id?: string;
  initial_date?: string;
  budget_observations?: string;
  final_considerations?: string;
}

export interface CreateBudgetEnvironmentData {
  environment_name: string;
  environment_description?: string;
  quantity: number;
  price: number;
}

export const useBudgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (budgetData: CreateBudgetData): Promise<Budget | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          ...budgetData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setBudgets(prev => [data, ...prev]);
      toast.success('Orçamento criado com sucesso');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao criar orçamento');
      return null;
    }
  };

  const updateBudget = async (id: string, updates: Partial<CreateBudgetData>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setBudgets(prev => 
        prev.map(budget => 
          budget.id === id ? { ...budget, ...updates } : budget
        )
      );
      toast.success('Orçamento atualizado com sucesso');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao atualizar orçamento');
      return false;
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
  };
};

export const useBudgetEnvironments = (budgetId?: string) => {
  const { user } = useAuth();
  const [environments, setEnvironments] = useState<BudgetEnvironment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnvironments = async () => {
    if (!user || !budgetId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('budget_environments')
        .select('*')
        .eq('budget_id', budgetId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEnvironments(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar ambientes');
    } finally {
      setLoading(false);
    }
  };

  const addEnvironment = async (environmentData: CreateBudgetEnvironmentData): Promise<BudgetEnvironment | null> => {
    if (!user || !budgetId) return null;

    const subtotal = environmentData.quantity * environmentData.price;

    try {
      const { data, error } = await supabase
        .from('budget_environments')
        .insert([{
          ...environmentData,
          budget_id: budgetId,
          subtotal,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setEnvironments(prev => [...prev, data]);
      toast.success('Ambiente adicionado com sucesso');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao adicionar ambiente');
      return null;
    }
  };

  const updateEnvironment = async (id: string, updates: Partial<CreateBudgetEnvironmentData>) => {
    if (!user) return false;

    try {
      const updateData = {
        ...updates,
        subtotal: updates.quantity && updates.price ? updates.quantity * updates.price : undefined
      };

      const { error } = await supabase
        .from('budget_environments')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setEnvironments(prev => 
        prev.map(env => 
          env.id === id ? { ...env, ...updateData } : env
        )
      );
      toast.success('Ambiente atualizado com sucesso');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao atualizar ambiente');
      return false;
    }
  };

  const removeEnvironment = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('budget_environments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEnvironments(prev => prev.filter(env => env.id !== id));
      toast.success('Ambiente removido com sucesso');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao remover ambiente');
      return false;
    }
  };

  useEffect(() => {
    if (budgetId) {
      fetchEnvironments();
    }
  }, [budgetId, user]);

  return {
    environments,
    loading,
    error,
    fetchEnvironments,
    addEnvironment,
    updateEnvironment,
    removeEnvironment,
  };
};