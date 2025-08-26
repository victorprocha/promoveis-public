
-- FASE 1: Índices Críticos para Otimização de Performance
-- Criação de índices estratégicos usando CONCURRENTLY para zero downtime

-- Índices em user_id para todas as tabelas principais (melhora consultas filtradas por usuário)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_user_id ON public.clients (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_user_id ON public.products (user_id);  
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_user_id ON public.projects (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_budgets_user_id ON public.budgets (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_orders_user_id ON public.purchase_orders (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_user_id ON public.sales (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_specifiers_user_id ON public.specifiers (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_collaborators_user_id ON public.collaborators (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contracts_user_id ON public.contracts (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_company_info_user_id ON public.company_info (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_user_id ON public.users (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pedidos_saida_user_id ON public.pedidos_saida (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_emitente_nfe_user_id ON public.emitente_nfe (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_matrix_user_id ON public.event_matrix (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_billing_info_user_id ON public.billing_info (user_id);

-- Índices em campos de data frequentemente filtrados (melhora consultas por período)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_orders_order_date ON public.purchase_orders (order_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_sale_date ON public.sales (sale_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_budgets_initial_date ON public.budgets (initial_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_delivery_deadline ON public.projects (delivery_deadline);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_deadline ON public.projects (deadline);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pedidos_saida_data_saida ON public.pedidos_saida (data_saida);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_billing_info_billing_date ON public.billing_info (billing_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_matrix_start_date ON public.event_matrix (start_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_matrix_end_date ON public.event_matrix (end_date);

-- Índices compostos para consultas comuns (user_id + data)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_orders_user_date ON public.purchase_orders (user_id, order_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_user_date ON public.sales (user_id, sale_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_user_deadline ON public.projects (user_id, delivery_deadline);

-- Índices para chaves estrangeiras frequentemente utilizadas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_order_items_purchase_order_id ON public.purchase_order_items (purchase_order_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pedidos_saida_items_pedido_saida_id ON public.pedidos_saida_items (pedido_saida_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_budget_environments_budget_id ON public.budget_environments (budget_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_proposals_budget_id ON public.payment_proposals (budget_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_installments_payment_proposal_id ON public.payment_installments (payment_proposal_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_matrix_events_event_matrix_id ON public.event_matrix_events (event_matrix_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_xml_data_project_id ON public.project_xml_data (project_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_billing_info_purchase_order_id ON public.billing_info (purchase_order_id);

-- Índices para campos frequentemente usados em ordenação e busca
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_name ON public.clients (name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_descricao ON public.products (descricao);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_name ON public.projects (name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_specifiers_nome ON public.specifiers (nome);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_collaborators_name ON public.collaborators (name);

-- Índices para campos de status frequentemente filtrados
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_orders_status ON public.purchase_orders (status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pedidos_saida_status ON public.pedidos_saida (status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_priority ON public.projects (priority);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_etapa_atual ON public.projects (etapa_atual);

-- Índice para campos numéricos frequentemente filtrados
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_estoque ON public.products (estoque);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_orders_order_number ON public.purchase_orders (order_number);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pedidos_saida_numero_pedido ON public.pedidos_saida (numero_pedido);
