-- Create event_matrix table for storing event matrix configurations
CREATE TABLE public.event_matrix (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  description TEXT NOT NULL DEFAULT 'FLUXO PADRÃO',
  start_date DATE NOT NULL DEFAULT '2000-01-01',
  end_date DATE NOT NULL DEFAULT '9999-12-31',
  agenda_type TEXT NOT NULL DEFAULT 'Compromissos',
  workflow_type TEXT NOT NULL DEFAULT 'Fluxo de venda padrão',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_matrix_events table for storing individual events
CREATE TABLE public.event_matrix_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_matrix_id UUID NOT NULL REFERENCES public.event_matrix(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_sequence INTEGER NOT NULL,
  days INTEGER NOT NULL DEFAULT 0,
  generates_commitment TEXT NOT NULL DEFAULT 'Não Gera Compromisso',
  control_enabled BOOLEAN NOT NULL DEFAULT true,
  selected_collaborators UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.event_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_matrix_events ENABLE ROW LEVEL SECURITY;

-- Create policies for event_matrix
CREATE POLICY "Users can view their own event matrices" 
ON public.event_matrix 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own event matrices" 
ON public.event_matrix 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event matrices" 
ON public.event_matrix 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event matrices" 
ON public.event_matrix 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for event_matrix_events
CREATE POLICY "Users can view their own event matrix events" 
ON public.event_matrix_events 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.event_matrix 
  WHERE event_matrix.id = event_matrix_events.event_matrix_id 
  AND event_matrix.user_id = auth.uid()
));

CREATE POLICY "Users can create their own event matrix events" 
ON public.event_matrix_events 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.event_matrix 
  WHERE event_matrix.id = event_matrix_events.event_matrix_id 
  AND event_matrix.user_id = auth.uid()
));

CREATE POLICY "Users can update their own event matrix events" 
ON public.event_matrix_events 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.event_matrix 
  WHERE event_matrix.id = event_matrix_events.event_matrix_id 
  AND event_matrix.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own event matrix events" 
ON public.event_matrix_events 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.event_matrix 
  WHERE event_matrix.id = event_matrix_events.event_matrix_id 
  AND event_matrix.user_id = auth.uid()
));

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_event_matrix_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_event_matrix_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_matrix_updated_at
  BEFORE UPDATE ON public.event_matrix
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_matrix_updated_at();

CREATE TRIGGER update_event_matrix_events_updated_at
  BEFORE UPDATE ON public.event_matrix_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_matrix_events_updated_at();

-- Insert default event matrix and events for existing users
INSERT INTO public.event_matrix (user_id, description, start_date, end_date, agenda_type, workflow_type)
SELECT DISTINCT user_id, 'FLUXO PADRÃO', '2000-01-01'::date, '9999-12-31'::date, 'Compromissos', 'Fluxo de venda padrão'
FROM public.projects
WHERE user_id IS NOT NULL;

-- Insert default events for each event matrix
WITH default_events AS (
  SELECT * FROM (VALUES
    ('Assinatura do Contrato', 10, 0, 'Não Gera Compromisso', true),
    ('Check-list Comercial do Contrato', 20, 0, 'Não Gera Compromisso', true),
    ('Check-list Financeiro do Contrato', 20, 0, 'Não Gera Compromisso', true),
    ('Liberação Comercial', 30, 0, 'Não Gera Compromisso', true),
    ('Liberação Financeira', 30, 0, 'Não Gera Compromisso', true),
    ('Medição dos Ambientes', 35, 0, 'Não Gera Compromisso', true),
    ('Revisão dos Ambientes', 40, 0, 'Não Gera Compromisso', true),
    ('Assinatura da Pasta Executiva', 45, 0, 'Não Gera Compromisso', true),
    ('Compra dos Itens dos Ambientes', 50, 0, 'Não Gera Compromisso', true),
    ('Produção dos Itens dos Ambientes', 55, 0, 'Não Gera Compromisso', true),
    ('Liberação de Obra', 55, 0, 'Não Gera Compromisso', true),
    ('Entrega dos Ambientes', 60, 0, 'Não Gera Compromisso', true),
    ('Montagem dos Ambientes', 70, 0, 'Não Gera Compromisso', true),
    ('Entrega Técnica', 75, 0, 'Não Gera Compromisso', true),
    ('Conclusão do Contrato', 80, 0, 'Não Gera Compromisso', true)
  ) AS t(name, order_sequence, days, generates_commitment, control_enabled)
)
INSERT INTO public.event_matrix_events (event_matrix_id, name, order_sequence, days, generates_commitment, control_enabled)
SELECT em.id, de.name, de.order_sequence, de.days, de.generates_commitment, de.control_enabled
FROM public.event_matrix em
CROSS JOIN default_events de;