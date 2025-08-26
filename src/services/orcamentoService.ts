
import { supabase } from '@/integrations/supabase/client';

export const orcamentoService = {
  async getOrcamentosByProject(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('orcamentos')
        .select(`
          *,
          ambientes (
            *,
            categorias (
              *,
              itens (
                *,
                subitens (*)
              )
            )
          ),
          margens (*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      throw error;
    }
  },

  async deleteOrcamento(orcamentoId: string) {
    try {
      const { error } = await supabase
        .from('orcamentos')
        .delete()
        .eq('id', orcamentoId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      throw error;
    }
  }
};
