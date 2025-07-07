
-- Adicionar coluna de prioridade à tabela projects se ela não existir
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Normal' 
CHECK (priority IN ('Baixa', 'Normal', 'Alta', 'Urgente'));

-- Atualizar projetos existentes para ter prioridade Normal se estiver null
UPDATE public.projects 
SET priority = 'Normal' 
WHERE priority IS NULL;
