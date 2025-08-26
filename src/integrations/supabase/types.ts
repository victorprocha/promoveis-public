export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ambientes: {
        Row: {
          created_at: string
          descricao: string
          id: string
          orcamento_id: string
          total_orcamento: number | null
          total_pedido: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          orcamento_id: string
          total_orcamento?: number | null
          total_pedido?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          orcamento_id?: string
          total_orcamento?: number | null
          total_pedido?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambientes_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_info: {
        Row: {
          bank: string | null
          billing_date: string
          created_at: string
          id: string
          installments: number | null
          payment_condition: string
          payment_method: string
          purchase_order_id: string
          reference: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bank?: string | null
          billing_date: string
          created_at?: string
          id?: string
          installments?: number | null
          payment_condition: string
          payment_method: string
          purchase_order_id: string
          reference: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bank?: string | null
          billing_date?: string
          created_at?: string
          id?: string
          installments?: number | null
          payment_condition?: string
          payment_method?: string
          purchase_order_id?: string
          reference?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_info_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_environments: {
        Row: {
          budget_id: string
          created_at: string
          environment_description: string | null
          environment_name: string
          id: string
          price: number
          quantity: number
          subtotal: number
          updated_at: string
        }
        Insert: {
          budget_id: string
          created_at?: string
          environment_description?: string | null
          environment_name: string
          id?: string
          price?: number
          quantity?: number
          subtotal?: number
          updated_at?: string
        }
        Update: {
          budget_id?: string
          created_at?: string
          environment_description?: string | null
          environment_name?: string
          id?: string
          price?: number
          quantity?: number
          subtotal?: number
          updated_at?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          budget_observations: string | null
          client_id: string | null
          client_name: string
          created_at: string
          final_considerations: string | null
          id: string
          initial_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_observations?: string | null
          client_id?: string | null
          client_name: string
          created_at?: string
          final_considerations?: string | null
          id?: string
          initial_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_observations?: string | null
          client_id?: string | null
          client_name?: string
          created_at?: string
          final_considerations?: string | null
          id?: string
          initial_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          ambiente_id: string
          created_at: string
          descricao: string
          id: string
          total_orcamento: number | null
          total_pedido: number | null
          updated_at: string
        }
        Insert: {
          ambiente_id: string
          created_at?: string
          descricao: string
          id?: string
          total_orcamento?: number | null
          total_pedido?: number | null
          updated_at?: string
        }
        Update: {
          ambiente_id?: string
          created_at?: string
          descricao?: string
          id?: string
          total_orcamento?: number | null
          total_pedido?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_ambiente_id_fkey"
            columns: ["ambiente_id"]
            isOneToOne: false
            referencedRelation: "ambientes"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      collaborators: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          bairro: string
          cidade: string
          cnpj: string
          created_at: string
          email: string
          id: string
          ie: string
          logo_url: string | null
          logradouro: string
          numero: string
          razao_social: string
          telefone: string
          uf: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bairro: string
          cidade: string
          cnpj: string
          created_at?: string
          email: string
          id?: string
          ie: string
          logo_url?: string | null
          logradouro: string
          numero: string
          razao_social: string
          telefone: string
          uf: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bairro?: string
          cidade?: string
          cnpj?: string
          created_at?: string
          email?: string
          id?: string
          ie?: string
          logo_url?: string | null
          logradouro?: string
          numero?: string
          razao_social?: string
          telefone?: string
          uf?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emitente_nfe: {
        Row: {
          ambiente: string
          bairro: string | null
          cep: string | null
          certificado_url: string | null
          cidade: string | null
          cnae: string | null
          cnpj: string
          contato: string | null
          created_at: string
          crt: string
          email: string | null
          endereco: string | null
          estado: string | null
          ibge: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          nome_fantasia: string | null
          numero: string | null
          razao_social: string
          senha_certificado: string | null
          serie_nfe: number | null
          situacao: string | null
          telefone: string | null
          ultima_nfe: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ambiente?: string
          bairro?: string | null
          cep?: string | null
          certificado_url?: string | null
          cidade?: string | null
          cnae?: string | null
          cnpj: string
          contato?: string | null
          created_at?: string
          crt?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          ibge?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          razao_social: string
          senha_certificado?: string | null
          serie_nfe?: number | null
          situacao?: string | null
          telefone?: string | null
          ultima_nfe?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ambiente?: string
          bairro?: string | null
          cep?: string | null
          certificado_url?: string | null
          cidade?: string | null
          cnae?: string | null
          cnpj?: string
          contato?: string | null
          created_at?: string
          crt?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          ibge?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          razao_social?: string
          senha_certificado?: string | null
          serie_nfe?: number | null
          situacao?: string | null
          telefone?: string | null
          ultima_nfe?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_matrix: {
        Row: {
          agenda_type: string
          created_at: string
          description: string
          end_date: string
          id: string
          start_date: string
          updated_at: string
          user_id: string
          workflow_type: string
        }
        Insert: {
          agenda_type?: string
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          start_date?: string
          updated_at?: string
          user_id: string
          workflow_type?: string
        }
        Update: {
          agenda_type?: string
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          start_date?: string
          updated_at?: string
          user_id?: string
          workflow_type?: string
        }
        Relationships: []
      }
      event_matrix_events: {
        Row: {
          control_enabled: boolean
          created_at: string
          days: number
          event_matrix_id: string
          generates_commitment: string
          id: string
          name: string
          order_sequence: number
          selected_collaborators: string[] | null
          updated_at: string
        }
        Insert: {
          control_enabled?: boolean
          created_at?: string
          days?: number
          event_matrix_id: string
          generates_commitment?: string
          id?: string
          name: string
          order_sequence: number
          selected_collaborators?: string[] | null
          updated_at?: string
        }
        Update: {
          control_enabled?: boolean
          created_at?: string
          days?: number
          event_matrix_id?: string
          generates_commitment?: string
          id?: string
          name?: string
          order_sequence?: number
          selected_collaborators?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_matrix_events_event_matrix_id_fkey"
            columns: ["event_matrix_id"]
            isOneToOne: false
            referencedRelation: "event_matrix"
            referencedColumns: ["id"]
          },
        ]
      }
      itens: {
        Row: {
          altura: number | null
          categoria_id: string
          created_at: string
          descricao: string
          dimensoes: string | null
          id: string
          largura: number | null
          profundidade: number | null
          quantidade: number | null
          referencia: string | null
          unidade: string | null
          updated_at: string
          valor_total: number | null
        }
        Insert: {
          altura?: number | null
          categoria_id: string
          created_at?: string
          descricao: string
          dimensoes?: string | null
          id?: string
          largura?: number | null
          profundidade?: number | null
          quantidade?: number | null
          referencia?: string | null
          unidade?: string | null
          updated_at?: string
          valor_total?: number | null
        }
        Update: {
          altura?: number | null
          categoria_id?: string
          created_at?: string
          descricao?: string
          dimensoes?: string | null
          id?: string
          largura?: number | null
          profundidade?: number | null
          quantidade?: number | null
          referencia?: string | null
          unidade?: string | null
          updated_at?: string
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      margens: {
        Row: {
          created_at: string
          descricao: string
          entidade_id: string
          entidade_tipo: string
          id: string
          tipo: string
          updated_at: string
          valor: number | null
        }
        Insert: {
          created_at?: string
          descricao: string
          entidade_id: string
          entidade_tipo: string
          id?: string
          tipo: string
          updated_at?: string
          valor?: number | null
        }
        Update: {
          created_at?: string
          descricao?: string
          entidade_id?: string
          entidade_tipo?: string
          id?: string
          tipo?: string
          updated_at?: string
          valor?: number | null
        }
        Relationships: []
      }
      orcamentos: {
        Row: {
          acrescimo: number | null
          ambiente_principal: string | null
          created_at: string
          data_orcamento: string | null
          descontos: number | null
          etapa: string | null
          frete: number | null
          id: string
          impostos: number | null
          montagem: number | null
          project_id: string | null
          situacao: string | null
          updated_at: string
          user_id: string
          valor_orcamento: number | null
          valor_pedido: number | null
        }
        Insert: {
          acrescimo?: number | null
          ambiente_principal?: string | null
          created_at?: string
          data_orcamento?: string | null
          descontos?: number | null
          etapa?: string | null
          frete?: number | null
          id?: string
          impostos?: number | null
          montagem?: number | null
          project_id?: string | null
          situacao?: string | null
          updated_at?: string
          user_id: string
          valor_orcamento?: number | null
          valor_pedido?: number | null
        }
        Update: {
          acrescimo?: number | null
          ambiente_principal?: string | null
          created_at?: string
          data_orcamento?: string | null
          descontos?: number | null
          etapa?: string | null
          frete?: number | null
          id?: string
          impostos?: number | null
          montagem?: number | null
          project_id?: string | null
          situacao?: string | null
          updated_at?: string
          user_id?: string
          valor_orcamento?: number | null
          valor_pedido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_installments: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          installment_number: number
          notes: string | null
          payment_method: string
          payment_proposal_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          due_date: string
          id?: string
          installment_number: number
          notes?: string | null
          payment_method?: string
          payment_proposal_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          installment_number?: number
          notes?: string | null
          payment_method?: string
          payment_proposal_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_installments_payment_proposal_id_fkey"
            columns: ["payment_proposal_id"]
            isOneToOne: false
            referencedRelation: "payment_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_proposals: {
        Row: {
          budget_id: string
          created_at: string
          discount_type: string | null
          discount_value: number | null
          down_payment_type: string | null
          down_payment_value: number | null
          id: string
          installments_count: number
          interest_rate: number | null
          is_selected: boolean | null
          name: string
          remaining_amount: number
          total_amount: number
          total_with_discount: number
          updated_at: string
        }
        Insert: {
          budget_id: string
          created_at?: string
          discount_type?: string | null
          discount_value?: number | null
          down_payment_type?: string | null
          down_payment_value?: number | null
          id?: string
          installments_count?: number
          interest_rate?: number | null
          is_selected?: boolean | null
          name?: string
          remaining_amount?: number
          total_amount?: number
          total_with_discount?: number
          updated_at?: string
        }
        Update: {
          budget_id?: string
          created_at?: string
          discount_type?: string | null
          discount_value?: number | null
          down_payment_type?: string | null
          down_payment_value?: number | null
          id?: string
          installments_count?: number
          interest_rate?: number | null
          is_selected?: boolean | null
          name?: string
          remaining_amount?: number
          total_amount?: number
          total_with_discount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_proposals_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_saida: {
        Row: {
          cliente_id: string
          created_at: string
          data_saida: string
          id: string
          numero_pedido: number
          referencia_contrato: string | null
          responsavel_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_saida: string
          id?: string
          numero_pedido?: number
          referencia_contrato?: string | null
          responsavel_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_saida?: string
          id?: string
          numero_pedido?: number
          referencia_contrato?: string | null
          responsavel_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pedidos_saida_items: {
        Row: {
          created_at: string
          id: string
          observacoes: string | null
          pedido_saida_id: string
          produto_nome: string
          quantidade: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          observacoes?: string | null
          pedido_saida_id: string
          produto_nome: string
          quantidade?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          observacoes?: string | null
          pedido_saida_id?: string
          produto_nome?: string
          quantidade?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_saida_items_pedido_saida_id_fkey"
            columns: ["pedido_saida_id"]
            isOneToOne: false
            referencedRelation: "pedidos_saida"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          acabamento: string | null
          altura_metros: number | null
          created_at: string
          descricao: string
          estoque: number
          estoque_minimo: number
          fornecedor: string | null
          id: string
          largura_metros: number | null
          localizacao: string | null
          marca: string | null
          preco_compra: number
          unidade: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acabamento?: string | null
          altura_metros?: number | null
          created_at?: string
          descricao: string
          estoque?: number
          estoque_minimo?: number
          fornecedor?: string | null
          id?: string
          largura_metros?: number | null
          localizacao?: string | null
          marca?: string | null
          preco_compra?: number
          unidade?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acabamento?: string | null
          altura_metros?: number | null
          created_at?: string
          descricao?: string
          estoque?: number
          estoque_minimo?: number
          fornecedor?: string | null
          id?: string
          largura_metros?: number | null
          localizacao?: string | null
          marca?: string | null
          preco_compra?: number
          unidade?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_xml_data: {
        Row: {
          ambiente_data: Json | null
          caracteristicas_data: Json | null
          created_at: string
          file_name: string
          file_url: string
          fornecedores_data: Json | null
          id: string
          itens_data: Json | null
          observacoes_data: Json | null
          project_id: string
          updated_at: string
        }
        Insert: {
          ambiente_data?: Json | null
          caracteristicas_data?: Json | null
          created_at?: string
          file_name: string
          file_url: string
          fornecedores_data?: Json | null
          id?: string
          itens_data?: Json | null
          observacoes_data?: Json | null
          project_id: string
          updated_at?: string
        }
        Update: {
          ambiente_data?: Json | null
          caracteristicas_data?: Json | null
          created_at?: string
          file_name?: string
          file_url?: string
          fornecedores_data?: Json | null
          id?: string
          itens_data?: Json | null
          observacoes_data?: Json | null
          project_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          deadline: string | null
          delivery_deadline: string | null
          description: string | null
          etapa_atual: string | null
          id: string
          name: string
          priority: string | null
          specifier_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          deadline?: string | null
          delivery_deadline?: string | null
          description?: string | null
          etapa_atual?: string | null
          id?: string
          name: string
          priority?: string | null
          specifier_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          deadline?: string | null
          delivery_deadline?: string | null
          description?: string | null
          etapa_atual?: string | null
          id?: string
          name?: string
          priority?: string | null
          specifier_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_specifier_id_fkey"
            columns: ["specifier_id"]
            isOneToOne: false
            referencedRelation: "specifiers"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          product_name: string
          purchase_order_id: string
          quantity: number
          subtotal: number | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_name: string
          purchase_order_id: string
          quantity?: number
          subtotal?: number | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_name?: string
          purchase_order_id?: string
          quantity?: number
          subtotal?: number | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          billing_status: string | null
          created_at: string
          id: string
          order_date: string
          order_number: number
          responsible: string
          status: string | null
          supplier: string
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_status?: string | null
          created_at?: string
          id?: string
          order_date: string
          order_number?: number
          responsible: string
          status?: string | null
          supplier: string
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_status?: string | null
          created_at?: string
          id?: string
          order_date?: string
          order_number?: number
          responsible?: string
          status?: string | null
          supplier?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          id: string
          notes: string | null
          product_description: string
          quantity: number | null
          sale_date: string
          total_amount: number | null
          unit_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_description: string
          quantity?: number | null
          sale_date: string
          total_amount?: number | null
          unit_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_description?: string
          quantity?: number | null
          sale_date?: string
          total_amount?: number | null
          unit_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      specifiers: {
        Row: {
          contato: string | null
          created_at: string
          email: string
          especialidade: string | null
          id: string
          nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contato?: string | null
          created_at?: string
          email: string
          especialidade?: string | null
          id?: string
          nome: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contato?: string | null
          created_at?: string
          email?: string
          especialidade?: string | null
          id?: string
          nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subitens: {
        Row: {
          altura: number | null
          created_at: string
          descricao: string
          dimensoes: string | null
          id: string
          item_id: string
          largura: number | null
          profundidade: number | null
          quantidade: number | null
          referencia: string | null
          unidade: string | null
          updated_at: string
          valor_total: number | null
        }
        Insert: {
          altura?: number | null
          created_at?: string
          descricao: string
          dimensoes?: string | null
          id?: string
          item_id: string
          largura?: number | null
          profundidade?: number | null
          quantidade?: number | null
          referencia?: string | null
          unidade?: string | null
          updated_at?: string
          valor_total?: number | null
        }
        Update: {
          altura?: number | null
          created_at?: string
          descricao?: string
          dimensoes?: string | null
          id?: string
          item_id?: string
          largura?: number | null
          profundidade?: number | null
          quantidade?: number | null
          referencia?: string | null
          unidade?: string | null
          updated_at?: string
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subitens_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itens"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          city: string | null
          cpf: string | null
          created_at: string
          email: string
          id: string
          mobile: string | null
          name: string
          neighborhood: string | null
          number: string | null
          password_hash: string
          permission: string
          phone: string | null
          rg: string | null
          state: string | null
          street: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          id?: string
          mobile?: string | null
          name: string
          neighborhood?: string | null
          number?: string | null
          password_hash: string
          permission?: string
          phone?: string | null
          rg?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          id?: string
          mobile?: string | null
          name?: string
          neighborhood?: string | null
          number?: string | null
          password_hash?: string
          permission?: string
          phone?: string | null
          rg?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
