-- Create table for NF-e issuer information
CREATE TABLE public.emitente_nfe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cnpj TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  inscricao_estadual TEXT,
  inscricao_municipal TEXT,
  cnae TEXT,
  crt TEXT NOT NULL DEFAULT 'Simples Nacional',
  cep TEXT,
  endereco TEXT,
  numero TEXT,
  bairro TEXT,
  estado TEXT,
  cidade TEXT,
  ibge TEXT,
  email TEXT,
  telefone TEXT,
  contato TEXT,
  situacao TEXT DEFAULT 'ATIVA',
  ambiente TEXT NOT NULL DEFAULT 'Homologação',
  certificado_url TEXT,
  senha_certificado TEXT,
  ultima_nfe INTEGER DEFAULT 0,
  serie_nfe INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emitente_nfe ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own emitente_nfe" 
ON public.emitente_nfe 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emitente_nfe" 
ON public.emitente_nfe 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emitente_nfe" 
ON public.emitente_nfe 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emitente_nfe" 
ON public.emitente_nfe 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_emitente_nfe_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_emitente_nfe_updated_at
BEFORE UPDATE ON public.emitente_nfe
FOR EACH ROW
EXECUTE FUNCTION public.update_emitente_nfe_updated_at();