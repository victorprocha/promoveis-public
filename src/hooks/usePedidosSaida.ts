import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface PedidoSaida {
  id: string;
  numero_pedido: number;
  data_saida: string;
  responsavel_id: string;
  cliente_id: string;
  referencia_contrato?: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PedidoSaidaItem {
  id: string;
  pedido_saida_id: string;
  produto_nome: string;
  quantidade: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const usePedidosSaida = () => {
  const [pedidos, setPedidos] = useState<PedidoSaida[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPedidos = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('pedidos_saida')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
      toast({
        title: "Erro",
        description: "Erro ao carregar pedidos de saída",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPedido = async (pedidoData: {
    data_saida: string;
    responsavel_id: string;
    cliente_id: string;
    referencia_contrato?: string;
  }) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('pedidos_saida')
      .insert([{
        ...pedidoData,
        user_id: user.id,
        status: 'Em Edição'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updatePedido = async (id: string, updates: Partial<PedidoSaida>) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('pedidos_saida')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deletePedido = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('pedidos_saida')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  const fetchPedidoById = async (id: string): Promise<PedidoSaida | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('pedidos_saida')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  const fetchPedidoItems = async (pedidoId: string): Promise<PedidoSaidaItem[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('pedidos_saida_items')
      .select('*')
      .eq('pedido_saida_id', pedidoId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  };

  const addPedidoItem = async (item: {
    pedido_saida_id: string;
    produto_nome: string;
    quantidade: number;
    observacoes?: string;
  }) => {
    const { data, error } = await supabase
      .from('pedidos_saida_items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updatePedidoItem = async (id: string, updates: Partial<PedidoSaidaItem>) => {
    const { data, error } = await supabase
      .from('pedidos_saida_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deletePedidoItem = async (id: string) => {
    const { error } = await supabase
      .from('pedidos_saida_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  const finalizePedido = async (pedidoId: string, items: PedidoSaidaItem[]) => {
    if (!user) throw new Error('Usuário não autenticado');

    // First, update the pedido status
    const { error: pedidoError } = await supabase
      .from('pedidos_saida')
      .update({ status: 'Finalizado' })
      .eq('id', pedidoId)
      .eq('user_id', user.id);

    if (pedidoError) throw pedidoError;

    // Then update the stock for each item
    for (const item of items) {
      // Get the product by name to find its ID and current stock
      const { data: products, error: productSearchError } = await supabase
        .from('products')
        .select('id, estoque')
        .eq('descricao', item.produto_nome)
        .eq('user_id', user.id);

      if (productSearchError) throw productSearchError;
      
      if (products && products.length > 0) {
        const product = products[0];
        const newStock = product.estoque - item.quantidade;

        // Update the product stock
        const { error: stockUpdateError } = await supabase
          .from('products')
          .update({ estoque: Math.max(0, newStock) })
          .eq('id', product.id)
          .eq('user_id', user.id);

        if (stockUpdateError) throw stockUpdateError;
      }
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [user]);

  return {
    pedidos,
    loading,
    error,
    fetchPedidos,
    createPedido,
    updatePedido,
    deletePedido,
    fetchPedidoById,
    fetchPedidoItems,
    addPedidoItem,
    updatePedidoItem,
    deletePedidoItem,
    finalizePedido
  };
};