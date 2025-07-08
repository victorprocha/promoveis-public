
-- Adicionar colunas para prazo de entrega e especificador na tabela projects
ALTER TABLE public.projects 
ADD COLUMN delivery_deadline date,
ADD COLUMN specifier_id uuid REFERENCES public.specifiers(id);

-- Criar índice para melhor performance nas consultas
CREATE INDEX idx_projects_specifier_id ON public.projects(specifier_id);
