
-- Create a table for specifiers
CREATE TABLE public.specifiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  contato TEXT,
  especialidade TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on specifiers
ALTER TABLE public.specifiers ENABLE ROW LEVEL SECURITY;

-- Create policies for specifiers
CREATE POLICY "Users can view their own specifiers" 
  ON public.specifiers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own specifiers" 
  ON public.specifiers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own specifiers" 
  ON public.specifiers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own specifiers" 
  ON public.specifiers 
  FOR DELETE 
  USING (auth.uid() = user_id);
