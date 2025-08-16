-- First create the function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create table for billing information
CREATE TABLE public.billing_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users,
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id),
  reference TEXT NOT NULL,
  bank TEXT,
  payment_condition TEXT NOT NULL, -- 'a_vista' or 'a_prazo'
  installments INTEGER, -- only if payment_condition is 'a_prazo'
  payment_method TEXT NOT NULL, -- 'dinheiro', 'cheque', 'boleto', 'deposito', 'cartao_credito', 'cartao_debito', 'transferencia'
  billing_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.billing_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own billing info" 
ON public.billing_info 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own billing info" 
ON public.billing_info 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own billing info" 
ON public.billing_info 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_billing_info_updated_at
BEFORE UPDATE ON public.billing_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add status column to purchase_orders to track billing status
ALTER TABLE public.purchase_orders 
ADD COLUMN billing_status TEXT DEFAULT 'pending'; -- 'pending', 'billed'