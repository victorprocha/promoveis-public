-- Fix critical security vulnerability in project_xml_data table
-- Replace overly permissive RLS policies with proper user-based access control

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can create project xml data" ON public.project_xml_data;
DROP POLICY IF EXISTS "Users can delete project xml data" ON public.project_xml_data;  
DROP POLICY IF EXISTS "Users can update project xml data" ON public.project_xml_data;
DROP POLICY IF EXISTS "Users can view project xml data" ON public.project_xml_data;

-- Create secure RLS policies that restrict access to project owners only
CREATE POLICY "Users can view their own project xml data" 
ON public.project_xml_data 
FOR SELECT 
USING (EXISTS (
  SELECT 1 
  FROM projects 
  WHERE projects.id = project_xml_data.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can create project xml data for their own projects" 
ON public.project_xml_data 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 
  FROM projects 
  WHERE projects.id = project_xml_data.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can update their own project xml data" 
ON public.project_xml_data 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 
  FROM projects 
  WHERE projects.id = project_xml_data.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own project xml data" 
ON public.project_xml_data 
FOR DELETE 
USING (EXISTS (
  SELECT 1 
  FROM projects 
  WHERE projects.id = project_xml_data.project_id 
  AND projects.user_id = auth.uid()
));