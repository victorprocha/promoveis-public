-- Create budgets table
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID,
  client_name TEXT NOT NULL,
  initial_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  budget_observations TEXT,
  final_considerations TEXT
);

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Create policies for budgets
CREATE POLICY "Users can view their own budgets" 
ON public.budgets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets" 
ON public.budgets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" 
ON public.budgets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" 
ON public.budgets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create budget_environments table
CREATE TABLE public.budget_environments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL,
  environment_name TEXT NOT NULL,
  environment_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.budget_environments ENABLE ROW LEVEL SECURITY;

-- Create policies for budget_environments
CREATE POLICY "Users can view their own budget environments" 
ON public.budget_environments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.budgets 
  WHERE budgets.id = budget_environments.budget_id 
  AND budgets.user_id = auth.uid()
));

CREATE POLICY "Users can create their own budget environments" 
ON public.budget_environments 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.budgets 
  WHERE budgets.id = budget_environments.budget_id 
  AND budgets.user_id = auth.uid()
));

CREATE POLICY "Users can update their own budget environments" 
ON public.budget_environments 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.budgets 
  WHERE budgets.id = budget_environments.budget_id 
  AND budgets.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own budget environments" 
ON public.budget_environments 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.budgets 
  WHERE budgets.id = budget_environments.budget_id 
  AND budgets.user_id = auth.uid()
));

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON public.budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_environments_updated_at
BEFORE UPDATE ON public.budget_environments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();