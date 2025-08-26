
-- Criar tabelas para armazenar dados do XML do Promob
-- Tabela para orçamentos importados do XML
CREATE TABLE public.orcamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  data_orcamento DATE,
  ambiente_principal TEXT,
  situacao TEXT DEFAULT 'Importado',
  etapa TEXT DEFAULT 'Análise',
  valor_pedido NUMERIC DEFAULT 0,
  valor_orcamento NUMERIC DEFAULT 0,
  acrescimo NUMERIC DEFAULT 0,
  frete NUMERIC DEFAULT 0,
  montagem NUMERIC DEFAULT 0,
  impostos NUMERIC DEFAULT 0,
  descontos NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para ambientes do orçamento
CREATE TABLE public.ambientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_id UUID NOT NULL REFERENCES public.orcamentos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  total_pedido NUMERIC DEFAULT 0,
  total_orcamento NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para categorias dos ambientes
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ambiente_id UUID NOT NULL REFERENCES public.ambientes(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  total_pedido NUMERIC DEFAULT 0,
  total_orcamento NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para itens das categorias
CREATE TABLE public.itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  referencia TEXT,
  quantidade INTEGER DEFAULT 1,
  unidade TEXT DEFAULT 'UN',
  largura NUMERIC,
  altura NUMERIC,
  profundidade NUMERIC,
  dimensoes TEXT,
  valor_total NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para subitens dos itens
CREATE TABLE public.subitens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.itens(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  referencia TEXT,
  quantidade INTEGER DEFAULT 1,
  unidade TEXT DEFAULT 'UN',
  largura NUMERIC,
  altura NUMERIC,
  profundidade NUMERIC,
  dimensoes TEXT,
  valor_total NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para margens (impostos, descontos, acréscimos)
CREATE TABLE public.margens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entidade_tipo TEXT NOT NULL, -- 'orcamento', 'ambiente', 'categoria', 'item'
  entidade_id UUID NOT NULL,
  tipo TEXT NOT NULL, -- 'imposto', 'desconto', 'acrescimo'
  descricao TEXT NOT NULL,
  valor NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS) nas novas tabelas
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subitens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.margens ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para orcamentos
CREATE POLICY "Users can view their own orcamentos" ON public.orcamentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orcamentos" ON public.orcamentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orcamentos" ON public.orcamentos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own orcamentos" ON public.orcamentos FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para ambientes
CREATE POLICY "Users can view their own ambientes" ON public.ambientes FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.orcamentos WHERE orcamentos.id = ambientes.orcamento_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can create their own ambientes" ON public.ambientes FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.orcamentos WHERE orcamentos.id = ambientes.orcamento_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can update their own ambientes" ON public.ambientes FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.orcamentos WHERE orcamentos.id = ambientes.orcamento_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can delete their own ambientes" ON public.ambientes FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.orcamentos WHERE orcamentos.id = ambientes.orcamento_id AND orcamentos.user_id = auth.uid()
));

-- Políticas RLS para categorias
CREATE POLICY "Users can view their own categorias" ON public.categorias FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.ambientes JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE ambientes.id = categorias.ambiente_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can create their own categorias" ON public.categorias FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.ambientes JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE ambientes.id = categorias.ambiente_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can update their own categorias" ON public.categorias FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.ambientes JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE ambientes.id = categorias.ambiente_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can delete their own categorias" ON public.categorias FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.ambientes JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE ambientes.id = categorias.ambiente_id AND orcamentos.user_id = auth.uid()
));

-- Políticas RLS para itens
CREATE POLICY "Users can view their own itens" ON public.itens FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.categorias 
  JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
  JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE categorias.id = itens.categoria_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can create their own itens" ON public.itens FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.categorias 
  JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
  JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE categorias.id = itens.categoria_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can update their own itens" ON public.itens FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.categorias 
  JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
  JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE categorias.id = itens.categoria_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can delete their own itens" ON public.itens FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.categorias 
  JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
  JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE categorias.id = itens.categoria_id AND orcamentos.user_id = auth.uid()
));

-- Políticas RLS para subitens
CREATE POLICY "Users can view their own subitens" ON public.subitens FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.itens 
  JOIN public.categorias ON itens.categoria_id = categorias.id
  JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
  JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE itens.id = subitens.item_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can create their own subitens" ON public.subitens FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.itens 
  JOIN public.categorias ON itens.categoria_id = categorias.id
  JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
  JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE itens.id = subitens.item_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can update their own subitens" ON public.subitens FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.itens 
  JOIN public.categorias ON itens.categoria_id = categorias.id
  JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
  JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE itens.id = subitens.item_id AND orcamentos.user_id = auth.uid()
));
CREATE POLICY "Users can delete their own subitens" ON public.subitens FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.itens 
  JOIN public.categorias ON itens.categoria_id = categorias.id
  JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
  JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
  WHERE itens.id = subitens.item_id AND orcamentos.user_id = auth.uid()
));

-- Políticas RLS para margens (aplicável a qualquer entidade)
CREATE POLICY "Users can view their own margens" ON public.margens FOR SELECT USING (
  CASE entidade_tipo
    WHEN 'orcamento' THEN EXISTS (SELECT 1 FROM public.orcamentos WHERE id = entidade_id AND user_id = auth.uid())
    WHEN 'ambiente' THEN EXISTS (
      SELECT 1 FROM public.ambientes 
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE ambientes.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    WHEN 'categoria' THEN EXISTS (
      SELECT 1 FROM public.categorias 
      JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE categorias.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    WHEN 'item' THEN EXISTS (
      SELECT 1 FROM public.itens 
      JOIN public.categorias ON itens.categoria_id = categorias.id
      JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE itens.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    ELSE false
  END
);

CREATE POLICY "Users can create their own margens" ON public.margens FOR INSERT WITH CHECK (
  CASE entidade_tipo
    WHEN 'orcamento' THEN EXISTS (SELECT 1 FROM public.orcamentos WHERE id = entidade_id AND user_id = auth.uid())
    WHEN 'ambiente' THEN EXISTS (
      SELECT 1 FROM public.ambientes 
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE ambientes.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    WHEN 'categoria' THEN EXISTS (
      SELECT 1 FROM public.categorias 
      JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE categorias.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    WHEN 'item' THEN EXISTS (
      SELECT 1 FROM public.itens 
      JOIN public.categorias ON itens.categoria_id = categorias.id
      JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE itens.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    ELSE false
  END
);

CREATE POLICY "Users can update their own margens" ON public.margens FOR UPDATE USING (
  CASE entidade_tipo
    WHEN 'orcamento' THEN EXISTS (SELECT 1 FROM public.orcamentos WHERE id = entidade_id AND user_id = auth.uid())
    WHEN 'ambiente' THEN EXISTS (
      SELECT 1 FROM public.ambientes 
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE ambientes.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    WHEN 'categoria' THEN EXISTS (
      SELECT 1 FROM public.categorias 
      JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE categorias.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    WHEN 'item' THEN EXISTS (
      SELECT 1 FROM public.itens 
      JOIN public.categorias ON itens.categoria_id = categorias.id
      JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE itens.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    ELSE false
  END
);

CREATE POLICY "Users can delete their own margens" ON public.margens FOR DELETE USING (
  CASE entidade_tipo
    WHEN 'orcamento' THEN EXISTS (SELECT 1 FROM public.orcamentos WHERE id = entidade_id AND user_id = auth.uid())
    WHEN 'ambiente' THEN EXISTS (
      SELECT 1 FROM public.ambientes 
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE ambientes.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    WHEN 'categoria' THEN EXISTS (
      SELECT 1 FROM public.categorias 
      JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE categorias.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    WHEN 'item' THEN EXISTS (
      SELECT 1 FROM public.itens 
      JOIN public.categorias ON itens.categoria_id = categorias.id
      JOIN public.ambientes ON categorias.ambiente_id = ambientes.id
      JOIN public.orcamentos ON ambientes.orcamento_id = orcamentos.id 
      WHERE itens.id = entidade_id AND orcamentos.user_id = auth.uid()
    )
    ELSE false
  END
);

-- Criar índices para otimizar performance
CREATE INDEX idx_orcamentos_user_id ON public.orcamentos (user_id);
CREATE INDEX idx_orcamentos_project_id ON public.orcamentos (project_id);
CREATE INDEX idx_ambientes_orcamento_id ON public.ambientes (orcamento_id);
CREATE INDEX idx_categorias_ambiente_id ON public.categorias (ambiente_id);
CREATE INDEX idx_itens_categoria_id ON public.itens (categoria_id);
CREATE INDEX idx_subitens_item_id ON public.subitens (item_id);
CREATE INDEX idx_margens_entidade ON public.margens (entidade_tipo, entidade_id);
