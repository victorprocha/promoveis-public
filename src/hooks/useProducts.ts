import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  descricao: string;
  unidade: string;
  marca?: string;
  acabamento?: string;
  fornecedor?: string;
  estoque: number;
  estoque_minimo: number;
  preco_compra: number;
  localizacao?: string;
  altura_metros?: number;
  largura_metros?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  descricao: string;
  unidade: string;
  marca: string;
  acabamento: string;
  fornecedor: string;
  estoque: string;
  estoque_minimo: string;
  preco_compra: string;
  localizacao: string;
  altura_metros?: string;
  largura_metros?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar produtos",
          variant: "destructive",
        });
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData: ProductFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return false;
      }

      const productData = {
        user_id: user.id,
        descricao: formData.descricao,
        unidade: formData.unidade,
        marca: formData.marca || null,
        acabamento: formData.acabamento || null,
        fornecedor: formData.fornecedor || null,
        estoque: parseInt(formData.estoque) || 0,
        estoque_minimo: parseInt(formData.estoque_minimo) || 0,
        preco_compra: parseFloat(formData.preco_compra.replace(',', '.')) || 0,
        localizacao: formData.localizacao || null,
        altura_metros: formData.altura_metros ? parseFloat(formData.altura_metros.replace(',', '.')) : null,
        largura_metros: formData.largura_metros ? parseFloat(formData.largura_metros.replace(',', '.')) : null,
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        console.error('Error creating product:', error);
        toast({
          title: "Erro",
          description: "Erro ao cadastrar produto",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Produto cadastrado com sucesso!",
      });

      // Refresh products list
      await fetchProducts();
      return true;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar produto",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir produto",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      });

      // Refresh products list
      await fetchProducts();
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir produto",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    createProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };
};