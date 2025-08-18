-- Create payment_proposals table for multiple payment proposals per budget
CREATE TABLE public.payment_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Proposta',
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) DEFAULT NULL,
  discount_value NUMERIC DEFAULT 0,
  down_payment_type TEXT CHECK (down_payment_type IN ('percentage', 'fixed')) DEFAULT NULL,
  down_payment_value NUMERIC DEFAULT 0,
  interest_rate NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  total_with_discount NUMERIC NOT NULL DEFAULT 0,
  remaining_amount NUMERIC NOT NULL DEFAULT 0,
  installments_count INTEGER NOT NULL DEFAULT 1,
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_installments table for individual installments
CREATE TABLE public.payment_installments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_proposal_id UUID NOT NULL REFERENCES public.payment_proposals(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'Pix',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_installments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payment_proposals
CREATE POLICY "Users can view their own payment proposals"
ON public.payment_proposals
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM budgets
  WHERE budgets.id = payment_proposals.budget_id
  AND budgets.user_id = auth.uid()
));

CREATE POLICY "Users can create their own payment proposals"
ON public.payment_proposals
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM budgets
  WHERE budgets.id = payment_proposals.budget_id
  AND budgets.user_id = auth.uid()
));

CREATE POLICY "Users can update their own payment proposals"
ON public.payment_proposals
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM budgets
  WHERE budgets.id = payment_proposals.budget_id
  AND budgets.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own payment proposals"
ON public.payment_proposals
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM budgets
  WHERE budgets.id = payment_proposals.budget_id
  AND budgets.user_id = auth.uid()
));

-- Create RLS policies for payment_installments
CREATE POLICY "Users can view their own payment installments"
ON public.payment_installments
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM payment_proposals pp
  JOIN budgets b ON b.id = pp.budget_id
  WHERE pp.id = payment_installments.payment_proposal_id
  AND b.user_id = auth.uid()
));

CREATE POLICY "Users can create their own payment installments"
ON public.payment_installments
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM payment_proposals pp
  JOIN budgets b ON b.id = pp.budget_id
  WHERE pp.id = payment_installments.payment_proposal_id
  AND b.user_id = auth.uid()
));

CREATE POLICY "Users can update their own payment installments"
ON public.payment_installments
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM payment_proposals pp
  JOIN budgets b ON b.id = pp.budget_id
  WHERE pp.id = payment_installments.payment_proposal_id
  AND b.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own payment installments"
ON public.payment_installments
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM payment_proposals pp
  JOIN budgets b ON b.id = pp.budget_id
  WHERE pp.id = payment_installments.payment_proposal_id
  AND b.user_id = auth.uid()
));

-- Create triggers for updated_at columns
CREATE TRIGGER update_payment_proposals_updated_at
BEFORE UPDATE ON public.payment_proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_installments_updated_at
BEFORE UPDATE ON public.payment_installments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_payment_proposals_budget_id ON public.payment_proposals(budget_id);
CREATE INDEX idx_payment_installments_proposal_id ON public.payment_installments(payment_proposal_id);
CREATE INDEX idx_payment_proposals_selected ON public.payment_proposals(budget_id, is_selected) WHERE is_selected = TRUE;