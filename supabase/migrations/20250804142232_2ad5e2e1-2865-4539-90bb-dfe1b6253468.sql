-- Adicionar campo etapa_atual à tabela projects
ALTER TABLE public.projects 
ADD COLUMN etapa_atual TEXT DEFAULT 'Assinatura do Projeto';

-- Criar índice para melhor performance
CREATE INDEX idx_projects_etapa_atual ON public.projects(etapa_atual);

-- Adicionar comentário para documentação
COMMENT ON COLUMN public.projects.etapa_atual IS 'Etapa atual do projeto no fluxo de trabalho';