
-- Adicionar constraint única na coluna project_id para permitir upsert
ALTER TABLE public.project_xml_data 
ADD CONSTRAINT project_xml_data_project_id_unique UNIQUE (project_id);
