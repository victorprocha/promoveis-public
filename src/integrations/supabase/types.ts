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
