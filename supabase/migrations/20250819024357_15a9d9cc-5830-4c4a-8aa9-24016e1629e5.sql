-- Criar bucket para armazenar arquivos XML de projetos
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false);

-- Criar políticas para o bucket de arquivos de projetos
CREATE POLICY "Users can view their own project files" 
ON storage.objects 
FOR SELECT 
USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own project files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project files" 
ON storage.objects 
FOR UPDATE 
USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project files" 
ON storage.objects 
FOR DELETE 
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Criar tabela para armazenar dados parseados dos XMLs
CREATE TABLE public.project_xml_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  ambiente_data JSONB,
  fornecedores_data JSONB,
  caracteristicas_data JSONB,
  observacoes_data JSONB,
  itens_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS na tabela
ALTER TABLE public.project_xml_data ENABLE ROW LEVEL SECURITY;

-- Criar políticas para a tabela de dados XML
CREATE POLICY "Users can view project xml data" 
ON public.project_xml_data 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create project xml data" 
ON public.project_xml_data 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update project xml data" 
ON public.project_xml_data 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete project xml data" 
ON public.project_xml_data 
FOR DELETE 
USING (true);

-- Criar trigger para atualizar timestamps
CREATE TRIGGER update_project_xml_data_updated_at
BEFORE UPDATE ON public.project_xml_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();