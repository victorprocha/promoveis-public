import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PurchaseOrder {
  id: string;
  user_id: string;
  order_number: number;
  order_date: string;
  supplier: string;
  responsible: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export const usePurchaseOrders = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPurchaseOrder = async (orderData: {
    order_date: string;
    supplier: string;
    responsible: string;
  }): Promise<PurchaseOrder | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert({
          user_id: user.id,
          order_date: orderData.order_date,
          supplier: orderData.supplier,
          responsible: orderData.responsible,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPurchaseOrder = async (id: string): Promise<PurchaseOrder | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPurchaseOrderItems = async (purchaseOrderId: string): Promise<PurchaseOrderItem[]> => {
    if (!user) {
      setError('User not authenticated');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('purchase_order_items')
        .select('*')
        .eq('purchase_order_id', purchaseOrderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addPurchaseOrderItem = async (itemData: {
    purchase_order_id: string;
    product_name: string;
    quantity: number;
    unit_price?: number;
  }): Promise<PurchaseOrderItem | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const subtotal = (itemData.unit_price || 0) * itemData.quantity;
      
      const { data, error } = await supabase
        .from('purchase_order_items')
        .insert({
          purchase_order_id: itemData.purchase_order_id,
          product_name: itemData.product_name,
          quantity: itemData.quantity,
          unit_price: itemData.unit_price || 0,
          subtotal: subtotal,
        })
        .select()
        .single();

      if (error) throw error;

      // Update total amount in purchase order
      await updatePurchaseOrderTotal(itemData.purchase_order_id);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePurchaseOrderItem = async (itemId: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the item to find the purchase order id
      const { data: item, error: getError } = await supabase
        .from('purchase_order_items')
        .select('purchase_order_id')
        .eq('id', itemId)
        .single();

      if (getError) throw getError;

      const { error } = await supabase
        .from('purchase_order_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Update total amount in purchase order
      if (item) {
        await updatePurchaseOrderTotal(item.purchase_order_id);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseOrderTotal = async (purchaseOrderId: string): Promise<void> => {
    try {
      // Calculate total from items
      const { data: items, error: itemsError } = await supabase
        .from('purchase_order_items')
        .select('subtotal')
        .eq('purchase_order_id', purchaseOrderId);

      if (itemsError) throw itemsError;

      const total = items?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;

      // Update purchase order total
      const { error: updateError } = await supabase
        .from('purchase_orders')
        .update({ total_amount: total })
        .eq('id', purchaseOrderId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating purchase order total:', err);
    }
  };

  return {
    loading,
    error,
    createPurchaseOrder,
    getPurchaseOrder,
    getPurchaseOrderItems,
    addPurchaseOrderItem,
    deletePurchaseOrderItem,
  };
};