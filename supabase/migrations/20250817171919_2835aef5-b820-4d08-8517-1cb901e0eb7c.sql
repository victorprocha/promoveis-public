-- Create table for pedidos de saída (outbound orders)
CREATE TABLE public.pedidos_saida (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pedido SERIAL NOT NULL,
  data_saida DATE NOT NULL,
  responsavel_id TEXT NOT NULL,
  cliente_id TEXT NOT NULL,
  referencia_contrato TEXT,
  status TEXT NOT NULL DEFAULT 'Em Edição',
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for pedido de saída items
CREATE TABLE public.pedidos_saida_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_saida_id UUID NOT NULL REFERENCES pedidos_saida(id) ON DELETE CASCADE,
  produto_nome TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pedidos_saida ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_saida_items ENABLE ROW LEVEL SECURITY;

-- Create policies for pedidos_saida
CREATE POLICY "Users can view their own pedidos_saida" 
ON public.pedidos_saida 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pedidos_saida" 
ON public.pedidos_saida 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pedidos_saida" 
ON public.pedidos_saida 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pedidos_saida" 
ON public.pedidos_saida 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for pedidos_saida_items
CREATE POLICY "Users can view items of their own pedidos_saida" 
ON public.pedidos_saida_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM pedidos_saida 
    WHERE pedidos_saida.id = pedidos_saida_items.pedido_saida_id 
    AND pedidos_saida.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create items for their own pedidos_saida" 
ON public.pedidos_saida_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM pedidos_saida 
    WHERE pedidos_saida.id = pedidos_saida_items.pedido_saida_id 
    AND pedidos_saida.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update items of their own pedidos_saida" 
ON public.pedidos_saida_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM pedidos_saida 
    WHERE pedidos_saida.id = pedidos_saida_items.pedido_saida_id 
    AND pedidos_saida.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete items of their own pedidos_saida" 
ON public.pedidos_saida_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM pedidos_saida 
    WHERE pedidos_saida.id = pedidos_saida_items.pedido_saida_id 
    AND pedidos_saida.user_id = auth.uid()
  )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_pedidos_saida_updated_at
  BEFORE UPDATE ON public.pedidos_saida
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pedidos_saida_items_updated_at
  BEFORE UPDATE ON public.pedidos_saida_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();