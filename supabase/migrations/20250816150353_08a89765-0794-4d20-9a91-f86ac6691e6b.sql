-- Create purchase orders table
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_number SERIAL NOT NULL,
  order_date DATE NOT NULL,
  supplier TEXT NOT NULL,
  responsible TEXT NOT NULL,
  total_amount NUMERIC DEFAULT 0.00,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase order items table
CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC DEFAULT 0.00,
  subtotal NUMERIC DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for purchase_orders
CREATE POLICY "Users can view their own purchase orders" 
ON public.purchase_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchase orders" 
ON public.purchase_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchase orders" 
ON public.purchase_orders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own purchase orders" 
ON public.purchase_orders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for purchase_order_items
CREATE POLICY "Users can view their own purchase order items" 
ON public.purchase_order_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.purchase_orders 
  WHERE purchase_orders.id = purchase_order_items.purchase_order_id 
  AND purchase_orders.user_id = auth.uid()
));

CREATE POLICY "Users can create their own purchase order items" 
ON public.purchase_order_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.purchase_orders 
  WHERE purchase_orders.id = purchase_order_items.purchase_order_id 
  AND purchase_orders.user_id = auth.uid()
));

CREATE POLICY "Users can update their own purchase order items" 
ON public.purchase_order_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.purchase_orders 
  WHERE purchase_orders.id = purchase_order_items.purchase_order_id 
  AND purchase_orders.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own purchase order items" 
ON public.purchase_order_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.purchase_orders 
  WHERE purchase_orders.id = purchase_order_items.purchase_order_id 
  AND purchase_orders.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_purchase_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_purchase_order_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_purchase_orders_updated_at
BEFORE UPDATE ON public.purchase_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_purchase_orders_updated_at();

CREATE TRIGGER update_purchase_order_items_updated_at
BEFORE UPDATE ON public.purchase_order_items
FOR EACH ROW
EXECUTE FUNCTION public.update_purchase_order_items_updated_at();