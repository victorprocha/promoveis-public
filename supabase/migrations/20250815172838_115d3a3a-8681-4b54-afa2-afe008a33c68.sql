-- Fix the search_path security issue for the update function
CREATE OR REPLACE FUNCTION public.update_emitente_nfe_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;