import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PaymentInstallment {
  id: string;
  payment_proposal_id: string;
  installment_number: number;
  due_date: string;
  amount: number;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentProposal {
  id: string;
  budget_id: string;
  name: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value: number;
  down_payment_type?: 'percentage' | 'fixed';
  down_payment_value: number;
  interest_rate: number;
  total_amount: number;
  total_with_discount: number;
  remaining_amount: number;
  installments_count: number;
  is_selected: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentProposalData {
  name: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  down_payment_type?: 'percentage' | 'fixed';
  down_payment_value?: number;
  interest_rate?: number;
  installments_count: number;
  installments: {
    due_date: string;
    amount: number;
    payment_method: string;
    notes?: string;
  }[];
}

export const usePaymentProposals = (budgetId?: string) => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<PaymentProposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = async () => {
    if (!user || !budgetId) {
      setProposals([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_proposals')
        .select('*')
        .eq('budget_id', budgetId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProposals((data || []) as PaymentProposal[]);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar propostas de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const calculateProposalValues = (
    totalAmount: number,
    discountType?: 'percentage' | 'fixed',
    discountValue?: number,
    downPaymentType?: 'percentage' | 'fixed',
    downPaymentValue?: number
  ) => {
    let totalWithDiscount = totalAmount;
    
    if (discountType && discountValue) {
      if (discountType === 'percentage') {
        totalWithDiscount = totalAmount * (1 - discountValue / 100);
      } else {
        totalWithDiscount = totalAmount - discountValue;
      }
    }

    let downPaymentAmount = 0;
    if (downPaymentType && downPaymentValue) {
      if (downPaymentType === 'percentage') {
        downPaymentAmount = totalWithDiscount * (downPaymentValue / 100);
      } else {
        downPaymentAmount = downPaymentValue;
      }
    }

    const remainingAmount = totalWithDiscount - downPaymentAmount;

    return {
      totalWithDiscount,
      downPaymentAmount,
      remainingAmount
    };
  };

  const createProposal = async (
    totalAmount: number,
    proposalData: CreatePaymentProposalData
  ): Promise<PaymentProposal | null> => {
    if (!user || !budgetId) return null;

    try {
      const { totalWithDiscount, remainingAmount } = calculateProposalValues(
        totalAmount,
        proposalData.discount_type,
        proposalData.discount_value,
        proposalData.down_payment_type,
        proposalData.down_payment_value
      );

      // Create the proposal
      const { data: proposal, error: proposalError } = await supabase
        .from('payment_proposals')
        .insert([{
          budget_id: budgetId,
          name: proposalData.name,
          discount_type: proposalData.discount_type,
          discount_value: proposalData.discount_value || 0,
          down_payment_type: proposalData.down_payment_type,
          down_payment_value: proposalData.down_payment_value || 0,
          interest_rate: proposalData.interest_rate || 0,
          total_amount: totalAmount,
          total_with_discount: totalWithDiscount,
          remaining_amount: remainingAmount,
          installments_count: proposalData.installments_count,
          is_selected: false,
        }])
        .select()
        .single();

      if (proposalError) throw proposalError;

      // Create installments
      const installmentsData = proposalData.installments.map((installment, index) => ({
        payment_proposal_id: proposal.id,
        installment_number: index + 1,
        due_date: installment.due_date,
        amount: installment.amount,
        payment_method: installment.payment_method,
        notes: installment.notes,
      }));

      const { error: installmentsError } = await supabase
        .from('payment_installments')
        .insert(installmentsData);

      if (installmentsError) throw installmentsError;

      setProposals(prev => [...prev, proposal as PaymentProposal]);
      toast.success('Proposta de pagamento criada com sucesso');
      return proposal as PaymentProposal;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao criar proposta de pagamento');
      return null;
    }
  };

  const updateProposal = async (
    id: string,
    totalAmount: number,
    updates: Partial<CreatePaymentProposalData>
  ) => {
    if (!user) return false;

    try {
      const { totalWithDiscount, remainingAmount } = calculateProposalValues(
        totalAmount,
        updates.discount_type,
        updates.discount_value,
        updates.down_payment_type,
        updates.down_payment_value
      );

      const { error } = await supabase
        .from('payment_proposals')
        .update({
          ...updates,
          total_amount: totalAmount,
          total_with_discount: totalWithDiscount,
          remaining_amount: remainingAmount,
        })
        .eq('id', id);

      if (error) throw error;

      await fetchProposals();
      toast.success('Proposta atualizada com sucesso');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao atualizar proposta');
      return false;
    }
  };

  const selectProposal = async (id: string) => {
    if (!user || !budgetId) return false;

    try {
      // First, unselect all proposals for this budget
      await supabase
        .from('payment_proposals')
        .update({ is_selected: false })
        .eq('budget_id', budgetId);

      // Then select the specified proposal
      const { error } = await supabase
        .from('payment_proposals')
        .update({ is_selected: true })
        .eq('id', id);

      if (error) throw error;

      setProposals(prev =>
        prev.map(proposal => ({
          ...proposal,
          is_selected: proposal.id === id
        }))
      );
      toast.success('Proposta selecionada');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao selecionar proposta');
      return false;
    }
  };

  const deleteProposal = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('payment_proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProposals(prev => prev.filter(proposal => proposal.id !== id));
      toast.success('Proposta removida com sucesso');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao remover proposta');
      return false;
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [budgetId, user]);

  return {
    proposals,
    loading,
    error,
    fetchProposals,
    createProposal,
    updateProposal,
    selectProposal,
    deleteProposal,
    calculateProposalValues,
  };
};

export const usePaymentInstallments = (proposalId?: string) => {
  const { user } = useAuth();
  const [installments, setInstallments] = useState<PaymentInstallment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstallments = async () => {
    if (!user || !proposalId) {
      setInstallments([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_installments')
        .select('*')
        .eq('payment_proposal_id', proposalId)
        .order('installment_number', { ascending: true });

      if (error) throw error;
      setInstallments(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar parcelas');
    } finally {
      setLoading(false);
    }
  };

  const updateInstallment = async (
    id: string,
    updates: Partial<{
      due_date: string;
      amount: number;
      payment_method: string;
      notes: string;
    }>
  ) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('payment_installments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setInstallments(prev =>
        prev.map(installment =>
          installment.id === id ? { ...installment, ...updates } : installment
        )
      );
      toast.success('Parcela atualizada com sucesso');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao atualizar parcela');
      return false;
    }
  };

  useEffect(() => {
    fetchInstallments();
  }, [proposalId, user]);

  return {
    installments,
    loading,
    error,
    fetchInstallments,
    updateInstallment,
  };
};